import { atom, computed } from 'nanostores';
import type { EditorView } from '@codemirror/view';

export const $markdownContent = atom<string>(
  '# Bienvenido a Nébula\nEmpieza a escribir...',
);
// Store para la instancia del editor
export const $editorView = atom<EditorView | null>(null);

// Store para saber si el cursor está dentro de una tabla
export const $isInTable = atom<boolean>(false);

// Statusbar atoms
export const $cursorLine = atom<number>(1);
export const $cursorCol = atom<number>(0);
export const $fileName = atom<string>('untitled.md');

export const $wordCount = computed($markdownContent, (content) => {
  const text = content.trim();
  return text ? text.split(/\s+/).length : 0;
});

// Context menu atoms
export const $contextMenuVisible = atom<boolean>(false);
export const $contextMenuX = atom<number>(0);
export const $contextMenuY = atom<number>(0);
