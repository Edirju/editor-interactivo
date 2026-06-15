import { Decoration } from '@codemirror/view';

// CSS class .cm-md-hidden-mark definida en theme.ts
export const hideMarkDecoration = Decoration.mark({
  class: 'cm-md-hidden-mark',
});

export interface DecorationItem {
  from: number;
  to: number;
  deco: Decoration;
  isLine?: boolean;
}

export interface SyntaxNode {
  name: string;
  from: number;
  to: number;
  parent: SyntaxNode | null;
  prevSibling: SyntaxNode | null;
  nextSibling: SyntaxNode | null;
  node: { parent: SyntaxNode | null };
}

export function resolveDepth(node: SyntaxNode, types: string[]): number {
  let depth = 0;
  let current = node.parent;
  while (current) {
    if (types.includes(current.name)) depth++;
    current = current.parent;
  }
  return depth;
}

export function getListItemIndex(item: SyntaxNode): number {
  let index = 1;
  let current: SyntaxNode | null = item.prevSibling;
  while (current) {
    if (current.name === 'ListItem') index++;
    current = current.prevSibling;
  }
  return index;
}
