"use client";

import { BadgeSelector } from "@repo/ui/components/badge-selector";

const options = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Closed", value: "closed" },
];

export function BadgeSelectorDemo() {
  return (
    <BadgeSelector
      options={options}
      defaultValue="active"
      variant="blue"
      onChange={() => undefined}
    />
  );
}
