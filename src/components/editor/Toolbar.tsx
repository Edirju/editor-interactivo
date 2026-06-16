import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { MenuDropdown } from '../ui/MenuDropdown';
import { MobileDrawer } from '../ui/MobileDrawer';
import { FootnoteModal } from './FootnoteModal';
import { CodeBlockModal } from './CodeBlockModal';
import { TableModal } from './TableModal';
import { $editorView, $isInTable } from '../../store/editorStore';
import { $theme, toggleTheme } from '../../store/themeStore';
import { useTranslation, setLocale } from '../../i18n';
import {
  formatoItems as formatoConfig,
  parrafoItems as parrafoConfig,
  insertarItems as insertarConfig,
  archivoItems as archivoConfig,
  desktopIconButtons,
  mobileSections as mobileConfig,
  tablaEditItems as tablaEditConfig,
} from './toolbar-config';
import type { ToolbarItem } from './toolbar-config';

const ToolbarSeparator = () => (
  <div className="w-px h-4 bg-[rgb(var(--color),0.25)] mx-1 sm:mx-2 shrink-0" />
);

const IconButton = ({
  icon,
  onClick,
  title,
}: {
  icon: string;
  onClick?: () => void;
  title?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 size-8 flex items-center justify-center rounded-md hover:bg-[rgb(var(--color),0.15)] text-[rgb(var(--color),0.65)] hover:text-[rgb(var(--color),0.85)] transition-all duration-300 active:scale-90 shrink-0"
  >
    <i className={`${icon} text-lg`}></i>
  </button>
);

function mapItems(
  items: ToolbarItem[],
  view: ReturnType<typeof useStore<typeof $editorView>>,
  t: (key: string, params?: Record<string, string | number>) => string,
  onFootnoteClick?: () => void,
  onCodeBlockClick?: () => void,
  onTableClick?: () => void,
) {
  return items.map((item) => {
    if (item.id === 'footnote' && onFootnoteClick) {
      return {
        label: t(item.labelKey, item.labelParams),
        icon: item.icon,
        shortcut: item.shortcut,
        divider: item.divider,
        onClick: onFootnoteClick,
      };
    }
    if (item.id === 'codeBlock' && onCodeBlockClick) {
      return {
        label: t(item.labelKey, item.labelParams),
        icon: item.icon,
        shortcut: item.shortcut,
        divider: item.divider,
        onClick: onCodeBlockClick,
      };
    }
    if (item.id === 'table' && onTableClick) {
      return {
        label: t(item.labelKey, item.labelParams),
        icon: item.icon,
        shortcut: item.shortcut,
        divider: item.divider,
        onClick: onTableClick,
      };
    }
    return {
      label: t(item.labelKey, item.labelParams),
      icon: item.icon,
      shortcut: item.shortcut,
      divider: item.divider,
      onClick: () => item.command?.(view!),
    };
  });
}

export const Toolbar = () => {
  const view = useStore($editorView);
  const theme = useStore($theme);
  const { t, locale } = useTranslation();
  const isInTable = useStore($isInTable);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFootnoteOpen, setIsFootnoteOpen] = useState(false);
  const [isCodeBlockOpen, setIsCodeBlockOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const openFootnoteModal = () => setIsFootnoteOpen(true);
  const openCodeBlockModal = () => setIsCodeBlockOpen(true);
  const openTableModal = () => setIsTableOpen(true);

  const formatoItems = mapItems(formatoConfig, view, t);
  const parrafoItems = mapItems(parrafoConfig, view, t);
  const insertarItems = mapItems(insertarConfig, view, t, openFootnoteModal, openCodeBlockModal, openTableModal);
  const archivoItems = mapItems(archivoConfig, view, t);
  const tablaEditMapped = isInTable ? mapItems(tablaEditConfig, view, t) : [];

  const mobileSections = mobileConfig
    .filter((section) => section.id !== 'tableEdit' || isInTable)
    .map((section) => ({
      title: t(section.titleKey),
      icon: section.icon,
      items: mapItems(section.items, view, t),
    }));

  return (
    <header className="toolbar sticky top-0 z-40 w-full backdrop-blur-md border-b border-[rgb(var(--color),0.1)] text-[rgb(var(--color),0.65)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <i className="ri-markdown-fill text-[rgb(var(--color))] text-2xl"></i>
          <span className="hidden sm:inline font-bold tracking-tighter text-[rgb(var(--color),0.85)]">
            {t('app.name')}
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          <div className="flex items-center">
            {archivoItems.map((item, i) => (
              <IconButton key={i} icon={item.icon} title={item.label} onClick={item.onClick} />
            ))}
          </div>
          <ToolbarSeparator />
          <div className="flex items-center">
            {desktopIconButtons.map((btn) => (
              <IconButton
                key={btn.id}
                icon={btn.icon}
                title={t(btn.labelKey)}
                onClick={() => btn.command?.(view!)}
              />
            ))}
          </div>
          <ToolbarSeparator />
          <MenuDropdown
            label={t('toolbar.format')}
            icon="ri-brush-3-line"
            items={formatoItems}
          />
          <MenuDropdown
            label={t('toolbar.paragraph')}
            icon="ri-paragraph"
            items={parrafoItems}
          />
          <MenuDropdown
            label={t('toolbar.insert')}
            icon="ri-add-box-line"
            items={insertarItems}
          />
          {isInTable && view && (
            <MenuDropdown
              label={t('toolbar.table')}
              icon="ri-table-2"
              items={tablaEditMapped}
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            icon={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}
            onClick={toggleTheme}
            title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          />

          <button
            onClick={() => setLocale(locale === 'es' ? 'en' : 'es')}
            title={locale === 'es' ? 'English' : 'Español'}
            className="p-2 size-8 flex items-center justify-center rounded-md hover:bg-[rgb(var(--color),0.15)] text-[rgb(var(--color),0.65)] hover:text-[rgb(var(--color),0.85)] transition-all duration-300 active:scale-90 shrink-0 font-medium text-[10px] border border-[rgb(var(--color),0.08)]"
          >
            {locale === 'es' ? 'EN' : 'ES'}
          </button>

          <div className="lg:hidden ml-2">
            <IconButton
              icon="ri-menu-line"
              onClick={() => setIsDrawerOpen(true)}
              title={t('common.menu')}
            />
          </div>
        </div>
      </div>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sections={mobileSections}
      />

      <FootnoteModal
        isOpen={isFootnoteOpen}
        onClose={() => setIsFootnoteOpen(false)}
        view={view}
      />
      <CodeBlockModal
        isOpen={isCodeBlockOpen}
        onClose={() => setIsCodeBlockOpen(false)}
        view={view}
      />
      <TableModal
        isOpen={isTableOpen}
        onClose={() => setIsTableOpen(false)}
        view={view}
      />
    </header>
  );
};
