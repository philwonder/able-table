import { AbleTablePaginationProps } from "../components/AbleTablePagination";
import { SearchBoxProps } from "../components/SearchBox";

export type AbleOverrides = {
  pagination?: React.FC<AbleTablePaginationProps>;
  search?: React.FC<SearchBoxProps>;
};
