// Binary property lists (bplist00), the format found in built apps:
// https://opensource.apple.com/source/CF/CF-1153.18/CFBinaryPList.c
import {
  BINARY_MAGIC,
  isDict,
  type PlistDict,
  PlistError,
  type PlistValue,
} from './plist-value.js';

const APPLE_EPOCH_MS = Date.UTC(2001, 0, 1);

/**
 * How many values one plist may produce. Objects are shared by reference, so a file of a few
 * hundred bytes can name the same array thousands of times at every level: without a budget, a
 * 1.7 KB Info.plist expands into billions of values. Real Info.plist files produce a few hundred.
 */
export const MAX_BINARY_PLIST_VALUES = 100_000;

/** How deep arrays and dictionaries may nest; real Info.plist files nest a few levels. */
export const MAX_BINARY_PLIST_DEPTH = 64;

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
  // Keyed by object offset, not by reference: the offset table may give many references the same
  // offset, and each must not decode the object again.
  const visiting = new Set<number>();
  // Strings, data and numbers are read once per offset and shared, so a large string that many
  // references name costs its bytes once; arrays and dictionaries count against the value budget.
  const leaves = new Map<number, PlistValue>();
  let produced = 0;
  // Offsets may also point into the middle of another object's bytes, so distinct objects can
  // overlap. Every string and data object counts its bytes here; all of them together cannot be
  // more than the file holds.
  let decodedBytes = 0;
  const decode = (count: number) => {
    decodedBytes += count;
    if (decodedBytes > bytes.length) {
      throw new PlistError('Binary plist decodes to more bytes than the file holds.');
    }
  };

  const lengthAt = (at: number, info: number): [number, number] => {
    if (info !== 0xf) return [info, at + 1];
    const marker = bytes[at + 1] ?? 0;
    if (marker >> 4 !== 0x1) throw new PlistError('Binary plist length is not an integer.');
    const size = 1 << (marker & 0xf);
    return [readUint(at + 2, size), at + 2 + size];
  };

  const read = (ref: number): PlistValue => {
    if (ref >= objectCount) throw new PlistError('Binary plist object reference is out of range.');
    if (visiting.size >= MAX_BINARY_PLIST_DEPTH) {
      throw new PlistError(`Binary plist nests more than ${MAX_BINARY_PLIST_DEPTH} levels.`);
    }
    if (++produced > MAX_BINARY_PLIST_VALUES) {
      throw new PlistError(`Binary plist has more than ${MAX_BINARY_PLIST_VALUES} values.`);
    }
    const offset = offsetOf(ref);
    const leaf = leaves.get(offset);
    if (leaf !== undefined) return leaf;
    if (visiting.has(offset)) throw new PlistError('Binary plist contains a reference cycle.');
    visiting.add(offset);
    try {
      const value = readObject(offset);
      if (!Array.isArray(value) && !isDict(value)) leaves.set(offset, value);
      return value;
    } finally {
      visiting.delete(offset);
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
        const data = bytes.subarray(start, start + length);
        decode(data.length);
        return Uint8Array.from(data);
      }
      case 0x5: {
        const [length, start] = lengthAt(at, info);
        const ascii = bytes.subarray(start, start + length);
        decode(ascii.length);
        return new TextDecoder('latin1').decode(ascii);
      }
      case 0x6: {
        const [length, start] = lengthAt(at, info);
        if (start + length * 2 > bytes.length) {
          throw new PlistError('Binary plist reads past its end.');
        }
        decode(length * 2);
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
