import * as React from "react";
import { ChevronsDownUp, GitCommitVertical, PanelRight } from "lucide-react";
import UserCard from "./user-card";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  fill?: string;
}>;

type SubItem = {
  label: string;
  icon: IconComponent;
  link: string;
};

type GroupItem = {
  label: string;
  icon: IconComponent;
  link: string;
  withAction?: {
    triggerIcon: React.ReactNode;
    content: React.ReactNode; // was "renderContent" — typo fixed
  };
  subItems?: SubItem[];
};

type SideBarItem =
  | { label: string; icon: IconComponent; link: string; subItems?: SubItem[] }
  | { withGroup: { name: string; items: GroupItem[] } };

type SideBarProps = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  sidebarItems: SideBarItem[];
  activePathName: string;
  setActive: React.Dispatch<React.SetStateAction<string>>;
  logoComponent: React.ReactNode;
  className?: string;
  name: string;
  email: string;
  url: string;
  isLoading?: boolean;
};

const ITEM_CLS =
  "flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-md bg-transparent px-3 py-1.5 text-[13.5px] font-normal text-slate-700 transition-colors duration-150 hover:bg-slate-100";

/** Match exact path or nested routes (e.g. /sales/create highlights /sales). */
const isNavActive = (pathname: string, link: string) => {
  if (pathname === link) return true;
  if (link === "/") return false;
  return pathname.startsWith(`${link}/`);
};

type NavItemProps = {
  label: string;
  icon: IconComponent;
  onClick: () => void;
  indent?: boolean;
  collapsed?: boolean;
  action?: GroupItem["withAction"];
  activePathName?: string;
  className?: string;
  link: string;
  hasSubItems?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
};

const NavItem = React.memo(
  ({
    label,
    icon: Icon,
    onClick,
    indent,
    collapsed,
    action,
    activePathName,
    link,
    hasSubItems,
    isOpen,
    onToggle,
  }: NavItemProps) => {
    const content = (
      <div
        className={cn(
          ITEM_CLS,
          indent && "pl-8",
          activePathName &&
            isNavActive(activePathName, link) &&
            "bg-primary text-white hover:bg-primary/90",
        )}
      >
        <div className="flex w-full items-center gap-2.5">
          <Icon size={18} />
          <span className={collapsed ? "sr-only" : ""}>{label}</span>

          {hasSubItems && !collapsed && (
            <button
              type="button"
              aria-label={isOpen ? "Collapse submenu" : "Expand submenu"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle?.();
              }}
              className="ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-slate-500 hover:bg-slate-100"
            >
              <ChevronsDownUp
                size={16}
                className={cn(
                  "transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
          )}
        </div>
      </div>
    );

    if (action) {
      return (
        <div
          className="relative block"
          onClick={hasSubItems ? onToggle : undefined}
          onKeyDown={undefined}
          role={hasSubItems ? "button" : undefined}
          tabIndex={hasSubItems ? 0 : undefined}
        >
          <div
            className={cn(
              ITEM_CLS,
              indent && "pl-8",
              activePathName &&
                isNavActive(activePathName, link) &&
                "bg-primary text-white hover:bg-primary/70",
            )}
            onClick={hasSubItems ? onToggle : undefined}
          >
            <Icon size={18} />
            <span className={collapsed ? "sr-only" : ""}>{label}</span>

            {hasSubItems && !collapsed && (
              <button
                type="button"
                aria-label={isOpen ? "Collapse submenu" : "Expand submenu"}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle?.();
                }}
                className="ml-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm text-slate-500 hover:bg-slate-100"
              >
                <ChevronsDownUp
                  size={16}
                  className={cn(
                    "transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick();
                  }}
                  className={cn(
                    "absolute right-3 flex h-6 w-6 items-center justify-center rounded-sm",
                    activePathName && isNavActive(activePathName, link)
                      ? "bg-white/20"
                      : "bg-primary",
                  )}
                >
                  <span className="text-white">{action.triggerIcon}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="p-0">
                {action.content}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );
    }

    if (hasSubItems) {
      return (
        <div
          role="button"
          tabIndex={0}
          className="w-full text-left"
          onClick={onToggle}
          onKeyDown={(event) => {
            if (!onToggle) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onToggle();
            }
          }}
        >
          {content}
        </div>
      );
    }

    return (
      <Link href={link} onClick={onClick} className="w-full">
        {content}
      </Link>
    );
  },
);
NavItem.displayName = "NavItem";

const SideBar = ({
  collapsed,
  setCollapsed,
  sidebarItems,
  activePathName,
  setActive,
  logoComponent,
  className,
  name,
  email,
  url,
  isLoading,
}: SideBarProps) => {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  const handleSelect = React.useCallback(
    (link: string) => () => setActive(link),
    [setActive],
  );

  const toggleItem = React.useCallback((link: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [link]: !prev[link],
    }));
  }, []);

  const isOpen = React.useCallback(
    (link: string) =>
      openItems[link] ??
      (!!activePathName && isNavActive(activePathName, link)),
    [activePathName, openItems],
  );

  return (
    <aside
      className={cn(
        "relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden bg-slate-50 px-2 py-4 transition-all duration-300 ease-in-out dark:bg-stone-900",
        className,
        collapsed ? "w-16" : "w-60",
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Expand" : "Collapse"}
        className={`absolute top-6 z-20 flex h-6 w-6 items-center justify-center ${
          collapsed ? "left-1/2 -translate-x-1/2" : "right-3"
        }`}
      >
        {!collapsed && <PanelRight size={15} />}
      </button>

      {logoComponent}

      <UserCard
        collapsed={collapsed}
        containerClassName="mt-5"
        name={name}
        email={email}
        url={url}
        isLoading={isLoading}
      />

      <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-y-contain">
        {sidebarItems.map((item) => {
          if ("withGroup" in item) {
            return (
              <div key={item.withGroup.name} className="mb-4">
                {!collapsed && (
                  <p className="mb-2 px-2 text-[11px] font-semibold text-slate-500 uppercase dark:text-slate-200">
                    {item.withGroup.name}
                  </p>
                )}
                {item.withGroup.items.map((subItem) => {
                  const hasSubItems = (subItem.subItems?.length ?? 0) > 0;
                  const open = isOpen(subItem.link);
                  return (
                    <React.Fragment key={subItem.link}>
                      <NavItem
                        label={subItem.label}
                        icon={subItem.icon}
                        onClick={handleSelect(subItem.link)}
                        collapsed={collapsed}
                        action={subItem.withAction}
                        link={subItem.link}
                        activePathName={activePathName}
                        hasSubItems={hasSubItems}
                        isOpen={open}
                        onToggle={() => toggleItem(subItem.link)}
                      />
                      {!collapsed &&
                        hasSubItems &&
                        open &&
                        subItem.subItems?.map((nested) => (
                          <NavItem
                            key={nested.link}
                            label={nested.label}
                            icon={nested.icon}
                            onClick={handleSelect(nested.link)}
                            indent
                            link={nested.link}
                            collapsed={collapsed}
                            activePathName={activePathName}
                          />
                        ))}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          }

          return (
            <React.Fragment key={item.link}>
              <NavItem
                label={item.label}
                icon={item.icon}
                onClick={handleSelect(item.link)}
                collapsed={collapsed}
                link={item.link}
                activePathName={activePathName}
                hasSubItems={!!item.subItems?.length}
                isOpen={isOpen(item.link)}
                onToggle={() => toggleItem(item.link)}
              />
              {item.subItems?.length &&
                !collapsed &&
                isOpen(item.link) &&
                item.subItems.map((subItem) => (
                  <NavItem
                    key={subItem.link}
                    label={subItem.label}
                    icon={subItem.icon}
                    onClick={handleSelect(subItem.link)}
                    indent
                    link={subItem.link}
                    collapsed={collapsed}
                    activePathName={activePathName}
                  />
                ))}
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideBar;
