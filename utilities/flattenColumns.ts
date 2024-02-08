import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { isColumnGroup } from "./isType";

export function flattenColumns<T extends object>(
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[]
) {
  return columns
    .filter((c) => !c.hidden) //filter out hidden columns and groups
    .map((c) => (isColumnGroup(c) ? c.columns.filter((c) => !c.hidden) : c)) //filter out hidden columns within visible groups
    .flat();
}
