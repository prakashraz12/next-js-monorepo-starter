import { useMemo } from "react";
import { TTablePaginationData } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Button } from "@repo/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TablePaginationProps = {
  paginationData?: TTablePaginationData;
  pageSize: number;
  page: number;
  pageSizeOptions: number[];
  setPage?: (page: number) => void;
  setTake?: (take: number) => void;
};
const TablePagination = ({
  paginationData,
  pageSize,
  page,
  pageSizeOptions,
  setPage,
  setTake,
}: TablePaginationProps) => {
  const totalPages = Math.ceil((paginationData?.total ?? 0) / pageSize);
  const from = paginationData?.total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, paginationData?.total ?? 0);

  const pageNumbers = useMemo<number[]>(() => {
    const pages: number[] = [];
    const delta = 2;
    const start = Math.max(0, page - delta);
    const end = Math.min(page + delta, totalPages - 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    setTake?.(newSize);
    setPage?.(0);
  };

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>
          {paginationData?.total === 0
            ? "No results"
            : `${from}–${to} of ${paginationData?.total ?? 0} rows`}
        </span>
        <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="h-9 w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions?.map((size: number) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="h-10 rounded-sm px-4"
          onClick={() => setPage?.(page - 1)}
          disabled={paginationData?.previousPage === null}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>

        {pageNumbers.map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "ghost"}
            className="h-9 w-9 rounded-md"
            onClick={() => setPage?.(p)}
          >
            {p + 1}
          </Button>
        ))}

        {pageNumbers.length > 0 &&
          pageNumbers[pageNumbers.length - 1]! < totalPages - 1 && (
            <>
              {pageNumbers[pageNumbers.length - 1]! < totalPages - 2 && (
                <span className="px-1 text-sm text-gray-400">…</span>
              )}
              <Button
                variant="outline"
                className="h-9 w-9 rounded-sm"
                onClick={() => setPage?.(totalPages - 1)}
              >
                {totalPages}
              </Button>
            </>
          )}

        <Button
          variant="outline"
          className="h-10 rounded-sm px-4"
          onClick={() => setPage?.(page + 1)}
          disabled={paginationData?.nextPage === null}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TablePagination;
