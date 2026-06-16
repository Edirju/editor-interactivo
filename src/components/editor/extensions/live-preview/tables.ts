import { syntaxTree } from '@codemirror/language';
import { Decoration } from '@codemirror/view';
import { TableWidget, type TableData } from './table-widget';
import type { DecorationItem } from './utils';

export function processTables(
  state: import('@codemirror/state').EditorState,
  decoList: DecorationItem[],
) {
  const cursorPos = state.selection.main.head;
  const cursor = syntaxTree(state).cursor();

  while (cursor.next()) {
    if (cursor.name !== 'Table') continue;

    const from = cursor.from;
    const to = cursor.to;

    // Cursor inside the table → show raw markdown (no widget)
    if (cursorPos >= from && cursorPos <= to) continue;

    const tableText = state.sliceDoc(from, to);
    const tableData = parseTable(tableText, from);
    if (!tableData || tableData.rows.length === 0) continue;

    const widget = new TableWidget(tableData);
    decoList.push({
      from: tableData.from,
      to: tableData.to,
      deco: Decoration.replace({ widget }),
    });
  }
}

interface CellPos {
  from: number;
  to: number;
}

interface RowInfo {
  cells: CellPos[];
  isHeader: boolean;
}

function parseTable(text: string, baseOffset: number): TableData | null {
  const lines = text.split('\n');
  if (lines.length < 2) return null;

  const rows: RowInfo[] = [];
  let passedDelimiter = false;
  let colCount = 0;
  let offset = baseOffset;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const lineStart = offset;
    const lineEnd = offset + line.length;

    const trimmed = line.trim();

    // Detect delimiter row: contains --- between pipes
    if (!passedDelimiter && isDelimiterRow(trimmed)) {
      passedDelimiter = true;
      offset = lineEnd + 1;
      continue;
    }

    const cells = extractCells(line, lineStart);
    if (cells.length === 0) {
      offset = lineEnd + 1;
      continue;
    }

    colCount = Math.max(colCount, cells.length);
    rows.push({ cells, isHeader: !passedDelimiter });

    offset = lineEnd + 1;
  }

  if (rows.length === 0) return null;

  return {
    from: baseOffset,
    to: baseOffset + text.length,
    rows,
    colCount,
  };
}

function isDelimiterRow(line: string): boolean {
  if (!line) return false;
  // Must contain only |, -, :, spaces
  const cleaned = line.replace(/^\|/, '').replace(/\|$/, '').trim();
  if (!cleaned) return false;
  const parts = cleaned.split('|').map((s) => s.trim());
  return parts.length > 0 && parts.every((p) => /^:?-{3,}:?$/.test(p));
}

function extractCells(line: string, lineStart: number): CellPos[] {
  // Find all pipe positions in the line
  const pipes: number[] = [];
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '|') pipes.push(i);
  }

  if (pipes.length === 0) {
    // No pipes → whole line is one cell
    return [{ from: lineStart, to: lineStart + line.length }];
  }

  const cells: CellPos[] = [];

  // Determine first cell start
  let firstStart: number;
  if (pipes[0] === 0) {
    // Line starts with | → first cell is after first pipe
    firstStart = pipes[0] + 1;
  } else {
    // No leading pipe → first cell starts at beginning
    firstStart = 0;
  }

  // Add cell before first pipe (if there's content before it)
  if (firstStart === 0) {
    cells.push({ from: lineStart, to: lineStart + pipes[0] });
  }

  // Cells between consecutive pipes
  for (let i = 0; i < pipes.length - 1; i++) {
    const cellFrom = pipes[i] + 1;
    const cellTo = pipes[i + 1];
    if (cellFrom < cellTo) {
      cells.push({ from: lineStart + cellFrom, to: lineStart + cellTo });
    }
  }

  // Last cell after last pipe (if line doesn't end with |)
  if (pipes[pipes.length - 1] < line.length - 1) {
    cells.push({
      from: lineStart + pipes[pipes.length - 1] + 1,
      to: lineStart + line.length,
    });
  }

  return cells;
}
