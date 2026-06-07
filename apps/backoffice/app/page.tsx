"use client";
import { Button } from "@repo/ui/components/button";
import CopyButton from "@repo/ui/components/reusables/copy-btn";

export default function BackofficePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Backoffice</h1>
      <p className="text-muted-foreground text-sm">
        Get started by editing{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">
          apps/backoffice/app/page.tsx
        </code>
      </p>
      <Button>Dashboard</Button>
      <CopyButton value="1234567890" />
    </main>
  );
}
