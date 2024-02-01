import { AbleColumn, AbleOptions } from "../types";
import { AbleTableCell } from "./AbleTableCell";
import React from "react";

type AbleTableBodyProps<T extends object & { key: string }> = {
  data: T[];
  columns: AbleColumn<T>[];
  onRowClick: ((d: T) => void) | undefined;
  options: AbleOptions<T> | undefined;
};

export function AbleTableBody<T extends object & { key: string }>({
  data,
  columns,
  onRowClick,
  options,
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
              ...(typeof options?.rowStyle == "function"
                ? options.rowStyle(d, i)
                : options?.rowStyle),
            }}
          >
            {columns.map((c, j) => (
              <AbleTableCell
                key={`${d.key}${"field" in c ? c.field : c.name}`}
                options={options}
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
                key={`empty${"field" in c ? c.field : c.name}`}
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
