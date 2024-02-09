import { memo } from "react";
import { KeyedColumn } from "../types/AbleColumn";
import { getField } from "../utilities/nestedFieldHelpers";
import { AbleStyles } from "../types/AbleStyles";
import React from "react";
import { AbleClasses } from "../types/AbleClasses";
import { isFunction } from "../utilities/isType";

type AbleTableCellProps<T extends object> = {
  data: T & { key: string | number };
  column: KeyedColumn<T>;
  index: number;
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
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
      className={`AbleTable-Cell ${
        isFunction(classes?.tableCell) ? classes.tableCell(column, index) : classes?.tableCell
      }`}
      style={{
        textWrap: "nowrap",
        ...(column.onClick && { cursor: "pointer" }),
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(isFunction(styles?.tableCell)
          ? styles?.tableCell(column, index)
          : styles?.tableCell),
        ...(isFunction(column.cellStyle) ? column.cellStyle(column, index) : column.cellStyle),
      }}
    >
      {isFunction(column.render)
        ? column.render(data)
        : column.render
        ? column.render
        : "field" in column
        ? getField(data, column.field)?.toString()
        : ""}
    </td>
  );
}

export const AbleTableCell = memo(AbleTableCellComponent) as typeof AbleTableCellComponent;
