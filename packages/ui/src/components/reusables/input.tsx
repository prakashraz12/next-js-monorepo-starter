import * as React from "react";
import { cn } from "@repo/ui/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rightSideIcon?: React.ReactNode;
  leftSideIcon?: React.ReactNode;
  rightSideText?: string;
  /** Styles for the inner `<input>` only (wrapper uses `className`). */
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      rightSideIcon,
      leftSideIcon,
      rightSideText,
      type,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "relative flex h-10 w-full min-w-0 items-center overflow-hidden rounded-sm shadow-xs",
          "border border-input bg-background",
          "focus-within:ring-1 focus-within:ring-primary focus-within:ring-offset-1 dark:focus-within:ring-ring",
          "has-disabled:cursor-not-allowed has-disabled:opacity-50",
          className,
        )}
      >
        {leftSideIcon && (
          <div className="flex h-full min-w-10 shrink-0 items-center justify-center border-r px-2 text-muted-foreground">
            {leftSideIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent py-2 pl-2 text-sm outline-none",
            "placeholder:text-slate-400",
            "disabled:cursor-not-allowed",
            !leftSideIcon && "pl-3",
            type === "number" &&
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            inputClassName,
          )}
          {...props}
        />

        {rightSideIcon && (
          <div className="flex shrink-0 items-center pr-3 text-muted-foreground">
            <div className="size-4">{rightSideIcon}</div>
          </div>
        )}

        {rightSideText && (
          <div className="flex h-full shrink-0 items-center border-l border-input bg-muted px-3 text-sm text-muted-foreground">
            {rightSideText}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
