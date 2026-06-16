import { syntaxTree } from '@codemirror/language';
import type { EditorView } from '@codemirror/view';
import {
  getTableAtCursor,
  isDelimiterRow,
  type TableCursorInfo,
} from './table-utils';
import { $fileName } from '../../../store/editorStore';

const wrapText = (view: EditorView, before: string, after: string = before) => {
  const { from, to, empty } = view.state.selection.main;
  if (empty) {
    // Si no hay selección, insertamos los símbolos y movemos el cursor al centro
    view.dispatch({
      changes: { from, insert: before + after },
      selection: { anchor: from + before.length },
      userEvent: 'input',
    });
  } else {
    // Si hay selección, envolvemos el texto
    const selectedText = view.state.sliceDoc(from, to);
    view.dispatch({
      changes: { from, to, insert: before + selectedText + after },
      selection: { anchor: from + before.length, head: to + before.length },
      userEvent: 'input',
    });
  }
  view.focus();
};

export const EditorCommands = {
  insertTable: (
    view: EditorView,
    opts: { rows: number; columns: number; hasHeader: boolean },
  ) => {
    const { rows, columns, hasHeader } = opts;
    const { from } = view.state.selection.main;
    const line = view.state.doc.lineAt(from);

    const headerRow =
      '| ' +
      Array.from({ length: columns }, (_, i) => `Header ${i + 1}`).join(' | ') +
      ' |';
    const delimiterRow =
      '| ' + Array.from({ length: columns }, () => '---').join(' | ') + ' |';
    const cellRows = Array.from(
      { length: hasHeader ? rows - 1 : rows },
      () =>
        '| ' +
        Array.from({ length: columns }, () => `Cell`).join(' | ') +
        ' |',
    );

    const tableLines: string[] = [];
    if (hasHeader) {
      tableLines.push(headerRow, delimiterRow, ...cellRows);
    } else {
      tableLines.push(delimiterRow, ...cellRows);
    }
    const tableText = tableLines.join('\n');

    const insertText = line.text === '' ? tableText : '\n' + tableText;

    const cursorOffset =
      (line.text === '' ? 0 : 1) +
      (hasHeader ? headerRow.length + 1 + delimiterRow.length + 1 + 2 : delimiterRow.length + 1 + 2);

    view.dispatch({
      changes: { from: line.to, insert: insertText },
      selection: { anchor: line.to + cursorOffset },
      userEvent: 'input',
    });
    view.focus();
  },

  toggleBold: (view: EditorView) => wrapText(view, '**'),

  toggleItalic: (view: EditorView) => wrapText(view, '*'),

  toggleStrikethrough: (view: EditorView) => wrapText(view, '~~'),

  toggleHighlight: (view: EditorView) => wrapText(view, '=='),

  toggleInlineCode: (view: EditorView) => wrapText(view, '`'),

  toggleMath: (view: EditorView) => wrapText(view, '$'),

  toggleClearFormat: (view: EditorView) => {
    const { state } = view;
    const { from, to, empty } = state.selection.main;
    // Si hay selección, limpiamos lo seleccionado (comportamiento actual mejorado)
    if (!empty) {
      const text = state.sliceDoc(from, to);
      const clean = text.replace(/[\\*\\_\\~\\=\\`\\$]/g, '');
      view.dispatch({
        changes: { from, to, insert: clean },
        userEvent: 'input',
      });
      return;
    }
    // SI NO HAY SELECCIÓN: Buscamos el nodo bajo el cursor
    const pos = from;
    const tree = syntaxTree(state);
    const node = tree.resolveInner(pos, -1);
    // Tipos de nodos que queremos limpiar
    const formatNodes = [
      'Emphasis',
      'StrongEmphasis',
      'Strikethrough',
      'Highlight',
      'InlineCode',
      'InlineMath',
    ];
    if (formatNodes.includes(node.name)) {
      // Obtenemos el texto del nodo completo (incluyendo marcas)
      const content = state.sliceDoc(node.from, node.to);
      // Limpiamos los símbolos del principio y el final
      // Esto elimina **, *, ==, $, etc.
      const clean = content
        .replace(/^(\*\*|\*|~~|==|`|\$)/, '')
        .replace(/(\*\*|\*|~~|==|`|\$)$/, '');

      view.dispatch({
        changes: { from: node.from, to: node.to, insert: clean },
        selection: { anchor: node.from + clean.length }, // Movemos el cursor al final
        userEvent: 'input',
      });
    }
    view.focus();
  },

  toggleHeader: (view: EditorView, level: number) => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const text = line.text;
    const headerPrefix = '#'.repeat(level) + ' ';

    // Si ya tiene el mismo header, lo quitamos
    if (text.startsWith(headerPrefix)) {
      view.dispatch({
        changes: {
          from: line.from,
          to: line.from + headerPrefix.length,
          insert: '',
        },
      });
    } else {
      // Limpiamos cualquier header previo y ponemos el nuevo
      const cleanText = text.replace(/^#+\s*/, '');
      view.dispatch({
        changes: {
          from: line.from,
          to: line.to,
          insert: headerPrefix + cleanText,
        },
      });
    }
    view.focus();
  },

  insertBulletList: (view: EditorView) => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    view.dispatch({
      changes: { from: line.from, to: line.from, insert: '- ' },
      selection: { anchor: line.from + 2 },
    });
    view.focus();
  },

  insertOrderedList: (view: EditorView) => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    view.dispatch({
      changes: { from: line.from, to: line.from, insert: '1. ' },
      selection: { anchor: line.from + 3 },
    });
    view.focus();
  },

  insertTaskList: (view: EditorView) => {
    const { state } = view;
    const line = state.doc.lineAt(state.selection.main.head);
    const text = line.text;

    const markerMatch = text.match(/^(\s*)([-+*]|\d+[.)])(\s*)(.*)/);

    if (markerMatch) {
      const indent = markerMatch[1];
      const marker = markerMatch[2];
      const rest = markerMatch[4];
      // Already a task list line → skip
      if (/^\[[ x]\]\s/.test(rest)) {
        view.focus();
        return;
      }
      view.dispatch({
        changes: { from: line.from, to: line.to, insert: `${indent}${marker} [ ] ${rest}` },
        selection: { anchor: line.from + indent.length + marker.length + 6 },
      });
    } else {
      view.dispatch({
        changes: { from: line.from, to: line.from, insert: '- [ ] ' },
        selection: { anchor: line.from + 6 },
      });
    }
    view.focus();
  },

  insertQuote: (view: EditorView) => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    view.dispatch({
      changes: { from: line.from, to: line.from, insert: '> ' },
      selection: { anchor: line.from + 2 },
    });
    view.focus();
  },

  insertMathBlock: (view: EditorView) => {
    const { state } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    const insertText = line.text === '' ? '$$\n\n$$\n' : '\n$$\n\n$$\n';
    const midPos = line.to + (line.text === '' ? 3 : 4);

    view.dispatch({
      changes: { from: line.to, insert: insertText },
      selection: { anchor: midPos },
    });
    view.focus();
  },

  insertHorizontalRule: (view: EditorView) => {
    const line = view.state.doc.lineAt(view.state.selection.main.head);
    const insertText = line.text === '' ? '---\n' : '\n---\n';

    view.dispatch({
      changes: { from: line.to, insert: insertText },
      selection: { anchor: line.to + insertText.length },
    });
    view.focus();
  },

  insertCallout: (view: EditorView) => {
    const { state } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);
    const template = '> [!NOTE] Nota\n>\n';
    view.dispatch({
      changes: { from: line.from, to: line.to, insert: template },
      selection: { anchor: line.from + 11 },
    });
    view.focus();
  },

  insertCodeBlock: (view: EditorView, language?: string) => {
    const { state } = view;
    const { from } = state.selection.main;
    const line = state.doc.lineAt(from);

    const lang = language ? language.trim() : '';
    const marker = lang ? `\`\`\`${lang}` : '```';
    const content = `${marker}\n\n\`\`\``;

    view.dispatch({
      changes: { from: line.from, to: line.to, insert: content },
      selection: { anchor: line.from + 3 + lang.length + 1 },
    });
    view.focus();
  },

  insertFootnote: (view: EditorView, defText?: string) => {
    const { state } = view;
    const { to } = state.selection.main;

    const content = state.doc.toString();
    const usedIds = new Set(
      [...content.matchAll(/\[\^([^\]]+)\]/g)].map((m) => m[1]),
    );
    let nextId = 1;
    while (usedIds.has(String(nextId))) nextId++;

    const marker = `[^${nextId}]`;
    const docEnd = state.doc.length;

    let insertPos = docEnd;
    const defRegex = /^\[\^([^\]]+)\]:/;
    for (let i = state.doc.lines; i >= 1; i--) {
      const line = state.doc.line(i);
      if (defRegex.test(line.text)) {
        insertPos = line.to;
        break;
      }
    }

    const defSuffix = defText ? ` ${defText}` : ' ';
    const definition = insertPos === docEnd
      ? `\n\n[^${nextId}]:${defSuffix}`
      : `\n[^${nextId}]:${defSuffix}`;

    const defEnd = insertPos + (to <= insertPos ? marker.length : 0) + definition.length;

    view.dispatch({
      changes: [
        { from: to, insert: marker },
        { from: insertPos, insert: definition },
      ],
      selection: { anchor: defEnd },
    });
    view.focus();
  },

  // ── Table editing commands ──────────────────────────────────────

  addRowAbove: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    const colCount = getColumnCount(info.rows);
    const newRow = '|' + Array.from({ length: colCount }, () => '   |').join('');
    info.rows.splice(info.cursorRow, 0, newRow);
    replaceTable(view, info);
  },

  addRowBelow: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    const colCount = getColumnCount(info.rows);
    const newRow = '|' + Array.from({ length: colCount }, () => '   |').join('');
    info.rows.splice(info.cursorRow + 1, 0, newRow);
    replaceTable(view, info);
  },

  deleteRow: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    if (isDelimiterRow(info.rows[info.cursorRow].trim())) return;
    info.rows.splice(info.cursorRow, 1);
    replaceTable(view, info);
  },

  addColumnLeft: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    info.rows = info.rows.map((row) => addColumnToRow(row, info.cursorCol));
    replaceTable(view, info);
  },

  addColumnRight: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    info.rows = info.rows.map((row) => addColumnToRow(row, info.cursorCol + 1));
    replaceTable(view, info);
  },

  deleteColumn: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    info.rows = info.rows.map((row) => removeColumnFromRow(row, info.cursorCol));
    replaceTable(view, info);
  },

  alignColumnLeft: (view: EditorView) => {
    alignColumn(view, 'left');
  },

  alignColumnCenter: (view: EditorView) => {
    alignColumn(view, 'center');
  },

  alignColumnRight: (view: EditorView) => {
    alignColumn(view, 'right');
  },

  deleteTable: (view: EditorView) => {
    const info = getTableAtCursor(view);
    if (!info) return;
    view.dispatch({
      changes: { from: info.from, to: info.to, insert: '' },
      selection: { anchor: info.from },
      userEvent: 'input',
    });
    view.focus();
  },

  // ── Clipboard commands ───────────────────────────────────────

  copyContent: (view: EditorView) => {
    const { from, to, empty } = view.state.selection.main;
    if (!empty) {
      const text = view.state.sliceDoc(from, to);
      navigator.clipboard.writeText(text);
    }
    view.focus();
  },

  cutContent: (view: EditorView) => {
    const { from, to, empty } = view.state.selection.main;
    if (!empty) {
      const text = view.state.sliceDoc(from, to);
      navigator.clipboard.writeText(text);
      view.dispatch({
        changes: { from, to, insert: '' },
        userEvent: 'input',
      });
    }
    view.focus();
  },

  pasteContent: (view: EditorView) => {
    navigator.clipboard
      .readText()
      .then((text) => {
        const { from, to } = view.state.selection.main;
        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from + text.length },
          userEvent: 'input',
        });
      })
      .catch(() => {});
    view.focus();
  },

  // ── File commands ────────────────────────────────────────────

  newDocument: (view: EditorView) => {
    $fileName.set('untitled.md');
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: INITIAL_CONTENT,
      },
      selection: { anchor: 0 },
      userEvent: 'input',
    });
    view.focus();
  },

  saveDocument: async (view: EditorView) => {
    const content = view.state.doc.toString();
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          types: FILE_PICKER_TYPES,
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
      } else {
        downloadFallback(content);
      }
    } catch {
      // User cancelled dialog or API not supported
    }
    view.focus();
  },

  openDocument: async (view: EditorView) => {
    try {
      let content: string | null = null;
      if ('showOpenFilePicker' in window) {
        const [handle] = await (window as any).showOpenFilePicker({
          types: FILE_PICKER_TYPES,
          multiple: false,
        });
        const file = await handle.getFile();
        content = await file.text();
        $fileName.set(file.name);
      } else {
        const result = await openFileFallback();
        if (result) {
          content = result.content;
          $fileName.set(result.name);
        }
      }
      if (content !== null) {
        const { state } = view;
        view.dispatch({
          changes: { from: 0, to: state.doc.length, insert: content },
          selection: { anchor: 0 },
          userEvent: 'input',
        });
      }
    } catch {
      // User cancelled dialog
    }
    view.focus();
  },
};

// ── Table helper functions ────────────────────────────────────────

function getColumnCount(rows: string[]): number {
  for (const row of rows) {
    const trimmed = row.trim();
    if (!trimmed) continue;
    const pipeCount = (trimmed.match(/\|/g) || []).length;
    const count = trimmed[0] === '|' ? pipeCount - 1 : pipeCount + 1;
    if (count > 0) return count;
  }
  return 1;
}

function addColumnToRow(row: string, colIndex: number): string {
  const segments = row.split('|');
  const insertAt = Math.min(colIndex + 1, segments.length);
  const isDelim = isDelimiterRow(row.trim());
  segments.splice(insertAt, 0, isDelim ? ' --- ' : '   ');
  return segments.join('|');
}

function removeColumnFromRow(row: string, colIndex: number): string {
  const segments = row.split('|');
  const removeAt = colIndex + 1;
  if (removeAt > 0 && removeAt < segments.length) {
    segments.splice(removeAt, 1);
  }
  return segments.join('|');
}

function alignColumn(view: EditorView, align: 'left' | 'center' | 'right') {
  const info = getTableAtCursor(view);
  if (!info) return;

  const delimRowIndex = info.rows.findIndex((row) => isDelimiterRow(row.trim()));
  if (delimRowIndex === -1) return;

  const row = info.rows[delimRowIndex];
  const segments = row.split('|');

  const segIndex = info.cursorCol + 1;
  if (segIndex < 1 || segIndex >= segments.length - 1) return;

  const alignMap: Record<string, string> = {
    left: ':---',
    center: ':---:',
    right: '---:',
  };

  segments[segIndex] = ' ' + alignMap[align] + ' ';
  info.rows[delimRowIndex] = segments.join('|');

  replaceTable(view, info);
}

function replaceTable(view: EditorView, info: TableCursorInfo): void {
  const newText = info.rows.join('\n');
  view.dispatch({
    changes: { from: info.from, to: info.to, insert: newText },
    selection: { anchor: info.from },
    userEvent: 'input',
  });
  view.focus();
}

// ── File command helpers ──────────────────────────────────────

const INITIAL_CONTENT = '# Bienvenido a Nébula\nEmpieza a escribir...';

const FILE_PICKER_TYPES = [
  {
    description: 'Markdown',
    accept: { 'text/markdown': ['.md', '.mdx'] },
  },
  {
    description: 'HTML',
    accept: { 'text/html': ['.html'] },
  },
  {
    description: 'Plain Text',
    accept: { 'text/plain': ['.txt'] },
  },
];

function downloadFallback(content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openFileFallback(): Promise<{ content: string; name: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.mdx,.html,.txt';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve({ content: reader.result as string, name: file.name });
      reader.onerror = () => resolve(null);
      reader.readAsText(file);
    });
    input.click();
    setTimeout(() => resolve(null), 30000);
  });
}
