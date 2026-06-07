import { cn } from "@repo/ui/lib/utils";
import { Button } from "../../button";
type TableTitleProps = {
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
    className?: string;
  }[];
};

const TableTitle = ({ title, subtitle, actions }: TableTitleProps) => {
  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <Button
              className={cn("px-6", action.className)}
              key={index}
              onClick={action.onClick}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableTitle;
