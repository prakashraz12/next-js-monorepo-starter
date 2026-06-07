"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
import { Check, X } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        // Sizes with p-[3px] padding
        "data-[size=default]:h-6 data-[size=default]:w-[42px] data-[size=default]:p-[3px]",
        "data-[size=sm]:h-[17px] data-[size=sm]:w-[30px] data-[size=sm]:p-[2px]",
        "data-[state=checked]:bg-green-700 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none relative flex items-center justify-center rounded-full bg-background ring-0 transition-transform",
          // Thumb size = track height - padding*2
          // default: 24 - 6 = 18px | sm: 17 - 4 = 13px
          "group-data-[size=default]/switch:size-[18px]",
          "group-data-[size=sm]/switch:size-[13px]",
          // translate = track width - padding*2 - thumb size
          // default: 42 - 6 - 18 = 18px | sm: 30 - 4 - 13 = 13px
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-[18px]",
          "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[13px]",
          "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0",
          "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
        )}
      >
        <Check
          className={cn(
            "absolute text-green-700 transition-opacity",
            "group-data-[size=default]/switch:size-[10px]",
            "group-data-[size=sm]/switch:size-[7px]",
            "group-data-[state=checked]/switch:opacity-100",
            "group-data-[state=unchecked]/switch:opacity-0",
          )}
          strokeWidth={5}
        />
        <X
          className={cn(
            "absolute text-muted-foreground transition-opacity",
            "group-data-[size=default]/switch:size-[10px]",
            "group-data-[size=sm]/switch:size-[7px]",
            "group-data-[state=checked]/switch:opacity-0",
            "group-data-[state=unchecked]/switch:opacity-100",
          )}
          strokeWidth={5}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
