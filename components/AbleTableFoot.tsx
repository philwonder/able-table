import React from "react";
import { KeyedColumn, KeyedColumnGroup } from "../types/AbleColumn";
import { flattenVisibleColumns } from "../utilities/flattenColumns";
import { AbleTableFootCell } from "./AbleTableFootCell";
import { AbleClasses } from "../types/AbleClasses";
import { AbleStyles } from "../types/AbleStyles";

type AbleTableFootProps<T extends object> = {
  data: (T & { key: string })[];
  columns: (KeyedColumnGroup<T> | KeyedColumn<T>)[];
  styles: AbleStyles<T> | undefined;
  classes: AbleClasses<T> | undefined;
};

export function AbleTableFoot<T extends object>({
  data,
  columns,
  styles,
  classes,
}: AbleTableFootProps<T>) {
  const flatColumns = flattenVisibleColumns(columns);
  return (
    <tfoot style={styles?.tableFoot} className={`AbleTable-Foot ${classes?.tableFoot}`}>
      <tr key="FooterRow">
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
