import { Check } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";

export type BadgeVariant =
  | "default"
  | "outline"
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "purple"
  | "teal";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface BadgeSelectorProps {
  options: BadgeOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  variant?: BadgeVariant;
  size?: BadgeSize;
  disabled?: boolean;
  onChange?: (value: string | string[] | null) => void;
  onSelect?: (value: string) => void;
  onDeselect?: (value: string) => void;
  className?: string;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}

const variantStyles: Record<BadgeVariant, { idle: string; active: string }> = {
  default: {
    idle: "bg-zinc-100 text-zinc-700 border-transparent hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
    active:
      "bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:border-zinc-50",
  },
  outline: {
    idle: "bg-transparent text-foreground border-border hover:bg-muted dark:hover:bg-muted",
    active: "bg-foreground text-background border-foreground",
  },
  blue: {
    idle: "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-200 dark:border-gray-800",
    active:
      "bg-blue-600 text-blue-50 border-blue-600 dark:bg-blue-400 dark:text-blue-950 dark:border-blue-400",
  },
  green: {
    idle: "bg-green-50 text-green-800 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
    active:
      "bg-green-700 text-green-50 border-green-700 dark:bg-green-400 dark:text-green-950 dark:border-green-400",
  },
  red: {
    idle: "bg-red-50 text-red-800 border-red-200 hover:bg-red-100 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
    active:
      "bg-red-700 text-red-50 border-red-700 dark:bg-red-400 dark:text-red-950 dark:border-red-400",
  },
  amber: {
    idle: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
    active:
      "bg-amber-600 text-amber-50 border-amber-600 dark:bg-amber-400 dark:text-amber-950 dark:border-amber-400",
  },
  purple: {
    idle: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800",
    active:
      "bg-purple-600 text-purple-50 border-purple-600 dark:bg-purple-400 dark:text-purple-950 dark:border-purple-400",
  },
  teal: {
    idle: "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-800",
    active:
      "bg-teal-600 text-teal-50 border-teal-600 dark:bg-teal-400 dark:text-teal-950 dark:border-teal-400",
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2.5 py-1 text-[11px] gap-1",
  md: "px-3 py-1.5 text-xs gap-1.5",
  lg: "px-4 py-2 text-sm gap-2",
};

const checkSize: Record<BadgeSize, number> = { sm: 10, md: 12, lg: 13 };

function normalise(v?: string | string[]): string[] {
  if (v === undefined || v === "") return [];
  return Array.isArray(v) ? v.filter(Boolean) : [v];
}

// --- Component ---

export function BadgeSelector({
  options,
  value,
  defaultValue,
  multiple = false,
  variant = "default",
  size = "md",
  disabled = false,
  onChange,
  onSelect,
  onDeselect,
  className,
  onBlur,
}: BadgeSelectorProps) {
  const isControlled = value !== undefined;

  const [internal, setInternal] = React.useState<string[]>(() =>
    normalise(defaultValue),
  );

  const selected = isControlled ? normalise(value) : internal;

  const toggle = React.useCallback(
    (optValue: string) => {
      const wasSelected = selected.includes(optValue);

      const next = multiple
        ? wasSelected
          ? selected.filter((v) => v !== optValue)
          : [...selected, optValue]
        : wasSelected
          ? []
          : [optValue];

      if (!isControlled) setInternal(next);

      wasSelected ? onDeselect?.(optValue) : onSelect?.(optValue);
      onChange?.(multiple ? next : (next[0] ?? null));
    },
    [selected, multiple, isControlled, onChange, onSelect, onDeselect],
  );

  const { idle, active } = variantStyles[variant];

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      onBlur?.(e as unknown as React.FocusEvent<HTMLButtonElement>);
    }
  };

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      onBlur={onBlur ? handleBlur : undefined}
    >
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const isDisabled = disabled || opt.disabled;

        return (
          <button
            key={opt.value}
            type="button"
            disabled={isDisabled}
            aria-pressed={isSelected}
            onClick={(e) => {
              e.preventDefault();
              toggle(opt.value);
            }}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center rounded-md border font-medium",
              "transition-all duration-100 outline-none",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-0",
              sizeStyles[size],
              isSelected ? active : idle,
              isDisabled && "pointer-events-none cursor-not-allowed opacity-40",
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}

            <Check
              size={checkSize[size]}
              strokeWidth={2.2}
              className={cn(
                "shrink-0 transition-all duration-100",
                isSelected ? "w-auto opacity-100" : "-ml-1 w-0 opacity-0",
              )}
            />

            <span className="text-sm">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
