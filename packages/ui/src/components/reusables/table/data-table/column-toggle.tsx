import { Table } from "@tanstack/react-table";
import { Check, MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/button";

function ColumnToggleMenu<TData>({ table }: { table: Table<TData> }) {
  const toggleableColumns = table
    .getAllLeafColumns()
    .filter((col) => col.getCanHide());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 rounded-sm text-sm"
          aria-label="Toggle column visibility"
        >
          <MoreHorizontal />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="max-w-fit min-w-40 p-0">
        {toggleableColumns.map((column) => {
          const isVisible = column.getIsVisible();
          return (
            <button
              key={column.id}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => column.toggleVisibility()}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded border",
                  isVisible
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white",
                )}
              >
                {isVisible && <Check className="h-3 w-3" />}
              </span>
              {typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

export default ColumnToggleMenu;
