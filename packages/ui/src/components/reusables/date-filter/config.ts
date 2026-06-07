import { format } from "date-fns";

export const DATE_PICKER_OPTIONS = [
  {
    label: "This Month",
    key: "THIS_MONTH",
  },
  {
    label: "This Week",
    key: "THIS_WEEK",
  },
  {
    label: "Today",
    key: "TODAY",
  },
  {
    label: "Yesterday",
    key: "YESTERDAY",
  },
  {
    label: "This Year",
    key: "THIS_YEAR",
  },
  {
    label: "Custom",
    key: "CUSTOM",
  },
] as const;

export type DatePickerKey = (typeof DATE_PICKER_OPTIONS)[number]["key"];

/** Preset keys supported for default table date range (excludes custom). */
export type DateFilterPreset = Exclude<DatePickerKey, "CUSTOM">;

interface DateRange {
  startDate: string;
  endDate: string;
}

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

const isSameDate = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

export function getDateRange(key: Exclude<DatePickerKey, "CUSTOM">): DateRange {
  const now = new Date();

  switch (key) {
    case "TODAY":
      return {
        startDate: startOfDay(now).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };

    case "YESTERDAY": {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      return {
        startDate: startOfDay(yesterday).toISOString(),
        endDate: endOfDay(yesterday).toISOString(),
      };
    }

    case "THIS_WEEK": {
      const startOfWeek = new Date(now);

      startOfWeek.setDate(now.getDate() - now.getDay());

      return {
        startDate: startOfDay(startOfWeek).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    }

    case "THIS_MONTH": {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        startDate: startOfDay(startOfMonth).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    }

    case "THIS_YEAR": {
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      return {
        startDate: startOfDay(startOfYear).toISOString(),
        endDate: endOfDay(now).toISOString(),
      };
    }

    default:
      throw new Error(`Unexpected date picker key: ${key}`);
  }
}

/**
 * Detect preset from startDate + endDate
 */
export function getDatePickerKeyFromRange(
  startDate: string,
  endDate: string,
): (typeof DATE_PICKER_OPTIONS)[number]["label"] {
  const now = new Date();

  const start = new Date(startDate);
  const end = new Date(endDate);

  // TODAY
  if (isSameDate(start, startOfDay(now)) && isSameDate(end, endOfDay(now))) {
    return "Today";
  }

  // YESTERDAY
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (
    isSameDate(start, startOfDay(yesterday)) &&
    isSameDate(end, endOfDay(yesterday))
  ) {
    return "Yesterday";
  }

  // THIS WEEK
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  if (
    isSameDate(start, startOfDay(startOfWeek)) &&
    isSameDate(end, endOfDay(now))
  ) {
    return "This Week";
  }

  // THIS MONTH
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (
    isSameDate(start, startOfDay(startOfMonth)) &&
    isSameDate(end, endOfDay(now))
  ) {
    return "This Month";
  }

  // THIS YEAR
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  if (
    isSameDate(start, startOfDay(startOfYear)) &&
    isSameDate(end, endOfDay(now))
  ) {
    return "This Year";
  }

  return "Custom";
}

export function getDatePickerPresetKey(
  startDate: string,
  endDate: string,
): DatePickerKey {
  const label = getDatePickerKeyFromRange(startDate, endDate);
  const match = DATE_PICKER_OPTIONS.find((option) => option.label === label);
  return match?.key ?? "CUSTOM";
}

export function formatCustomDateRangeLabel(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${format(start, "dd MMM yyyy")} – ${format(end, "dd MMM yyyy")}`;
}

/** Button label: preset name, or formatted range when custom. */
export function getDateRangeDisplayLabel(startDate: string, endDate: string) {
  const presetLabel = getDatePickerKeyFromRange(startDate, endDate);
  if (presetLabel === "Custom") {
    return formatCustomDateRangeLabel(startDate, endDate);
  }
  return presetLabel;
}

function toIsoString(value?: string | Date | null) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.toISOString();
}

/** True when the range is not the default "This Month" preset */
export function isDateFilterApplied(
  startDate?: string | Date | null,
  endDate?: string | Date | null,
): boolean {
  const startIso = toIsoString(startDate);
  const endIso = toIsoString(endDate);

  if (!startIso || !endIso) return false;

  return getDatePickerKeyFromRange(startIso, endIso) !== "This Month";
}

export function getDefaultThisMonthRange(): DateRange {
  return getDateRange("THIS_MONTH");
}

export function getDefaultDateRange(
  preset: DateFilterPreset = "THIS_MONTH",
): DateRange {
  return getDateRange(preset);
}
