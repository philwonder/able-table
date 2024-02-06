import { ReactNode, CSSProperties } from "react";
import { NestedKeyOf } from "./UtitlityTypes";

export type AbleColumn<T extends object> = {
  title?: ReactNode;
  cellStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  cellTip?: (d: T) => string;
  headerStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  headerTip?: string;
  width?: string | number;
  search?: (d: T, filter: any) => boolean;
  /** A custom sort function.
   *
   * Must be provided for columns without a field property to be sortable.
   */
  sort?: (d1: T, d2: T) => number;
  onClick?: (d: T) => void;
  /** Whether the data can be sorted by this column.
   * @default true unless options.sortable is false
   */
  sortable?: boolean;
  searchable?: boolean;
  hidden?: boolean;
  sticky?: boolean;
} & (
  | {
      render: ReactNode | ((d: T) => ReactNode);
    }
  | {
      field: NestedKeyOf<T>;
      render?: ReactNode | ((d: T) => ReactNode);
    }
);

export type AbleColumnGroup<T extends object> = {
  groupTitle: ReactNode;
  groupHeaderStyle?: CSSProperties;
  groupHeaderTip?: string;
  hidden?: boolean;
  columns: AbleColumn<T>[];
};

export type KeyedColumn<T extends object> = AbleColumn<T> & { key: string };
export type KeyedColumnGroup<T extends object> = Omit<AbleColumnGroup<T>, "columns"> & {
  key: string;
  columns: KeyedColumn<T>[];
};
