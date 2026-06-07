/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { FieldNamesMarkedBoolean } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatBytes = (
  bytes: number | string,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) => {
  if (typeof bytes === "string") return bytes;

  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  const val = bytes / Math.pow(1024, i);

  if (Number.isNaN(val)) return "";

  return `${val.toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
};

export const getUrlExtension = (url: string): string => {
  if (!url) return "";

  const cleanUrl = url.split(/[#?]/)[0];
  const parts = cleanUrl?.split(".");
  const ext = parts?.pop();

  return ext ? ext.trim() : "";
};

export const parseToFormData = <T extends object>(
  data: Partial<T>,
  imgKey?: string[],
  dirtyFields?: Partial<FieldNamesMarkedBoolean<T>>,
): T => {
  const formData = new FormData();
  const filterData = filterDirtyData(data, dirtyFields);

  Object.entries(filterData).forEach(([key, value]) => {
    if (imgKey?.includes(key) && value) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v instanceof File) {
            formData.append(key, v);
          }
        });
      }
      if (value instanceof File) {
        formData.append(key, value);
      }
      return;
    }
    if (Array.isArray(value)) {
      return formData.append(key, JSON.stringify(value));
    } else if (value instanceof FileList) {
      for (let i = 0; i < value.length; i++) {
        if (value[i]) formData.append(key, value[i] as Blob);
      }
    } else if (typeof value === "object" && value !== null) {
      formData.append(key, JSON.stringify(value));
    } else {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    }
  });

  return formData as T;
};

export const filterDirtyData = <T extends Record<string, any>>(
  data: T,
  dirtyFields?: Partial<FieldNamesMarkedBoolean<T>>,
): Partial<T> => {
  const filteredData: Partial<T> = {};
  if (!dirtyFields) return data;

  Object.entries(data).forEach(([key, value]) => {
    const isDirty = dirtyFields[key as keyof typeof dirtyFields];

    if (!isDirty) return;

    if (
      !Array.isArray(isDirty) &&
      typeof isDirty === "object" &&
      typeof value === "object" &&
      value !== null
    ) {
      const nestedFilteredData = filterDirtyData<T>(value, isDirty);
      if (Object.keys(nestedFilteredData).length > 0) {
        filteredData[key as keyof T] = nestedFilteredData as T[keyof T];
      }
    } else {
      filteredData[key as keyof typeof filteredData] = value;
    }
  });

  return filteredData;
};

export type DatePreset =
  | "TODAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "THIS_YEAR"
  | "CUSTOM";

export type GetDateRangeProps = {
  preset: DatePreset;
  customStartDate?: Date;
  customEndDate?: Date;
};

export const getDateRange = ({
  preset,
  customStartDate,
  customEndDate,
}: GetDateRangeProps) => {
  const now = new Date();

  let startDate = new Date();
  let endDate = new Date();

  switch (preset) {
    case "TODAY": {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );

      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999,
      );

      break;
    }

    case "THIS_WEEK": {
      const currentDay = now.getDay(); // 0 = Sunday
      const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

      startDate = new Date(now);
      startDate.setDate(now.getDate() + diffToMonday);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);

      break;
    }

    case "THIS_MONTH": {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      break;
    }

    case "THIS_YEAR": {
      startDate = new Date(now.getFullYear(), 0, 1);

      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      break;
    }

    case "CUSTOM": {
      startDate = customStartDate || now;
      endDate = customEndDate || now;

      break;
    }

    default:
      break;
  }

  return {
    startDate,
    endDate,
  };
};
