import { AbleColumn, AbleColumnGroup } from "../types/AbleColumn";

export function isColumnGroup<T extends object>(
  c: AbleColumn<T> | AbleColumnGroup<T>
): c is AbleColumnGroup<T> {
  return (c as AbleColumnGroup<T>)?.groupTitle != undefined;
}
