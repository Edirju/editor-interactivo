import { Decoration } from '@codemirror/view';
import { hideMarkDecoration, type DecorationItem } from './utils';

const FORMAT_STYLE: Record<string, string> = {
  Emphasis: 'cm-md-italic',
  StrongEmphasis: 'cm-md-bold',
  Strikethrough: 'cm-md-strikethrough',
  Highlight: 'cm-md-highlight',
};

const FORMAT_MARKS = new Set([
  'EmphasisMark',
  'StrongEmphasisMark',
  'StrikethroughMark',
  'HighlightMark',
]);

export function processFormatting(node: { name: string; from: number; to: number }, decoList: DecorationItem[]) {
  const styleClass = FORMAT_STYLE[node.name];
  if (styleClass) {
    decoList.push({
      from: node.from,
      to: node.to,
      deco: Decoration.mark({ class: styleClass }),
    });
  }
  if (FORMAT_MARKS.has(node.name)) {
    decoList.push({
      from: node.from,
      to: node.to,
      deco: hideMarkDecoration,
    });
  }
}
