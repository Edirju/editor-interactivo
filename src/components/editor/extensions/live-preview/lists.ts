import { Decoration, WidgetType } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';
import {
  resolveDepth,
  getListItemIndex,
  type SyntaxNode,
  type DecorationItem,
} from './utils';
import { CheckboxWidget } from '../../../ui/TaskWidget';

// CSS clases usadas (definidas en theme.ts):
// - .cm-md-indent-[1-8]
// - .cm-md-task-checked, .cm-md-checkbox
// - .cm-md-bullet-hidden
// - .cm-md-list-number, .cm-md-list-number-[1-8]

function computeListNumber(listMarkNode: SyntaxNode): string {
  const indices: number[] = [];
  let current: SyntaxNode | null = listMarkNode.parent;

  while (current) {
    if (current.name === 'ListItem') {
      indices.unshift(getListItemIndex(current));
      current = current.parent;
      if (current) current = current.parent;
    } else {
      break;
    }
  }

  const len = indices.length;
  if (len === 1) return `${indices[0]}.`;
  if (len === 2) return `${indices[1]}.`;
  return indices.slice(1).join('.') + '.';
}

class ListNumberWidget extends WidgetType {
  constructor(
    readonly number: string,
    readonly depth: number,
  ) {
    super();
  }

  eq(other: ListNumberWidget) {
    return other.number === this.number && other.depth === this.depth;
  }

  toDOM() {
    const wrap = document.createElement('span');
    wrap.className = `cm-md-list-number cm-md-list-number-${this.depth}`;
    wrap.textContent = this.number;
    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

export function processLists(
  node: { name: string; from: number; to: number; node: SyntaxNode },
  state: EditorState,
  decoList: DecorationItem[],
  cursorLineNum: number,
) {
  const line = state.doc.lineAt(node.from);
  const isLineActive = line.number === cursorLineNum;

  if (node.name === 'ListItem') {
    const depth = Math.min(
      resolveDepth(node.node, ['BulletList', 'OrderedList']) + 1,
      8,
    );
    decoList.push({
      from: line.from,
      to: line.from,
      deco: Decoration.line({ class: `cm-md-indent-${depth}` }),
      isLine: true,
    });
  }

  if (node.name === 'TaskMarker') {
    if (!isLineActive) {
      const isChecked = state
        .sliceDoc(node.from, node.to)
        .toLowerCase()
        .includes('x');
      decoList.push({
        from: node.from,
        to: node.to,
        deco: Decoration.replace({
          widget: new CheckboxWidget(isChecked, node.from),
        }),
      });
      if (isChecked) {
        decoList.push({
          from: node.to,
          to: line.to,
          deco: Decoration.mark({ class: 'cm-md-task-checked' }),
        });
      }
    }
  }

  if (node.name === 'ListMark') {
    if (!isLineActive) {
      const markText = state.sliceDoc(node.from, node.to).trim();

      if (/^[-+*]$/.test(markText)) {
        decoList.push({
          from: node.from,
          to: node.to,
          deco: Decoration.mark({ class: 'cm-md-bullet-hidden' }),
        });
      } else if (/^\d+[.)]$|^[a-zA-Z][.)]$/.test(markText)) {
        const displayNumber = computeListNumber(node.node);
        const depth = Math.min(
          displayNumber.split('.').length,
          8,
        );
        decoList.push({
          from: node.from,
          to: node.to,
          deco: Decoration.replace({
            widget: new ListNumberWidget(displayNumber, depth),
          }),
        });
      }
    }
  }
}
