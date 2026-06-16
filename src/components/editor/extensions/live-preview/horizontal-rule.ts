import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import { type DecorationItem } from './utils';
import { HRWidget } from '../../../ui/HRWidget';

export function processHorizontalRule(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  if (node.name === 'HorizontalRule') {
    const line = state.doc.lineAt(node.from);
    const isLineActive = line.number === cursorLineNum;

    if (!isLineActive) {
      decoList.push({
        from: node.from,
        to: node.to,
        deco: Decoration.replace({ widget: new HRWidget() }),
      });
    }
  }
}
