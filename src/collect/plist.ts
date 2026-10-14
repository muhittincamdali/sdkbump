// Property list reader for Info.plist files: the XML format Xcode writes into projects and the
// binary format (bplist00) found in built apps. No dependencies; only what Info.plist files use.
import { parseBinaryPlist } from './plist-binary.js';
import { BINARY_MAGIC, type ParsedPlist } from './plist-value.js';
import { parseXmlPlist } from './plist-xml.js';

export { parseBinaryPlist } from './plist-binary.js';
export {
  isDict,
  type ParsedPlist,
  type PlistDict,
  PlistError,
  type PlistValue,
} from './plist-value.js';
export { parseXmlPlist } from './plist-xml.js';

/** Parses an XML or binary property list. Throws PlistError for anything else. */
export function parsePlist(data: Uint8Array | string): ParsedPlist {
  if (typeof data !== 'string') {
    const head = new TextDecoder('latin1').decode(data.subarray(0, BINARY_MAGIC.length));
    if (head === BINARY_MAGIC) return { value: parseBinaryPlist(data), keyLines: new Map() };
    return parseXmlPlist(new TextDecoder().decode(data));
  }
  return parseXmlPlist(data);
}
