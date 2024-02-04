import { memo } from "react";
import { AbleColumn } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { getField } from "../utilities/nestedFieldHelpers";
import { AbleStyles } from "../types/AbleStyles";
import React from "react";

type AbleTableCellProps<T extends object> = {
  data: T & { key: string | number };
  column: AbleColumn<T>;
  index: number;
  options?: AbleOptions | undefined;
  styles: AbleStyles<T> | undefined;
};

export function AbleTableCellComponent<T extends object>({
  data,
  column,
  index,
  options,
  styles,
}: AbleTableCellProps<T>) {
  return (
    <td
      onClick={(e) => {
        if (!column.onClick) return;
        e.stopPropagation();
        column.onClick(data);
      }}
      style={{
        ...(column.onClick && { cursor: "pointer" }),
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(typeof styles?.tableCell == "function"
          ? styles?.tableCell(column, index)
          : styles?.tableCell),
        ...(typeof column.cellStyle == "function"
          ? column.cellStyle(column, index)
          : column.cellStyle),
        ...(column.width && { width: column.width }),
      }}
    >
      {typeof column.render == "function"
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
