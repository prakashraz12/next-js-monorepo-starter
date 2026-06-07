import Link from "next/link";
import { getCategories } from "@/lib/registry";

export default function DocsHomePage() {
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Pool House UI</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Component documentation with live previews, usage guides, and
          copy-paste examples. Start with the guides below or pick a component
          from the sidebar.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Getting started</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/playground"
            className="hover:bg-muted/40 rounded-xl border border-border p-5 transition-colors"
          >
            <p className="font-medium">Theme Playground</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Try color palettes and radius options with live previews.
            </p>
          </Link>
          <Link
            href="/components/data-table"
            className="hover:bg-muted/40 rounded-xl border border-border p-5 transition-colors"
          >
            <p className="font-medium">DataTable</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Tables with sorting, pagination, loading skeletons, and filters.
            </p>
          </Link>
          <Link
            href="/components/use-table-filter"
            className="hover:bg-muted/40 rounded-xl border border-border p-5 transition-colors"
          >
            <p className="font-medium">useTableFilter</p>
            <p className="text-muted-foreground mt-1 text-sm">
              Hook for search, pagination, and API query params.
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">All components</h2>
        <div className="space-y-6">
          {categories.map(([category, components]) => (
            <div key={category}>
              <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                {category}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {components.map((component) => (
                  <Link
                    key={component.slug}
                    href={`/components/${component.slug}`}
                    className="hover:bg-muted/40 rounded-lg border border-border px-4 py-3 transition-colors"
                  >
                    <p className="text-sm font-medium">{component.name}</p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                      {component.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
