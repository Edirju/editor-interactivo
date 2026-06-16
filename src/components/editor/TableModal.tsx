import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { EditorView } from '@codemirror/view';
import { EditorCommands } from './utils/commands';
import { useTranslation } from '../../i18n';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: EditorView | null;
}

export function TableModal({ isOpen, onClose, view }: TableModalProps) {
  const { t } = useTranslation();
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [hasHeader, setHasHeader] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setRows(3);
      setColumns(3);
      setHasHeader(true);
    }
  }, [isOpen]);

  const handleInsert = () => {
    if (view) {
      EditorCommands.insertTable(view, { rows, columns, hasHeader });
    }
    onClose();
  };

  const minRows = hasHeader ? 2 : 1;
  const canSubmit = rows >= minRows && columns >= 1;

  const gridPreview = generateTablePreview(rows, columns, hasHeader);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white dark:bg-[#1e252c] p-6 shadow-2xl border border-[rgb(30,37,44,0.15)] dark:border-[rgb(255,254,254,0.1)]">
                <Dialog.Title className="text-lg font-bold tracking-tighter mb-1">
                  {t('tableModal.title')}
                </Dialog.Title>
                <p className="text-sm text-[rgb(30,37,44,0.5)] dark:text-[rgb(255,254,254,0.5)] mb-4">
                  {t('tableModal.description')}
                </p>

                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-[rgb(30,37,44,0.7)] dark:text-[rgb(255,254,254,0.7)]">
                      {t('tableModal.rows')}
                    </label>
                    <input
                      type="number"
                      min={minRows}
                      max={20}
                      className="w-full rounded-lg border border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] bg-transparent p-3 text-sm focus:outline-none focus:border-[#3b82f6]"
                      value={rows}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setRows(Math.max(minRows, Math.min(20, val)));
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2 text-[rgb(30,37,44,0.7)] dark:text-[rgb(255,254,254,0.7)]">
                      {t('tableModal.columns')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className="w-full rounded-lg border border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] bg-transparent p-3 text-sm focus:outline-none focus:border-[#3b82f6]"
                      value={columns}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setColumns(Math.max(1, Math.min(20, val)));
                      }}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHeader}
                    onChange={(e) => setHasHeader(e.target.checked)}
                    className="w-5 h-5 rounded border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] accent-[#3b82f6]"
                  />
                  <span className="text-sm text-[rgb(30,37,44,0.7)] dark:text-[rgb(255,254,254,0.7)]">
                    {t('tableModal.includeHeader')}
                  </span>
                </label>

                <div className="mb-4">
                  <p className="text-xs font-medium mb-2 text-[rgb(30,37,44,0.5)] dark:text-[rgb(255,254,254,0.5)] uppercase tracking-wider">
                    {t('tableModal.preview')}
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-[rgb(30,37,44,0.12)] dark:border-[rgb(255,254,254,0.08)] p-3 bg-[rgb(30,37,44,0.03)] dark:bg-[rgb(255,254,254,0.03)]">
                    <table className="table-preview w-full text-xs border-collapse">
                      {gridPreview}
                    </table>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg text-sm text-[rgb(30,37,44,0.6)] dark:text-[rgb(255,254,254,0.6)] hover:bg-[rgb(30,37,44,0.08)] dark:hover:bg-[rgb(255,254,254,0.08)] transition-colors"
                    onClick={onClose}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleInsert}
                    disabled={!canSubmit}
                  >
                    {t('tableModal.insert')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

function generateTablePreview(rows: number, columns: number, hasHeader: boolean) {
  const bodyRows = hasHeader ? rows - 1 : rows;

  return (
    <>
      {hasHeader && (
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={`h-${i}`} className="border border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] px-2 py-1 font-semibold text-left">
                Col {i + 1}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: bodyRows }, (_, r) => (
          <tr key={`r-${r}`}>
            {Array.from({ length: columns }, (_, c) => (
              <td key={`c-${r}-${c}`} className="border border-[rgb(30,37,44,0.12)] dark:border-[rgb(255,254,254,0.08)] px-2 py-1">
                Cell
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </>
  );
}
