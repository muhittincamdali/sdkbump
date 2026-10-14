// Blanking of comments and string literals in Swift and Objective-C, so that the rules' patterns
// never match inside them while offsets and line numbers stay those of the file.
import type { Language } from './sources.js';

/**
 * Replaces comments and the contents of string and character literals with spaces, keeping
 * newlines and quote characters, so offsets and line numbers stay the same.
 */
export function blankCommentsAndStrings(text: string, language: Language): string {
  const out = text.split('');
  const blank = (from: number, to: number) => {
    for (let index = from; index < to; index++) if (out[index] !== '\n') out[index] = ' ';
  };
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '/' && next === '/') {
      const end = text.indexOf('\n', index);
      const stop = end === -1 ? text.length : end;
      blank(index, stop);
      index = stop;
    } else if (char === '/' && next === '*') {
      // Swift block comments nest; Objective-C ones do not.
      let depth = 1;
      let cursor = index + 2;
      while (cursor < text.length && depth > 0) {
        if (text.startsWith('*/', cursor)) {
          depth--;
          cursor += 2;
        } else if (language === 'swift' && text.startsWith('/*', cursor)) {
          depth++;
          cursor += 2;
        } else cursor++;
      }
      blank(index, cursor);
      index = cursor;
    } else if (
      language === 'swift' &&
      (char === '"' || (char === '#' && /^#+"/.test(text.slice(index, index + 8))))
    ) {
      const hashes = /^#*/.exec(text.slice(index))?.[0].length ?? 0;
      const open = index + hashes;
      const multiline = text.startsWith('"""', open);
      const closing = `${multiline ? '"""' : '"'}${'#'.repeat(hashes)}`;
      let cursor = open + (multiline ? 3 : 1);
      while (cursor < text.length) {
        if (hashes === 0 && text[cursor] === '\\') cursor += 2;
        else if (text.startsWith(closing, cursor)) break;
        else if (!multiline && text[cursor] === '\n') break;
        else cursor++;
      }
      const contentEnd = Math.min(cursor, text.length);
      blank(open + (multiline ? 3 : 1), contentEnd);
      index = contentEnd + (text.startsWith(closing, contentEnd) ? closing.length : 0);
    } else if (language === 'objc' && (char === '"' || char === "'")) {
      let cursor = index + 1;
      while (cursor < text.length && text[cursor] !== char && text[cursor] !== '\n') {
        cursor += text[cursor] === '\\' ? 2 : 1;
      }
      blank(index + 1, Math.min(cursor, text.length));
      index = cursor + 1;
    } else index++;
  }
  return out.join('');
}
