import React, { ReactNode, useEffect, useState } from "react";
import { AbleAction, AbleColumn, AbleColumnGroup, AbleOptions, NestedKeyOf } from "../types";
import { AbleTableBody } from "./AbleTableBody";
import { AbleTableHead } from "./AbleTableHead";
import { getField, hasKey } from "../utilities";
import { SearchBox } from "./SearchBox";
import { AbleTablePagination } from "./AbleTablePagination";

const filterData = <T extends object>(
  data: (T & { key: string | number })[],
  columns: AbleColumn<T>[],
  filter: string
) =>
  data.filter((d) =>
    columns.some(
      (c) => c.searchable != false && (c.search?.(d, filter) || standardSearch(d, c, filter))
    )
  );

const standardSearch = <T extends object>(datum: T, column: AbleColumn<T>, filter: string) => {
  const cellData =
    "field" in column
      ? getField(datum, column.field)
      : typeof column.render == "function"
      ? column.render(datum)
      : column.render;
  return cellData?.toString().toLowerCase().includes(filter.toLowerCase());
};

const sortData = <T extends object>(
  data: (T & { key: string | number })[],
  order: "asc" | "desc",
  sortBy: AbleColumn<T>
) =>
  order == "desc"
    ? data.sort((a, b) => sortBy.sort?.(a, b) ?? standardSort(sortBy)(a, b))
    : data.sort((a, b) => sortBy.sort?.(b, a) ?? standardSort(sortBy)(b, a));

const standardSort =
  <T extends object>(sortBy: AbleColumn<T> | undefined) =>
  (a: T, b: T) => {
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

const sliceData = <T extends object>(data: T[], page: number, rowsPerPage: number) =>
  data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const flattenColumns = <T extends object>(columns: (AbleColumn<T> | AbleColumnGroup<T>)[]) =>
  columns
    .filter((c) => !c.hidden) //filter out hidden columns and groups
    .map((c) => ("groupTitle" in c ? c.columns.filter((c) => !c.hidden) : c)) //filter out hidden columns within visible groups
    .flat();

type AbleTableProps<T extends object> = {
  data: T[];
  columns: (AbleColumn<T> | AbleColumnGroup<T>)[];
  title?: ReactNode;
  onRowClick?: (d: T) => void;
  tableActions?: AbleAction[];
  options?: AbleOptions<T>;
} & (T extends { key: string | number } ? {} : { rowKey: NestedKeyOf<T> });

export function AbleTable<T extends object>({
  data,
  columns,
  rowKey,
  title,
  onRowClick,
  tableActions,
  options,
}: AbleTableProps<T>) {
  const [keyedData, setKeyedData] = useState<(T & { key: string | number })[]>([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState<AbleColumn<T>>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [sortedData, setSortedData] = useState<(T & { key: string | number })[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(
    options?.pageSize || options?.pageSizeOptions?.[0] || 10
  );
  const defaultPageSizeOptions = [10, 25, 50, 100]
    .filter((n) => n != options?.pageSize)
    .concat(options?.pageSize ? [options.pageSize] : [])
    .sort((a, b) => a - b);

  const visibleData = options?.paging
    ? sliceData(sortedData, currentPage, rowsPerPage)
    : sortedData;
  const flatColumns = flattenColumns(columns);

  useEffect(() => {
    setKeyedData(
      data.map((d) => ({ ...d, key: hasKey(d) ? d.key : `${getField(d, rowKey)}` }))
    );
  }, [data]);

  useEffect(() => {
    const filtered = filterData(keyedData, flatColumns, filter);
    const sorted = sortBy ? sortData(filtered, order, sortBy) : filtered;
    setSortedData(sorted);
  }, [filter, keyedData, columns]);

  useEffect(() => {
    sortBy
      ? setSortedData([...sortData(sortedData, order, sortBy)])
      : setSortedData(filterData(keyedData, flatColumns, filter));
  }, [sortBy, order]);

  const handleSort = (c?: AbleColumn<T>) => {
    setCurrentPage(0); // since sort has changed, the page we were on means nothing!
    if (sortBy != c) {
      setSortBy(c);
      setOrder("desc");
    } else order == "desc" ? setOrder("asc") : setSortBy(undefined);
  };

  return (
    <div style={{ zIndex: 1, ...options?.containerStyle }}>
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
      <table>
        <AbleTableHead
          columns={columns}
          sortBy={sortBy}
          order={order}
          options={options}
          onUpdateSort={handleSort}
        />
        <AbleTableBody
          data={visibleData}
          columns={flatColumns}
          onRowClick={onRowClick}
          options={options}
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
