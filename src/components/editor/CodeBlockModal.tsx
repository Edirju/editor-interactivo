import { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { EditorView } from '@codemirror/view';
import { EditorCommands } from './utils/commands';
import { useTranslation } from '../../i18n';

const LANGUAGES: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  css: 'CSS',
  html: 'HTML',
  xml: 'XML / SVG',
  bash: 'Bash / Shell',
  python: 'Python',
  rust: 'Rust',
  go: 'Go',
  java: 'Java',
  kotlin: 'Kotlin',
  swift: 'Swift',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  dockerfile: 'Dockerfile',
  graphql: 'GraphQL',
  wasm: 'WebAssembly',
  php: 'PHP',
  ruby: 'Ruby',
  latex: 'LaTeX',
  diff: 'Diff',
};

interface CodeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  view: EditorView | null;
}

const LANGUAGE_OPTIONS = Object.entries(LANGUAGES)
  .map(([value, label]) => ({ value, label }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function CodeBlockModal({ isOpen, onClose, view }: CodeBlockModalProps) {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('');
  const [customLang, setCustomLang] = useState('');
  const [isOther, setIsOther] = useState(false);
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedLang('');
      setCustomLang('');
      setIsOther(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOther && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [isOther]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__other__') {
      setIsOther(true);
      setSelectedLang('');
    } else {
      setIsOther(false);
      setSelectedLang(val);
    }
  };

  const getLanguage = (): string => {
    if (isOther) return customLang.trim();
    return selectedLang;
  };

  const handleSubmit = () => {
    const lang = getLanguage();
    if (view) {
      EditorCommands.insertCodeBlock(view, lang);
    }
    onClose();
  };

  const canSubmit = isOther ? customLang.trim().length > 0 : selectedLang.length > 0;

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
                  {t('codeBlockModal.title')}
                </Dialog.Title>
                <p className="text-sm text-[rgb(30,37,44,0.5)] dark:text-[rgb(255,254,254,0.5)] mb-4">
                  {t('codeBlockModal.description')}
                </p>

                <label className="block text-sm font-medium mb-2 text-[rgb(30,37,44,0.7)] dark:text-[rgb(255,254,254,0.7)]">
                  {t('codeBlockModal.language')}
                </label>
                <select
                  className="w-full rounded-lg border border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] bg-transparent p-3 text-sm focus:outline-none focus:border-[#3b82f6] appearance-none cursor-pointer"
                  value={isOther ? '__other__' : selectedLang}
                  onChange={handleSelectChange}
                >
                  <option value="" disabled>
                    {t('codeBlockModal.selectLanguage')}
                  </option>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                  <option value="__other__">{t('codeBlockModal.other')}</option>
                </select>

                {isOther && (
                  <input
                    ref={customInputRef}
                    type="text"
                    className="w-full mt-3 rounded-lg border border-[rgb(30,37,44,0.2)] dark:border-[rgb(255,254,254,0.15)] bg-transparent p-3 text-sm focus:outline-none focus:border-[#3b82f6] font-mono leading-relaxed"
                    placeholder={t('codeBlockModal.otherPlaceholder')}
                    value={customLang}
                    onChange={(e) => setCustomLang(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canSubmit) handleSubmit();
                    }}
                  />
                )}

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
                    disabled={!canSubmit}
                  >
                    {t('codeBlockModal.insert')}
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
