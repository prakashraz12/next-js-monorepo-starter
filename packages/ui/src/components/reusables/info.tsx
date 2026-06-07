import { Lightbulb, AlertTriangle, AlertOctagon } from "lucide-react";

type InfoCardProps = {
  type?: "Info" | "warning" | "danger";
  message: string;
};

const cardConfig = {
  Info: {
    icon: Lightbulb,
    label: "Info",
    containerClass: "bg-blue-50 border-blue-200 text-blue-800",
    iconClass: "text-blue-500",
    labelClass: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    label: "Warning",
    containerClass: "bg-amber-50 border-amber-200 text-amber-800",
    iconClass: "text-amber-500",
    labelClass: "text-amber-500",
  },
  danger: {
    icon: AlertOctagon,
    label: "Danger",
    containerClass: "bg-red-50 border-red-200 text-red-800",
    iconClass: "text-red-500",
    labelClass: "text-red-500",
  },
};

const InfoCard = ({ type = "Info", message }: InfoCardProps) => {
  const {
    icon: Icon,
    label,
    containerClass,
    iconClass,
    labelClass,
  } = cardConfig[type];

  return (
    <div
      className={`flex items-start gap-2 rounded-md border p-3 ${containerClass}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} />
      <div>
        <span
          className={`text-xs font-semibold tracking-wide uppercase ${labelClass}`}
        >
          {label}
        </span>
        <p className="mt-0.5 text-xs">{message}</p>
      </div>
    </div>
  );
};

export default InfoCard;
