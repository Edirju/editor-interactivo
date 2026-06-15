import React from 'react';
import { Toolbar } from './Toolbar';
import { EditorIsland } from './EditorIsland';
import { ErrorBoundary } from './ErrorBoundary';

export const EditorContainer = () => {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Toolbar />
      <div className="flex-1 overflow-y-auto pt-10 pb-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ErrorBoundary>
            <EditorIsland />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
