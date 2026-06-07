"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../sheet";
import { cn } from "@repo/ui/lib/utils";

type SheetProviderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  openFrom?: "top" | "bottom" | "left" | "right";
  noExit?: boolean;
};

export type _SheetModalProps = {
  close?: () => void;
};

const SheetProvider = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  openFrom,
  noExit = false,
}: SheetProviderProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && noExit) return;
    onOpenChange(nextOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        className={cn(className)}
        side={openFrom}
        onInteractOutside={(e) => noExit && e.preventDefault()}
        onEscapeKeyDown={(e) => noExit && e.preventDefault()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{title || "sheet-title"}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  close: () => handleOpenChange(false),
                } as React.HTMLAttributes<HTMLElement>)
              : child,
          )}
        </div>
        <SheetFooter></SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SheetProvider;
