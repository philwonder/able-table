import React, { ForwardedRef, forwardRef, ForwardRefExoticComponent, JSX } from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { AbleStyles } from "../types/AbleStyles";
import { isColumnGroup, isFunction } from "../utilities/isType";
import { AbleClasses } from "../types/AbleClasses";

type AbleTableHeadProps<T extends object> = {
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[];
  sort: { col?: KeyedColumn<T>; desc: boolean };
  onUpdateSort: (sortBy: KeyedColumn<T> | undefined) => void;
  options: AbleOptions | undefined;
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
};

export const AbleTableHead = forwardRef(function AbleTableHeadComponent<T extends object>(
  { columns, sort, onUpdateSort, options, styles, classes }: AbleTableHeadProps<T>,
  ref: ForwardedRef<HTMLTableCellElement>
) {
  function renderHeaderCell(c: KeyedColumn<T>, i: number) {
    const sortable =
      !(options?.sortable == false) && !(c.sortable == false) && ("field" in c || c.sort);
    return (
      <th
        ref={ref}
        id={c.key}
        key={`H${c.key}`}
        className={`AbleTable-Header ${
          isFunction(classes?.tableHeader) ? classes.tableHeader(c, i) : classes?.tableHeader
        }`}
        style={{
          zIndex: 11,
          ...(c.sticky && { position: "sticky", left: 0, zIndex: 12 }),
          ...(isFunction(styles?.tableHeader)
            ? styles.tableHeader(c, i)
            : styles?.tableHeader),
          ...(isFunction(c.headerStyle) ? c.headerStyle(c, i) : c.headerStyle),
          width: c.width,
        }}
      >
        {sortable ? (
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
              style={{ margin: -3, opacity: sort.col == c && !sort.desc ? 1 : 0 }}
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
              style={{ margin: -3, opacity: sort.col == c && sort.desc ? 1 : 0 }}
            >
              <path d="M24 24H0V0h24v24z" fill="none" opacity=".87" />
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z" />
            </svg>
          </div>
        ) : (
          c.title
        )}
      </th>
    );
  }

  const visibleColumns = columns.filter((c) => !c.hidden);

  return (
    <thead style={styles?.tableHead} className={`AbleTable-Head ${classes?.tableHead}`}>
      {!!visibleColumns.some(isColumnGroup) && (
        // TODO: need to reconsider styling for the groupHeaderRow
        <tr key={"groupHeaderRow"}>
          {visibleColumns.map((c, i) =>
            isColumnGroup(c) ? (
              <th
                key={`${c.key}`}
                className={`AbleTable-Header ${
                  isFunction(classes?.tableHeader)
                    ? classes?.tableHeader(undefined, i)
                    : classes?.tableHeader
                }`}
                style={{
                  textAlign: "center",
                  ...(isFunction(styles?.tableHeader)
                    ? styles?.tableHeader(undefined, i)
                    : styles?.tableHeader),
                  ...c.groupHeaderStyle,
                }}
                colSpan={c.columns.length}
              >
                {c.groupHeader}
              </th>
            ) : (
              <th
                key={`GH${c.key}`}
                className={`AbleTable-Header ${
                  isFunction(classes?.tableHeader)
                    ? classes?.tableHeader(c, i)
                    : classes?.tableHeader
                }`}
                style={{
                  ...(isFunction(styles?.tableHeader)
                    ? styles?.tableHeader(c, i)
                    : styles?.tableHeader),
                  ...(isFunction(c.headerStyle) ? c.headerStyle(c, i) : c.headerStyle),
                }}
              ></th>
            )
          )}
        </tr>
      )}
      <tr key={"HeaderRow"}>
        {visibleColumns.map((c, i) =>
          isColumnGroup(c)
            ? c.columns.filter((co) => !co.hidden).map((c) => renderHeaderCell(c, i))
            : renderHeaderCell(c, i)
        )}
      </tr>
    </thead>
  );
}) as (<T extends object>(
  props: AbleTableHeadProps<T> & { ref?: ForwardedRef<HTMLTableCellElement> }
) => JSX.Element) &
  ForwardRefExoticComponent<AbleTableHeadProps<object>>;
