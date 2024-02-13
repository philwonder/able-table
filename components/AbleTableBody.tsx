import React from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { AbleStyles } from "../types/AbleStyles";
import { AbleTableCell } from "./AbleTableCell";
import { flattenColumns } from "../utilities/flattenColumns";
import { AbleClasses } from "../types/AbleClasses";
import { isFunction } from "../utilities/isType";
import { AbleTableHeader } from "./AbleTableHeader";

type AbleTableBodyProps<T extends object> = {
  data: (T & { key: string | number })[];
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[];
  onRowClick: ((d: T) => void) | undefined;
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
};

export function AbleTableBody<T extends object>({
  data,
  columns,
  onRowClick,
  styles,
  classes,
}: AbleTableBodyProps<T>) {
  const flatColumns = flattenColumns(columns);
  return (
    <tbody style={styles?.tableBody} className={`AbleTable-Body ${classes?.tableBody}`}>
      {!!data.length ? (
        data.map((d, i) => (
          <tr
            key={d.key}
            onClick={(e) => {
              if (!onRowClick) return;
              e.stopPropagation();
              onRowClick(d);
            }}
            className={`AbleTable-Row ${
              isFunction(classes?.tableRow) ? classes?.tableRow(d, i) : classes?.tableRow
            }`}
            style={{
              ...(onRowClick && { cursor: "pointer" }),
              ...(isFunction(styles?.tableRow) ? styles?.tableRow(d, i) : styles?.tableRow),
            }}
          >
            {flatColumns.map((c, j) =>
              c.isHeader ? (
                <AbleTableHeader
                  key={`${d.key}${c.key}`}
                  styles={styles?.tableHeader}
                  classes={classes?.tableHeader}
                  data={d}
                  column={c}
                  index={j}
                />
              ) : (
                <AbleTableCell
                  key={`${d.key}${c.key}`}
                  styles={styles?.tableCell}
                  classes={classes?.tableCell}
                  data={d}
                  column={c}
                  index={j}
                />
              )
            )}
          </tr>
        ))
      ) : (
        <>
          <tr>
            {flatColumns.map((c) => (
              <td key={`empty${c.key}`} style={{ ...c.cellStyle, opacity: 0 }}></td>
            ))}
          </tr>
          <tr>
            <td colSpan={columns.length} align="center" style={{ border: "none" }}>
              No records to display
            </td>
          </tr>
        </>
      )}
      <tr style={{ height: "100%" }}></tr>
    </tbody>
  );
}
