import { cn } from "@repo/ui/lib/utils";

export const LEADING_STICKY_COLUMN_ID = "select-sn";

export function isLeadingStickyColumn(columnId: string) {
  return (
    columnId === LEADING_STICKY_COLUMN_ID ||
    columnId === "select" ||
    columnId === "sn"
  );
}

export function isTrailingStickyColumn(columnId: string) {
  return columnId === "action";
}

const leadingStickyBase =
  "sticky left-0 min-w-[4.5rem] w-[4.5rem] max-w-[4.5rem] px-2";

export const stickyHeaderTopClass =
  "sticky top-0 z-10 border-b border-border bg-muted";

export function getLeadingHeaderStickyClass(stickyHeader: boolean) {
  return cn(
    leadingStickyBase,
    "z-20 bg-muted",
    stickyHeader && "sticky top-0 z-30 border-b border-border",
  );
}

export function getRowSurfaceClass({
  striped,
  rowIndex,
  isSelected,
}: {
  striped: boolean;
  rowIndex: number;
  isSelected: boolean;
}) {
  if (isSelected) {
    return "bg-primary/5 group-hover:bg-primary/10";
  }

  return cn(
    "bg-background group-hover:bg-accent/50",
    striped && rowIndex % 2 === 1 && "bg-muted/40",
  );
}

export function getLeadingBodyStickyClass() {
  return cn(leadingStickyBase, "z-20");
}

export function getTrailingBodyStickyClass() {
  return cn("sticky right-0 z-20 px-2");
}

export function getTrailingStickyClass(stickyHeader: boolean) {
  return cn(
    "sticky right-0 z-20 bg-muted px-2",
    stickyHeader && "sticky top-0 z-30 border-b border-border",
  );
}
