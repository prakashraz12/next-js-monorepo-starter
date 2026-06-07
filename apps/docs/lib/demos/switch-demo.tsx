"use client";

import { Switch } from "@repo/ui/components/switch";

export function SwitchDemo() {
  return (
    <div className="flex items-center gap-6">
      <label className="flex items-center gap-2 text-sm">
        <Switch defaultChecked />
        On
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Switch />
        Off
      </label>
      <label className="flex items-center gap-2 text-sm opacity-50">
        <Switch disabled />
        Disabled
      </label>
    </div>
  );
}
