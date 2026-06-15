import { syntaxTree } from '@codemirror/language';
import type { EditorView } from '@codemirror/view';

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

};
