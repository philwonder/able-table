import { CSSProperties, memo } from "react";
import { AbleColumn, KeyedColumn } from "../types/AbleColumn";
import { getField } from "../utilities/nestedFieldHelpers";
import { isFunction } from "../utilities/isType";
import React from "react";

type AbleTableCellProps<T extends object> = {
  data: T & { key: string | number };
  column: KeyedColumn<T>;
  index: number;
  styles: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties) | undefined;
  classes: string | ((c?: AbleColumn<T>, i?: number) => string) | undefined;
};

export function AbleTableCellComponent<T extends object>({
  data,
  column,
  index,
  styles,
  classes,
}: AbleTableCellProps<T>) {
  return (
    <td
      onClick={(e) => {
        if (!column.onClick) return;
        e.stopPropagation();
        column.onClick(data);
      }}
      className={`AbleTable-Cell ${isFunction(classes) ? classes(column, index) : classes}`}
      style={{
        textWrap: "nowrap",
        ...(column.onClick && { cursor: "pointer" }),
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(isFunction(styles) ? styles(column, index) : styles),
        ...column.groupCellStyle,
        ...(isFunction(column.cellStyle) ? column.cellStyle(column, index) : column.cellStyle),
      }}
    >
      {isFunction(column.render)
        ? column.render(data)
        : !!column.render
        ? column.render
        : "field" in column
        ? getField(data, column.field)?.toString()
        : ""}
    </td>
  );
}

export const AbleTableCell = memo(AbleTableCellComponent) as typeof AbleTableCellComponent;
