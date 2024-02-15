import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { isColumnGroup } from "./isType";

export function flattenColumns<T extends object>(
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
