import { format, type FormatDistanceFn } from "date-fns";

import date from "../assets/json/date.json";
import fiscal from "../assets/json/fiscal.json";

const NEPALI_TO_ENGLISH = Object.keys(date).reduce(
  (acc, key) => {
    acc[date[key as keyof typeof date]] = key;
    return acc;
  },
  {} as Record<string, string>,
);

export const NEPALI_MONTHS = [
  "Baishakh",
  "Jestha",
  "Ashad",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

export const getOrdinalNumber = (value: string) => {
  const number = Number(value);

  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};

export const toNepaliDate = (
  val?: string | Date | null,
  fmt: Parameters<typeof format>[1] = "yyyy-MM-dd",
) => {
  const input = new Date(val || new Date());
  if (Number.isNaN(input.getTime())) return "";
  const converted = date[format(input, "yyyy-M-d") as keyof typeof date];
  if (!converted) return format(input, fmt || "yyyy-MM-dd");

  const [year, month, day] = converted.split("-").map(Number);

  const isAm = input.getHours() < 12;

  return fmt.replace(
    /yyyy|yy|MMMM|MMM|MM|M|dd|do|d|a|HH|H|hh|h|mm|m|ss|s/g,
    (match) => {
      switch (match) {
        case "yyyy":
          return year?.toString() || "";
        case "yy":
          return year?.toString()?.slice(-2) || "";
        case "MMMM":
          return NEPALI_MONTHS[(month || 0) - 1] || "";
        case "MMM":
          return NEPALI_MONTHS[(month || 0) - 1]?.slice(0, 3) || "";
        case "MM":
          return month?.toString()?.padStart(2, "0") || "";
        case "M":
          return month?.toString() || "";
        case "dd":
          return day?.toString()?.padStart(2, "0") || "";
        case "do":
          return getOrdinalNumber(day?.toString() || "");
        case "d":
          return day?.toString() || "";
        case "a":
          return isAm ? "AM" : "PM";
        case "HH":
          return input.getHours().toString().padStart(2, "0");
        case "H":
          return input.getHours().toString();
        case "hh":
          return (input.getHours() === 12 ? 12 : input.getHours() % 12)
            .toString()
            .padStart(2, "0");
        case "h":
          return (
            input.getHours() === 12 ? 12 : input.getHours() % 12
          ).toString();
        case "mm":
          return input.getMinutes().toString().padStart(2, "0");
        case "m":
          return input.getMinutes().toString();
        case "ss":
          return input.getSeconds().toString().padStart(2, "0");
        case "s":
          return input.getSeconds().toString();
        default:
          return match;
      }
    },
  );
};

export const toNepaliYears = (year?: number) => {
  if (year === undefined) return "N/A";

  const start = toNepaliDate(`${year}-01-01`, "yyyy");
  const end = toNepaliDate(`${year}-12-1`, "yyyy");

  return `${start}/${end}`;
};

export const toEnglishDate = (input: string) => {
  return NEPALI_TO_ENGLISH[input] || "DATE_ERROR";
};

export const formatDistanceLocale: FormatDistanceFn = (token, count) => {
  switch (token) {
    case "xSeconds":
      return `${count} sec${count > 1 ? "s" : ""}`;
    case "xMinutes":
      return `${count} min${count > 1 ? "s" : ""}`;
    case "xHours":
      return `${count} hr${count > 1 ? "s" : ""}`;
    case "xDays":
      return `${count} day${count > 1 ? "s" : ""}`;
    case "xMonths":
      return `${count} mth${count > 1 ? "s" : ""}`;
    case "xYears":
      return `${count} yr${count > 1 ? "s" : ""}`;
    case "xWeeks":
      return `${count} wk${count > 1 ? "s" : ""}`;
    case "halfAMinute":
      return "half a minute";
    case "lessThanXMinutes":
      return `less than ${count} min${count > 1 ? "s" : ""}`;
    case "lessThanXSeconds":
      return `less than ${count} sec${count > 1 ? "s" : ""}`;
    case "aboutXHours":
      return `${count} hr${count > 1 ? "s" : ""}`;
    case "aboutXMonths":
      return `${count} mth${count > 1 ? "s" : ""}`;
    case "aboutXYears":
      return `${count} yr${count > 1 ? "s" : ""}`;
    default:
      return "";
  }
};

export const getLastOfMonth = (year: number, month: number) => {
  for (let i = 25; i <= 35; i++) {
    if (!NEPALI_TO_ENGLISH[`${year}-${month}-${i}`]) {
      return i - 1;
    }
  }

  return 1;
};

export { fiscal };

export const resetUTCTime = (date?: Date) => {
  if (!date) return date;
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return date;
};

export const getFiscalYear = (date?: Date | string): string => {
  if (!date) return "-";

  const targetDate = new Date(date);

  for (const [fy, range] of Object.entries(fiscal)) {
    const start = new Date(range.start);
    const end = new Date(range.end);

    if (targetDate >= start && targetDate <= end) {
      return fy;
    }
  }

  return "-";
};
