import { useCallback, useMemo } from "react";
import {
  type DateFilterPreset,
  getDefaultDateRange,
} from "../../../date-filter/config";
import { useCustomStates } from "../../../hooks/useCustomState";
import useDebounce from "../../../hooks/useDebounce";
import {
  type CustomFilterDefinition,
  TFilterProps,
  TTableQueryParams,
} from "../types";
import { buildTableQueryParams } from "./build-query-params";
import {
  buildCustomFiltersInitialState,
  buildCustomFiltersQuerySnapshot,
  buildCustomFiltersRuntime,
} from "./custom-filter-state";

type BaseFilterState = {
  page: number;
  take: number;
  searchQuery: string;
  startDate: string;
  endDate: string;
};

export type UseTableFilterOptions<
  TCustom extends Record<string, unknown> = Record<string, never>,
> = {
  dateFilter?: boolean;
  defaultDatePreset?: DateFilterPreset;
  initial?: Partial<BaseFilterState>;
  /** Declarative filters (e.g. select) — state keyed by `dbKey`, sent as `dbKey` in `queryParams` */
  customFilters?: CustomFilterDefinition[];
  /** @deprecated Prefer `customFilters` */
  custom?: TCustom;
  queryKeys?: (keyof TCustom & string)[];
};

export type UseTableFilterReturn<
  TCustom extends Record<string, unknown> = Record<string, never>,
> = {
  tableFilter: TFilterProps;
  queryParams: TTableQueryParams & {
    [K in keyof TCustom]?: TCustom[K];
  };
} & {
  [K in keyof TCustom]: TCustom[K];
} & {
  [K in keyof TCustom as `set${Capitalize<string & K>}`]: (
    value: TCustom[K],
  ) => void;
};

function capitalize(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

const useTableFilter = <
  TCustom extends Record<string, unknown> = Record<string, never>,
>(
  options?: UseTableFilterOptions<TCustom>,
): UseTableFilterReturn<TCustom> => {
  const dateFilter = options?.dateFilter ?? false;
  const defaultDatePreset = options?.defaultDatePreset ?? "THIS_MONTH";
  const customFilterDefs = options?.customFilters ?? [];
  const defaultRange = dateFilter
    ? getDefaultDateRange(defaultDatePreset)
    : { startDate: "", endDate: "" };
  const customInitial = (options?.custom ?? {}) as TCustom;

  const {
    page,
    take,
    searchQuery,
    startDate,
    endDate,
    setPage,
    setTake,
    setSearchQuery,
    setStartDate,
    setEndDate,
  } = useCustomStates<BaseFilterState>({
    page: options?.initial?.page ?? 0,
    take: options?.initial?.take ?? 10,
    searchQuery: options?.initial?.searchQuery ?? "",
    startDate: options?.initial?.startDate ?? defaultRange.startDate,
    endDate: options?.initial?.endDate ?? defaultRange.endDate,
  });

  const customFiltersInitial = buildCustomFiltersInitialState(customFilterDefs);
  const customFiltersState = useCustomStates(customFiltersInitial);
  const customState = useCustomStates(customInitial);

  const resetPage = useCallback(() => setPage(0), [setPage]);

  const { debouncedQuery: debouncedSearchQuery } = useDebounce(
    searchQuery,
    300,
  );

  const customFiltersRuntime = useMemo(
    () =>
      buildCustomFiltersRuntime(
        customFilterDefs,
        customFiltersState,
        resetPage,
      ),
    [customFilterDefs, customFiltersState, resetPage],
  );

  const tableFilter: TFilterProps = useMemo(
    () => ({
      page,
      take,
      searchQuery,
      debouncedSearchQuery,
      startDate: dateFilter ? startDate : undefined,
      endDate: dateFilter ? endDate : undefined,
      setPage,
      setTake,
      setSearchQuery,
      setStartDate: (date) => setStartDate(date ?? ""),
      setEndDate: (date) => setEndDate(date ?? ""),
      config: {
        dateFilter,
        defaultDatePreset,
      },
      customFilters: customFiltersRuntime,
    }),
    [
      page,
      take,
      searchQuery,
      debouncedSearchQuery,
      startDate,
      endDate,
      dateFilter,
      defaultDatePreset,
      setPage,
      setTake,
      setSearchQuery,
      setStartDate,
      setEndDate,
      customFiltersRuntime,
    ],
  );

  const legacyCustomSnapshot = useMemo(() => {
    if (Object.keys(customInitial).length === 0) return {} as TCustom;
    return Object.fromEntries(
      (Object.keys(customInitial) as (keyof TCustom & string)[]).map((key) => [
        key,
        customState[key as keyof typeof customState],
      ]),
    ) as TCustom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ...Object.keys(customInitial).map(
      (key) => customState[key as keyof typeof customState],
    ),
  ]);

  const customFiltersQuerySnapshot = useMemo(
    () => buildCustomFiltersQuerySnapshot(customFilterDefs, customFiltersState),
    [customFilterDefs, customFiltersState],
  );

  const queryParams = useMemo(
    () =>
      buildTableQueryParams(tableFilter, {
        dateFilter,
        custom: {
          ...(legacyCustomSnapshot as Record<string, unknown>),
          ...customFiltersQuerySnapshot,
        },
        queryKeys: options?.queryKeys as string[] | undefined,
      }) as UseTableFilterReturn<TCustom>["queryParams"],
    [
      tableFilter,
      dateFilter,
      legacyCustomSnapshot,
      customFiltersQuerySnapshot,
      options?.queryKeys,
    ],
  );

  const customFields = useMemo(() => {
    if (Object.keys(customInitial).length === 0) return {};
    const picked: Record<string, unknown> = {};
    for (const key of Object.keys(customInitial) as (keyof TCustom &
      string)[]) {
      picked[key] = customState[key as keyof typeof customState];
      picked[`set${capitalize(key)}`] =
        customState[`set${capitalize(key)}` as keyof typeof customState];
    }
    return picked;
  }, [customInitial, customState]);

  return {
    tableFilter,
    queryParams,
    ...customFields,
  } as unknown as UseTableFilterReturn<TCustom>;
};

export default useTableFilter;
