"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@repo/ui/components/reusables/table/data-table";
import useTableFilter from "@repo/ui/components/reusables/table/data-table/hooks/useTableFilter";
import { Button } from "@repo/ui/components/button";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Sita Rai",
    email: "sita@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Ram Sharma",
    email: "ram@example.com",
    role: "Editor",
    status: "active",
  },
  {
    id: "3",
    name: "Gita KC",
    email: "gita@example.com",
    role: "Viewer",
    status: "inactive",
  },
  {
    id: "4",
    name: "Hari Thapa",
    email: "hari@example.com",
    role: "Editor",
    status: "active",
  },
  {
    id: "5",
    name: "Maya Gurung",
    email: "maya@example.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "6",
    name: "Bikash Lama",
    email: "bikash@example.com",
    role: "Viewer",
    status: "inactive",
  },
  {
    id: "7",
    name: "Anita Shrestha",
    email: "anita@example.com",
    role: "Editor",
    status: "active",
  },
  {
    id: "8",
    name: "Prakash Raz",
    email: "prakash@example.com",
    role: "Admin",
    status: "active",
  },
];

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: User } }) => (
      <span
        className={
          row.original.status === "active"
            ? "text-emerald-600"
            : "text-muted-foreground"
        }
      >
        {row.original.status}
      </span>
    ),
  },
];

export function DataTableDemo() {
  const [variant, setVariant] = useState<"basic" | "loading" | "filtered">(
    "basic",
  );
  const { tableFilter } = useTableFilter({
    dateFilter: false,
    initial: { take: 5 },
    customFilters: [
      {
        label: "Role",
        type: "select",
        dbKey: "role",
        placeholder: "All roles",
        options: [
          { label: "Admin", value: "admin" },
          { label: "Editor", value: "editor" },
          { label: "Viewer", value: "viewer" },
        ],
      },
    ],
  });

  const filteredData = useMemo(() => {
    const query = tableFilter.debouncedSearchQuery?.toLowerCase() ?? "";
    const roleFilter = tableFilter.customFilters?.[0]?.value?.toLowerCase();

    return SAMPLE_USERS.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = !roleFilter || user.role.toLowerCase() === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [tableFilter.debouncedSearchQuery, tableFilter.customFilters]);

  const pagedData = useMemo(() => {
    const page = tableFilter.page ?? 0;
    const take = tableFilter.take ?? 5;
    const start = page * take;
    return filteredData.slice(start, start + take);
  }, [filteredData, tableFilter.page, tableFilter.take]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["basic", "Basic"],
            ["loading", "Loading"],
            ["filtered", "With filters"],
          ] as const
        ).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={variant === key ? "default" : "outline"}
            onClick={() => setVariant(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {variant === "basic" && (
        <DataTable
          title="Users"
          data={SAMPLE_USERS.slice(0, 5)}
          columns={columns}
          opts={{
            enableSorting: true,
            enablePagination: true,
            defaultPageSize: 5,
          }}
        />
      )}

      {variant === "loading" && (
        <DataTable
          title="Users"
          data={[]}
          columns={columns}
          opts={{ loading: true, skeletonRows: 5, enablePagination: false }}
        />
      )}

      {variant === "filtered" && (
        <DataTable
          title="Users"
          data={pagedData}
          columns={columns}
          tableFilter={tableFilter}
          paginationData={{
            total: filteredData.length,
            previousPage:
              (tableFilter.page ?? 0) > 0 ? (tableFilter.page ?? 0) - 1 : null,
            nextPage:
              ((tableFilter.page ?? 0) + 1) * (tableFilter.take ?? 5) <
              filteredData.length
                ? (tableFilter.page ?? 0) + 1
                : null,
          }}
          opts={{
            enableSorting: true,
            enablePagination: true,
            defaultPageSize: 5,
          }}
          actionButtons={[
            { label: "Add user", onClick: () => undefined, variant: "default" },
          ]}
        />
      )}
    </div>
  );
}

export function DataTableLoadingDemo() {
  return (
    <DataTable
      title="Users"
      data={[]}
      columns={columns}
      opts={{ loading: true, skeletonRows: 5 }}
    />
  );
}

export function DataTableFilteredDemo() {
  const { tableFilter } = useTableFilter({ initial: { take: 5 } });

  return (
    <DataTable
      title="Users"
      data={SAMPLE_USERS.slice(0, 5)}
      columns={columns}
      tableFilter={tableFilter}
      paginationData={{
        total: SAMPLE_USERS.length,
        previousPage: null,
        nextPage: 1,
      }}
      opts={{ enableSorting: true }}
    />
  );
}
