"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

export function TabsDemo() {
  return (
    <Tabs defaultValue="overview" className="max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-muted-foreground text-sm">
        Overview content for the component preview.
      </TabsContent>
      <TabsContent value="analytics" className="text-muted-foreground text-sm">
        Analytics content for the component preview.
      </TabsContent>
      <TabsContent value="settings" className="text-muted-foreground text-sm">
        Settings content for the component preview.
      </TabsContent>
    </Tabs>
  );
}
