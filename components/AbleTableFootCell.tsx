import { CSSProperties, memo } from "react";
import { AbleColumn, KeyedColumn } from "../types/AbleColumn";
import { isFunction } from "../utilities/isType";
import React from "react";

type AbleTableFootCellProps<T extends object> = {
  data: (T & { key: string })[];
  column: KeyedColumn<T>;
  index: number;
  styles: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties) | undefined;
  classes: string | ((c?: AbleColumn<T>, i?: number) => string) | undefined;
};

export function AbleTableFootCellComponent<T extends object>({
  data,
  column,
  index,
  styles,
  classes,
}: AbleTableFootCellProps<T>) {
  return (
    <td
      className={`AbleTable-FootCell ${
        isFunction(classes) ? classes(column, index) : classes
      }`}
      style={{
        textWrap: "nowrap",
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(isFunction(styles) ? styles(column, index) : styles),
        ...(isFunction(column.cellStyle) ? column.cellStyle(column, index) : column.cellStyle),
      }}
    >
      {isFunction(column.footerRender)
        ? column.footerRender(data)
        : !!column.footerRender
        ? column.footerRender
        : ""}
    </td>
  );
}

export const AbleTableFootCell = memo(
  AbleTableFootCellComponent
) as typeof AbleTableFootCellComponent;
