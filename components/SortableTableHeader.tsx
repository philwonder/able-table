import React from "react";
import { KeyedColumn } from "../types/AbleColumn";
type SortableTableHeaderProps<T extends object> = {
  column: KeyedColumn<T>;
  sort: { col?: KeyedColumn<T>; desc: boolean };
  onUpdateSort: (sortBy: KeyedColumn<T> | undefined) => void;
};

export function SortableTableHeader<T extends object>({
  column,
  sort,
  onUpdateSort,
}: SortableTableHeaderProps<T>) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: "fit-content",
        maxWidth: "fit-content",
        alignItems: "center",
        cursor: "pointer",
        margin: "6 0 6 0",
      }}
      onClick={() => onUpdateSort(column)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#000000"
        style={{ margin: -3, opacity: sort.col == column && !sort.desc ? 1 : 0 }}
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" />
      </svg>
      {column.header}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#000000"
        style={{ margin: -3, opacity: sort.col == column && sort.desc ? 1 : 0 }}
      >
        <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
      </svg>
    </div>
  );
}
