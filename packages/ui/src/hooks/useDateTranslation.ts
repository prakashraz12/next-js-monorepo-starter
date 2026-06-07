import { format } from "date-fns";
import { toNepaliDate, toNepaliYears } from "../lib/date-util";

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
];

export const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type TReturnUseDateTranslation = {
  getTranslatedDate: (input?: Date | string | null, fmt?: string) => string;
  getMonthsForEnglish: (month?: number) => string;
  getYearsForEnglish: (year?: number) => number | string;
  months: string[];
  mode: "BS" | "AD";
};

export function useDateTranslation(
  forcedDateMode: "BS" | "AD",
): TReturnUseDateTranslation {
  const dateMode = forcedDateMode;

  return {
    getTranslatedDate: (input?: Date | string | null, fmt?: string) => {
      const value = input === "now" ? new Date().toISOString() : input;

      if (dateMode === "BS") return toNepaliDate(value, fmt || "yyyy-MM-dd");
      return format(new Date(value || new Date()), fmt || "yyyy-MM-dd");
    },
    getMonthsForEnglish: (month?: number) => {
      if (month === undefined) return "N/A";

      const months =
        dateMode === "BS"
          ? [
              "Poush/Magh",
              "Magh/Falgun",
              "Falgun/Chaitra",
              "Chaitra/Baishakh",
              "Baishakh/Jestha",
              "Jestha/Ashad",
              "Ashad/Shrawan",
              "Shrawan/Bhadra",
              "Bhadra/Ashwin",
              "Ashwin/Kartik",
              "Kartik/Mangsir",
              "Mangsir/Poush",
            ]
          : [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];

      return months[month] || "N/A";
    },
    getYearsForEnglish: (year?: number) => {
      if (dateMode === "AD") return year || "N/A";
      else return toNepaliYears(year);
    },
    months: dateMode === "BS" ? NEPALI_MONTHS : ENGLISH_MONTHS,
    mode: dateMode as "BS" | "AD",
  };
}
