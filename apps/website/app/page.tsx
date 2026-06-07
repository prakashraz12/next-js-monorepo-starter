import { Button } from "@repo/ui/components/button";

export default function WebsitePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Website</h1>
      <p className="text-muted-foreground text-sm">
        Get started by editing{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">
          apps/website/app/page.tsx
        </code>
      </p>
      <Button>Get started</Button>
    </main>
  );
}
