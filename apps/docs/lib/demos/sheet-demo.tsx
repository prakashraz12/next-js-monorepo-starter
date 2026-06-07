"use client";

import { useState } from "react";
import SheetProvider from "@repo/ui/components/reusables/global/sheet";
import { Button } from "@repo/ui/components/button";

function SheetContent({ close }: { close?: () => void }) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Slide-over panel for forms, filters, or detail views.
      </p>
      <Button variant="outline" onClick={close}>
        Close sheet
      </Button>
    </div>
  );
}

export function SheetDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <SheetProvider
        open={open}
        onOpenChange={setOpen}
        title="Example sheet"
        description="Side panel documentation preview"
        openFrom="right"
      >
        <SheetContent />
      </SheetProvider>
    </>
  );
}
