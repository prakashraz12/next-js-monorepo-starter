import { CheckCircle2, XCircle, Clock } from "lucide-react";

type PaymentStatusBadgeProps = {
  status: "PAID" | "UNPAID" | "PARTIAL";
};

const config = {
  PAID: {
    icon: CheckCircle2,
    label: "Paid",
    className:
      "bg-green-500 text-white border border-green-200 dark:border-green-700",
    iconClass: "text-white",
    dot: "bg-white",
  },
  UNPAID: {
    icon: XCircle,
    label: "Unpaid",
    className:
      "bg-red-50 text-red-700 border border-red-200 ring-1 ring-red-100",
    iconClass: "text-red-500",
    dot: "bg-red-400",
  },
  PARTIAL: {
    icon: Clock,
    label: "Partial",
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
    iconClass: "text-amber-500",
    dot: "bg-amber-400",
  },
};

const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  const {
    icon: Icon,
    label,
    className,
    iconClass,
  } = config[status] ?? {
    icon: null,
    label: status,
    className: "bg-gray-100 text-gray-600 border border-gray-200",
    iconClass: "text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md py-1.5 pr-4 pl-1.5 text-xs font-medium tracking-wide ${className}`}
    >
      {Icon && (
        <Icon size={16} className={`shrink-0 ${iconClass}`} strokeWidth={2.5} />
      )}
      {label}
    </span>
  );
};

export default PaymentStatusBadge;
