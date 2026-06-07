import { cn } from "@repo/ui/lib/utils";
import { ChevronRight } from "lucide-react";

const MenuItem = ({
  children,
  icon,
  childrenArrow,
  onClick,
  selected,
  type = "default",
}: {
  children: React.ReactNode | string;
  icon?: React.ReactNode;
  childrenArrow?: boolean;
  onClick: () => void;
  selected: boolean;
  type: "default" | "danger" | "info";
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 w-full items-center justify-between gap-2 rounded-md px-2 text-left text-[13px] font-medium transition-colors",

        type === "default" && [
          "text-gray-800 dark:text-gray-200",
          "hover:bg-gray-100 dark:hover:bg-neutral-800",
          selected && "bg-gray-100 dark:bg-neutral-800",
        ],

        // info
        type === "info" && [
          "text-blue-600 dark:text-blue-400",
          "hover:bg-blue-50 dark:hover:bg-blue-950",
          selected && "bg-blue-50 dark:bg-blue-950",
        ],

        // danger
        type === "danger" && [
          "text-red-600 dark:text-red-400",
          "hover:bg-red-50 dark:hover:bg-red-950",
          selected && "bg-red-50 dark:bg-red-950",
        ],
      )}
    >
      <span className="flex items-center gap-2">
        {icon && (
          <span
            className={cn(
              "flex items-center",
              type === "default" && "text-gray-400 dark:text-neutral-500",
              type === "info" && "text-blue-400 dark:text-blue-500",
              type === "danger" && "text-red-400 dark:text-red-500",
            )}
          >
            {icon}
          </span>
        )}
        {children}
      </span>

      {childrenArrow && (
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            type === "default" && "text-gray-500 dark:text-neutral-600",
            type === "info" && "text-blue-300 dark:text-blue-700",
            type === "danger" && "text-red-300 dark:text-red-700",
          )}
        />
      )}
    </button>
  );
};

export default MenuItem;
