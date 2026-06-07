"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../dialog";
import { cn } from "@repo/ui/lib/utils";
import DeleteModalUi from "../delete-modal-ui";

type TDeleteModalProviderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  containerClassName?: string;
  modalProps?: React.ComponentProps<typeof DialogContent>;
  children?: React.ReactNode;
  title?: string;
  onConfirm?: () => void;
  isLoading?: boolean;
  noExit?: boolean;
};

const DeleteModalProvider = ({
  open,
  onOpenChange,
  containerClassName,
  modalProps,
  children,
  title,
  onConfirm,
  isLoading,
  noExit = false,
}: TDeleteModalProviderProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && noExit) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn("h-fit w-fit overflow-y-scroll", containerClassName)}
        showCloseButton={!noExit}
        onInteractOutside={(e) => noExit && e.preventDefault()}
        onEscapeKeyDown={(e) => noExit && e.preventDefault()}
        {...modalProps}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {children ? (
            children
          ) : (
            <DeleteModalUi
              isOpen={open}
              onConfirm={onConfirm || (() => {})}
              onCancel={() => handleOpenChange(false)}
              title="Are you sure want to delete?"
              description="Are you sure you want to delete this article? This action cannot be undone."
              isLoading={isLoading}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModalProvider;
