import type { EditorView } from '@codemirror/view';
import { EditorCommands } from './utils/commands';

// INTERFACES — Toolbar Config
export interface ToolbarItem {
  id: string;
  labelKey: string;
  icon: string;
  shortcut?: string;
  divider?: boolean;
  command?: (view: EditorView) => void;
  labelParams?: Record<string, string | number>;
}

export interface ToolbarSection {
  id: string;
  titleKey: string;
  icon: string;
  items: ToolbarItem[];
}

export interface DesktopIconButton {
  id: string;
  icon: string;
  labelKey: string;
  command?: (view: EditorView) => void;
}

// FORMATO
export const formatoItems: ToolbarItem[] = [
  {
    id: 'bold',
    labelKey: 'toolbar.bold',
    icon: 'ri-bold',
    shortcut: 'Ctrl+B',
    command: EditorCommands.toggleBold,
  },
  {
    id: 'italic',
    labelKey: 'toolbar.italic',
    icon: 'ri-italic',
    shortcut: 'Ctrl+I',
    command: EditorCommands.toggleItalic,
  },
  {
    id: 'strikethrough',
    labelKey: 'toolbar.strikethrough',
    icon: 'ri-strikethrough',
    command: EditorCommands.toggleStrikethrough,
  },
  {
    id: 'highlight',
    labelKey: 'toolbar.highlight',
    icon: 'ri-mark-pen-line',
    divider: true,
    command: EditorCommands.toggleHighlight,
  },
  {
    id: 'code',
    labelKey: 'toolbar.code',
    icon: 'ri-code-s-slash-line',
    command: EditorCommands.toggleInlineCode,
  },
  {
    id: 'math',
    labelKey: 'toolbar.math',
    icon: 'ri-functions',
    command: EditorCommands.toggleMath,
  },
  {
    id: 'comment',
    labelKey: 'toolbar.comment',
    icon: 'ri-percent-line',
    divider: true,
  },
  {
    id: 'clearFormat',
    labelKey: 'toolbar.clearFormat',
    icon: 'ri-eraser-line',
    command: EditorCommands.toggleClearFormat,
  },
];

// PARRAFO
export const parrafoItems: ToolbarItem[] = [
  {
    id: 'bulletList',
    labelKey: 'toolbar.bulletList',
    icon: 'ri-list-unordered',
    command: EditorCommands.insertBulletList,
  },
  {
    id: 'orderedList',
    labelKey: 'toolbar.orderedList',
    icon: 'ri-list-ordered-2',
    command: EditorCommands.insertOrderedList,
  },
  {
    id: 'taskList',
    labelKey: 'toolbar.taskList',
    icon: 'ri-list-check-3',
    divider: true,
    command: EditorCommands.insertTaskList,
  },
  {
    id: 'heading1',
    labelKey: 'toolbar.heading',
    icon: 'ri-h-1',
    labelParams: { level: 1 },
    command: (v) => EditorCommands.toggleHeader(v, 1),
  },
  {
    id: 'heading2',
    labelKey: 'toolbar.heading',
    icon: 'ri-h-2',
    labelParams: { level: 2 },
    command: (v) => EditorCommands.toggleHeader(v, 2),
  },
  {
    id: 'heading3',
    labelKey: 'toolbar.heading',
    icon: 'ri-h-3',
    labelParams: { level: 3 },
    command: (v) => EditorCommands.toggleHeader(v, 3),
  },
  {
    id: 'heading4',
    labelKey: 'toolbar.heading',
    icon: 'ri-h-4',
    labelParams: { level: 4 },
    command: (v) => EditorCommands.toggleHeader(v, 4),
  },
  {
    id: 'heading5',
    labelKey: 'toolbar.heading',
    icon: 'ri-h-5',
    labelParams: { level: 5 },
    command: (v) => EditorCommands.toggleHeader(v, 5),
  },
  {
    id: 'heading6',
    labelKey: 'toolbar.heading',
    icon: 'ri-h-6',
    labelParams: { level: 6 },
    command: (v) => EditorCommands.toggleHeader(v, 6),
  },
  { id: 'body', labelKey: 'toolbar.body', icon: 'ri-text', divider: true },
  {
    id: 'quote',
    labelKey: 'toolbar.quote',
    icon: 'ri-double-quotes-l',
    command: EditorCommands.insertQuote,
  },
];

// INSERTAR
export const insertarItems: ToolbarItem[] = [
  {
    id: 'footnote',
    labelKey: 'toolbar.footnote',
    icon: 'ri-sticky-note-add-line',
    command: EditorCommands.insertFootnote,
  },
  {
    id: 'callout',
    labelKey: 'toolbar.featured',
    icon: 'ri-chat-quote-line',
    command: EditorCommands.insertCallout,
  },
  {
    id: 'horizontalRule',
    labelKey: 'toolbar.horizontalRule',
    icon: 'ri-separator',
    divider: true,
    command: EditorCommands.insertHorizontalRule,
  },

  { id: 'table', labelKey: 'toolbar.table', icon: 'ri-table-2', divider: true },
  {
    id: 'mathBlock',
    labelKey: 'toolbar.mathBlock',
    icon: 'ri-formula',
    command: EditorCommands.insertMathBlock,
  },
  {
    id: 'codeBlock',
    labelKey: 'toolbar.codeBlock',
    icon: 'ri-code-view',
  },
];

// ARCHIVO
export const archivoItems: ToolbarItem[] = [
  { id: 'new', labelKey: 'common.new', icon: 'ri-file-add-line' },
  { id: 'save', labelKey: 'common.save', icon: 'ri-save-line' },
  { id: 'open', labelKey: 'common.open', icon: 'ri-folder-open-line' },
];

// ICONOS DE ESCRITORIO (Copy, Cut, Paste)
export const desktopIconButtons: DesktopIconButton[] = [
  { id: 'copy', icon: 'ri-file-copy-line', labelKey: 'common.copy' },
  { id: 'cut', icon: 'ri-scissors-line', labelKey: 'common.cut' },
  { id: 'paste', icon: 'ri-clipboard-line', labelKey: 'common.paste' },
];

// SECCIONES DEL DRAWER MOVIL
export const mobileSections: ToolbarSection[] = [
  {
    id: 'file',
    titleKey: 'toolbar.file',
    icon: 'ri-folder-settings-line',
    items: archivoItems,
  },
  {
    id: 'format',
    titleKey: 'toolbar.format',
    icon: 'ri-brush-3-line',
    items: formatoItems,
  },
  {
    id: 'paragraph',
    titleKey: 'toolbar.paragraph',
    icon: 'ri-paragraph',
    items: parrafoItems,
  },
  {
    id: 'insert',
    titleKey: 'toolbar.insert',
    icon: 'ri-add-box-line',
    items: insertarItems,
  },
];
