import { syntaxTree } from '@codemirror/language';
import type { EditorView } from '@codemirror/view';
import type { EditorState } from '@codemirror/state';

export function isCursorInTable(view: EditorView): boolean {
  return isCursorInTableState(view.state);
}

export function isCursorInTableState(state: EditorState): boolean {
  const cursorPos = state.selection.main.head;
  const cursor = syntaxTree(state).cursor();
  while (cursor.next()) {
    if (cursor.name === 'Table') {
      if (cursorPos >= cursor.from && cursorPos <= cursor.to) {
        return true;
      }
    }
  }
  return false;
}

export interface TableCursorInfo {
  from: number;
  to: number;
  rows: string[];
  cursorRow: number;
  cursorCol: number;
}

export function getTableAtCursor(view: EditorView): TableCursorInfo | null {
  const cursorPos = view.state.selection.main.head;
  const tree = syntaxTree(view.state);
  const c = tree.cursor();

  while (c.next()) {
    if (c.name !== 'Table') continue;
    if (cursorPos < c.from || cursorPos > c.to) continue;

    const from = c.from;
    const to = c.to;
    const text = view.state.sliceDoc(from, to);
    const lines = text.split('\n');

    let offset = from;
    let cursorRow = -1;
    for (let i = 0; i < lines.length; i++) {
      const lineEnd = offset + lines[i].length;
      if (cursorPos >= offset && cursorPos <= lineEnd) {
        cursorRow = i;
        break;
      }
      offset = lineEnd + 1;
    }

    if (cursorRow === -1) return null;

    const lineStart = from + lines.slice(0, cursorRow).join('\n').length + (cursorRow > 0 ? 1 : 0);
    const colOffset = cursorPos - lineStart;
    const cursorCol = findColumnInLine(lines[cursorRow], colOffset);

    return { from, to, rows: lines, cursorRow, cursorCol };
  }

  return null;
}

function findColumnInLine(line: string, offset: number): number {
  const segments = line.split('|');
  let accum = 0;
  for (let i = 0; i < segments.length; i++) {
    const segEnd = accum + segments[i].length;
    if (offset <= segEnd) {
      const col = i - (line[0] === '|' ? 1 : 0);
      return Math.max(0, col);
    }
    accum = segEnd + 1;
  }
  return Math.max(0, segments.length - 1 - (line[0] === '|' ? 1 : 0));
}

export function isDelimiterRow(line: string): boolean {
  if (!line) return false;
  const cleaned = line.replace(/^\|/, '').replace(/\|$/, '').trim();
  if (!cleaned) return false;
  const parts = cleaned.split('|').map((s) => s.trim());
  return parts.length > 0 && parts.every((p) => /^:?-{3,}:?$/.test(p));
}
