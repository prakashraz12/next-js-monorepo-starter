import { DateLib, type DateLibOptions } from "react-day-picker";
import {
  format as formatDate,
  type FormatOptions,
  type Interval,
} from "date-fns";

import {
  getLastOfMonth,
  NEPALI_MONTHS,
  toEnglishDate,
  toNepaliDate,
} from "./date-util";

type BsDateParts = {
  year: number;
  monthIndex: number;
  day: number;
};

const normalizeMonthIndex = (monthIndex: number) => {
  const yearOffset = Math.trunc(monthIndex / 12);
  let normalized = monthIndex % 12;
  if (normalized < 0) {
    normalized += 12;
    return { yearOffset: yearOffset - 1, monthIndex: normalized };
  }
  return { yearOffset, monthIndex: normalized };
};

const getSafeNumber = (value: number | undefined, fallback: number) =>
  Number.isFinite(value) ? (value as number) : fallback;

const getBsDateParts = (date: Date): BsDateParts => {
  const nepali = toNepaliDate(date, "yyyy-M-d");
  if (!nepali) {
    throw new Error("Invalid BS date conversion");
  }
  const [yearRaw, monthRaw, dayRaw] = nepali.split("-").map(Number);
  const year = getSafeNumber(yearRaw, date.getFullYear());
  const monthIndex = getSafeNumber(monthRaw, 1) - 1;
  const day = getSafeNumber(dayRaw, date.getDate());
  return { year, monthIndex, day };
};

const toGregorianDate = ({ year, monthIndex, day }: BsDateParts): Date => {
  const nepali = `${year}-${monthIndex + 1}-${day}`;
  const english = toEnglishDate(nepali);
  if (english === "DATE_ERROR") {
    throw new Error(`Invalid BS date: ${nepali}`);
  }
  const [y, m, d] = english.split("-").map(Number);
  if (y && m && d) {
    const dateObj = new Date(y, m - 1, d);
    if (!isNaN(dateObj.getTime())) {
      return dateObj;
    }
  }
  return new Date(english);
};

const clampDay = (year: number, monthIndex: number, day: number) => {
  const lastDay = getLastOfMonth(year, monthIndex + 1);
  return Math.min(day, lastDay);
};

const addBsMonths = (parts: BsDateParts, amount: number): BsDateParts => {
  const { yearOffset, monthIndex } = normalizeMonthIndex(
    parts.monthIndex + amount,
  );
  const year = parts.year + yearOffset;
  const day = clampDay(year, monthIndex, parts.day);
  return { year, monthIndex, day };
};

const formatMonthName = (monthIndex: number) => {
  return NEPALI_MONTHS[monthIndex] ?? "";
};

const formatDateStyle = (
  date: Date,
  style: "long" | "full",
  options?: FormatOptions,
) => {
  const { year, monthIndex, day } = getBsDateParts(date);
  const monthName = formatMonthName(monthIndex);
  if (style === "full") {
    const weekday = formatDate(date, "cccc", options);
    return `${weekday}, ${monthName} ${day}, ${year}`;
  }
  return `${monthName} ${day}, ${year}`;
};

const buildTimeFormat = (
  date: Date,
  formatStr: string,
  options?: FormatOptions,
) => {
  return formatDate(date, formatStr, options);
};

const formatBsDate = (
  date: Date,
  formatStr: string,
  options?: FormatOptions,
) => {
  const { year, monthIndex, day } = getBsDateParts(date);
  const monthNumber = monthIndex + 1;
  switch (formatStr) {
    case "LLLL y":
    case "LLLL yyyy":
      return `${formatMonthName(monthIndex)} ${year}`;
    case "LLLL":
      return formatMonthName(monthIndex);
    case "PPP":
      return formatDateStyle(date, "long", options);
    case "PPPP":
      return formatDateStyle(date, "full", options);
    case "cccc":
    case "cccccc":
      return formatDate(date, formatStr, options);
    case "yyyy":
    case "y":
      return year.toString();
    case "yyyy-MM":
      return `${year}-${monthNumber.toString().padStart(2, "0")}`;
    case "yyyy-MM-dd":
      return `${year}-${monthNumber
        .toString()
        .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    case "MM":
      return monthNumber.toString().padStart(2, "0");
    case "M":
      return monthNumber.toString();
    case "dd":
      return day.toString().padStart(2, "0");
    case "d":
      return day.toString();
    default:
      if (/[Hh]/.test(formatStr) && /m/.test(formatStr)) {
        return buildTimeFormat(date, formatStr, options);
      }
      return `${day}/${monthNumber}/${year}`;
  }
};

const addMonths = (date: Date, amount: number) => {
  const parts = getBsDateParts(date);
  return toGregorianDate(addBsMonths(parts, amount));
};

const addYears = (date: Date, amount: number) => {
  const parts = getBsDateParts(date);
  const year = parts.year + amount;
  const day = clampDay(year, parts.monthIndex, parts.day);
  return toGregorianDate({ ...parts, year, day });
};

const differenceInCalendarMonths = (dateLeft: Date, dateRight: Date) => {
  const left = getBsDateParts(dateLeft);
  const right = getBsDateParts(dateRight);
  return (left.year - right.year) * 12 + (left.monthIndex - right.monthIndex);
};

const eachMonthOfInterval = (interval: Interval) => {
  const start = new Date(interval.start);
  const end = new Date(interval.end);
  const startParts = getBsDateParts(startOfMonth(start));
  const endParts = getBsDateParts(startOfMonth(end));
  const dates: Date[] = [];
  let current = { ...startParts, day: 1 };
  while (
    current.year < endParts.year ||
    (current.year === endParts.year &&
      current.monthIndex <= endParts.monthIndex)
  ) {
    dates.push(toGregorianDate(current));
    current = addBsMonths(current, 1);
    current.day = 1;
  }
  return dates;
};

const eachYearOfInterval = (interval: Interval) => {
  const start = new Date(interval.start);
  const end = new Date(interval.end);
  const startParts = getBsDateParts(startOfYear(start));
  const endParts = getBsDateParts(startOfYear(end));
  const dates: Date[] = [];
  for (let year = startParts.year; year <= endParts.year; year += 1) {
    dates.push(toGregorianDate({ year, monthIndex: 0, day: 1 }));
  }
  return dates;
};

const endOfMonth = (date: Date) => {
  const parts = getBsDateParts(date);
  const day = getLastOfMonth(parts.year, parts.monthIndex + 1);
  return toGregorianDate({ ...parts, day });
};

const endOfYear = (date: Date) => {
  const parts = getBsDateParts(date);
  const day = getLastOfMonth(parts.year, 12);
  return toGregorianDate({ year: parts.year, monthIndex: 11, day });
};

const getMonth = (date: Date) => {
  return getBsDateParts(date).monthIndex;
};

const getYear = (date: Date) => {
  return getBsDateParts(date).year;
};

const isSameMonth = (dateLeft: Date, dateRight: Date) => {
  const left = getBsDateParts(dateLeft);
  const right = getBsDateParts(dateRight);
  return left.year === right.year && left.monthIndex === right.monthIndex;
};

const isSameYear = (dateLeft: Date, dateRight: Date) => {
  return getBsDateParts(dateLeft).year === getBsDateParts(dateRight).year;
};

const newDate = (year: number, monthIndex: number, day: number) => {
  return toGregorianDate({ year, monthIndex, day });
};

const setMonth = (date: Date, monthIndex: number) => {
  const parts = getBsDateParts(date);
  const day = clampDay(parts.year, monthIndex, parts.day);
  return toGregorianDate({ ...parts, monthIndex, day });
};

const setYear = (date: Date, year: number) => {
  const parts = getBsDateParts(date);
  const day = clampDay(year, parts.monthIndex, parts.day);
  return toGregorianDate({ ...parts, year, day });
};

const startOfMonth = (date: Date) => {
  const parts = getBsDateParts(date);
  return toGregorianDate({ ...parts, day: 1 });
};

const startOfYear = (date: Date) => {
  const parts = getBsDateParts(date);
  return toGregorianDate({ year: parts.year, monthIndex: 0, day: 1 });
};

const format = (date: Date, formatStr: string, options?: FormatOptions) => {
  return formatBsDate(date, formatStr, options);
};

export const getBsDateLib = (options?: DateLibOptions) => {
  return new DateLib(options, {
    addMonths,
    addYears,
    differenceInCalendarMonths,
    eachMonthOfInterval,
    eachYearOfInterval,
    endOfMonth,
    endOfYear,
    format,
    getMonth,
    getYear,
    isSameMonth,
    isSameYear,
    newDate,
    setMonth,
    setYear,
    startOfMonth,
    startOfYear,
  });
};
