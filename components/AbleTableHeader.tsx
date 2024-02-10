import { memo } from "react";
import { KeyedColumn } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { getField } from "../utilities/nestedFieldHelpers";
import { AbleStyles } from "../types/AbleStyles";
import React from "react";

type AbleTableHeaderProps<T extends object> = {
  data: T & { key: string | number };
  column: KeyedColumn<T>;
  index: number;
  styles: AbleStyles<T> | undefined;
};

export function AbleTableHeaderComponent<T extends object>({
  data,
  column,
  index,
  styles,
}: AbleTableHeaderProps<T>) {
  return (
    <td
      onClick={(e) => {
        if (!column.onClick) return;
        e.stopPropagation();
        column.onClick(data);
      }}
      style={{
        textWrap: "nowrap",
        ...(column.onClick && { cursor: "pointer" }),
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(typeof styles?.tableCell == "function"
          ? styles?.tableCell(column, index)
          : styles?.tableCell),
        ...(typeof column.cellStyle == "function"
          ? column.cellStyle(column, index)
          : column.cellStyle),
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

export const AbleTableHeader = memo(
  AbleTableHeaderComponent
) as typeof AbleTableHeaderComponent;
