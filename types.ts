import { ReactNode, CSSProperties } from "react";

export type AbleTableColumn<T extends object> = {
  title?: ReactNode;
  cellStyle?: CSSProperties | ((c?: AbleTableColumn<T>, i?: number) => CSSProperties);
  cellTip?: (d: T) => string;
  headerStyle?: CSSProperties | ((c?: AbleTableColumn<T>, i?: number) => CSSProperties);
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

export type AbleTableColumnGroup<T extends object> = {
  groupTitle: ReactNode;
  groupHeaderStyle?: CSSProperties;
  groupHeaderTip?: string;
  hidden?: boolean;
  columns: AbleTableColumn<T>[];
};

export type AbleTableAction = {
  render: ReactNode;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
};

export type AbleTableOptions<T extends object> = {
  containerStyle?: CSSProperties;
  bodyStyle?: CSSProperties;
  rowStyle?: CSSProperties | ((d?: T, i?: number) => CSSProperties);
  headerStyle?: CSSProperties | ((c?: AbleTableColumn<T>, i?: number) => CSSProperties);
  cellStyle?: CSSProperties | ((c?: AbleTableColumn<T>, colIndex?: number) => CSSProperties);
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

export function getField<T extends object>(object: T, path: NestedKeyOf<T> | undefined) {
  const keys = path?.split(".") ?? [];
  let result: any = object;
  for (const key of keys) {
    result = result[key];
  }
  return result;
}
