import React from "react";
import { AbleColumn, AbleColumnGroup } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { AbleStyles } from "../types/AbleStyles";

type AbleTableHeadProps<T extends object> = {
  columns: (AbleColumn<T> | AbleColumnGroup<T>)[];
  sortBy: AbleColumn<T> | undefined;
  order: "asc" | "desc";
  onUpdateSort: (sortBy: AbleColumn<T> | undefined) => void;
  options: AbleOptions | undefined;
  styles: AbleStyles<T> | undefined;
};

export function AbleTableHead<T extends object>({
  columns,
  sortBy,
  order,
  onUpdateSort,
  options,
  styles,
}: AbleTableHeadProps<T>) {
  const renderHeaderCell = (c: AbleColumn<T>, i: number) => (
    <th
      key={"field" in c ? `H${c.field}` : `H${c.render}`}
      style={{
        zIndex: 11,
        ...(c.sticky && { position: "sticky", left: 0, zIndex: 12 }),
        ...(typeof styles?.tableHeader == "function"
          ? styles.tableHeader(c, i)
          : styles?.tableHeader),
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
    </th>
  );

  const visibleColumns = columns.filter((c) => !c.hidden);

  return (
    <thead>
      {!!visibleColumns.some((c) => "groupTitle" in c) && (
        <tr key={"groupHeaderRow"}>
          {visibleColumns.map((c, i) =>
            "groupTitle" in c ? (
              <th
                key={`${c.groupTitle}`}
                style={{
                  textAlign: "center",
                  ...(typeof styles?.tableHeader == "function"
                    ? styles?.tableHeader(undefined, i)
                    : styles?.tableHeader),
                  ...c.groupHeaderStyle,
                }}
                colSpan={c.columns.length}
              >
                {c.groupTitle}
              </th>
            ) : (
              <th
                key={"field" in c ? `${c.field}GH` : `${c.render}GH`}
                style={{
                  ...(typeof styles?.tableHeader == "function"
                    ? styles?.tableHeader(c, i)
                    : styles?.tableHeader),
                  ...(typeof c.headerStyle == "function"
                    ? c.headerStyle(c, i)
                    : c.headerStyle),
                }}
              ></th>
            )
          )}
        </tr>
      )}
      <tr key={"HeaderRow"}>
        {visibleColumns.map((c, i) =>
          "groupTitle" in c
            ? c.columns.filter((co) => !co.hidden).map((c) => renderHeaderCell(c, i))
            : renderHeaderCell(c, i)
        )}
      </tr>
    </thead>
  );
}
