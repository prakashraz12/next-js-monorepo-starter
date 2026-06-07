"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Switch } from "@repo/ui/components/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { BadgeSelector } from "@repo/ui/components/badge-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

export function PlaygroundPreview() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          Buttons
        </p>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button isLoading>Loading</Button>
        </div>
      </section>

      <section>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          Form controls
        </p>
        <div className="grid max-w-md gap-4">
          <Input placeholder="Email address" />
          <Select defaultValue="option-1">
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option-1">Option one</SelectItem>
              <SelectItem value="option-2">Option two</SelectItem>
              <SelectItem value="option-3">Option three</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Checkbox
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch defaultChecked />
              Switch
            </label>
          </div>
        </div>
      </section>

      <section>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          Badge selector
        </p>
        <BadgeSelector
          options={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
          ]}
          defaultValue="all"
        />
      </section>

      <section>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
          Card
        </p>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Theme preview</CardTitle>
            <CardDescription>
              Components update live as you change palette and radius.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Primary buttons, focus rings, and rounded corners all reflect your
              selections.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
