import { ReactNode, useState, useEffect, useRef } from "react";
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
import React from "react";

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
};

export function AbleTable<T extends object>({
  data,
  columns,
  title,
  onRowClick,
  tableActions,
  options,
  styles,
}: AbleTableProps<T>) {
  let keyedData = useRef<(T & { key: string })[]>([]).current;
  useEffect(() => {
    keyedData = data.map((d, i) => ({ ...d, key: `${i}` }));
  }, [data]);

  let keyedColumns = useRef<(KeyedColumn<T> | KeyedColumnGroup<T>)[]>([]).current;
  useEffect(() => {
    keyedColumns = mapKeyedColumns(columns);
  }, [columns]);

  const defaultPageSizeOptions = useRef(
    [10, 25, 50, 100]
      .filter((n) => n != options?.pageSize)
      .concat(options?.pageSize ? [options.pageSize] : [])
      .sort((a, b) => a - b)
  ).current;

  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<KeyedColumn<T>>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<(T & { key: string })[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    options?.pageSize || options?.pageSizeOptions?.[0] || 10
  );
  useEffect(() => {
    const filtered = filterData(keyedData, flatColumns, filter);
    const sorted = sortBy ? sortData(filtered, order, sortBy) : filtered;
    setSortedData(sorted);
  }, [filter, keyedData, keyedColumns]);

  useEffect(() => {
    sortBy
      ? setSortedData([...sortData(sortedData, order, sortBy)])
      : setSortedData(filterData(keyedData, flatColumns, filter));
  }, [sortBy, order]);

  const handleSort = (c?: KeyedColumn<T>) => {
    setCurrentPage(0);
    if (sortBy != c) {
      setSortBy(c);
      setOrder("desc");
    } else order == "desc" ? setOrder("asc") : setSortBy(undefined);
  };

  const visibleData = options?.paging
    ? sliceData(sortedData, currentPage, rowsPerPage)
    : sortedData;

  const flatColumns = flattenColumns(keyedColumns);

  return (
    <div style={{ zIndex: 1, ...styles?.container }}>
      {(!!title || options?.searchable != false || !!tableActions?.length) && (
        <div style={{ justifyContent: "space-between" }}>
          <h6>{title}</h6>
          <div style={{ display: "flex" }}>
            {/* {options?.searchable != false && (
              <SearchBox value={filter} updateValue={setFilter} />
            )} */}
            {tableActions?.map((a, i) => (
              <button onClick={a.onClick} disabled={a.disabled}>
                {a.render}
              </button>
            ))}
          </div>
        </div>
      )}
      <table style={styles?.table}>
        <AbleTableHead
          columns={keyedColumns}
          sortBy={sortBy}
          order={order}
          options={options}
          styles={styles}
          onUpdateSort={handleSort}
        />
        <AbleTableBody
          data={visibleData}
          columns={flatColumns}
          onRowClick={onRowClick}
          options={options}
          styles={styles}
        />
      </table>
      <AbleTablePagination
        rowsPerPage={rowsPerPage}
        pageSizeOptions={options?.pageSizeOptions ?? defaultPageSizeOptions}
        currentPage={currentPage}
        isLastPage={sortedData.length < rowsPerPage}
        updateCurrentPage={setCurrentPage}
        updateRowsPerPage={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(0);
        }}
      />
    </div>
  );
}

function filterData<T extends object>(
  data: (T & { key: string })[],
  columns: KeyedColumn<T>[],
  filter: string
) {
  return data.filter((d) =>
    columns.some(
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
      : typeof column.render == "function"
      ? column.render(datum)
      : column.render;
  return cellData?.toString().toLowerCase().includes(filter.toLowerCase());
}

function sortData<T extends object>(
  data: (T & { key: string })[],
  order: "asc" | "desc",
  sortBy: KeyedColumn<T>
) {
  return order == "desc"
    ? data.sort((a, b) => sortBy.sort?.(a, b) ?? standardSort(sortBy)(a, b))
    : data.sort((a, b) => sortBy.sort?.(b, a) ?? standardSort(sortBy)(b, a));
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
        return (sortByB ?? 0) - (sortByA ?? 0);
      case "string":
        return sortByA.localeCompare(sortByB);
      default:
        return 0;
    }
  };
}

function sliceData<T extends object>(data: T[], page: number, rowsPerPage: number) {
  return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

function flattenColumns<T extends object>(columns: (KeyedColumn<T> | KeyedColumnGroup<T>)[]) {
  return columns
    .filter((c) => !c.hidden) //filter out hidden columns and groups
    .map((c) => ("groupTitle" in c ? c.columns.filter((c) => !c.hidden) : c)) //filter out hidden columns within visible groups
    .flat();
}

function mapKeyedColumns<T extends object>(columns: (AbleColumn<T> | AbleColumnGroup<T>)[]) {
  return columns.map((c, i) =>
    "groupTitle" in c
      ? {
          ...c,
          key: `${i}`,
          columns: c.columns.map((c2, j) => ({ ...c2, key: `${i}${j}` })),
        }
      : { ...c, key: `${i}` }
  );
}
