import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import { type DecorationItem, hideMarkDecoration } from './utils';

const CALLOUT_RE = /^>\s*\[!(NOTE|INFO|TIP|WARNING|QUESTION|DANGER|FAILURE)\]\s*([+-])?\s*(.*)$/i;

const calloutLineSet = new Set<number>();

export function resetCalloutLines() {
  calloutLineSet.clear();
}

export function isCalloutLine(lineNumber: number): boolean {
  return calloutLineSet.has(lineNumber);
}

export function processCallouts(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  if (node.name === 'Blockquote') {
    const firstLine = state.doc.lineAt(node.from);
    const match = firstLine.text.match(CALLOUT_RE);
    if (!match) return;

    const type = match[1].toLowerCase();

    const startLine = firstLine.number;
    const endLine = state.doc.lineAt(node.to).number;

    for (let i = startLine; i <= endLine; i++) {
      const line = state.doc.line(i);
      calloutLineSet.add(i);

      let lineClass = `cm-md-callout cm-md-callout-${type}`;
      if (i === startLine) lineClass += ' cm-md-callout-first';
      if (i === endLine) lineClass += ' cm-md-callout-last';

      decoList.push({
        from: line.from,
        to: line.from,
        deco: Decoration.line({ class: lineClass }),
        isLine: true,
      });
    }

    // Hide the [TYPE] marker only when cursor is not on the first line
    const isLineActive = firstLine.number === cursorLineNum;
    if (!isLineActive) {
      const lineText = firstLine.text;
      const bracketStart = lineText.indexOf('[');
      const bracketEnd = lineText.indexOf(']') + 1;
      if (bracketStart >= 0 && bracketEnd > bracketStart) {
        const from = firstLine.from + bracketStart;
        let to = firstLine.from + bracketEnd;
        if (to < firstLine.to && lineText[bracketEnd] === ' ') {
          to += 1;
        }
        decoList.push({ from, to, deco: hideMarkDecoration });
      }
    }
  }

  if (node.name === 'QuoteMark') {
    const line = state.doc.lineAt(node.from);
    if (calloutLineSet.has(line.number)) {
      const to = Math.min(node.to + 1, state.doc.length);
      if (node.from < to) {
        decoList.push({ from: node.from, to, deco: hideMarkDecoration });
      }
    }
  }
}
