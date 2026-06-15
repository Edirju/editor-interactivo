import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import { hideMarkDecoration, type DecorationItem } from './utils';
import { MathBlockWidget, InlineMathWidget } from './math-widget';

export function processMath(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  if (node.name === 'InlineMath') {
    const line = state.doc.lineAt(node.from);
    const isLineActive = line.number === cursorLineNum;

    if (isLineActive) {
      decoList.push({
        from: node.from + 1,
        to: node.to - 1,
        deco: Decoration.mark({ class: 'cm-md-math' }),
      });
    } else {
      const latex = state.sliceDoc(node.from + 1, node.to - 1);
      decoList.push({
        from: node.from,
        to: node.to,
        deco: Decoration.replace({ widget: new InlineMathWidget(latex) }),
      });
    }
  }

  if (node.name === 'InlineMathMark') {
    const line = state.doc.lineAt(node.from);
    const isLineActive = line.number === cursorLineNum;
    if (!isLineActive) {
      decoList.push({ from: node.from, to: node.to, deco: hideMarkDecoration });
    }
  }

  if (node.name === 'DisplayMath') {
    const startLine = state.doc.lineAt(node.from).number;
    const endLine = state.doc.lineAt(node.to).number;
    const cursorInBlock = cursorLineNum >= startLine && cursorLineNum <= endLine;

    if (cursorInBlock) {
      decoList.push({
        from: node.from + 2,
        to: node.to - 2,
        deco: Decoration.mark({ class: 'cm-md-math-block-edit' }),
      });
    } else {
      const latex = state.sliceDoc(node.from + 2, node.to - 2);
      decoList.push({
        from: node.from,
        to: node.to,
        deco: Decoration.replace({ widget: new MathBlockWidget(latex) }),
      });
    }
  }
}
