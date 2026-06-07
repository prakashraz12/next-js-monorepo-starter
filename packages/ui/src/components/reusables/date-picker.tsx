import { useEffect, useState } from "react";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "@repo/ui/lib/utils";
import { useDateTranslation } from "@repo/ui/hooks/useDateTranslation";
import { Calendar } from "../calendar";
import TimePicker from "./time-picker";

type TCalanderInput = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (e: any) => void;
  disabled?: boolean;
  label?: string;
  value?: Date | null;
  disableFutureDays?: boolean;
  disablePastDays?: boolean;
  initialDate?: Date;
  withTime?: boolean;
  futureYear?: number;
  fixedWeeks?: boolean;
  mode?: "default" | "edit";
  disableSaveButton?: (date: Date) => boolean;
  calendarMode: "AD" | "BS";
};

export default function DatePicker({
  onChange,
  value,
  className,
  label,
  disableFutureDays,
  initialDate,
  withTime,
  disablePastDays,
  futureYear = 0,
  fixedWeeks = true,
  mode = "default",
  calendarMode,
  disableSaveButton,
  ...props
}: TCalanderInput) {
  const today = startOfDay(new Date());
  const f = useDateTranslation(calendarMode);
  const [date, setDate] = useState<Date | undefined | null>(value);
  const [open, setOpen] = useState(false);
  const valueTime = value?.getTime();

  useEffect(() => {
    setDate((prev) =>
      prev?.getTime() === valueTime ? prev : (value ?? undefined),
    );
  }, [valueTime, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "3xl:h-11 h-10 w-full justify-start border-border text-left font-normal !text-black hover:bg-card dark:!text-white",
            !date && "text-muted-foreground",
            className,
          )}
          disabled={props.disabled}
        >
          <CalendarIcon
            className={cn("mr-2 h-4 w-4", !date && "text-muted-foreground")}
          />
          {date ? (
            f.getTranslatedDate(
              mode === "edit" ? value?.toISOString() : date.toISOString(),
              withTime ? "MMMM do, yyyy hh:mm a" : "MMMM do, yyyy",
            )
          ) : (
            <span className="text-muted-foreground">
              {" "}
              || {label || "Pick a date"}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Calendar
          fixedWeeks={fixedWeeks}
          mode="single"
          onSelect={(val) => {
            if (!val) return;
            if (val.getTime() === date?.getTime()) return;
            setDate(val);
            if (mode === "default") onChange(val);
            if (!withTime) {
              setOpen(false);
            }
          }}
          calendarMode={calendarMode}
          selected={date || undefined}
          defaultMonth={date || undefined}
          fromYear={initialDate ? new Date(initialDate).getFullYear() : 1950}
          disabled={(date) =>
            (disablePastDays ? isBefore(date, today) : false) ||
            (disableFutureDays ? isBefore(new Date(), date) : false) ||
            (initialDate ? isAfter(initialDate, date) : false)
          }
          toYear={new Date().getFullYear() + futureYear}
        />
        {withTime && (
          <div className="px-1 pb-1">
            <hr className="mb-1 w-full" />
            <TimePicker
              date={date || undefined}
              setDate={(value) => {
                setDate(value);
                if (mode === "default") onChange(value);
              }}
            />
          </div>
        )}
        {mode === "edit" && (
          <div className="flex justify-end gap-1 p-2">
            <Button
              variant={"ghost"}
              onClick={() => {
                setDate(value || undefined);
                setOpen(false);
              }}
            >
              Discard
            </Button>
            <Button
              className="flex-1"
              disabled={
                (disableFutureDays && date
                  ? isBefore(new Date(), date)
                  : false) ||
                (initialDate && date ? isAfter(initialDate, date) : false) ||
                (disableSaveButton && date ? disableSaveButton(date) : false)
              }
              onClick={() => {
                onChange(date);
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
