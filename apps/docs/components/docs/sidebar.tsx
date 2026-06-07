"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui/lib/utils";
import { getCategories } from "@/lib/registry";

export function DocsSidebar() {
  const pathname = usePathname();
  const categories = getCategories();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-background">
      <div className="border-b border-border px-4 py-5">
        <Link href="/" className="block">
          <p className="text-sm font-semibold">Pool House UI</p>
          <p className="text-muted-foreground text-xs">Component docs</p>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-4 space-y-0.5">
          <Link
            href="/"
            className={cn(
              "block rounded-md px-2 py-1.5 text-sm transition-colors",
              pathname === "/"
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            Overview
          </Link>
          <Link
            href="/playground"
            className={cn(
              "block rounded-md px-2 py-1.5 text-sm transition-colors",
              pathname === "/playground"
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            Playground
          </Link>
        </div>
        {categories.map(([category, components]) => (
          <div key={category} className="mb-5">
            <p className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">
              {category}
            </p>
            <ul className="space-y-0.5">
              {components.map((component) => {
                const href = `/components/${component.slug}`;
                const isActive = pathname === href;

                return (
                  <li key={component.slug}>
                    <Link
                      href={href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {component.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
