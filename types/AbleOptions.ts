export type AbleOptions = {
  /** Whether paging is enabled.
   * @default
   * if (!!pageSize || !!pageSizeOptions) true
   * else false
   * */
  paging?: boolean;
  /**
   * Initial page size in rows.
   * Defaults to pageSizeOptions[0]
   */
  pageSize?: number;
  /**
   * Page size options in rows.
   * Defaults to [10, 25, 50, 100]
   */
  pageSizeOptions?: number[];
  showFirstPageButton?: boolean;
  showLastPageButton?: boolean;
  /** Whether search is enabled. @default true */
  searchable?: boolean;
  /** Whether sort is enabled. @default true */
  sortable?: boolean;
};
