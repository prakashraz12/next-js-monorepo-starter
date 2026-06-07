import type { ComponentDoc } from "./types";
import { BadgeSelectorDemo } from "./demos/badge-selector-demo";
import { ButtonDemo } from "./demos/button-demo";
import { CardDemo } from "./demos/card-demo";
import { CheckboxDemo } from "./demos/checkbox-demo";
import { InputDemo } from "./demos/input-demo";
import { SelectDemo } from "./demos/select-demo";
import { SwitchDemo } from "./demos/switch-demo";
import { TabsDemo } from "./demos/tabs-demo";
import { TextareaDemo } from "./demos/textarea-demo";
import { AvatarDemo } from "./demos/avatar-demo";
import { TooltipDemo } from "./demos/tooltip-demo";
import {
  DataTableDemo,
  DataTableLoadingDemo,
  DataTableFilteredDemo,
} from "./demos/data-table-demo";
import { ModalDemo } from "./demos/modal-demo";
import { SheetDemo } from "./demos/sheet-demo";
import { UseTableFilterDemo } from "./demos/use-table-filter-demo";

export const componentRegistry: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    category: "Form",
    description: "Triggers an action or event when clicked.",
    importPath: "@repo/ui/components/button",
    Demo: ButtonDemo,
    props: [
      {
        name: "variant",
        type: `"default" | "secondary" | "outline" | "ghost" | "destructive" | "link" | "success" | "danger"`,
        default: "default",
        description: "Visual style of the button.",
      },
      {
        name: "size",
        type: `"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"`,
        default: "default",
        description: "Controls padding and height.",
      },
      {
        name: "isLoading",
        type: "boolean",
        default: "false",
        description: "Shows a spinner and disables the button.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Merge props onto the child element.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Prevents user interaction.",
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "Form",
    description: "Text field for collecting user input.",
    importPath: "@repo/ui/components/input",
    Demo: InputDemo,
    props: [
      {
        name: "type",
        type: "string",
        default: "text",
        description: "Native input type attribute.",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Hint shown when empty.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the input.",
      },
      {
        name: "aria-invalid",
        type: "boolean",
        description: "Applies error styling.",
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Form",
    description: "Multi-line text input.",
    importPath: "@repo/ui/components/textarea",
    Demo: TextareaDemo,
    props: [
      {
        name: "placeholder",
        type: "string",
        description: "Hint shown when empty.",
      },
      {
        name: "rows",
        type: "number",
        description: "Visible number of text lines.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the textarea.",
      },
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Form",
    description: "Binary choice control.",
    importPath: "@repo/ui/components/checkbox",
    Demo: CheckboxDemo,
    props: [
      {
        name: "checked",
        type: "boolean",
        description: "Controlled checked state.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "Initial checked state (uncontrolled).",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Prevents interaction.",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Called when the value changes.",
      },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Form",
    description: "Toggle between on and off states.",
    importPath: "@repo/ui/components/switch",
    Demo: SwitchDemo,
    props: [
      {
        name: "size",
        type: `"default" | "sm"`,
        default: "default",
        description: "Size of the switch track.",
      },
      {
        name: "checked",
        type: "boolean",
        description: "Controlled checked state.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description: "Initial checked state (uncontrolled).",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Prevents interaction.",
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "Form",
    description: "Dropdown for choosing one option from a list.",
    importPath: "@repo/ui/components/select",
    Demo: SelectDemo,
    props: [
      {
        name: "value",
        type: "string",
        description: "Controlled selected value.",
      },
      {
        name: "defaultValue",
        type: "string",
        description: "Initial value (uncontrolled).",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Called when selection changes.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disables the select.",
      },
    ],
  },
  {
    slug: "badge-selector",
    name: "Badge Selector",
    category: "Form",
    description: "Selectable badge group for filters or segmented choices.",
    importPath: "@repo/ui/components/badge-selector",
    Demo: BadgeSelectorDemo,
    props: [
      {
        name: "options",
        type: "BadgeOption[]",
        required: true,
        description: "List of selectable badge items.",
      },
      {
        name: "value",
        type: "string | string[]",
        description: "Controlled selected value(s).",
      },
      {
        name: "multiple",
        type: "boolean",
        default: "false",
        description: "Allow multiple selections.",
      },
      {
        name: "variant",
        type: "BadgeVariant",
        default: "default",
        description: "Color variant for badges.",
      },
      {
        name: "onChange",
        type: "(value: string | string[] | null) => void",
        description: "Called when selection changes.",
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    category: "Display",
    description: "Container for grouped content with header, body, and footer.",
    importPath: "@repo/ui/components/card",
    Demo: CardDemo,
    props: [
      {
        name: "size",
        type: `"default" | "sm"`,
        default: "default",
        description: "Controls internal spacing.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Display",
    description: "Displays a user profile image with fallback initials.",
    importPath: "@repo/ui/components/avatar",
    Demo: AvatarDemo,
    props: [
      {
        name: "name",
        type: "string",
        description: "Display name used for initials fallback.",
      },
      {
        name: "src",
        type: "string",
        description: "Optional image URL.",
      },
      {
        name: "size",
        type: "string",
        default: "40px",
        description: "Width and height of the avatar.",
      },
      {
        name: "shape",
        type: `"rounded" | "radius-md"`,
        default: "radius-md",
        description: "Border radius style.",
      },
      {
        name: "bg",
        type: "string",
        description: "Background color for initials fallback.",
      },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Navigation",
    description: "Organize content into switchable panels.",
    importPath: "@repo/ui/components/tabs",
    Demo: TabsDemo,
    props: [
      {
        name: "defaultValue",
        type: "string",
        description: "Initially active tab (uncontrolled).",
      },
      {
        name: "value",
        type: "string",
        description: "Active tab (controlled).",
      },
      {
        name: "orientation",
        type: `"horizontal" | "vertical"`,
        default: "horizontal",
        description: "Layout direction of the tab list.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Called when the active tab changes.",
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Overlay",
    description: "Contextual label shown on hover or focus.",
    importPath: "@repo/ui/components/tooltip",
    Demo: TooltipDemo,
    props: [
      {
        name: "delayDuration",
        type: "number",
        default: "0",
        description: "Delay before opening (TooltipProvider).",
      },
      {
        name: "side",
        type: `"top" | "right" | "bottom" | "left"`,
        default: "top",
        description: "Preferred side of the trigger.",
      },
      {
        name: "align",
        type: `"start" | "center" | "end"`,
        default: "center",
        description: "Alignment along the side.",
      },
    ],
  },
  {
    slug: "data-table",
    name: "DataTable",
    category: "Data",
    description:
      "Full-featured data table built on TanStack Table with sorting, pagination, search, filters, row actions, and loading skeletons.",
    importPath: "@repo/ui/components/reusables/table/data-table",
    exportName: "DataTable",
    Demo: DataTableDemo,
    guide: [
      {
        title: "1. Define columns",
        content:
          "Create ColumnDef[] with accessorKey or custom cell renderers. Import ColumnDef from @tanstack/react-table.",
      },
      {
        title: "2. Pass data and options",
        content:
          "Provide your row data array and enable features via opts (sorting, pagination, row selection, etc.). For server-side lists, pass paginationData from your API response.",
      },
      {
        title: "3. Wire up filters (optional)",
        content:
          "Use the useTableFilter hook to manage page, take, search, date range, and custom filters. Pass the returned tableFilter object to DataTable.",
      },
      {
        title: "4. Show loading state",
        content:
          "Set opts.loading = true while fetching. The table renders skeleton rows automatically — no need to swap components.",
      },
    ],
    usage: [
      {
        title: "Basic table",
        code: `import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui/components/reusables/table/data-table";

type User = { id: string; name: string; email: string };

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
];

<DataTable
  title="Users"
  data={users}
  columns={columns}
  opts={{ enableSorting: true, enablePagination: true }}
/>`,
      },
      {
        title: "Loading skeleton",
        description: "Use while data is being fetched from your API.",
        code: `<DataTable
  title="Users"
  data={[]}
  columns={columns}
  opts={{ loading: true, skeletonRows: 8 }}
/>`,
      },
      {
        title: "Server-side pagination",
        code: `const { tableFilter, queryParams } = useTableFilter();

// fetch with queryParams, then:
<DataTable
  data={response.results}
  columns={columns}
  tableFilter={tableFilter}
  paginationData={{
    total: response.total,
    previousPage: response.previousPage,
    nextPage: response.nextPage,
  }}
/>`,
      },
    ],
    examples: [
      {
        title: "Loading state",
        description: "Skeleton rows appear when opts.loading is true.",
        Demo: DataTableLoadingDemo,
      },
      {
        title: "With useTableFilter",
        description: "Search and pagination state managed by the hook.",
        Demo: DataTableFilteredDemo,
      },
    ],
    notes: [
      "Pass tableFilter from useTableFilter to enable search, date range, and custom filter UI.",
      "Set opts.loading = true during fetch — the preview above has a Loading tab to try it.",
      "Row actions appear when you pass an actions array; action buttons go in actionButtons.",
      "For server-side data, always pass paginationData alongside tableFilter.",
    ],
    props: [
      {
        name: "data",
        type: "TData[]",
        required: true,
        description: "Array of row objects to display.",
      },
      {
        name: "columns",
        type: "ColumnDef<TData>[]",
        required: true,
        description: "TanStack Table column definitions.",
      },
      {
        name: "tableFilter",
        type: "TFilterProps",
        description: "Filter/pagination state from useTableFilter.",
      },
      {
        name: "paginationData",
        type: "{ total?, previousPage?, nextPage?, count? }",
        description: "Server-side pagination metadata from your API.",
      },
      {
        name: "opts.loading",
        type: "boolean",
        default: "false",
        description: "Shows skeleton rows instead of data.",
      },
      {
        name: "opts.skeletonRows",
        type: "number",
        default: "10",
        description: "Number of skeleton rows when loading.",
      },
      {
        name: "opts.enableSorting",
        type: "boolean",
        default: "false",
        description: "Enable column sorting.",
      },
      {
        name: "opts.enablePagination",
        type: "boolean",
        default: "true",
        description: "Show pagination controls.",
      },
      {
        name: "opts.enableRowSelection",
        type: "boolean",
        default: "false",
        description: "Adds checkbox column with S.N.",
      },
      {
        name: "opts.dateFilter",
        type: "boolean",
        default: "false",
        description: "Show date range filter (requires tableFilter setters).",
      },
      {
        name: "actions",
        type: "{ label, onClick, icon?, variant? }[]",
        description: "Per-row action menu items.",
      },
      {
        name: "actionButtons",
        type: "{ label, onClick, icon?, variant? }[]",
        description: "Toolbar buttons above the table.",
      },
      {
        name: "title",
        type: "string",
        description: "Table heading shown in the toolbar.",
      },
      {
        name: "onRowClick",
        type: "(row: TData) => void",
        description: "Called when a row is clicked.",
      },
    ],
  },
  {
    slug: "use-table-filter",
    name: "useTableFilter",
    category: "Hooks",
    kind: "hook",
    description:
      "Manages table filter state — page, page size, debounced search, date range, and declarative custom filters. Returns queryParams ready for your API.",
    importPath:
      "@repo/ui/components/reusables/table/data-table/hooks/useTableFilter",
    exportName: "useTableFilter",
    Demo: UseTableFilterDemo,
    guide: [
      {
        title: "Quick start",
        content:
          "Call useTableFilter() at the top of your list page. Destructure tableFilter and queryParams. Pass tableFilter to DataTable and use queryParams in your fetch call.",
      },
      {
        title: "Custom filters",
        content:
          'Define customFilters with type "select" or "async". Each filter uses a dbKey that becomes a query param sent to your API.',
      },
    ],
    usage: [
      {
        title: "Basic usage",
        code: `import useTableFilter from "@repo/ui/components/reusables/table/data-table/hooks/useTableFilter";
import { DataTable } from "@repo/ui/components/reusables/table/data-table";

const { tableFilter, queryParams } = useTableFilter({
  dateFilter: true,
  initial: { take: 20 },
});

// use queryParams in your API call
const { data } = useQuery({
  queryKey: ["users", queryParams],
  queryFn: () => fetchUsers(queryParams),
});

<DataTable
  data={data.results}
  columns={columns}
  tableFilter={tableFilter}
  paginationData={data.pagination}
/>`,
      },
      {
        title: "With select filter",
        code: `const { tableFilter, queryParams } = useTableFilter({
  customFilters: [
    {
      label: "Status",
      type: "select",
      dbKey: "status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ],
});`,
      },
    ],
    notes: [
      "queryParams is debounced for search — safe to pass directly to React Query.",
      "Changing any filter automatically resets page to 0.",
      "Date filter requires dateFilter: true and uses THIS_MONTH as the default preset.",
    ],
    props: [
      {
        name: "dateFilter",
        type: "boolean",
        default: "false",
        description: "Enable date range filter state.",
      },
      {
        name: "defaultDatePreset",
        type: "DateFilterPreset",
        default: "THIS_MONTH",
        description: "Initial date range when dateFilter is enabled.",
      },
      {
        name: "initial",
        type: "{ page?, take?, searchQuery?, startDate?, endDate? }",
        description: "Override default filter values.",
      },
      {
        name: "customFilters",
        type: "CustomFilterDefinition[]",
        description: "Declarative select or async filters.",
      },
      {
        name: "tableFilter",
        type: "TFilterProps",
        description: "Return value — pass to DataTable.",
      },
      {
        name: "queryParams",
        type: "TTableQueryParams",
        description: "Return value — pass to your API fetcher.",
      },
    ],
  },
  {
    slug: "modal",
    name: "Modal",
    category: "Overlay",
    description:
      "Dialog wrapper that injects a close callback into child components. Ideal for forms and confirmations.",
    importPath: "@repo/ui/components/reusables/global/modal",
    exportName: "ModalProvider",
    Demo: ModalDemo,
    usage: [
      {
        title: "Controlled modal",
        code: `import ModalProvider from "@repo/ui/components/reusables/global/modal";

const [open, setOpen] = useState(false);

<ModalProvider open={open} onOpenChange={setOpen} title="Edit user">
  <EditUserForm />
</ModalProvider>

// Child receives close prop automatically:
function EditUserForm({ close }: { close?: () => void }) {
  return <Button onClick={close}>Cancel</Button>;
}`,
      },
    ],
    notes: [
      "Children receive a close() prop via React.cloneElement.",
      "Set noExit to prevent closing via overlay click or Escape.",
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        required: true,
        description: "Controls visibility.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        required: true,
        description: "Called when open state should change.",
      },
      {
        name: "title",
        type: "string",
        description: "Dialog title.",
      },
      {
        name: "noExit",
        type: "boolean",
        default: "false",
        description: "Prevent closing via overlay or Escape.",
      },
      {
        name: "containerClassName",
        type: "string",
        description: "Extra classes on DialogContent.",
      },
    ],
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "Overlay",
    description:
      "Slide-over panel for secondary flows — filters, detail views, or mobile-friendly forms.",
    importPath: "@repo/ui/components/reusables/global/sheet",
    exportName: "SheetProvider",
    Demo: SheetDemo,
    usage: [
      {
        title: "Right-side sheet",
        code: `import SheetProvider from "@repo/ui/components/reusables/global/sheet";

<SheetProvider
  open={open}
  onOpenChange={setOpen}
  title="Filters"
  openFrom="right"
>
  <FilterForm />
</SheetProvider>`,
      },
    ],
    notes: [
      "Children receive a close() prop, same as Modal.",
      "openFrom accepts top, bottom, left, or right.",
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        required: true,
        description: "Controls visibility.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        required: true,
        description: "Called when open state should change.",
      },
      {
        name: "title",
        type: "string",
        description: "Sheet title (sr-only).",
      },
      {
        name: "openFrom",
        type: `"top" | "bottom" | "left" | "right"`,
        default: "right",
        description: "Edge the sheet slides in from.",
      },
      {
        name: "noExit",
        type: "boolean",
        default: "false",
        description: "Prevent closing via overlay or Escape.",
      },
    ],
  },
];

export function getComponentBySlug(slug: string) {
  return componentRegistry.find((component) => component.slug === slug);
}

export function getCategories() {
  const categories = new Map<string, ComponentDoc[]>();

  for (const component of componentRegistry) {
    const list = categories.get(component.category) ?? [];
    list.push(component);
    categories.set(component.category, list);
  }

  return Array.from(categories.entries()).sort(([a], [b]) =>
    a.localeCompare(b),
  );
}
