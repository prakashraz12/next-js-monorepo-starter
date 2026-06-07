"use client";

import { useState } from "react";
import ModalProvider from "@repo/ui/components/reusables/global/modal";
import { Button } from "@repo/ui/components/button";

function ModalContent({ close }: { close?: () => void }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-muted-foreground text-sm">
        Modal content goes here. Child components receive a <code>close</code>{" "}
        prop automatically.
      </p>
      <Button onClick={close}>Close modal</Button>
    </div>
  );
}

export function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <ModalProvider open={open} onOpenChange={setOpen} title="Example modal">
        <ModalContent />
      </ModalProvider>
    </>
  );
}
