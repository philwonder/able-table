import React, { ReactNode, useState, useRef, useMemo, useLayoutEffect } from "react";
import { AbleAction } from "../types/AbleAction";
import {
  AbleColumn,
  AbleColumnGroup,
  KeyedColumn,
  KeyedColumnGroup,
} from "../types/AbleColumn";
import { AbleOptions } from "../types/AbleOptions";
import { getField } from "../utilities/nestedFieldHelpers";
import { AbleTableBody } from "./AbleTableBody";
import { AbleTableHead } from "./AbleTableHead";
import { AbleTablePagination } from "./AbleTablePagination";
import { AbleStyles } from "../types/AbleStyles";
import { flattenColumns } from "../utilities/flattenColumns";
import { SearchBox } from "./SearchBox";
import { isColumnGroup, isFunction } from "../utilities/isType";
import { AbleClasses } from "../types/AbleClasses";
import { AbleTableFoot } from "./AbleTableFoot";

type AbleTableProps<T extends object> = {
  data: T[];
  columns: (AbleColumn<T> | AbleColumnGroup<T>)[];
  title?: ReactNode;
  onRowClick?: (d: T) => void;
  /**
   * Custom actions that are not row specific.
   */
  tableActions?: AbleAction[];
  /**
   * Options for paging, sort and search
   * - paging?: boolean;
   * - pageSize?: number;
   * - pageSizeOptions?: number[];
   * - showFirstPageButton?: boolean;
   * - showLastPageButton?: boolean;
   * - searchable?: boolean;
   * - sortable?: boolean;
   */
  options?: AbleOptions;
  /**
   * Styles applied to the individual elements of the table.
   * - container?: CSSProperties;
   * - table?: CSSProperties;
   * - tableBody?: CSSProperties;
   * - tableHead?: CSSProperties;
   * - tableFoot?: CSSProperties;
   * - tableRow?: CSSProperties | ((d?: T, i?: number) => CSSProperties);
   * - tableHeader?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
   * - tableCell?: CSSProperties | ((c?: AbleColumn<T>, i?: number) => CSSProperties);
   */
  styles?: AbleStyles<T>;
  /**
   * Classes applied to the individual elements of the table.
   * - container?: string;
   * - table?: string;
   * - tableBody?: string;
   * - tableHead?: string;
   * - tableFoot?: string;
   * - tableRow?: string | ((d?: T, i?: number) => string);
   * - tableHeader?: string | ((c?: AbleColumn<T>, i?: number) => string);
   * - tableCell?: string | ((c?: AbleColumn<T>, i?: number) => string);
   */
  classes?: AbleClasses<T>;
};

export function AbleTable<T extends object>({
  title,
  onRowClick,
  options,
  styles,
  classes,
  ...props
}: AbleTableProps<T>) {
  const data = useMemo(() => props.data.map((d, i) => ({ ...d, key: `${i}` })), [props.data]);
  const tableActions = useMemo(
    () => props.tableActions?.map((a, i) => ({ ...a, key: `${i}` })),
    [props.tableActions]
  );
  const [columns, setColumns] = useState(() => mapKeyedColumns(props.columns));

  const pageSizeOptions = useRef(
    options?.pageSizeOptions ??
      [10, 25, 50, 100]
        .filter((n) => n != options?.pageSize)
        .concat(options?.pageSize ? [options.pageSize] : [])
        .sort((a, b) => a - b)
  ).current;
  const [paging, setPaging] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options?.pageSize || pageSizeOptions[0]);

  const [sort, setSort] = useState<{ col?: KeyedColumn<T>; desc: boolean }>({ desc: false });
  const [sortedData, setSortedData] = useState<(T & { key: string })[]>(data);

  const columnRef = useRef<Record<string, number>>({});
  useLayoutEffect(() => {
    setColumns(mapWidthColumns(columns, columnRef.current));
    setPaging(!!options?.paging);
  }, []);

  const handleSearch = (filter: string) => {
    const filtered = filterData(data, columns, filter);
    const sorted = sort.col ? sortData(filtered, sort) : filtered;
    setSortedData(sorted);
  };

  const handleSort = (col?: KeyedColumn<T>) => {
    setCurrentPage(0);
    const newSort = sort.col != col ? { col, desc: true } : { ...sort, desc: !sort.desc };
    setSortedData([...sortData(sortedData, newSort)]);
    setSort(newSort);
  };

  const visibleData = paging ? getPage(sortedData, currentPage, rowsPerPage) : sortedData;

  return (
    <div className={`AbleTable-Container ${classes?.container}`} style={styles?.container}>
      {title}
      {options?.searchable != false && (
        <SearchBox
          onChange={handleSearch}
          styles={styles?.searchBox}
          classes={classes?.searchBox}
        />
      )}
      {!!tableActions?.length &&
        tableActions?.map((a, i) => (
          <button key={a.key} onClick={a.onClick} disabled={a.disabled}>
            {a.render}
          </button>
        ))}
      <table className={`AbleTable-Table ${classes?.table}`} style={styles?.table}>
        <AbleTableHead
          ref={(r) => (columnRef.current[r?.id ?? "null"] = r?.clientWidth ?? 0)}
          columns={columns}
          sort={sort}
          options={options}
          styles={styles}
          classes={classes}
          onUpdateSort={handleSort}
        />
        <AbleTableBody
          data={visibleData}
          columns={columns}
          styles={styles}
          classes={classes}
          onRowClick={onRowClick}
        />
        <AbleTableFoot data={sortedData} columns={columns} styles={styles} classes={classes} />
      </table>
      {paging && (
        <AbleTablePagination
          pageSize={rowsPerPage}
          pageSizeOptions={options?.pageSizeOptions ?? pageSizeOptions}
          currentPage={currentPage}
          lastPage={Math.ceil(sortedData.length / rowsPerPage)}
          updateCurrentPage={setCurrentPage}
          updatePageSize={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(0);
          }}
          styles={styles?.pagination}
          classes={classes?.pagination}
        />
      )}
    </div>
  );
}

function filterData<T extends object>(
  data: (T & { key: string })[],
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[],
  filter: string
) {
  const flatColumns = flattenColumns(columns);
  return data.filter((d) =>
    flatColumns.some(
      (c) => c.searchable != false && (c.search?.(d, filter) || standardSearch(d, c, filter))
    )
  );
}

function standardSearch<T extends object>(
  datum: T & { key: string },
  column: KeyedColumn<T>,
  filter: string
) {
  const cellData =
    "field" in column
      ? getField(datum, column.field)
      : isFunction(column.render)
      ? column.render(datum)
      : column.render;
  return cellData?.toString().toLowerCase().includes(filter.toLowerCase());
}

function sortData<T extends object>(
  data: (T & { key: string })[],
  sort: { col?: KeyedColumn<T>; desc: boolean }
) {
  return sort.desc
    ? data.sort((a, b) => sort.col?.sort?.(a, b) ?? standardSort(sort.col)(a, b))
    : data.sort((a, b) => sort.col?.sort?.(b, a) ?? standardSort(sort.col)(b, a));
}

function standardSort<T extends object>(sortBy: KeyedColumn<T> | undefined) {
  return (a: T & { key: string }, b: T & { key: string }) => {
    if (sortBy == undefined || !("field" in sortBy)) {
      return 0;
    }
    const sortByA = getField(a, sortBy.field);
    const sortByB = getField(b, sortBy.field);
    switch (typeof sortByA) {
      case "boolean":
        return (sortByA ? 0 : 1) - (sortByB ? 0 : 1);
      case "number":
        return (sortByB ? +sortByB : 0) - (sortByA ?? 0);
      case "string":
        return sortByA.localeCompare(`${sortByB}`);
      default:
        return 0;
    }
  };
}

function getPage<T extends object>(data: T[], page: number, rowsPerPage: number) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

function mapKeyedColumns<T extends object>(
  columns: (AbleColumn<T> | AbleColumnGroup<T>)[]
): (KeyedColumn<T> | KeyedColumnGroup<T>)[] {
  return columns.map((c, i) =>
    isColumnGroup(c)
      ? {
          ...c,
          key: `${i}`,
          columns: c.columns.map((c2, j) => ({ ...c2, key: `${i}${j}` })),
        }
      : { ...c, key: `${i}` }
  );
}

function mapWidthColumns<T extends object>(
  columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[],
  widths: Record<string, number>
): (KeyedColumn<T> | KeyedColumnGroup<T>)[] {
  const totalWidth = Object.values(widths).reduce((a, b) => a + b);
  return columns.map((c) => {
    if (isColumnGroup(c)) {
      const columns = c.columns.map((c2) => {
        const width = `${Math.round((widths[c2.key] / totalWidth) * 100)}%`;
        return { ...c2, width };
      });
      return { ...c, columns };
    }
    const width = `${Math.round((widths[c.key] / totalWidth) * 100)}%`;
    return { ...c, width };
  });
}
