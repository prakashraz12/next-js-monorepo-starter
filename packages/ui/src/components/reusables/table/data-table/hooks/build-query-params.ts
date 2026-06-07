import { TFilterProps, TTableQueryParams } from "../types";

export function toQueryString(value?: string | null): string | undefined {
  if (value == null || value === "") return undefined;
  return typeof value === "string" ? value : String(value);
}

function omitEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Partial<T>;
}

export function buildTableQueryParams(
  filter: Pick<
    TFilterProps,
    "page" | "take" | "debouncedSearchQuery" | "startDate" | "endDate"
  >,
  options?: {
    dateFilter?: boolean;
    custom?: Record<string, unknown>;
    queryKeys?: string[];
  },
): TTableQueryParams & Record<string, unknown> {
  const dateFilter = options?.dateFilter ?? false;

  const base: TTableQueryParams & Record<string, unknown> = {
    page: filter.page,
    take: filter.take,
  };

  const search = filter.debouncedSearchQuery?.trim();
  if (search) {
    base.search = search;
  }

  if (dateFilter) {
    const startDate = toQueryString(filter.startDate);
    const endDate = toQueryString(filter.endDate);
    if (startDate) base.startDate = startDate;
    if (endDate) base.endDate = endDate;
  }

  const customValues = options?.custom ?? {};
  const keys = options?.queryKeys ?? Object.keys(customValues);

  for (const key of keys) {
    const value = customValues[key];
    if (value == null || value === "") continue;
    if (typeof value === "string" || typeof value === "number") {
      base[key] = value;
    }
  }

  return omitEmpty(base) as TTableQueryParams & Record<string, unknown>;
}
