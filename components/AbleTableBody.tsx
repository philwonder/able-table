import React from "react";
import { AbleColumn } from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { AbleStyles } from "../types/AbleStyles";
import { AbleTableCell } from "./AbleTableCell";

type AbleTableBodyProps<T extends object> = {
  data: (T & { key: string | number })[];
  columns: AbleColumn<T>[];
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
            {columns.map((c, j) => (
              <AbleTableCell
                key={`${d.key}${"field" in c ? c.field : c.render}`}
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
            {columns.map((c) => (
              <td
                key={`empty${"field" in c ? c.field : c.render}`}
                style={{ ...c.cellStyle, opacity: 0 }}
              ></td>
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
