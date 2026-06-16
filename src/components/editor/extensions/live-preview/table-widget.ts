import { WidgetType } from '@codemirror/view';

export interface CellPos {
  from: number;
  to: number;
}

export interface RowData {
  cells: CellPos[];
  isHeader: boolean;
}

export interface TableData {
  from: number;
  to: number;
  rows: RowData[];
  colCount: number;
}

export class TableWidget extends WidgetType {
  constructor(private data: TableData) {
    super();
  }

  override ignoreEvent() {
    return true;
  }

  override eq(other: TableWidget) {
    return (
      other.data.from === this.data.from &&
      other.data.to === this.data.to &&
      other.data.colCount === this.data.colCount &&
      other.data.rows.length === this.data.rows.length
    );
  }

  toDOM(view: import('@codemirror/view').EditorView) {
    const { rows, colCount } = this.data;
    const table = document.createElement('table');
    table.className = 'cm-md-table-widget';

    const headerRows: RowData[] = [];
    const bodyRows: RowData[] = [];

    for (const row of rows) {
      if (row.isHeader) {
        headerRows.push(row);
      } else {
        bodyRows.push(row);
      }
    }

    if (headerRows.length > 0) {
      const thead = table.createTHead();
      for (const row of headerRows) {
        const tr = thead.insertRow();
        for (let i = 0; i < colCount; i++) {
          const cell = row.cells[i];
          const th = document.createElement('th');
          if (cell) {
            th.textContent = view.state.sliceDoc(cell.from, cell.to);
            th.setAttribute('data-from', String(cell.from));
            th.setAttribute('data-to', String(cell.to));
          } else {
            th.textContent = '';
          }
          tr.appendChild(th);
        }
      }
    }

    const tbody = table.createTBody();
    for (const row of bodyRows) {
      const tr = tbody.insertRow();
      for (let i = 0; i < colCount; i++) {
        const cell = row.cells[i];
        const td = tr.insertCell();
        if (cell) {
          td.textContent = view.state.sliceDoc(cell.from, cell.to);
          td.setAttribute('data-from', String(cell.from));
          td.setAttribute('data-to', String(cell.to));
        } else {
          td.textContent = '';
        }
        tr.appendChild(td);
      }
    }

    table.addEventListener('mousedown', (e) => {
      const target = (e.target as HTMLElement).closest('th,td');
      if (!target || !(target instanceof HTMLElement)) return;

      const from = parseInt(target.getAttribute('data-from') || '');
      if (!isNaN(from) && view) {
        e.preventDefault();
        view.dispatch({
          selection: { anchor: from },
          scrollIntoView: true,
        });
        view.focus();
      }
    });

    return table;
  }
}
