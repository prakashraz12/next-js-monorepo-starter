"use client";

import { DataTable } from "@repo/ui/components/reusables/table/data-table";
import useTableFilter from "@repo/ui/components/reusables/table/data-table/hooks/useTableFilter";

type Row = { id: string; item: string; amount: number };

const data: Row[] = [
  { id: "1", item: "Invoice #101", amount: 1200 },
  { id: "2", item: "Invoice #102", amount: 850 },
  { id: "3", item: "Invoice #103", amount: 2400 },
];

const columns = [
  { accessorKey: "item", header: "Item" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }: { row: { original: Row } }) =>
      `Rs. ${row.original.amount.toLocaleString()}`,
  },
];

export function UseTableFilterDemo() {
  const { tableFilter, queryParams } = useTableFilter({
    dateFilter: true,
    initial: { take: 10 },
  });

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted/40 rounded-lg border border-border p-4">
        <p className="mb-2 text-xs font-medium">Generated query params</p>
        <pre className="text-muted-foreground overflow-x-auto font-mono text-xs">
          {JSON.stringify(queryParams, null, 2)}
        </pre>
      </div>
      <DataTable
        title="Orders"
        data={data}
        columns={columns}
        tableFilter={tableFilter}
        opts={{ enablePagination: false }}
      />
    </div>
  );
}
