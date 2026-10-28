// Writes small binary property lists object by object, for tests that need a file no tool would
// write: shared references, deep nesting, hostile keys. References are 2 bytes, offsets 4 bytes.

export type BinaryObject =
  | { array: number[] }
  | { dict: [key: number, value: number][] }
  | { ascii: string }
  | { true: true };

const REF_SIZE = 2;
const OFFSET_SIZE = 4;

function lengthMarker(type: number, length: number): number[] {
  if (length < 15) return [(type << 4) | length];
  // 0xF in the low nibble, then an integer object with the length (2 bytes).
  return [(type << 4) | 0xf, 0x11, length >> 8, length & 0xff];
}

const ref = (index: number) => [index >> 8, index & 0xff];

function encode(object: BinaryObject): number[] {
  if ('true' in object) return [0x09];
  if ('ascii' in object) {
    return [...lengthMarker(0x5, object.ascii.length), ...Buffer.from(object.ascii, 'latin1')];
  }
  if ('array' in object)
    return [...lengthMarker(0xa, object.array.length), ...object.array.flatMap(ref)];
  const keys = object.dict.flatMap(([key]) => ref(key));
  const values = object.dict.flatMap(([, value]) => ref(value));
  return [...lengthMarker(0xd, object.dict.length), ...keys, ...values];
}

/** A bplist00 file whose top object is the first of `objects`. */
export function binaryPlist(objects: BinaryObject[]): Uint8Array {
  const magic = Buffer.from('bplist00', 'latin1');
  const bodies = objects.map((object) => Buffer.from(encode(object)));
  const offsets: number[] = [];
  let position = magic.length;
  for (const body of bodies) {
    offsets.push(position);
    position += body.length;
  }
  const table = Buffer.alloc(offsets.length * OFFSET_SIZE);
  offsets.forEach((offset, index) => {
    table.writeUInt32BE(offset, index * OFFSET_SIZE);
  });
  const trailer = Buffer.alloc(32);
  trailer[6] = OFFSET_SIZE;
  trailer[7] = REF_SIZE;
  trailer.writeBigUInt64BE(BigInt(objects.length), 8);
  trailer.writeBigUInt64BE(0n, 16);
  trailer.writeBigUInt64BE(BigInt(position), 24);
  return Uint8Array.from(Buffer.concat([magic, ...bodies, table, trailer]));
}

/**
 * The audit's amplification file: a dictionary {"k": a1} where each array a1 … a`depth` holds
 * `width` references to the next one. It is under 2 KB at depth 4 and width 200, and names
 * 200^4 = 1.6 billion values.
 */
export function sharedReferencePlist(depth: number, width: number): Uint8Array {
  const objects: BinaryObject[] = [{ dict: [[1, 2]] }, { ascii: 'k' }];
  for (let level = 0; level < depth; level++) {
    objects.push({ array: Array.from({ length: width }, () => 2 + level + 1) });
  }
  objects.push({ true: true });
  return binaryPlist(objects);
}

/** A bplist00 file from raw object bytes and an offset table (4-byte offsets, 2-byte refs). */
function rawPlist(body: Buffer, offsets: number[]): Uint8Array {
  const magic = Buffer.from('bplist00', 'latin1');
  const table = Buffer.alloc(offsets.length * OFFSET_SIZE);
  offsets.forEach((offset, index) => {
    table.writeUInt32BE(magic.length + offset, index * OFFSET_SIZE);
  });
  const trailer = Buffer.alloc(32);
  trailer[6] = OFFSET_SIZE;
  trailer[7] = REF_SIZE;
  trailer.writeBigUInt64BE(BigInt(offsets.length), 8);
  trailer.writeBigUInt64BE(0n, 16);
  trailer.writeBigUInt64BE(BigInt(magic.length + body.length), 24);
  return Uint8Array.from(Buffer.concat([magic, body, table, trailer]));
}

/** An array with `references` items, each its own object reference to one ASCII string of `length`. */
export function sharedOffsetPlist(references: number, length: number): Uint8Array {
  const array = Buffer.from([
    ...lengthMarker(0xa, references),
    ...Array.from({ length: references }, (_, index) => ref(index + 1)).flat(),
  ]);
  const string = Buffer.alloc(6 + length, 'x');
  string[0] = 0x5f;
  string[1] = 0x12; // a 4-byte integer length follows
  string.writeUInt32BE(length, 2);
  return rawPlist(Buffer.concat([array, string]), [
    0,
    ...Array.from({ length: references }, () => array.length),
  ]);
}

/**
 * An array of `run` references to objects at consecutive offsets of a run of 0x5E bytes: each byte
 * starts an ASCII string of 14 bytes made of the bytes after it, so the strings overlap.
 */
export function overlappingStringsPlist(run: number): Uint8Array {
  const array = Buffer.from([
    ...lengthMarker(0xa, run),
    ...Array.from({ length: run }, (_, index) => ref(index + 1)).flat(),
  ]);
  const strings = Buffer.alloc(run + 14, 0x5e);
  return rawPlist(Buffer.concat([array, strings]), [
    0,
    ...Array.from({ length: run }, (_, index) => array.length + index),
  ]);
}
