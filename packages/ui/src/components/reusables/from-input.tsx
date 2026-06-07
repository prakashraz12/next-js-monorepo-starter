"use client";

import {
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type Path,
  type UseFormReturn,
  type UseFormStateReturn,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import Input, { InputProps } from "@repo/ui/components/reusables/input";
import { cn } from "@repo/ui/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { HelpCircle } from "lucide-react";

type TProps<
  Name extends Path<FieldValue>,
  FieldValue extends FieldValues = FieldValues,
> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<FieldValue, any, FieldValue>;
  name: Name;
  label?: string;
  description?: string;
  required?: boolean;
  htmlFor?: string;
  horizontal?: boolean;
  vertical?: boolean;
  input?: Omit<InputProps, keyof ControllerRenderProps<FieldValues, string>> & {
    disabled?: boolean;
  };
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  charLimit?: number;
  render?: (
    props: ControllerRenderProps<FieldValue, Name>,
    fieldState: ControllerFieldState,
    formState: UseFormStateReturn<FieldValue>,
  ) => React.ReactNode;
  hideError?: boolean;
  helperText?: string;
};

export default function FormInput<
  Name extends Path<FieldValue>,
  FieldValue extends FieldValues,
>({
  form,
  name,
  label,
  input,
  horizontal,
  htmlFor,
  required,
  description,
  render,
  className,
  labelClassName,
  descriptionClassName,
  charLimit,
  hideError = false,
  vertical = false,
  helperText,
}: TProps<Name, FieldValue>) {
  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field, fieldState, formState }) => (
        <FormItem
          className={cn(
            horizontal
              ? "flex-row items-center justify-between space-y-0"
              : "3xl:space-y-3 space-y-2",
            className,
          )}
        >
          {(label || charLimit || (description && vertical)) && (
            <div
              className={cn(charLimit && "flex items-center justify-between")}
            >
              {label && (
                <FormLabel
                  htmlFor={htmlFor}
                  className={cn(
                    "ml-1 flex w-fit items-center gap-1 text-sm font-medium text-gray-900 dark:text-white",
                    labelClassName,
                  )}
                >
                  {label} {required && <span className="text-red-600"> *</span>}{" "}
                  {helperText && (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="pointer-events-auto mt-0.5 flex">
                          <HelpCircle className="size-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{helperText}</TooltipContent>
                    </Tooltip>
                  )}
                </FormLabel>
              )}
              {description && vertical && (
                <FormDescription className={cn(descriptionClassName)}>
                  {description}
                </FormDescription>
              )}
              {charLimit && (
                <p className="text-dark-500 text-xs">
                  {field.value?.length || 0} / {charLimit}
                </p>
              )}
            </div>
          )}
          <FormControl>
            {render ? (
              render(field, fieldState, formState)
            ) : (
              <Input {...input} {...field} />
            )}
          </FormControl>
          {description && !vertical && (
            <FormDescription className={cn(descriptionClassName)}>
              {description}
            </FormDescription>
          )}
          {!hideError && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
