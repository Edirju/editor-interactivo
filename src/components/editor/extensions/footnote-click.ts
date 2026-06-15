import { EditorView } from '@codemirror/view';

const defLineRegex = /^\[\^([^\]]+)\]:/;

export function footnoteClickHandler() {
  return EditorView.domEventHandlers({
    click(event, view) {
      const target = event.target as HTMLElement;

      const refEl = target.closest('.cm-md-footnote-ref');
      if (refEl) {
        const text = refEl.textContent ?? '';
        const match = text.match(/\[\^(.+?)\]/);
        if (match) {
          const id = match[1];
          const doc = view.state.doc;
          for (let i = 1; i <= doc.lines; i++) {
            const line = doc.line(i);
            const defMatch = line.text.match(
              new RegExp(`^\\[\\^${escapeRegex(id)}\\]:`),
            );
            if (defMatch) {
              view.dispatch({
                selection: { anchor: line.from + defMatch[0].length },
                scrollIntoView: true,
              });
              return true;
            }
          }
        }
        return false;
      }

      const lineEl = target.closest('.cm-md-footnote-def-line');
      if (lineEl) {
        const text = lineEl.textContent ?? '';
        const defMatch = text.match(defLineRegex);
        if (defMatch) {
          const id = defMatch[1];
          const doc = view.state.doc;
          for (let i = 1; i <= doc.lines; i++) {
            const l = doc.line(i);
            if (defLineRegex.test(l.text)) continue;
            const refRegex = new RegExp(`\\[\\^${escapeRegex(id)}\\]`);
            const refMatch = l.text.match(refRegex);
            if (refMatch) {
              const p = l.from + (refMatch.index ?? 0);
              view.dispatch({
                selection: { anchor: p, head: p + refMatch[0].length },
                scrollIntoView: true,
              });
              return true;
            }
          }
        }
        return false;
      }

      return false;
    },
  });
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
