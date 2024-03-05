import React from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { flattenVisibleColumns } from "../utilities/flattenColumns";
import { AbleTableFootCell } from "./AbleTableFootCell";
import { AbleClasses } from "../types/AbleClasses";
import { AbleStyles } from "../types/AbleStyles";
import { AbleRowGroup } from "../types/AbleRowGroup";
import { isFunction } from "../utilities/isType";
import { getRowGroupDepth } from "../utilities/getRowGroupDepth";

type AbleTableFootProps<T extends object> = {
  data: (T & { key: string })[];
  columns: (KeyedColumnGroup<T> | KeyedColumn<T>)[];
  rowGroups: AbleRowGroup<T>[];
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
};

export function AbleTableFoot<T extends object>({
  data,
  columns,
  rowGroups,
  styles,
  classes,
}: AbleTableFootProps<T>) {
  const flatColumns = flattenVisibleColumns(columns);
  return (
    <tfoot style={styles?.tableFoot} className={`AbleTable-Foot ${classes?.tableFoot}`}>
      <tr key="FooterRow">
        {!!(rowGroups.length > 1) && (
          <th
            className={`AbleTable-FootCell ${
              isFunction(classes?.tableCell)
                ? classes?.tableCell(undefined)
                : classes?.tableCell
            }`}
            style={{
              textAlign: "center",
              ...(isFunction(styles?.tableCell)
                ? styles?.tableCell(undefined)
                : styles?.tableCell),
            }}
            colSpan={getRowGroupDepth(rowGroups)}
          ></th>
        )}
        {flatColumns.map((c, i) => (
          <AbleTableFootCell
            key={`Footer${c.key}`}
            data={data}
            column={c}
            index={i}
            styles={styles?.tableCell}
            classes={classes?.tableCell}
          />
        ))}
      </tr>
    </tfoot>
  );
}
