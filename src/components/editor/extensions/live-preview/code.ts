import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import { type DecorationItem, hideMarkDecoration } from './utils';

// CSS clases usadas (definidas en theme.ts):
// - .cm-md-code
// - .cm-md-code-block  (FencedCode: background, border, padding)
// - .cm-md-code-info   (FencedCode language label)

export function processCode(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
  _cursorLineNum: number,
) {
  if (node.name === 'InlineCode') {
    decoList.push({
      from: node.from,
      to: node.to,
      deco: Decoration.mark({ class: 'cm-md-code' }),
    });
  }
}

export function processCodeBlock(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  if (node.name === 'FencedCode') {
    const startLine = state.doc.lineAt(node.from).number;
    const endLine = state.doc.lineAt(node.to).number;

    for (let i = startLine; i <= endLine; i++) {
      const line = state.doc.line(i);
      let lineClass = 'cm-md-code-block';
      if (i === startLine) lineClass += ' cm-md-code-block-first';
      if (i === endLine) lineClass += ' cm-md-code-block-last';
      decoList.push({
        from: line.from,
        to: line.from,
        deco: Decoration.line({ class: lineClass }),
      });
    }
  }

  if (node.name === 'CodeInfo') {
    const line = state.doc.lineAt(node.from);
    const isLineActive = line.number === cursorLineNum;
    if (!isLineActive) {
      decoList.push({
        from: node.from,
        to: node.to,
        deco: Decoration.mark({ class: 'cm-md-code-info' }),
      });
    }
  }

  if (node.name === 'CodeMark') {
    const line = state.doc.lineAt(node.from);
    const isLineActive = line.number === cursorLineNum;
    if (!isLineActive) {
      decoList.push({
        from: node.from,
        to: node.to,
        deco: hideMarkDecoration,
      });
    }
  }
}
