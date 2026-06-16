import { useStore } from '@nanostores/react';
import { $cursorLine, $cursorCol, $fileName, $wordCount } from '../../store/editorStore';
import { useTranslation } from '../../i18n';

const StatusbarSeparator = () => (
  <div className="w-px h-3 bg-[rgb(var(--color),0.15)] mx-2 shrink-0" />
);

export const Statusbar = () => {
  const line = useStore($cursorLine);
  const col = useStore($cursorCol);
  const name = useStore($fileName);
  const words = useStore($wordCount);
  const { t } = useTranslation();

  return (
    <footer className="statusbar shrink-0 h-7 flex items-center justify-between px-4 text-[0.7rem] leading-none select-none bg-[rgb(var(--statusbar-bg),0.45)] text-[rgb(var(--color),0.55)] border-t border-[rgb(var(--color),0.08)] font-mono font-light ">
      <div className="flex items-center gap-1.5 min-w-0">
        <i className="ri-file-text-line text-[0.8rem]" />
        <span className="truncate">{name}</span>
      </div>

      <div className="flex items-center shrink-0">
        <span>
          {t('statusbar.line')} {line}, {t('statusbar.column')} {col}
        </span>
        <StatusbarSeparator />
        <span>
          {words} {t('statusbar.words')}
        </span>
        <StatusbarSeparator />
        <span className="font-semibold tracking-wide text-[0.65rem]">
          MD
        </span>
      </div>
    </footer>
  );
};
