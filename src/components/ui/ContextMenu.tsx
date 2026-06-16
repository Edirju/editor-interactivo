import { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '@nanostores/react';
import { Transition } from '@headlessui/react';
import {
  $contextMenuVisible,
  $contextMenuX,
  $contextMenuY,
  $editorView,
  $isInTable,
} from '../../store/editorStore';
import { useTranslation } from '../../i18n';
import {
  formatoItems,
  parrafoItems,
  insertarItems,
  tablaEditItems,
} from '../editor/toolbar-config';
import { EditorCommands } from '../editor/utils/commands';
import type { ToolbarItem } from '../editor/toolbar-config';
import type { EditorView } from '@codemirror/view';

// ── Helpers ──────────────────────────────────────────────────

interface ContextItem {
  label: string;
  icon: string;
  shortcut?: string;
  divider?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface SubmenuDef {
  id: string;
  label: string;
  icon: string;
  items: ContextItem[];
}

function mapItems(
  items: ToolbarItem[],
  view: EditorView | null,
  t: (key: string, params?: Record<string, string | number>) => string,
): ContextItem[] {
  const result: ContextItem[] = [];

  for (const item of items) {
    if (item.id === 'comment' || item.id === 'body') continue;

    let onClick: (() => void) | undefined;

    if (item.id === 'table') {
      onClick = view
        ? () => EditorCommands.insertTable(view!, { rows: 3, columns: 3, hasHeader: true })
        : undefined;
    } else if (item.id === 'codeBlock') {
      onClick = view
        ? () => EditorCommands.insertCodeBlock(view!)
        : undefined;
    } else if (item.command) {
      onClick = view ? () => item.command!(view!) : undefined;
    }

    result.push({
      label: t(item.labelKey, item.labelParams),
      icon: item.icon,
      shortcut: item.shortcut,
      divider: item.divider,
      disabled: !onClick,
      onClick,
    });
  }

  return result;
}

const ITEM_H = 32;
const SUBMENU_W = 200;

// ── Component ─────────────────────────────────────────────────

export const ContextMenu = () => {
  const visible = useStore($contextMenuVisible);
  const mouseX = useStore($contextMenuX);
  const mouseY = useStore($contextMenuY);
  const view = useStore($editorView);
  const isInTable = useStore($isInTable);
  const { t } = useTranslation();

  const menuRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [subPos, setSubPos] = useState({ x: 0, y: 0 });

  // ── Build items ────────────────────────────────────────────

  const clipboardGroup: ContextItem[] = [
    {
      label: t('common.copy'),
      icon: 'ri-file-copy-line',
      shortcut: 'Ctrl+C',
      onClick: view ? () => EditorCommands.copyContent(view!) : undefined,
    },
    {
      label: t('common.cut'),
      icon: 'ri-scissors-line',
      shortcut: 'Ctrl+X',
      onClick: view ? () => EditorCommands.cutContent(view!) : undefined,
    },
    {
      label: t('common.paste'),
      icon: 'ri-clipboard-line',
      shortcut: 'Ctrl+V',
      onClick: view ? () => EditorCommands.pasteContent(view!) : undefined,
    },
  ];

  const submenus: SubmenuDef[] = [
    { id: 'format', label: t('toolbar.format'), icon: 'ri-brush-3-line', items: mapItems(formatoItems, view, t) },
    { id: 'paragraph', label: t('toolbar.paragraph'), icon: 'ri-paragraph', items: mapItems(parrafoItems, view, t) },
    { id: 'insert', label: t('toolbar.insert'), icon: 'ri-add-box-line', items: mapItems(insertarItems, view, t) },
  ];

  if (isInTable) {
    submenus.push({
      id: 'table',
      label: t('toolbar.table'),
      icon: 'ri-table-2',
      items: mapItems(tablaEditItems, view, t),
    });
  }

  // ── Close handlers ─────────────────────────────────────────

  const close = () => {
    $contextMenuVisible.set(false);
    setOpenSub(null);
  };

  useEffect(() => {
    if (!visible) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target)) {
        close();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onPointerDown);
    });
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [visible]);

  // ── Adjust position ────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;
    setPos({ x: mouseX, y: mouseY });
    setOpenSub(null);

    requestAnimationFrame(() => {
      const el = menuRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const maxX = window.innerWidth - rect.width - 8;
      const maxY = window.innerHeight - rect.height - 8;
      setPos({
        x: Math.min(mouseX, maxX),
        y: Math.min(mouseY, maxY),
      });
    });
  }, [visible, mouseX, mouseY]);

  // ── Submenu open/close with delay ──────────────────────────

  const startClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenSub(null), 150);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleSubEnter = (id: string) => {
    cancelClose();
    setOpenSub(id);
  };

  // ── Submenu position ───────────────────────────────────────

  useEffect(() => {
    if (!openSub || !menuRef.current) return;
    const idx = submenus.findIndex((s) => s.id === openSub);
    if (idx === -1) return;

    const sub = submenus[idx];
    const divCount = sub.items.filter((i) => i.divider).length;
    const subH = 8 + sub.items.length * ITEM_H + divCount * 9;

    const el = menuRef.current;
    const rect = el.getBoundingClientRect();

    const topOffset = 4; /* py-1 */
    const clipboardH = 3 * ITEM_H + 1; /* 3 items + divider border */
    let subY = rect.top + topOffset + clipboardH + idx * ITEM_H;

    if (subY + subH > window.innerHeight - 8) {
      subY = Math.max(8, window.innerHeight - 8 - subH);
    }

    let subX = rect.right;
    if (subX + SUBMENU_W > window.innerWidth - 8) {
      subX = rect.left - SUBMENU_W;
    }

    setSubPos({ x: subX, y: subY });
  }, [openSub, submenus]);

  // ── Render ─────────────────────────────────────────────────

  return createPortal(
    <Transition show={visible} as={Fragment} appear>
      <div
        className="fixed inset-0 z-50"
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            ref={menuRef}
            style={{ left: pos.x, top: pos.y, width: SUBMENU_W }}
            className="absolute rounded-md bg-[rgb(var(--light))] dark:bg-[rgb(var(--dark))] border border-transparent shadow-xl ring-1 ring-[rgb(var(--color),0.25)] py-1 font-mono font-light text-sm select-none"
          >
            {/* Clipboard group */}
            {clipboardGroup.map((item, i) => (
              <div key={i}>
                <button
                  onClick={() => {
                    item.onClick?.();
                    close();
                  }}
                  disabled={item.disabled}
                  className="flex w-full items-center justify-between px-2 py-1.5 text-[rgb(var(--color),0.85)] hover:bg-[rgb(var(--color),0.10)] hover:text-blue-500 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  style={{ height: ITEM_H }}
                >
                  <div className="flex items-center gap-2">
                    <i className={`${item.icon} text-base`} />
                    <span>{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-[.625rem] text-[rgb(var(--color),0.3)] tracking-wide uppercase">
                      {item.shortcut}
                    </span>
                  )}
                </button>
                {i < 2 && <div className="mx-2 border-t border-[rgb(var(--color),0.12)]" />}
              </div>
            ))}

            {/* Divider after clipboard */}
            <div className="mx-2 my-1 border-t border-[rgb(var(--color),0.25)]" />

            {/* Submenu triggers */}
            {submenus.map((sub) => (
              <div
                key={sub.id}
                onMouseEnter={() => handleSubEnter(sub.id)}
                onMouseLeave={startClose}
                className="relative"
              >
                <button
                  className={`flex w-full items-center justify-between px-2 py-1.5 text-[rgb(var(--color),0.85)] hover:bg-[rgb(var(--color),0.10)] hover:text-blue-500 transition-colors ${openSub === sub.id ? 'bg-[rgb(var(--color),0.10)] text-blue-500' : ''}`}
                  style={{ height: ITEM_H }}
                >
                  <div className="flex items-center gap-2">
                    <i className={`${sub.icon} text-base`} />
                    <span>{sub.label}</span>
                  </div>
                  <i className="ri-arrow-right-s-line text-base" />
                </button>

                {/* Submenu panel */}
                {openSub === sub.id && (
                  <div
                    onMouseEnter={cancelClose}
                    onMouseLeave={startClose}
                    style={{
                      left: subPos.x,
                      top: subPos.y,
                      width: SUBMENU_W,
                    }}
                    className="fixed rounded-md bg-[rgb(var(--light))] dark:bg-[rgb(var(--dark))] border border-transparent shadow-xl ring-1 ring-[rgb(var(--color),0.25)] py-1 font-mono font-light text-sm select-none"
                  >
                    {sub.items.map((item, i) => (
                      <Fragment key={i}>
                        {item.divider && (
                          <div className="mx-2 my-1 border-t border-[rgb(var(--color),0.25)]" />
                        )}
                        <button
                          onClick={() => {
                            item.onClick?.();
                            close();
                          }}
                          disabled={item.disabled}
                          className="flex w-full items-center justify-between px-2 py-1.5 text-[rgb(var(--color),0.85)] hover:bg-[rgb(var(--color),0.10)] hover:text-blue-500 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          style={{ height: ITEM_H }}
                        >
                          <div className="flex items-center gap-2">
                            <i className={`${item.icon} text-base`} />
                            <span>{item.label}</span>
                          </div>
                          {item.shortcut && (
                            <span className="text-[.625rem] text-[rgb(var(--color),0.3)] tracking-wide uppercase">
                              {item.shortcut}
                            </span>
                          )}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Transition.Child>
      </div>
    </Transition>,
    document.body,
  );
};
