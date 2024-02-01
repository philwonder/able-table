import { AbleColumn, AbleColumnGroup, AbleOptions } from "../types";
import React from "react";

type AbleTableHeadProps<T extends object> = {
  columns: (AbleColumn<T> | AbleColumnGroup<T>)[];
  sortBy: AbleColumn<T> | undefined;
  order: "asc" | "desc";
  onUpdateSort: (sortBy: AbleColumn<T> | undefined) => void;
  options: AbleOptions<T> | undefined;
};

export function AbleTableHead<T extends object>({
  columns,
  sortBy,
  order,
  onUpdateSort,
  options,
}: AbleTableHeadProps<T>) {
  const renderHeaderCell = (c: AbleColumn<T>, i: number) => (
    <td
      style={{
        zIndex: 11,
        ...(c.sticky && { position: "sticky", left: 0, zIndex: 12 }),
        ...(typeof options?.headerStyle == "function"
          ? options.headerStyle(c, i)
          : options?.headerStyle),
        ...(typeof c.headerStyle == "function" ? c.headerStyle(c, i) : c.headerStyle),
      }}
    >
      {options?.sortable == false || c.sortable == false ? (
        c.title
      ) : (
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
          onClick={() => onUpdateSort(c)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
            style={{ margin: -3, opacity: sortBy == c && order == "asc" ? 1 : 0 }}
          >
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14l-6-6z" />
          </svg>
          {c.title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
            fill="#000000"
            style={{ margin: -3, opacity: sortBy == c && order == "desc" ? 1 : 0 }}
          >
            <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
          </svg>
        </div>
      )}
    </td>
  );

  const visibleColumns = columns.filter((c) => !c.hidden);

  return (
    <thead>
      {!!visibleColumns.some((c) => "groupTitle" in c) && (
        <tr
          key={"groupHeaderRow"}
          style={{
            ...(typeof options?.rowStyle == "function"
              ? options.rowStyle()
              : options?.rowStyle),
          }}
        >
          {visibleColumns.map((c, i) =>
            "groupTitle" in c ? (
              <td
                style={{
                  textAlign: "center",
                  ...(typeof options?.headerStyle == "function"
                    ? options.headerStyle(undefined, i)
                    : options?.headerStyle),
                  ...c.groupHeaderStyle,
                }}
                colSpan={c.columns.length}
              >
                {c.groupTitle}
              </td>
            ) : (
              <td
                key={"field" in c ? `${c.field}GH` : `${c.name}GH`}
                style={{
                  ...(typeof options?.headerStyle == "function"
                    ? options.headerStyle(c, i)
                    : options?.headerStyle),
                  ...(typeof c.headerStyle == "function"
                    ? c.headerStyle(c, i)
                    : c.headerStyle),
                }}
              ></td>
            )
          )}
        </tr>
      )}
      <tr
        key={"HeaderRow"}
        style={{
          ...(typeof options?.rowStyle == "function" ? options.rowStyle() : options?.rowStyle),
        }}
      >
        {visibleColumns.map((c, i) =>
          "groupTitle" in c
            ? c.columns.filter((co) => !co.hidden).map((c) => renderHeaderCell(c, i))
            : renderHeaderCell(c, i)
        )}
      </tr>
    </thead>
  );
}
