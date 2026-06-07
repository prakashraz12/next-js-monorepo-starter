"use client";

import { useCallback, useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { motion } from "motion/react";
import { X } from "lucide-react";
import {
  getDefaultThisMonthRange,
  isDateFilterApplied,
} from "../../../date-filter/config";
import type {
  TableCustomFilterAsyncRuntime,
  TableCustomFilterRuntime,
} from "../types";
import { getCustomFilterDefaultValue } from "../hooks/custom-filter-state";
import DateFilter from "./date-filter";
import AsyncSelect from "../../../async-select";

const FILTER_TRIGGER_CLASS =
  "h-10 min-w-[160px] shadow-none ring-0 rounded-sm focus:ring-0 cursor-pointer text-sm font-normal";

type TableFilterProps = {
  startDate?: string | null;
  endDate?: string | null;
  setStartDate?: (date: string | null) => void;
  setEndDate?: (date: string | null) => void;
  open: boolean;
  customFilters?: TableCustomFilterRuntime[];
};

function getAsyncSelectProps(filter: TableCustomFilterAsyncRuntime) {
  return {
    fetcher: filter.fetcher,
    options: filter.options,
    fetcherTake: filter.fetcherTake,
    getValueFromItem: filter.getValueFromItem,
    getLabelFromItem: filter.getLabelFromItem,
    getIconFromItem: filter.getIconFromItem,
    getDescriptionFromItem: filter.getDescriptionFromItem,
    getKeywordsFromItem: filter.getKeywordsFromItem,
    deselectable: filter.deselectable,
    searchable: filter.searchable,
    withSearch: filter.withSearch,
    debounceMs: filter.debounceMs,
    disabled: filter.disabled,
    minQueryLength: filter.minQueryLength,
    searchPlaceholder: filter.searchPlaceholder,
    emptyMessage: filter.emptyMessage,
    type: filter.selectMode,
    placeholder: filter.placeholder ?? filter.label,
    popover: filter.popover,
    classNames: {
      trigger: FILTER_TRIGGER_CLASS,
      ...filter.classNames,
    },
  };
}

const TableFilterContainer = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  open,
  customFilters = [],
}: TableFilterProps) => {
  const [asyncResetKeys, setAsyncResetKeys] = useState<Record<string, number>>(
    {},
  );

  const bumpAsyncReset = useCallback((dbKey: string) => {
    setAsyncResetKeys((prev) => ({
      ...prev,
      [dbKey]: (prev[dbKey] ?? 0) + 1,
    }));
  }, []);

  const clearAsyncFilter = useCallback(
    (filter: TableCustomFilterAsyncRuntime) => {
      filter.onChange("");
      bumpAsyncReset(filter.dbKey);
    },
    [bumpAsyncReset],
  );

  const showDateFilter = Boolean(setStartDate && setEndDate);
  const hasDateFilterApplied = isDateFilterApplied(startDate, endDate);

  const hasSelectFiltersApplied = customFilters.some(
    (filter) =>
      (filter.type === "select" || filter.type === "async") &&
      filter.value !== getCustomFilterDefaultValue(filter),
  );

  const hasAppliedFilter = hasDateFilterApplied || hasSelectFiltersApplied;

  const handleClearFilters = () => {
    if (showDateFilter) {
      const defaultRange = getDefaultThisMonthRange();
      setStartDate?.(defaultRange.startDate);
      setEndDate?.(defaultRange.endDate);
    }

    customFilters.forEach((filter) => {
      if (filter.type === "async") {
        clearAsyncFilter(filter);
        return;
      }
      if (filter.type === "select") {
        filter.onChange(getCustomFilterDefaultValue(filter));
      }
    });
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="overflow-hidden px-1 py-1"
    >
      <motion.div className="mb-3 flex flex-wrap items-end gap-2">
        {showDateFilter ? (
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        ) : null}

        {customFilters.map((filter) => {
          if (filter.type === "async") {
            const resetKey = asyncResetKeys[filter.dbKey];

            return (
              <motion.div key={filter.dbKey} className="flex flex-col gap-1">
                <AsyncSelect
                  {...getAsyncSelectProps(filter)}
                  {...(resetKey !== undefined ? { resetKey } : {})}
                  value={filter.value || undefined}
                  deselectable={filter.deselectable ?? true}
                  onChange={(value) =>
                    filter.onChange(
                      typeof value === "string" ? value : (value[0] ?? ""),
                    )
                  }
                  onFilterRemove={() => clearAsyncFilter(filter)}
                />
              </motion.div>
            );
          }

          if (filter.type !== "select") return null;

          return (
            <motion.div key={filter.dbKey} className="flex flex-col gap-1">
              <Select
                value={filter.value || undefined}
                onValueChange={filter.onChange}
              >
                <SelectTrigger
                  className={`${FILTER_TRIGGER_CLASS} ${
                    filter.value ? "[&>svg:last-child]:hidden" : ""
                  }`}
                >
                  <SelectValue
                    placeholder={filter.placeholder ?? filter.label}
                    className="text-sm font-normal data-[placeholder]:text-muted-foreground"
                  />
                  {filter.value ? (
                    <X
                      className="h-4 w-4 shrink-0 text-muted-foreground hover:text-foreground"
                      onPointerDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        filter.onChange("");
                      }}
                    />
                  ) : null}
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          );
        })}

        {hasAppliedFilter && (
          <Button
            type="button"
            className="h-10 border-none"
            variant="destructive"
            onClick={handleClearFilters}
          >
            Clear Filter <X className="h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TableFilterContainer;
