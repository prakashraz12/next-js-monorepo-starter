"use client";

import * as React from "react";
import {
  DayPicker,
  type DateLib,
  type DayPickerLocale,
} from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import "react-day-picker/style.css";

import { buttonVariants } from "./button";
import { getBsDateLib } from "../lib/bs-date-lib";
import { cn } from "../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  disableFutureDate?: boolean;
  calendarMode?: "AD" | "BS";
  fromYear?: number;
  toYear?: number;
};

const isDayPickerLocale = (value: unknown): value is DayPickerLocale => {
  if (!value || typeof value !== "object") return false;
  return typeof (value as DayPickerLocale).code === "string";
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fromYear = 2020,
  toYear = 2030,
  calendarMode,
  dateLib: dateLibProp,
  formatters: formattersProp,
  disableFutureDate,
  ...props
}: CalendarProps) {
  const resolvedMode = calendarMode ?? "AD";

  const locale = isDayPickerLocale(props.locale) ? props.locale : undefined;

  const bsDefaults =
    resolvedMode === "BS"
      ? {
          weekStartsOn: 0 as const,
          firstWeekContainsDate: 4 as const,
          timeZone: "Asia/Kathmandu",
          // numerals: "deva" as const,
        }
      : {};

  const effectiveOptions = {
    weekStartsOn: props.weekStartsOn ?? bsDefaults.weekStartsOn,
    firstWeekContainsDate:
      props.firstWeekContainsDate ?? bsDefaults.firstWeekContainsDate,
    timeZone: props.timeZone ?? bsDefaults.timeZone,
    // numerals: props.numerals ?? bsDefaults.numerals,
  };

  const dateLib: Partial<DateLib> | undefined =
    dateLibProp ??
    (resolvedMode === "BS"
      ? getBsDateLib({
          locale,
          weekStartsOn: effectiveOptions.weekStartsOn,
          firstWeekContainsDate: effectiveOptions.firstWeekContainsDate,
          useAdditionalWeekYearTokens: props.useAdditionalWeekYearTokens,
          useAdditionalDayOfYearTokens: props.useAdditionalDayOfYearTokens,
          timeZone: effectiveOptions.timeZone,
          // numerals: effectiveOptions.numerals,
        })
      : undefined);

  const formatWithLib = (date: Date, formatStr: string) => {
    if (dateLib?.format) {
      return dateLib.format(date, formatStr);
    }
    return "";
  };
  const bsFormatters =
    resolvedMode === "BS"
      ? {
          ...(formattersProp || {}),
          formatYearCaption: (date: Date) => formatWithLib(date, "yyyy"),
          formatYearDropdown: (date: Date) => formatWithLib(date, "yyyy"),
          formatMonthCaption: (date: Date) => formatWithLib(date, "LLLL"),
          formatMonthDropdown: (date: Date) => formatWithLib(date, "LLLL"),
          formatDay: (date: Date) => formatWithLib(date, "d"),
          formatCaption: (date: Date) => formatWithLib(date, "LLLL yyyy"),
        }
      : formattersProp;

  return (
    <DayPicker
      dateLib={dateLib}
      dir="ltr"
      captionLayout="dropdown"
      formatters={bsFormatters}
      weekStartsOn={effectiveOptions.weekStartsOn}
      firstWeekContainsDate={effectiveOptions.firstWeekContainsDate}
      timeZone={effectiveOptions.timeZone}
      // numerals={effectiveOptions.numerals}
      startMonth={new Date(fromYear, 0, 1)}
      hidden={{
        before: new Date(fromYear, 0, 1),
        after: new Date(toYear, 11, 31),
      }}
      endMonth={new Date(toYear, 11, 31)}
      showOutsideDays={showOutsideDays}
      disabled={disableFutureDate ? { after: new Date() } : undefined}
      // Classname styles for the calendar and its parts
      className={cn("p-1 lg:p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2",
        month: "space-y-4",
        month_caption: "flex justify-start gap-2 pt-1 relative items-center",
        caption_label:
          "flex items-center justify-start gap-2 text-sm font-medium",
        dropdowns: "flex gap-2 items-start [&_.rdp-vhidden]:hidden",
        months_dropdown:
          "absolute w-[150px] 3xl:text-xs font-medium px-2 text-[10px] inline-flex items-center",
        years_dropdown:
          "absolute 3xl:text-xs font-medium px-2 text-[10px] inline-flex items-center",
        dropdown:
          " inset-0 px-2.5 w-full appearance-none opacity-0 z-10 cursor-pointer",

        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-2 right-10 z-10 h-7 w-7 border-[1px] bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute top-2 right-1 z-10 h-7 w-7 border-[1px] bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        month_grid: "border-collapse space-y-1 mx-auto",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-10 p-0 font-normal shadow-none hover:bg-primary/50 hover:text-white aria-selected:opacity-100",
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "bg-primary rounded-md text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent rounded-md text-accent-foreground",
        outside:
          "day-outside text-muted-foreground opacity-50  aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === "left" ? (
            <ChevronLeftIcon {...rest} className="h-4 w-4" />
          ) : orientation === "right" ? (
            <ChevronRightIcon {...rest} className="h-4 w-4" />
          ) : orientation === "up" ? (
            <ChevronLeftIcon {...rest} className="h-4 w-4 rotate-90" />
          ) : (
            <ChevronLeftIcon {...rest} className="h-4 w-4 -rotate-90" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
