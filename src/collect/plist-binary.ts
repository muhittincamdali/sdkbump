// Binary property lists (bplist00), the format found in built apps:
// https://opensource.apple.com/source/CF/CF-1153.18/CFBinaryPList.c
import { BINARY_MAGIC, type PlistDict, PlistError, type PlistValue } from './plist-value.js';

const APPLE_EPOCH_MS = Date.UTC(2001, 0, 1);

export function parseBinaryPlist(bytes: Uint8Array): PlistValue {
  if (bytes.length < BINARY_MAGIC.length + 32) throw new PlistError('Binary plist is too short.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const trailer = bytes.length - 32;
  const offsetSize = view.getUint8(trailer + 6);
  const refSize = view.getUint8(trailer + 7);
  const objectCount = Number(view.getBigUint64(trailer + 8));
  const topObject = Number(view.getBigUint64(trailer + 16));
  const tableOffset = Number(view.getBigUint64(trailer + 24));
  if (offsetSize < 1 || offsetSize > 8 || refSize < 1 || refSize > 8) {
    throw new PlistError('Binary plist trailer is not valid.');
  }
  if (tableOffset + objectCount * offsetSize > trailer || topObject >= objectCount) {
    throw new PlistError('Binary plist offset table is out of range.');
  }

  const readUint = (at: number, size: number): number => {
    if (at + size > bytes.length) throw new PlistError('Binary plist reads past its end.');
    let value = 0;
    for (let index = 0; index < size; index++) value = value * 256 + (bytes[at + index] ?? 0);
    return value;
  };
  const offsetOf = (ref: number) => readUint(tableOffset + ref * offsetSize, offsetSize);
  const visiting = new Set<number>();

  const lengthAt = (at: number, info: number): [number, number] => {
    if (info !== 0xf) return [info, at + 1];
    const marker = bytes[at + 1] ?? 0;
    if (marker >> 4 !== 0x1) throw new PlistError('Binary plist length is not an integer.');
    const size = 1 << (marker & 0xf);
    return [readUint(at + 2, size), at + 2 + size];
  };

  const read = (ref: number): PlistValue => {
    if (ref >= objectCount) throw new PlistError('Binary plist object reference is out of range.');
    if (visiting.has(ref)) throw new PlistError('Binary plist contains a reference cycle.');
    visiting.add(ref);
    try {
      return readObject(offsetOf(ref));
    } finally {
      visiting.delete(ref);
    }
  };

  const readObject = (at: number): PlistValue => {
    const marker = bytes[at];
    if (marker === undefined) throw new PlistError('Binary plist object is out of range.');
    const type = marker >> 4;
    const info = marker & 0xf;
    switch (type) {
      case 0x0:
        if (info === 0x8) return false;
        if (info === 0x9) return true;
        throw new PlistError(`Unsupported binary plist marker 0x${marker.toString(16)}.`);
      case 0x1: {
        const size = 1 << info;
        if (size === 16) return view.getBigInt64(at + 9);
        if (size === 8) {
          const big = view.getBigInt64(at + 1);
          return Number.isSafeInteger(Number(big)) ? Number(big) : big;
        }
        return readUint(at + 1, size);
      }
      case 0x2:
        return info === 2 ? view.getFloat32(at + 1) : view.getFloat64(at + 1);
      case 0x3:
        return new Date(APPLE_EPOCH_MS + view.getFloat64(at + 1) * 1000);
      case 0x4: {
        const [length, start] = lengthAt(at, info);
        return Uint8Array.from(bytes.subarray(start, start + length));
      }
      case 0x5: {
        const [length, start] = lengthAt(at, info);
        return new TextDecoder('latin1').decode(bytes.subarray(start, start + length));
      }
      case 0x6: {
        const [length, start] = lengthAt(at, info);
        let text = '';
        for (let index = 0; index < length; index++) {
          text += String.fromCharCode(readUint(start + index * 2, 2));
        }
        return text;
      }
      case 0x8:
        return readUint(at + 1, info + 1);
      case 0xa: {
        const [length, start] = lengthAt(at, info);
        const items: PlistValue[] = [];
        for (let index = 0; index < length; index++) {
          items.push(read(readUint(start + index * refSize, refSize)));
        }
        return items;
      }
      case 0xd: {
        const [length, start] = lengthAt(at, info);
        const dict: PlistDict = {};
        for (let index = 0; index < length; index++) {
          const key = read(readUint(start + index * refSize, refSize));
          if (typeof key !== 'string')
            throw new PlistError('Binary plist dictionary key is not a string.');
          dict[key] = read(readUint(start + (length + index) * refSize, refSize));
        }
        return dict;
      }
      default:
        throw new PlistError(`Unsupported binary plist marker 0x${marker.toString(16)}.`);
    }
  };

  return read(topObject);
}
