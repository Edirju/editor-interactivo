import { atom } from 'nanostores';
import type { EditorView } from '@codemirror/view';

export const $markdownContent = atom<string>(
  '# Bienvenido a Nébula\nEmpieza a escribir...',
);
// Store para la instancia del editor
export const $editorView = atom<EditorView | null>(null);
