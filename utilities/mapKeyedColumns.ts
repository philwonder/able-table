import {
  AbleColumn,
  AbleColumnGroup,
  KeyedColumn,
  KeyedColumnGroup,
} from "../types/AbleColumn";
import { isColumnGroup } from "./isType";
import { sum } from "./sum";

export function mapKeyedColumns<T extends object>(
  columns: (AbleColumn<T> | AbleColumnGroup<T>)[],
  isTableSortable: boolean,
  parentKey?: string,
  parentHidden?: boolean
): (KeyedColumn<T> | KeyedColumnGroup<T>)[] {
  return columns.map((c, i) => {
    const key = !!parentKey ? `${parentKey}${i}` : `${i}`;
    const hidden = parentHidden || c.hidden;
    if (!isColumnGroup(c)) {
      const sortable =
        isTableSortable && !(c.sortable === false) && !!c.header && ("field" in c || !!c.sort);
      return { ...c, sortable, hidden, key, level: 0, span: hidden ? 0 : 1 };
    }
    const mappedColumns = mapKeyedColumns(c.columns, isTableSortable, key, hidden);
    const level = Math.max(...mappedColumns.map((c) => c.level)) + 1;
    const span = hidden ? 0 : sum(mappedColumns.map((c) => c.span));
    return { ...c, key, level, span, columns: mappedColumns };
  });
}
