import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sections: {
    title: string;
    icon: string;
    items: any[];
  }[];
}

export const MobileDrawer = ({
  isOpen,
  onClose,
  sections,
}: MobileDrawerProps) => {
  const [openSection, setOpenSection] = useState<number | null>(0);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[rgb(var(--light),0.45)] dark:bg-[rgb(var(--dark),0.45)] backdrop-blur-xl backdrop-saturate-100" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-400"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xs">
                  <div className="flex h-full flex-col bg-[rgb(var(--light),0.65)] dark:bg-[rgb(var(--dark),0.65)] border-l border-[rgb(var(--color),0.1)] shadow-2xl">
                    {/* Header del Drawer */}
                    <div className="px-6 py-6 flex justify-between items-center border-b border-[rgb(var(--color),0.1)]">
                      <div className="flex items-center gap-2 text-[rgb(var(--color),0.85)]">
                        <i className="ri-settings-4-line text-xl"></i>
                        <Dialog.Title className="text-lg font-bold tracking-tighter">
                          Nebula Tools
                        </Dialog.Title>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 size-8 flex items-center justify-center rounded-md hover:bg-[rgb(var(--color),0.15)] text-[rgb(var(--color),0.65)] hover:text-[rgb(var(--color),0.85)] transition-all duration-300 active:scale-90 shrink-0"
                      >
                        <i className="ri-close-fill text-2xl"></i>
                      </button>
                    </div>

                    {/* Contenido con Acordeones */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                      {sections.map((section, idx) => (
                        <div
                          key={idx}
                          className="border border-[rgb(var(--color),0.1)] rounded-xl overflow-hidden bg-[rgb(var(--light),0.45)] dark:bg-[rgb(var(--dark),0.45)]"
                        >
                          <button
                            onClick={() =>
                              setOpenSection(openSection === idx ? null : idx)
                            }
                            className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-medium text-[rgb(var(--color),0.85)] hover:bg-[rgb(var(--color),0.15)] transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <i className={`${section.icon} text-xl`}></i>
                              <span>{section.title}</span>
                            </div>
                            <i
                              className={`ri-arrow-down-s-line text-lg transition-transform duration-300 ${openSection === idx ? 'rotate-180 text-blue-400' : ''}`}
                            ></i>
                          </button>

                          <Transition
                            show={openSection === idx}
                            enter="transition duration-200 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-100 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <div className="px-2 pb-4 pt-1 bg-[rgb(var(--color),0.05)] text-[rgb(var(--color),0.65)]">
                              <div className="grid grid-cols-1 gap-1">
                                {section.items.map((item, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      item.onClick();
                                      onClose();
                                    }}
                                    className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-blue-600/10 hover:text-blue-400 transition-all group"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <i
                                        className={`${item.icon} text-lg group-hover:scale-110 transition-transform`}
                                      ></i>
                                      <span className="text-[13px] font-ligth tracking-tight font-mono">
                                        {item.label}
                                      </span>
                                    </div>
                                    {item.shortcut && (
                                      <span className="text-[10px] bg-[rgb(var(--color),0.25)] px-1.5 py-0.5 rounded font-mono">
                                        {item.shortcut}
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </Transition>
                        </div>
                      ))}
                    </div>

                    {/* Footer del Drawer */}
                    <div className="p-4 border-t border-[rgb(var(--color),0.1)] bg-[rgb(var(--color),0.08)]">
                      <p className="text-[10px] text-center text-[rgb(var(--color),0.55)] font-mono uppercase tracking-widest">
                        Markdown Engine v1.0.0
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
