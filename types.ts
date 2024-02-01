import { ReactNode, CSSProperties } from "react";

export type AbleColumn<T extends object> = {
  title?: ReactNode;
  cellStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  cellTip?: (d: T) => string;
  headerStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  headerTip?: string;
  width?: string | number;
  search?: (d: T, filter: any) => boolean;
  sort?: (d1: T, d2: T) => number;
  onClick?: (d: T) => void;
  sortable?: boolean;
  searchable?: boolean;
  hidden?: boolean;
  sticky?: boolean;
} & (
  | {
      name: string;
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

export type AbleAction = {
  render: ReactNode;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
};

export type AbleOptions<T extends object> = {
  containerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  rowStyle?: CSSProperties | ((d?: T, i?: number) => CSSProperties);
  headerStyle?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
  cellStyle?: CSSProperties | ((c?: AbleColumn<T>, colIndex?: number) => CSSProperties);
  paging?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showFirstPageButton?: boolean;
  showLastPageButton?: boolean;
  searchable?: boolean;
  sortable?: boolean;
};

export type NestedKeyOf<T extends object> = {
  [Key in keyof T & (string | number)]: T[Key] extends Array<any>
    ? `${Key}`
    : T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
    : `${Key}`;
}[keyof T & string];
