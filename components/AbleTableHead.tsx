import React from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { AbleStyles } from "../types/AbleStyles";
import { isColumnGroup, isFunction } from "../utilities/isType";
import { AbleClasses } from "../types/AbleClasses";
import { SortableTableHeader } from "./SortableTableHeader";
import { AbleRowGroup } from "../types/AbleRowGroup";
import { getRowHeaderColSpan } from "../utilities/getRowHeaderColSpan";

type AbleTableHeadProps<T extends object> = {
  rows: (KeyedColumn<T> | KeyedColumnGroup<T>)[][];
  rowGroups: AbleRowGroup<T>[];
  sort: { col?: KeyedColumn<T>; desc: boolean };
  onUpdateSort: (sortBy: KeyedColumn<T> | undefined) => void;
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
};

export function AbleTableHead<T extends object>({
  rows,
  rowGroups,
  sort,
  onUpdateSort,
  styles,
  classes,
}: AbleTableHeadProps<T>) {
  return (
    <thead style={styles?.tableHead} className={`AbleTable-Head ${classes?.tableHead}`}>
      {rows.map((r, i) => (
        <tr key={`hr${i}`}>
          {!!(rowGroups.length > 1) && (
            <th
              className={`AbleTable-Header ${
                isFunction(classes?.tableHeader)
                  ? classes?.tableHeader(undefined)
                  : classes?.tableHeader
              }`}
              style={{
                textAlign: "center",
                ...(isFunction(styles?.tableHeader)
                  ? styles?.tableHeader(undefined)
                  : styles?.tableHeader),
              }}
              colSpan={getRowHeaderColSpan(rowGroups)}
            ></th>
          )}
          {r
            .filter((c) => !c.hidden)
            .map((c) =>
              isColumnGroup(c) ? (
                <th
                  key={`${c.key}`}
                  scope="colgroup"
                  colSpan={c.span}
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
                    ...c.headerStyle,
                  }}
                >
                  {c.header}
                </th>
              ) : (
                <th
                  scope="col"
                  id={c.key}
                  key={`H${c.key}`}
                  className={`AbleTable-Header ${
                    isFunction(classes?.tableHeader)
                      ? classes?.tableHeader(c, i)
                      : classes?.tableHeader
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
                  {c.sortable ? (
                    <SortableTableHeader column={c} sort={sort} onUpdateSort={onUpdateSort} />
                  ) : (
                    c.header
                  )}
                </th>
              )
            )}
        </tr>
      ))}
    </thead>
  );
}
