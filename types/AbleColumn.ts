import { ReactNode, CSSProperties } from "react";
import { NestedKeyOf } from "./UtitlityTypes";

export type AbleColumn<T extends object> = {
  title?: ReactNode;
  /**
   * Styles applied to the column's \<td> elements.
   * Overrides thes styles tableCell prop.
   */
  cellStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  // cellTip?: (d: T) => string; //not implemented yet
  /**
   * Styles applied to the column's \<th> elements.
   * Overrides thes styles tableHeader prop.
   */
  headerStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  // headerTip?: string; //not implemented yet
  width?: string | number;
  /** A custom search function.
   * - If omitted, the search is against the field data or render value.
   */
  search?: (d: T, filter: any) => boolean;
  /** A custom sort function.
   * -  Must be provided for columns without a field property to be sortable.
   */
  sort?: (d1: T, d2: T) => number;
  onClick?: (d: T) => void;
  /** Whether the data can be sorted by this column.
   * @default true unless options.sortable is false
   */
  sortable?: boolean;
  /** Whether this column is compared against the search string.
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
      /**
       * A ReactNode or a function that returns one, which populates the cell.
       * - If omitted, the field value is used.
       * - Required if the column has no associated field.
       */
      render: ReactNode | ((d: T) => ReactNode);
    }
  | {
      /**
       * The data field associated with this column.
       * - The value of this field is used to populate the cell if no render is provided.
       */
      field: NestedKeyOf<T>;
      /**
       * A ReactNode or a function that returns one, which populates the cell.
       * - If omitted, the field value is used.
       * - Required if the column has no associated field.
       */
      render?: ReactNode | ((d: T) => ReactNode);
    }
);

export type AbleColumnGroup<T extends object> = {
  /**
   * The header for the column group
   */
  groupHeader: ReactNode;
  /**
   * Styles applied to the groupHeader cell
   * Overrides thes styles tableHeader prop.
   */
  groupHeaderStyle?: CSSProperties;
  // groupHeaderTip?: string; //not implemented yet.
  /**
   * @default false
   */
  hidden?: boolean;
  /** The columns in this group */
  columns: AbleColumn<T>[];
};

export type KeyedColumn<T extends object> = AbleColumn<T> & { key: string };
export type KeyedColumnGroup<T extends object> = Omit<AbleColumnGroup<T>, "columns"> & {
  key: string;
  columns: KeyedColumn<T>[];
};
