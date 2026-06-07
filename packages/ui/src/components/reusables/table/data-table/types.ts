import type { DateFilterPreset } from "../../date-filter/config";
import type {
  AsyncSelectItemMappers,
  AsyncSelectProps,
  TOption,
  TServiceFetcherFn,
} from "../../async-select";

export type TTablePaginationData = {
  total?: number;
  previousPage?: number | null;
  nextPage?: number | null;
};

export type TTablePagination = {
  page: number;
  take: number;
  setUpdatePage: (page: number) => void;
  setUpdateTake: (take: number) => void;
};

export type TableFilterConfig = {
  dateFilter: boolean;
  defaultDatePreset?: DateFilterPreset;
};

export type CustomFilterSelectOption = {
  label: string;
  value: string;
};

export type CustomFilterSelectConfig = {
  label: string;
  type: "select";
  dbKey: string;
  options: CustomFilterSelectOption[];
  defaultValue?: string;
  placeholder?: string;
};

export type CustomFilterAsyncControlProps = Pick<
  AsyncSelectProps,
  | "deselectable"
  | "searchable"
  | "withSearch"
  | "debounceMs"
  | "disabled"
  | "minQueryLength"
  | "searchPlaceholder"
  | "emptyMessage"
  | "classNames"
  | "popover"
> & {
  selectMode?: AsyncSelectProps["type"];
};

export type CustomFilterAsyncConfig<Item = any> = {
  label: string;
  type: "async";
  dbKey: string;
  defaultValue?: string;
  placeholder?: string;
  fetcherTake?: number;
} & CustomFilterAsyncControlProps &
  AsyncSelectItemMappers<Item> &
  (
    | { fetcher: TServiceFetcherFn<Item>; options?: never }
    | { options: TOption[] | CustomFilterSelectOption[]; fetcher?: never }
  );

export type CustomFilterDefinition =
  | CustomFilterSelectConfig
  | CustomFilterAsyncConfig;

export type TableCustomFilterSelectRuntime = CustomFilterSelectConfig & {
  value: string;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
};

export type TableCustomFilterAsyncRuntime = CustomFilterAsyncConfig & {
  value: string;
  setValue: (value: string) => void;
  onChange: (value: string) => void;
};

export type TableCustomFilterRuntime =
  | TableCustomFilterSelectRuntime
  | TableCustomFilterAsyncRuntime;

export type TFilterProps = {
  take?: number;
  page?: number;
  setPage?: (page: number) => void;
  setTake?: (take: number) => void;
  searchQuery?: string;
  setSearchQuery?: (searchQuery: string) => void;
  debouncedSearchQuery?: string;
  startDate?: string | null;
  endDate?: string | null;
  setStartDate?: (date: string | null) => void;
  setEndDate?: (date: string | null) => void;
  config?: TableFilterConfig;
  /** Runtime select filters with value / onChange — from `useTableFilter` */
  customFilters?: TableCustomFilterRuntime[];
};

/** Normalized list API query params from {@link TFilterProps} (no `null` values). */
export type TTableQueryParams = {
  page?: number;
  take?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | number | undefined;
};
