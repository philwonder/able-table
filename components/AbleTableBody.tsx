import React, { ReactNode } from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { AbleStyles } from "../types/AbleStyles";
import { AbleTableCell } from "./AbleTableCell";
import { AbleClasses } from "../types/AbleClasses";
import { isFunction } from "../utilities/isType";
import { AbleTableHeader } from "./AbleTableHeader";
import { AbleRowGroup } from "../types/AbleRowGroup";

type AbleTableBodyProps<T extends object> = {
  groups: AbleRowGroup<T>[];
  columns: KeyedColumn<T>[];
  onRowClick: ((d: T) => void) | undefined;
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
};

export function AbleTableBody<T extends object>({
  groups,
  columns,
  onRowClick,
  styles,
  classes,
}: AbleTableBodyProps<T>) {
  function mapToTable(groups: AbleRowGroup<T>[]): ReactNode[] {
    if (!groups.length || (!groups[0].colspan && !groups[0].rows?.length)) {
      return [
        <>
          <tr>
            {columns.map((c) => (
              <td key={`empty${c.key}`} style={{ ...c.cellStyle, opacity: 0 }}></td>
            ))}
          </tr>
          <tr>
            <td colSpan={columns.length} align="center" style={{ border: "none" }}>
              No records to display
            </td>
          </tr>
        </>,
      ];
    }
    const nodes: ReactNode[] = [];
    groups.forEach((g) => {
      !!g.colspan &&
        nodes.push(
          <tr key={`${g.header}`}>
            <th colSpan={g.colspan} rowSpan={g.rowspan}>
              {g.header}
            </th>
          </tr>
        );
      if (g.subGroups) nodes.push(...mapToTable(g.subGroups));
      else if (g.rows)
        nodes.push(
          g.rows.map((d, i) => (
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
              {columns.map((c, j) =>
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
        );
    });
    return nodes;
  }

  return (
    <tbody style={styles?.tableBody} className={`AbleTable-Body ${classes?.tableBody}`}>
      {mapToTable(groups)}
      <tr style={{ height: "100%" }}></tr>
    </tbody>
  );
}
