import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface MenuItem {
  label: string;
  icon: string;
  shortcut?: string;
  onClick: () => void;
  divider?: boolean;
}

interface Props {
  label: string;
  icon: string;
  items: MenuItem[];
}

export const MenuDropdown = ({ label, icon, items }: Props) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 px-3 py-1 rounded-md  transition-all duration-300 text-sm font-light font-mono hover:bg-[rgb(var(--color),0.15)] text-[rgb(var(--color),0.65)] hover:text-[rgb(var(--color),0.85)]">
        <i className={`${icon} text-lg`}></i>
        <span className="hidden sm:inline">{label}</span>
        <i className="ri-arrow-down-s-line"></i>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 origin-top-left divide-y divide-[rgb(var(--color),0.25)] rounded-md bg-[rgb(var(--light))] dark:bg-[rgb(var(--dark))] border border-transparent shadow-xl ring-1 ring-[rgb(var(--color),0.25)] ring-opacity-5 focus:outline-none z-50 font-mono font-light">
          <div className="px-1 py-1">
            {items.map((item, index) => (
              <Fragment key={index}>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={item.onClick}
                      className={`${
                        active
                          ? 'bg-[rgb(var(--color),0.10)] text-blue-500'
                          : 'text-[rgb(var(--color),0.85)]'
                      } group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm transition-colors`}
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <i className={`${item.icon} text-base`}></i>
                        {item.label}
                      </div>
                      {item.shortcut && (
                        <span className="text-[.625rem] text-[rgb(var(--color),0.3)] tracking-wide uppercase">
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )}
                </Menu.Item>
                {item.divider && (
                  <div className="my-1 border-t border-[rgb(var(--color),0.25)]" />
                )}
              </Fragment>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
