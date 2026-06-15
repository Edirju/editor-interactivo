import { Decoration } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import { hideMarkDecoration, type DecorationItem } from './utils';

// CSS clases usadas (definidas en theme.ts):
// - .cm-md-h1, .cm-md-h2, .cm-md-h3, .cm-md-h4, .cm-md-h5, .cm-md-h6
// - .cm-md-hidden-mark

const HEADING_STYLE: Record<string, string> = {
  ATXHeading1: 'cm-md-h1',
  ATXHeading2: 'cm-md-h2',
  ATXHeading3: 'cm-md-h3',
  ATXHeading4: 'cm-md-h4',
  ATXHeading5: 'cm-md-h5',
  ATXHeading6: 'cm-md-h6',
};

export function processHeadings(
  node: { name: string; from: number; to: number },
  state: EditorState,
  decoList: DecorationItem[],
) {
  const styleClass = HEADING_STYLE[node.name];
  if (styleClass) {
    decoList.push({
      from: node.from,
      to: node.to,
      deco: Decoration.mark({ class: styleClass }),
    });
  }
  if (node.name === 'HeaderMark') {
    const to = Math.min(node.to + 1, state.doc.length);
    if (node.from < to) {
      decoList.push({ from: node.from, to, deco: hideMarkDecoration });
    }
  }
}
