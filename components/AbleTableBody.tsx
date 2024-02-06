import React from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { AbleStyles } from "../types/AbleStyles";
import { AbleTableCell } from "./AbleTableCell";
import { flattenColumns } from "../utilities/flattenColumns";

type AbleTableBodyProps<T extends object> = {
  data: (T & { key: string | number })[];
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[];
  onRowClick: ((d: T) => void) | undefined;
  options: AbleOptions | undefined;
  styles: AbleStyles<T> | undefined;
};

export function AbleTableBody<T extends object>({
  data,
  columns,
  onRowClick,
  options,
  styles,
}: AbleTableBodyProps<T>) {
  const flatColumns = flattenColumns(columns);
  return (
    <tbody>
      {!!data.length ? (
        data.map((d, i) => (
          <tr
            key={d.key}
            onClick={(e) => {
              if (!onRowClick) return;
              e.stopPropagation();
              onRowClick(d);
            }}
            style={{
              height: 35,
              ...(onRowClick && { cursor: "pointer" }),
              ...(typeof styles?.tableRow == "function"
                ? styles?.tableRow(d, i)
                : styles?.tableRow),
            }}
          >
            {flatColumns.map((c, j) => (
              <AbleTableCell
                key={`${d.key}${c.key}`}
                options={options}
                styles={styles}
                data={d}
                column={c}
                index={j}
              />
            ))}
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
