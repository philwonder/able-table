import { CSSProperties, memo } from "react";
import { AbleColumn, KeyedColumn } from "../types/AbleColumn";
import { getField } from "../utilities/nestedFieldHelpers";
import { isFunction } from "../utilities/isType";
import React from "react";

type AbleTableHeaderProps<T extends object> = {
  data: T & { key: string | number };
  column: KeyedColumn<T>;
  index: number;
  styles: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties) | undefined;
  classes: string | ((c?: AbleColumn<T>, i?: number) => string) | undefined;
};

export function AbleTableHeaderComponent<T extends object>({
  data,
  column,
  index,
  styles,
  classes,
}: AbleTableHeaderProps<T>) {
  return (
    <th
      onClick={(e) => {
        if (!column.onClick) return;
        e.stopPropagation();
        column.onClick(data);
      }}
      className={`AbleTable-Cell ${isFunction(classes) ? classes(column, index) : classes}`}
      style={{
        textWrap: "nowrap",
        zIndex: 10,
        ...(column.onClick && { cursor: "pointer" }),
        ...(column.sticky && { position: "sticky", left: 0, zIndex: 11 }),
        ...(isFunction(styles) ? styles(column, index) : styles),
        ...(isFunction(column.headerStyle)
          ? column.headerStyle(column, index)
          : column.headerStyle),
      }}
    >
      {isFunction(column.render)
        ? column.render(data)
        : !!column.render
        ? column.render
        : "field" in column
        ? getField(data, column.field)?.toString()
        : ""}
    </th>
  );
}

export const AbleTableHeader = memo(
  AbleTableHeaderComponent
) as typeof AbleTableHeaderComponent;
