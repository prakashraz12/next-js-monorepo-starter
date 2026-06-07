"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";

import { cn } from "@repo/ui/lib/utils";

type TModalProviderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  containerClassName?: string;
  modalProps?: React.ComponentProps<typeof DialogContent>;
  children?: React.ReactNode;
  title?: string;
  noExit?: boolean;
};

export type _ModalProps = {
  close?: () => void;
};

const ModalProvider = ({
  open,
  onOpenChange,
  containerClassName,
  modalProps,
  children,
  title,
  noExit = false,
}: TModalProviderProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && noExit) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("w-full min-w-2xl overflow-y-scroll", containerClassName)}
        showCloseButton={!noExit}
        onInteractOutside={(e) => noExit && e.preventDefault()}
        onEscapeKeyDown={(e) => noExit && e.preventDefault()}
        {...modalProps}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {React.Children.map(children, (child) =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  close: () => handleOpenChange(false),
                } as React.HTMLAttributes<HTMLElement>)
              : child,
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProvider;
