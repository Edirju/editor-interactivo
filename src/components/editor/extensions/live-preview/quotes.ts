import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import { hideMarkDecoration, type DecorationItem } from './utils';
import { isCalloutLine } from './callouts';

// CSS clases usadas (definidas en theme.ts):
// - .cm-md-quote-line, .cm-md-quote-depth-[1-10]
// - .cm-md-hidden-mark

export function processQuotes(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  const line = state.doc.lineAt(node.from);
  if (isCalloutLine(line.number)) return;

  const isLineActive = line.number === cursorLineNum;

  if (node.name === 'Blockquote') {
    const quoteMatch = line.text.match(/^(\s*>)+/);
    if (quoteMatch) {
      const depth = Math.min((quoteMatch[0].match(/>/g) || []).length, 10);
      decoList.push({
        from: line.from,
        to: line.from,
        deco: Decoration.line({
          class: `cm-md-quote-line cm-md-quote-depth-${depth}`,
        }),
        isLine: true,
      });
    }
  }

  if (node.name === 'QuoteMark' && !isLineActive) {
    const to = Math.min(node.to + 1, state.doc.length);
    if (node.from < to) {
      decoList.push({ from: node.from, to, deco: hideMarkDecoration });
    }
  }
}
