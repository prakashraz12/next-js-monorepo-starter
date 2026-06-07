import type { ComponentType } from "react";

export type PropDefinition = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: string;
};

export type GuideSection = {
  title: string;
  content: string;
};

export type UsageExample = {
  title: string;
  description?: string;
  code: string;
};

export type DocExample = {
  title: string;
  description?: string;
  Demo: ComponentType;
};

export type ComponentDoc = {
  slug: string;
  name: string;
  description: string;
  category: string;
  importPath: string;
  exportName?: string;
  kind?: "component" | "hook";
  props: PropDefinition[];
  Demo: ComponentType;
  guide?: GuideSection[];
  usage?: UsageExample[];
  examples?: DocExample[];
  notes?: string[];
};
