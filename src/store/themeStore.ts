import { atom } from 'nanostores';

export type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') as Theme;
  }
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'dark';
};

export const $theme = atom<Theme>(getInitialTheme());

$theme.listen((newTheme) => {
  localStorage.setItem('theme', newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
});

export function toggleTheme() {
  $theme.set($theme.get() === 'dark' ? 'light' : 'dark');
}
