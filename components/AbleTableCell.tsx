import { memo } from "react";
import { AbleTableColumn, AbleTableOptions } from "../types";
import { getField } from "../utilities";
import React from "react";

type AbleTableCellProps<T extends object & { key: string }> = {
  data: T;
  column: AbleTableColumn<T>;
  index: number;
  options?: AbleTableOptions<T> | undefined;
};

export function AbleTableCellComponent<T extends object & { key: string }>({
  data,
  column,
  index,
  options,
}: AbleTableCellProps<T>) {
  return (
    <td
      key={`${data.key}${"field" in column ? column.field : column.name}`}
      onClick={(e) => {
        if (!column.onClick) return;
        e.stopPropagation();
        column.onClick(data);
      }}
      style={{
        ...(column.onClick && { cursor: "pointer" }),
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(typeof options?.cellStyle == "function"
          ? options.cellStyle(column, index)
          : options?.cellStyle),
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
