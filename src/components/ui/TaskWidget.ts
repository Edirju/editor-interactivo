import { WidgetType } from '@codemirror/view';

export class CheckboxWidget extends WidgetType {
  constructor(
    readonly checked: boolean,
    readonly pos: number,
  ) {
    super();
  }

  // Comparamos widgets para evitar re-renderizados innecesarios
  eq(other: CheckboxWidget) {
    return other.checked === this.checked && other.pos === this.pos;
  }

  toDOM() {
    const wrap = document.createElement('span');
    wrap.className = 'cm-md-checkbox'; // Clase limpia definida en theme.ts
    wrap.setAttribute('data-pos', this.pos.toString());
    wrap.setAttribute('data-checked', this.checked.toString());

    if (this.checked) {
      wrap.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    }

    return wrap;
  }

  // Ignorar eventos de teclado dentro del widget
  ignoreEvent() {
    return false;
  }
}
