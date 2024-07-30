import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { isColumnGroup } from "./isType";

export function mapHeaderRows<T extends object>(
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[]
) {
  const maxLevel = Math.max(...columns.map((c) => c.level));
  const rows: (KeyedColumn<T> | KeyedColumnGroup<T>)[][] = [];
  let remainingColumns = [...columns];
  for (let i = maxLevel; i >= 0; i--) {
    const row: (KeyedColumn<T> | KeyedColumnGroup<T>)[] = remainingColumns.map((c) =>
      c.level === i ? c : { ...c, header: "", level: i, key: `placeHolder${i}${c.key}` }
    );
    rows.push(row);
    remainingColumns = remainingColumns
      .map((c) => (c.level === i && isColumnGroup(c) ? c.columns : c))
      .flat();
  }
  return rows;
}
