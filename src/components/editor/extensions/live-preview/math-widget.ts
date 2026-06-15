import { WidgetType } from '@codemirror/view';
import katex from 'katex';

export class MathBlockWidget extends WidgetType {
  private readonly renderedHTML: string;

  constructor(private readonly latex: string) {
    super();
    this.renderedHTML = katex.renderToString(latex, {
      displayMode: true,
      throwOnError: false,
      output: 'html',
    });
  }

  override eq(other: MathBlockWidget): boolean {
    return other.latex === this.latex;
  }

  override toDOM(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'cm-md-math-block-display';
    wrapper.innerHTML = this.renderedHTML;
    return wrapper;
  }

  override ignoreEvent(): boolean {
    return false;
  }
}

export class InlineMathWidget extends WidgetType {
  private readonly renderedHTML: string;

  constructor(private readonly latex: string) {
    super();
    this.renderedHTML = katex.renderToString(latex, {
      displayMode: false,
      throwOnError: false,
      output: 'html',
    });
  }

  override eq(other: InlineMathWidget): boolean {
    return other.latex === this.latex;
  }

  override toDOM(): HTMLElement {
    const wrapper = document.createElement('span');
    wrapper.className = 'cm-md-math-inline-katex';
    wrapper.innerHTML = this.renderedHTML;
    return wrapper;
  }

  override ignoreEvent(): boolean {
    return false;
  }
}
