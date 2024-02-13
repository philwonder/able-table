import React, { ForwardedRef, forwardRef, ForwardRefExoticComponent, JSX } from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { AbleStyles } from "../types/AbleStyles";
import { isColumnGroup, isFunction } from "../utilities/isType";
import { AbleClasses } from "../types/AbleClasses";
import { SortableTableHeader } from "./SortableTableHeader";

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
      !(options?.sortable == false) &&
      !(c.sortable == false) &&
      !!c.header &&
      ("field" in c || c.sort);
    return (
      <th
        ref={ref}
        id={c.key}
        key={`H${c.key}`}
        className={`AbleTable-Header ${
          isFunction(classes?.tableHeader) ? classes?.tableHeader(c, i) : classes?.tableHeader
        }`}
        style={{
          zIndex: 11,
          ...(c.sticky && { position: "sticky", left: 0, zIndex: 12 }),
          ...(isFunction(styles?.tableHeader)
            ? styles?.tableHeader(c, i)
            : styles?.tableHeader),
          ...(isFunction(c.headerStyle) ? c.headerStyle(c, i) : c.headerStyle),
          width: c.width,
          minWidth: c.minWidth,
        }}
      >
        {sortable ? (
          <SortableTableHeader column={c} sort={sort} onUpdateSort={onUpdateSort} />
        ) : (
          c.header
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
