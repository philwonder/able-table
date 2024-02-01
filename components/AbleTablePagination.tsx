import React from "react";

type AbleTablePaginationProps = {
  rowsPerPage: number;
  pageSizeOptions: number[];
  currentPage: number;
  isLastPage: boolean;
  updateCurrentPage: (page: number) => void;
  updateRowsPerPage: (size: number) => void;
};

export function AbleTablePagination({
  rowsPerPage: pageSize,
  pageSizeOptions,
  currentPage,
  isLastPage,
  updateCurrentPage,
  updateRowsPerPage: updatePageSize,
}: AbleTablePaginationProps) {
  return (
    <div style={{ display: "flex" }}>
      <label htmlFor="page-size">Page size:</label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(e) => updatePageSize(+e.target.value)}
      >
        {pageSizeOptions.map((o) => (
          <option value={o}>{o}</option>
        ))}
      </select>
      <button disabled={!currentPage} onClick={() => updateCurrentPage(currentPage - 1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
        </svg>
      </button>
      <button disabled={isLastPage} onClick={() => updateCurrentPage(currentPage + 1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
        </svg>
      </button>
    </div>
  );
}
