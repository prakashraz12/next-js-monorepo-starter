import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { ChevronDown } from "lucide-react";

import { Button } from "../button";

import type { InputProps } from "./input";
import useClient from "./hooks/useClient";
import { cn } from "@repo/ui/lib/utils";
import { getCountryByTimeZone } from "@repo/ui/lib/phone.util";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { CommandGroup } from "cmdk";

let myCountry: RPNInput.Country = getCountryByTimeZone();

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      className={cn(
        "3xl:h-11 h-11 w-full rounded-s-none rounded-e-lg border border-l-0 pl-2 text-sm outline-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
InputComponent.displayName = "InputComponent";

export const FlagComponent = ({
  country,
  countryName,
  className,
}: RPNInput.FlagProps & { className?: string }): React.JSX.Element => {
  const Flag = flags[country];

  return (
    <span className={cn("flex h-5 w-full overflow-hidden", className)}>
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = "FlagComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options?: CountrySelectOption[];
  allowedCountries?: RPNInput.Country[];
  onlyCountrySelect?: boolean;
  noCallingCode?: boolean;
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
  allowedCountries,
  noCallingCode,
  onlyCountrySelect,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const isClient = useClient();

  const handleSelect = React.useCallback(
    (country: RPNInput.Country) => {
      onChange(country);
      myCountry = country;
    },
    [onChange],
  );

  let filteredOptions = allowedCountries
    ? options?.filter((option) => allowedCountries?.includes(option.value))
    : options;

  if (!options && onlyCountrySelect) {
    const intl = new Intl.DisplayNames(["en"], { type: "region" });

    filteredOptions = RPNInput.getCountries().map((item) => ({
      label: intl.of(item) || "",
      value: item,
    }));
  }

  if (!isClient)
    return (
      <div className="3xl:h-11 loading h-10 w-[84px] rounded-s-lg rounded-r-none border" />
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "text-dark flex h-11 gap-2 rounded-s-lg rounded-e-none border-border bg-background pr-1 pl-3 focus-visible:ring-1 disabled:pr-3 [&_svg:not([class*='size-'])]:size-4.5",
            onlyCountrySelect &&
              "3xl:h-12 h-10 justify-between rounded-lg px-4",
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-4">
            <FlagComponent country={value} countryName={value} />
            {onlyCountrySelect && (
              <span className="3xl:text-sm flex-1 text-xs">
                {new Intl.DisplayNames(["en"], { type: "region" }).of(value) ||
                  ""}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-foreground opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-0"
        sideOffset={onlyCountrySelect ? -4 : 4}
      >
        <Command className="p-2">
          <CommandInput placeholder="Search country..." />
          <CommandList className="max-h-[250px]">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup className="mt-2 p-0">
              {filteredOptions
                ?.filter((x) => x.value)
                ?.map((option) => (
                  <CommandItem
                    className={cn(
                      "h-10 cursor-pointer gap-2 px-2 py-2",
                      option.value === value && "bg-accent/20! text-primary",
                    )}
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option.value);
                      setOpen(false);
                    }}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                      className="rounded-none object-contain"
                    />
                    <span className="3xl:text-sm flex-1 text-xs">
                      {option.label}
                    </span>

                    {option.value && !noCallingCode && (
                      <span className="3xl:text-sm text-xs">
                        {RPNInput.getCountryCallingCode(option.value)}
                      </span>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange" | "value"> & {
    onChange?: (value: string) => void;
    value?: string | null;
    allowedCountries?: RPNInput.Country[];
  };

const PhoneNumberInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange = () => {}, allowedCountries, ...props }, ref) => {
      const handleOnChange = React.useCallback(
        (value: RPNInput.Value) => {
          if (!value) {
            onChange("");
            return;
          }

          if (myCountry) {
            const formattedValue = value.replace(
              `+${RPNInput.getCountryCallingCode(myCountry)}`,
              `+${RPNInput.getCountryCallingCode(myCountry)}`,
            );
            onChange(formattedValue);
          }
        },
        [onChange],
      );

      return (
        <RPNInput.default
          ref={ref}
          international
          defaultCountry={myCountry}
          smartCaret
          onFocus={() => {
            if (!myCountry) {
              myCountry = "NP";
            }
          }}
          limitMaxLength
          countryCallingCodeEditable={false}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          countrySelectProps={{
            allowedCountries,
          }}
          inputComponent={InputComponent}
          onChange={handleOnChange}
          {...props}
          value={props.value || undefined}
        />
      );
    },
  );
PhoneNumberInput.displayName = "PhoneInput";

export const getParsePhoneNumber = (number: string) => {
  try {
    const parsed = RPNInput.parsePhoneNumber(number);
    if (!parsed) return number;
    return `${parsed.countryCallingCode} ${parsed.nationalNumber}`;
  } catch {
    return number;
  }
};
export const getOriginalPhoneNumber = (number: string) => {
  try {
    const parsed = RPNInput.parsePhoneNumber(`+${number.replace(" ", "")}`);
    if (!parsed) return number;
    return parsed.number;
  } catch {
    return number;
  }
};

export { CountrySelect, PhoneNumberInput };
