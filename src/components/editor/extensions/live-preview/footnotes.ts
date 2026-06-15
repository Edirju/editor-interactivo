import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import type { DecorationItem } from './utils';

const refRegex = /\[\^([^\]]+)\]/g;
const defLineRegex = /^\[\^([^\]]+)\]:/;

export function processFootnotes(
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  const doc = state.doc;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const isLineActive = i === cursorLineNum;
    const isDefLine = defLineRegex.test(line.text);

    // Scan inline references [^id] in this line
    refRegex.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = refRegex.exec(line.text)) !== null) {
      const from = line.from + match.index;
      const to = from + match[0].length;

      if (isDefLine) continue;

      decoList.push({
        from,
        to,
        deco: Decoration.mark({ class: 'cm-md-footnote-ref' }),
      });

      if (!isLineActive) {
        decoList.push({
          from,
          to: from + 2,
          deco: Decoration.mark({ class: 'cm-md-hidden-mark' }),
        });
        decoList.push({
          from: to - 1,
          to,
          deco: Decoration.mark({ class: 'cm-md-hidden-mark' }),
        });
      }
    }

    // Definition line decoration
    if (!isLineActive && defLineRegex.test(line.text)) {
      decoList.push({
        from: line.from,
        to: line.from,
        deco: Decoration.line({ class: 'cm-md-footnote-def-line' }),
        isLine: true,
      });
    }
  }
}
