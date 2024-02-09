import { ReactNode, CSSProperties } from "react";
import { NestedKeyOf } from "./UtitlityTypes";

export type AbleColumn<T extends object> = {
  title?: ReactNode;
  /**
   * Styles applied to the \<td> elements.
   * Overrides thes styles tableCell prop.
   */
  cellStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  // cellTip?: (d: T) => string; //not implemented yet
  /**
   * Styles applied to the \<th> elements.
   * Overrides thes styles tableHeader prop.
   */
  headerStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  // headerTip?: string; //not implemented yet
  width?: string | number;
  /** A custom search function.
   *
   * If omitted, the search is against the field data or render value.
   */
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
  /** Whether this column will be compared against the search string.
   * @default true unless options.searchable is false
   */
  searchable?: boolean;
  /**
   * @default false
   */
  hidden?: boolean;
  /**
   * @default false
   */
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
