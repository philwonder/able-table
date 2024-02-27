import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { isColumnGroup } from "./isType";

/**
 * Flatten groups and filter out hidden groups and columns
 */
export function flattenVisibleColumns<T extends object>(
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[]
): KeyedColumn<T>[] {
  return columns
    .filter((c) => !c.hidden) //filter out hidden columns and groups
    .map((cg) =>
      isColumnGroup(cg)
        ? cg.columns
            .filter((c) => !c.hidden)
            .map((c) => ({
              ...c,
              groupHeaderStyle: cg.headerStyle,
              groupCellStyle: cg.cellStyle,
            }))
        : cg
    ) //filter out hidden columns within visible groups
    .flat();
}

/**
 * Flatten groups
 */
export function flattenColumns<T extends object>(
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[]
): KeyedColumn<T>[] {
  return columns
    .map((cg) =>
      isColumnGroup(cg)
        ? cg.columns
            .filter((c) => !c.hidden)
            .map((c) => ({
              ...c,
              groupHeaderStyle: cg.headerStyle,
              groupCellStyle: cg.cellStyle,
            }))
        : cg
    ) //filter out hidden columns within visible groups
    .flat();
}
