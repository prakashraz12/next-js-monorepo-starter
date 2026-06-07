type MenuItemProps = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  variant?: "default" | "danger";
  onClick?: () => void;
  children?: React.ReactNode;
};

const MenuItem = ({
  icon: Icon,
  label,
  variant = "default",
  onClick,
  children,
}: MenuItemProps) => (
  <button
    onClick={onClick}
    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors hover:bg-slate-100 ${
      variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-slate-700"
    }`}
  >
    <Icon size={15} className="shrink-0 opacity-60" />
    <span>{label}</span>
    {children}
  </button>
);

export default MenuItem;
