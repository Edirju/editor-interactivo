import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { EditorView } from '@codemirror/view';
import { EditorCommands } from './utils/commands';
import { useTranslation } from '../../i18n';

interface FootnoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: EditorView | null;
}

export function FootnoteModal({ isOpen, onClose, view }: FootnoteModalProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) setText('');
  }, [isOpen]);

  const handleSubmit = () => {
    if (view && text.trim()) {
      EditorCommands.insertFootnote(view, text.trim());
    }
    onClose();
  };

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
                  {t('footnoteModal.title')}
                </Dialog.Title>
                <p className="text-sm text-[rgb(30,37,44,0.5)] dark:text-[rgb(255,254,254,0.5)] mb-4">
                  {t('footnoteModal.description')}
                </p>

                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] bg-transparent p-3 text-sm resize-y focus:outline-none focus:border-[#3b82f6] font-mono leading-relaxed"
                  placeholder={t('footnoteModal.placeholder')}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoFocus
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg text-sm text-[rgb(30,37,44,0.6)] dark:text-[rgb(255,254,254,0.6)] hover:bg-[rgb(30,37,44,0.08)] dark:hover:bg-[rgb(255,254,254,0.08)] transition-colors"
                    onClick={onClose}
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm bg-[#3b82f6] text-white hover:bg-[#2563eb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={!text.trim()}
                  >
                    {t('footnoteModal.insert')}
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
