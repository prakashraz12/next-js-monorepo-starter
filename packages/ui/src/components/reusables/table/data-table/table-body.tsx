import { ColumnDef, flexRender, type Table } from "@tanstack/react-table";
import { cn } from "@repo/ui/lib/utils";
import {
  TableBody as SHTableBody,
  TableRow,
  TableCell,
} from "@repo/ui/components/table";
import {
  getLeadingBodyStickyClass,
  getRowSurfaceClass,
  getTrailingBodyStickyClass,
  isLeadingStickyColumn,
  isTrailingStickyColumn,
} from "./sticky-columns";

type TableBodyProps<TData> = {
  table: Table<TData>;
  allColumns: ColumnDef<TData, unknown>[];
  striped: boolean;
  dense?: boolean;
  onRowClick?: (t: TData) => void;
};

const TableBody = <TData,>({
  table,
  allColumns,
  striped,
  dense,
  onRowClick,
}: TableBodyProps<TData>) => {
  return (
    <SHTableBody className="divide-y divide-border bg-background">
      {table.getRowModel().rows.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={allColumns.length}
            className="py-16 text-center text-muted-foreground"
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                />
              </svg>
              <span className="text-sm">No rows to display</span>
            </div>
          </TableCell>
        </TableRow>
      ) : (
        table.getRowModel().rows.map((row, i) => {
          const isSelected = row.getIsSelected();
          const rowSurfaceClass = getRowSurfaceClass({
            striped,
            rowIndex: i,
            isSelected,
          });

          return (
            <TableRow
              key={row.id}
              data-state={isSelected ? "selected" : undefined}
              onClick={(e) => {
                e.stopPropagation();
                onRowClick?.(row.original);
              }}
              className={cn("group transition-colors", rowSurfaceClass)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    "truncate px-4 text-sm text-foreground",
                    dense ? "py-1.5" : "py-3",
                    rowSurfaceClass,
                    isLeadingStickyColumn(cell.column.id) &&
                      getLeadingBodyStickyClass(),
                    (cell.column.getIsPinned() === "right" ||
                      isTrailingStickyColumn(cell.column.id)) &&
                      getTrailingBodyStickyClass(),
                    cell.column.getIsPinned() === "left" &&
                      !isLeadingStickyColumn(cell.column.id) &&
                      cn("sticky left-0 z-10", rowSurfaceClass),
                  )}
                  style={{ width: cell.column.getSize() }}
                >
                  {cell.getIsGrouped() ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        row.getToggleExpandedHandler()();
                      }}
                      className="flex items-center gap-1 font-semibold text-primary"
                    >
                      {row.getIsExpanded() ? "▼" : "▶"}{" "}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}{" "}
                      <span className="font-normal text-muted-foreground">
                        ({row.subRows.length})
                      </span>
                    </button>
                  ) : cell.getIsAggregated() ? (
                    flexRender(
                      cell.column.columnDef.aggregatedCell ??
                        cell.column.columnDef.cell,
                      cell.getContext(),
                    )
                  ) : cell.getIsPlaceholder() ? null : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          );
        })
      )}
    </SHTableBody>
  );
};

export default TableBody;
