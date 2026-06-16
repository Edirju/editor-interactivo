import { Toolbar } from './Toolbar';
import { EditorIsland } from './EditorIsland';
import { ErrorBoundary } from './ErrorBoundary';
import { Statusbar } from './Statusbar';
import { ContextMenu } from '../ui/ContextMenu';

export const EditorContainer = () => {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Toolbar />
      <div className="flex-1 overflow-y-auto pt-10 pb-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ErrorBoundary>
            <EditorIsland />
          </ErrorBoundary>
        </div>
      </div>
      <Statusbar />
      <ContextMenu />
    </div>
  );
};
