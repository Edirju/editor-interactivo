import type { MarkdownConfig, InlineContext, BlockContext, Line, Element } from '@lezer/markdown';

// Extensión para Resaltado ==texto==
export const HighlightExtension: MarkdownConfig = {
  defineNodes: ['Highlight', 'HighlightMark'],
  parseInline: [
    {
      name: 'Highlight',
      parse(cx: InlineContext, next: number, pos: number) {
        // Buscamos el doble '='
        if (next != 61 /* '=' */ || cx.char(pos + 1) != 61) return -1;

        // Buscamos el cierre '=='
        let end = -1;
        for (let i = pos + 2; i < cx.end; i++) {
          if (cx.char(i) == 61 && cx.char(i + 1) == 61) {
            end = i + 2;
            break;
          }
        }
        if (end == -1) return -1;

        return cx.addElement(
          cx.elt('Highlight', pos, end, [
            cx.elt('HighlightMark', pos, pos + 2),
            cx.elt('HighlightMark', end - 2, end),
          ]),
        );
      },
    },
  ],
};

// Extensión para Fórmulas $texto$
export const MathExtension: MarkdownConfig = {
  defineNodes: ['InlineMath', 'InlineMathMark'],
  parseInline: [
    {
      name: 'InlineMath',
      parse(cx: InlineContext, next: number, pos: number) {
        if (next != 36 /* '$' */) return -1;
        // No procesar si es $$ (bloque) — el bloque se maneja en DisplayMathExtension
        if (cx.char(pos + 1) == 36) return -1;

        let end = -1;
        for (let i = pos + 1; i < cx.end; i++) {
          if (cx.char(i) == 36) {
            // Encontramos el cierre '$'
            end = i + 1;
            break;
          }
        }
        if (end == -1) return -1;

        return cx.addElement(
          cx.elt('InlineMath', pos, end, [
            cx.elt('InlineMathMark', pos, pos + 1),
            cx.elt('InlineMathMark', end - 1, end),
          ]),
        );
      },
    },
  ],
};

// Extensión para Bloques Matemáticos $$...$$ (multilínea)
export const DisplayMathExtension: MarkdownConfig = {
  defineNodes: ['DisplayMath', 'DisplayMathMark'],
  parseBlock: [
    {
      name: 'DisplayMath',
      parse(cx: BlockContext, line: Line) {
        if (line.next !== 36 /* '$' */) return false;
        if (line.text.charCodeAt(line.pos + 1) !== 36) return false;

        const openFrom = cx.lineStart + line.pos;
        const openTo = openFrom + 2;
        const children: Element[] = [cx.elt('DisplayMathMark', openFrom, openTo)];

        let found = false;

        for (; cx.nextLine();) {
          const lineText = line.text;
          const linePos = line.pos;

          if (
            lineText.charCodeAt(linePos) === 36 &&
            lineText.charCodeAt(linePos + 1) === 36
          ) {
            const closeFrom = cx.lineStart + linePos;
            const closeTo = closeFrom + 2;
            children.push(cx.elt('DisplayMathMark', closeFrom, closeTo));
            cx.nextLine();
            found = true;
            break;
          }
        }

        const end = found ? cx.prevLineEnd() : cx.parsedPos;
        cx.addElement(cx.elt('DisplayMath', openFrom, end, children));
        return true;
      },
      endLeaf(_cx: BlockContext, line: Line, _leaf: import('@lezer/markdown').LeafBlock) {
        return line.next === 36 && line.text.charCodeAt(line.pos + 1) === 36;
      },
    },
  ],
};


