"use client";

import { Textarea } from "@repo/ui/components/textarea";

export function TextareaDemo() {
  return (
    <Textarea
      className="max-w-md"
      placeholder="Write your message..."
      rows={4}
    />
  );
}
