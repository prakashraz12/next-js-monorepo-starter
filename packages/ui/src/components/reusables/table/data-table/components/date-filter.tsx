"use client";

import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import {
  DATE_PICKER_OPTIONS,
  type DatePickerKey,
  getDatePickerPresetKey,
  getDateRange,
  getDateRangeDisplayLabel,
} from "../../../date-filter/config";
import MenuItem from "../../../menu-item";
import { Calendar } from "@repo/ui/components/calendar";
import { DateRange } from "react-day-picker";

type DateFilterProps = {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  setStartDate?: (date: string | null) => void;
  setEndDate?: (date: string | null) => void;
};

function toIsoString(value?: string | Date | null) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.toISOString();
}

const DateFilter = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateFilterProps) => {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const startIso = toIsoString(startDate);
  const endIso = toIsoString(endDate);

  const selectedLabel = useMemo(() => {
    if (!startIso || !endIso) return "Select date range";
    return getDateRangeDisplayLabel(startIso, endIso);
  }, [startIso, endIso]);

  const selectedPresetKey = useMemo(() => {
    if (!startIso || !endIso) return null;
    return getDatePickerPresetKey(startIso, endIso);
  }, [startIso, endIso]);

  const applyPreset = (key: DatePickerKey) => {
    if (!setStartDate || !setEndDate) return;

    if (key === "CUSTOM") {
      // Seed the calendar with the current applied range if available
      setRange(
        startDate && endDate
          ? { from: new Date(startDate), to: new Date(endDate) }
          : undefined,
      );
      setShowCustom(true);
      return;
    }

    const dateRange = getDateRange(key);
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
    setShowCustom(false);
    setOpen(false);
  };

  const applyCustomRange = () => {
    if (!range?.from || !range?.to || !setStartDate || !setEndDate) return;

    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);

    const end = new Date(range.to);
    end.setHours(23, 59, 59, 999);

    setStartDate(start.toISOString());
    setEndDate(end.toISOString());
    setShowCustom(false);
    setOpen(false);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setShowCustom(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-fit justify-start gap-2 px-3 font-normal shadow-none"
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span
            className="truncate text-muted-foreground"
            title={selectedLabel}
          >
            {selectedLabel}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={showCustom ? "w-auto p-2" : "w-56 p-1"}
        align="start"
      >
        {!showCustom ? (
          <div className="flex flex-col gap-0.5">
            {DATE_PICKER_OPTIONS.map((item) => (
              <MenuItem
                key={item.key}
                type="default"
                selected={selectedPresetKey === item.key}
                childrenArrow={item.key === "CUSTOM"}
                onClick={() => applyPreset(item.key)}
              >
                {item.label}
              </MenuItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
            />
            <div className="flex gap-2 px-1 pb-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 w-[200px]"
                onClick={() => setShowCustom(false)}
              >
                Back
              </Button>
              <Button
                type="button"
                variant={"success"}
                className="h-10 flex-1"
                disabled={!range?.from || !range?.to}
                onClick={applyCustomRange}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
