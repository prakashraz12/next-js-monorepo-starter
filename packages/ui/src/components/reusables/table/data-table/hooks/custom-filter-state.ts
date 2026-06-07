import type {
  CustomFilterDefinition,
  CustomFilterSelectConfig,
  TableCustomFilterRuntime,
} from "../types";

function capitalize(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function getSelectFilterDefaultValue(filter: CustomFilterSelectConfig) {
  if (filter.defaultValue !== undefined) return filter.defaultValue;
  return "";
}

export function getCustomFilterDefaultValue(filter: CustomFilterDefinition) {
  if (filter.defaultValue !== undefined) return filter.defaultValue;
  return "";
}

export function buildCustomFiltersInitialState(
  definitions: CustomFilterDefinition[] = [],
): Record<string, string> {
  const initial: Record<string, string> = {};
  for (const filter of definitions) {
    if (filter.type === "select" || filter.type === "async") {
      initial[filter.dbKey] = getCustomFilterDefaultValue(filter);
    }
  }
  return initial;
}

export function buildCustomFiltersQuerySnapshot(
  definitions: CustomFilterDefinition[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: Record<string, any>,
): Record<string, string> {
  const snapshot: Record<string, string> = {};
  for (const filter of definitions) {
    if (filter.type !== "select" && filter.type !== "async") continue;
    const value = state[filter.dbKey];
    if (value != null && value !== "") {
      snapshot[filter.dbKey] = String(value);
    }
  }
  return snapshot;
}

export function buildCustomFiltersRuntime(
  definitions: CustomFilterDefinition[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: Record<string, any>,
  onFilterChange?: () => void,
): TableCustomFilterRuntime[] {
  return definitions
    .filter((filter) => filter.type === "select" || filter.type === "async")
    .map((filter) => {
      const setterKey = `set${capitalize(filter.dbKey)}`;
      const setValue = state[setterKey] as (value: string) => void;
      const value = (state[filter.dbKey] as string) ?? "";

      return {
        ...filter,
        value,
        setValue,
        onChange: (next: string) => {
          setValue(next);
          onFilterChange?.();
        },
      };
    });
}

export function hasCustomFiltersApplied(
  definitions: CustomFilterDefinition[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: Record<string, any>,
) {
  return definitions.some((filter) => {
    if (filter.type !== "select" && filter.type !== "async") return false;
    return state[filter.dbKey] !== getCustomFilterDefaultValue(filter);
  });
}

export function resetCustomFiltersState(
  definitions: CustomFilterDefinition[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: Record<string, any>,
) {
  for (const filter of definitions) {
    if (filter.type !== "select" && filter.type !== "async") continue;
    const setterKey = `set${capitalize(filter.dbKey)}`;
    const setValue = state[setterKey] as (value: string) => void;
    setValue(getCustomFilterDefaultValue(filter));
  }
}
