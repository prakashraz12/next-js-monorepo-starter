"use client";
import { useState, useMemo } from "react";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type GroupingState,
  type ExpandedState,
  type ColumnPinningState,
  type FilterFn,
  type Table,
  type Row,
  type PaginationState,
  type Updater,
  type OnChangeFn,
} from "@tanstack/react-table";
import { X, MoreHorizontal, Search, Filter } from "lucide-react";
import TableHeader from "./table-header";
import TableBody from "./table-body";
import { Button } from "@repo/ui/components/button";
import TablePagination from "./table-pagination";
import { TFilterProps } from "./types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Table as SHTable } from "@repo/ui/components/table";
import ColumnToggleMenu from "./column-toggle";
import TableFilterContainer from "./components/filter-container";

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

const fuzzyFilter: FilterFn<unknown> = (row, columnId, value, addMeta) => {
  const match = String(row.getValue(columnId) ?? "")
    .toLowerCase()
    .includes(String(value).toLowerCase());
  addMeta({ itemRank: match });
  return match;
};

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: boolean;
  }
}

function IndeterminateCheckbox({
  checked,
  disabled,
  indeterminate = false,
  onChange,
  "aria-label": ariaLabel,
}: {
  checked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
}) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : checked}
      disabled={disabled}
      onCheckedChange={(state) =>
        onChange?.({
          target: { checked: state === true },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      aria-label={ariaLabel}
    />
  );
}

function SkeletonRows({
  columnCount,
  rowCount = 10,
  dense,
}: {
  columnCount: number;
  rowCount?: number;
  dense?: boolean;
}) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <tr key={rowIdx} className="border-b border-border">
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <td key={colIdx} className={cn("px-3", dense ? "py-1.5" : "py-3")}>
              <div
                className="h-8 animate-pulse rounded bg-muted"
                style={{
                  width: `${55 + ((rowIdx * 7 + colIdx * 13) % 35)}%`,
                  animationDelay: `${(rowIdx * columnCount + colIdx) * 40}ms`,
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export interface DataTableOptions<TData> {
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableGrouping?: boolean;
  enableColumnPinning?: boolean;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  onSortingChange?: (sorting: SortingState) => void;
  className?: string;
  stickyHeader?: boolean;
  striped?: boolean;
  dense?: boolean;
  caption?: string;
  selectionActions?: React.ReactNode;
  loading?: boolean;
  skeletonRows?: number;
  searchPlaceholder?: string;
  /** When true, shows the date range filter (default: this month) */
  dateFilter?: boolean;
}

type TAction<T> = {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: "danger" | "default";
};
export interface DataTableProps<TData extends object> {
  data: TData[];
  paginationData?:
    | {
        previousPage?: number | null;
        nextPage?: number | null;
        total?: number;
        count?: number;
      }
    | undefined;
  columns: ColumnDef<TData, unknown>[];
  opts?: DataTableOptions<TData>;
  tableFilter?: TFilterProps;
  actions?: TAction<TData>[];
  title?: string;
  actionButtons?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    variant?: "default" | "destructive" | "success";
  }[];
  onRowClick?: (t: TData) => void;
}

export function DataTable<TData extends object>({
  data = [] as TData[],
  paginationData,
  columns = [],
  tableFilter,
  opts = {},
  actions,
  actionButtons,
  title,
  onRowClick,
}: DataTableProps<TData>) {
  const {
    enableSorting = false,
    enablePagination = true,
    enableRowSelection = false,
    enableGrouping = false,
    enableColumnPinning = false,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    onRowSelectionChange,
    onSortingChange,
    className = "",
    stickyHeader = false,
    striped = false,
    dense = false,
    caption,
    selectionActions,
    loading = false,
    skeletonRows = 10,
    dateFilter: dateFilterOpt = false,
  } = opts;

  const showDateFilter =
    (tableFilter?.config?.dateFilter ?? dateFilterOpt) &&
    Boolean(tableFilter?.setStartDate && tableFilter?.setEndDate);

  const hasCustomFilters = (tableFilter?.customFilters?.length ?? 0) > 0;
  const showFiltersPanel = showDateFilter || hasCustomFilters;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const pageSize = tableFilter?.take ?? defaultPageSize;

  const allColumns = useMemo<ColumnDef<TData, unknown>[]>(() => {
    if (!enableRowSelection) return columns;

    const selectSnCol: ColumnDef<TData, unknown> = {
      id: "select-sn",
      header: ({ table }: { table: Table<TData> }) => (
        <div className="flex items-center gap-2">
          <IndeterminateCheckbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all rows"
          />
          <span className="text-sm font-medium">S.N</span>
        </div>
      ),
      cell: ({ row }: { row: Row<TData> }) => (
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
            aria-label="Select row"
          />
          <span className="min-w-[1.25rem] text-center text-sm tabular-nums">
            {(tableFilter?.page || 0) * pageSize + row.index + 1}
          </span>
        </div>
      ),
      size: 20,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
    };

    const actionCol: ColumnDef<TData, unknown> = {
      id: "action",
      header: "",
      cell: ({ row }: { row: Row<TData> }) => {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="border-none shadow-none"
                onClick={(e) => e.stopPropagation()}
                variant="ghost"
                size="icon"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-1" align="end">
              <div className="flex flex-col gap-0.5">
                {actions?.map((action) => (
                  <button
                    key={action.label}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row.original);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-left font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      action.variant === "danger" &&
                        "text-destructive hover:text-destructive/80",
                    )}
                  >
                    {action.icon && action.icon}
                    <span className="text-[13px]">{action.label}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        );
      },
      size: 100,
      enableSorting: false,
      enableResizing: false,
      enableHiding: false,
    };

    return [selectSnCol, ...columns, ...(actions?.length ? [actionCol] : [])];
  }, [columns, enableRowSelection, tableFilter?.page, pageSize]);

  const table = useReactTable<TData>({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      grouping,
      expanded,
      columnPinning,
      globalFilter,
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    onColumnVisibilityChange:
      setColumnVisibility as OnChangeFn<VisibilityState>,
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onRowSelectionChange) {
        const selectedRows = Object.keys(next)
          .filter((k) => next[k])
          .map((k) => data[parseInt(k, 10)])
          .filter((row): row is TData => row !== undefined);
        onRowSelectionChange(selectedRows);
      }
    },
    onGroupingChange: setGrouping as OnChangeFn<GroupingState>,
    onExpandedChange: setExpanded as OnChangeFn<ExpandedState>,
    onColumnPinningChange: setColumnPinning as OnChangeFn<ColumnPinningState>,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getExpandedRowModel: getExpandedRowModel(),
    enableSorting,
    enableRowSelection,
    columnResizeMode: "onChange",
    globalFilterFn: fuzzyFilter as FilterFn<TData>,
    filterFns: { fuzzy: fuzzyFilter as FilterFn<TData> },
    initialState: {
      pagination: { pageSize } as PaginationState,
    },
    autoResetPageIndex: true,
    manualPagination: !!tableFilter?.setPage,
    pageCount: paginationData
      ? Math.ceil(paginationData?.total || 0 / pageSize)
      : undefined,
  });

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  function SelectionBar() {
    if (selectedCount === 0) return null;
    return (
      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
          "flex items-center gap-3 rounded-md border border-gray-200 bg-white px-2 py-2.5",
          "animate-in duration-200 slide-in-from-bottom-4",
        )}
      >
        <button
          onClick={() => table.resetRowSelection()}
          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Clear selection"
        >
          <X className="h-3.5 w-3.5 text-gray-500" />
        </button>
        <span className="border-r border-gray-200 pr-2 text-sm font-medium text-gray-700">
          {selectedCount} selected
        </span>
        {selectionActions}
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h1 className="pl-1 text-[20px] font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          <div
            className={`group flex h-[42px] items-center gap-2.5 rounded-md border bg-white px-3.5 transition-all duration-150 focus-within:border-border/70 focus-within:ring-2 focus-within:ring-ring/10 dark:bg-background`}
          >
            <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-foreground/70" />

            <input
              type="text"
              value={tableFilter?.searchQuery || ""}
              onChange={(e) => tableFilter?.setSearchQuery?.(e.target.value)}
              placeholder={"Search..."}
              className="min-w-0 flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />

            {(tableFilter?.searchQuery?.length ?? 0) > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  tableFilter?.setSearchQuery?.("");
                }}
                className="flex size-[18px] items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Clear"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {showFiltersPanel && (
            <Button
              variant={"outline"}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter />
              Filters
            </Button>
          )}

          {actionButtons?.map((btn, index) => (
            <Button
              variant={btn?.variant || "default"}
              onClick={() => btn?.onClick()}
              key={index}
            >
              {btn?.icon}
              {btn?.label}
            </Button>
          ))}
          <ColumnToggleMenu table={table} />
        </div>
      </div>

      {showFiltersPanel && (
        <TableFilterContainer
          startDate={tableFilter?.startDate}
          endDate={tableFilter?.endDate}
          setStartDate={tableFilter?.setStartDate}
          setEndDate={tableFilter?.setEndDate}
          open={isFilterOpen}
          customFilters={tableFilter?.customFilters}
        />
      )}

      <div
        className={cn(
          "w-full overflow-x-auto rounded-md border border-gray-200 dark:border-border",
          stickyHeader && "max-h-[calc(100vh-150px)] overflow-y-auto",
        )}
      >
        <SHTable
          noContainer
          aria-label={caption}
          className={
            stickyHeader ? "border-separate border-spacing-0" : undefined
          }
        >
          {caption && (
            <caption className="sr-only mt-4 text-sm text-muted-foreground">
              {caption}
            </caption>
          )}
          <TableHeader
            stickyHeader={stickyHeader}
            table={table}
            dense={dense}
            enableGrouping={enableGrouping}
            enableColumnPinning={enableColumnPinning}
          />
          {loading ? (
            <tbody>
              <SkeletonRows
                columnCount={visibleColumnCount}
                rowCount={skeletonRows}
                dense={dense}
              />
            </tbody>
          ) : (
            <TableBody
              table={table}
              allColumns={allColumns}
              striped={striped}
              dense={dense}
              onRowClick={onRowClick}
            />
          )}
        </SHTable>
      </div>

      {enablePagination && !loading && paginationData && (
        <TablePagination
          page={tableFilter?.page || 0}
          pageSize={pageSize}
          setPage={tableFilter?.setPage}
          setTake={tableFilter?.setTake}
          paginationData={paginationData}
          pageSizeOptions={pageSizeOptions}
        />
      )}
      {enableRowSelection && <SelectionBar />}
    </div>
  );
}
