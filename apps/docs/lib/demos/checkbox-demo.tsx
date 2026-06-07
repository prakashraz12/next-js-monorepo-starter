"use client";

import { Checkbox } from "@repo/ui/components/checkbox";

export function CheckboxDemo() {
  return (
    <div className="flex items-center gap-6">
      <label className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked />
        Checked
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox />
        Unchecked
      </label>
      <label className="flex items-center gap-2 text-sm opacity-50">
        <Checkbox disabled />
        Disabled
      </label>
    </div>
  );
}
