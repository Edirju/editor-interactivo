import React, { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { useCodeMirror } from './hooks/useCodeMirror';
import { $markdownContent } from '../../store/editorStore';
import { persistenceService } from '../../services/persistence';

export const EditorIsland: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Cargar contenido guardado desde IndexedDB
  useEffect(() => {
    persistenceService
      .load('editing-document')
      .then((saved) => {
        if (saved) {
          $markdownContent.set(saved);
        }
        setIsReady(true);
      })
      .catch(() => {
        setIsReady(true);
      });
  }, []);

  // Hook personalizado que crea y gestiona el EditorView de CodeMirror
  useCodeMirror(editorRef, isReady);

  // Auto-guardado debounced cada vez que cambia el contenido
  useEffect(() => {
    if (!isReady) return;

    const debouncedSave = debounce((content: string) => {
      persistenceService.save('editing-document', content);
    }, 500);

    const unsub = $markdownContent.listen((content) => {
      debouncedSave(content);
    });

    return () => {
      unsub();
      debouncedSave.cancel();
    };
  }, [isReady]);

  return <div ref={editorRef} className="h-full w-full cursor-text" />;
};
