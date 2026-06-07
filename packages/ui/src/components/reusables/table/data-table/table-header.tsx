import { Column, flexRender, Table } from "@tanstack/react-table";
import { cn } from "@repo/ui/lib/utils";
import { ChevronDown, ChevronUp, Pin, PinOff, Group } from "lucide-react";
import {
  TableHeader as SHTableHeader,
  TableRow,
  TableHead,
} from "@repo/ui/components/table";
import {
  getLeadingHeaderStickyClass,
  getTrailingStickyClass,
  isLeadingStickyColumn,
  isTrailingStickyColumn,
  stickyHeaderTopClass,
} from "./sticky-columns";

function SortIcon<TData>({ column }: { column: Column<TData, unknown> }) {
  if (!column.getCanSort()) return null;
  const sorted = column.getIsSorted();
  return (
    <span className="ml-1 inline-flex flex-col leading-none select-none">
      <ChevronUp
        className={cn(
          "size-3",
          sorted === "asc" ? "text-primary" : "text-muted-foreground/40",
        )}
      />
      <ChevronDown
        className={cn(
          "size-3",
          sorted === "desc" ? "text-primary" : "text-muted-foreground/40",
        )}
      />
    </span>
  );
}

function TableHeader<TData>({
  stickyHeader,
  table,
  dense,
  enableGrouping,
  enableColumnPinning,
}: {
  stickyHeader: boolean;
  table: Table<TData>;
  dense: boolean;
  enableGrouping: boolean;
  enableColumnPinning: boolean;
}) {
  return (
    <SHTableHeader
      className={cn("text-muted-foreground", !stickyHeader && "bg-muted/50")}
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className={cn(!stickyHeader && "border-b border-border")}
        >
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                "group relative px-4 text-left text-sm font-medium whitespace-nowrap text-foreground",
                dense ? "py-2" : "py-3",
                header.column.getCanSort() &&
                  "cursor-pointer transition-colors select-none hover:bg-accent/60",
                stickyHeader &&
                  !isLeadingStickyColumn(header.column.id) &&
                  !isTrailingStickyColumn(header.column.id) &&
                  header.column.getIsPinned() !== "right" &&
                  stickyHeaderTopClass,
                isLeadingStickyColumn(header.column.id) &&
                  getLeadingHeaderStickyClass(stickyHeader),
                (header.column.getIsPinned() === "right" ||
                  isTrailingStickyColumn(header.column.id)) &&
                  getTrailingStickyClass(stickyHeader),
                header.column.getIsPinned() === "left" &&
                  !isLeadingStickyColumn(header.column.id) &&
                  cn(
                    "sticky left-0 z-10 bg-muted",
                    stickyHeader && "sticky top-0 z-20 border-b border-border",
                  ),
              )}
              onClick={header.column.getToggleSortingHandler()}
              aria-sort={
                header.column.getIsSorted() === "asc"
                  ? "ascending"
                  : header.column.getIsSorted() === "desc"
                    ? "descending"
                    : undefined
              }
            >
              {header.isPlaceholder ? null : (
                <div className="flex items-center gap-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}

                  <SortIcon column={header.column} />

                  {enableGrouping && header.column.getCanGroup() && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        header.column.getToggleGroupingHandler()();
                      }}
                      className="ml-1 text-muted-foreground/50 opacity-0 transition-colors group-hover:opacity-100 hover:text-primary"
                      title="Group by this column"
                      aria-label={`Group by ${header.id}`}
                    >
                      <Group className="size-3.5" />
                    </button>
                  )}

                  {enableColumnPinning && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const pinned = header.column.getIsPinned();
                        header.column.pin(pinned ? false : "left");
                      }}
                      className="ml-1 text-muted-foreground/50 opacity-0 transition-colors group-hover:opacity-100 hover:text-primary"
                      title={
                        header.column.getIsPinned()
                          ? "Unpin column"
                          : "Pin column"
                      }
                      aria-label={`Pin ${header.id}`}
                    >
                      {header.column.getIsPinned() ? (
                        <PinOff className="size-3.5" />
                      ) : (
                        <Pin className="size-3.5" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </SHTableHeader>
  );
}

export default TableHeader;
