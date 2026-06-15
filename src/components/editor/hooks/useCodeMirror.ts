import { useEffect, useRef, type RefObject } from 'react';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  keymap,
  drawSelection,
  highlightActiveLine,
} from '@codemirror/view';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
  insertNewlineAndIndent,
  indentMore,
  indentLess,
} from '@codemirror/commands';
import { markdown, markdownLanguage, markdownKeymap } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { GFM, Subscript, Superscript } from '@lezer/markdown';
import { useStore } from '@nanostores/react';
import { $theme } from '../../../store/themeStore';
import { $editorView, $markdownContent } from '../../../store/editorStore';
import {
  HighlightExtension,
  MathExtension,
  DisplayMathExtension,
} from '../extensions/markdown-syntax';
import { getEditorTheme, themeCompartment } from '../extensions/theme';
import { livePreviewEngine, livePreviewProxy } from '../extensions/live-preview';
import { footnoteClickHandler } from '../extensions/footnote-click';

export function useCodeMirror(
  containerRef: RefObject<HTMLDivElement | null>,
  isReady: boolean,
): EditorView | null {
  const currentTheme = useStore($theme);
  const editorViewRef = useRef<EditorView | null>(null);

  // Reconfigurar tema cuando cambia
  useEffect(() => {
    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        effects: themeCompartment.reconfigure(getEditorTheme(currentTheme)),
      });
    }
  }, [currentTheme]);

  // Crear EditorView cuando isReady = true
  useEffect(() => {
    if (!containerRef.current || !isReady) return;

    const state = EditorState.create({
      doc: $markdownContent.get(),
      extensions: [
        history(),
        drawSelection(),
        highlightActiveLine(),
        EditorView.lineWrapping,
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          extensions: [
            GFM,
            Subscript,
            Superscript,
            HighlightExtension,
            MathExtension,
            DisplayMathExtension,
          ],
        }),
        livePreviewEngine,
        livePreviewProxy,
        footnoteClickHandler(),
        themeCompartment.of(getEditorTheme($theme.get())),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
          ...markdownKeymap,
          { key: 'Enter', run: insertNewlineAndIndent },
          {
            key: 'Tab',
            run: indentMore,
            shift: indentLess,
          },
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            $markdownContent.set(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          click(event, view) {
            const target = (event.target as HTMLElement).closest(
              '.cm-md-checkbox',
            );

            if (target && target instanceof HTMLElement) {
              const pos = parseInt(target.dataset.pos || '');
              const isChecked = target.dataset.checked === 'true';

              if (!isNaN(pos)) {
                view.dispatch({
                  changes: {
                    from: pos + 1,
                    to: pos + 2,
                    insert: isChecked ? ' ' : 'x',
                  },
                });
                return true;
              }
            }
            return false;
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    $editorView.set(view);
    editorViewRef.current = view;

    setTimeout(() => view.focus(), 100);

    return () => {
      view.destroy();
      $editorView.set(null);
      editorViewRef.current = null;
    };
  }, [isReady, containerRef]);

  return editorViewRef.current;
}
