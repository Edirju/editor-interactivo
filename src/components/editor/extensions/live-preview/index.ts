import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
} from '@codemirror/view';
import { StateField, RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { processFormatting } from './formatting';
import { processHeadings } from './headings';
import { processLists } from './lists';
import { processQuotes } from './quotes';
import { processCode, processCodeBlock } from './code';
import { processCallouts, resetCalloutLines } from './callouts';
import { processMath } from './math';
import { processFootnotes } from './footnotes';
import { processHorizontalRule } from './horizontal-rule';
import type { DecorationItem } from './utils';

export const livePreviewEngine = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },

  update(decorations, tr) {
    if (!tr.docChanged && !tr.selection) return decorations.map(tr.changes);

    const builder = new RangeSetBuilder<Decoration>();
    const state = tr.state;
    const cursorLineNum = state.doc.lineAt(state.selection.main.head).number;
    const decoList: DecorationItem[] = [];

    resetCalloutLines();

    syntaxTree(state).iterate({
      enter: (node) => {
        processFormatting(node, decoList);
        processHeadings(node, state, decoList);
        processLists(node, state, decoList, cursorLineNum);
        processCallouts(node, state, decoList, cursorLineNum);
        processQuotes(node, state, decoList, cursorLineNum);
        processCode(node, state, decoList, cursorLineNum);
        processCodeBlock(node, state, decoList, cursorLineNum);
        processMath(node, state, decoList, cursorLineNum);
        processHorizontalRule(node, state, decoList, cursorLineNum);
      },
    });

    processFootnotes(state, decoList, cursorLineNum);

    decoList.sort((a, b) => a.from - b.from || (a.isLine ? -1 : 1));

    for (const item of decoList) {
      try {
        builder.add(item.from, item.to, item.deco);
      } catch {
        // Silently skip overlapping decorations
      }
    }
    return builder.finish();
  },

  provide: (f) => EditorView.decorations.from(f),
});

export const livePreviewProxy = ViewPlugin.fromClass(
  class {
    update(update: ViewUpdate) {
      if (update.selectionSet && !update.docChanged) {
        update.view.requestMeasure();
      }
    }
  },
);
