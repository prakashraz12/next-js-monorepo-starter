import type { ComponentDoc } from "@/lib/types";
import { CodeBlock } from "./code-block";
import { PropsTable } from "./props-table";

type ComponentDocViewProps = {
  doc: ComponentDoc;
};

export function ComponentDocView({ doc }: ComponentDocViewProps) {
  const Demo = doc.Demo;
  const exportName = doc.exportName ?? doc.name.replace(/\s+/g, "");
  const importStatement =
    doc.kind === "hook"
      ? `import ${exportName} from "${doc.importPath}";`
      : `import { ${exportName} } from "${doc.importPath}";`;

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <p className="text-muted-foreground text-sm">{doc.category}</p>
          {doc.kind === "hook" && (
            <span className="bg-muted rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
              Hook
            </span>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{doc.name}</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          {doc.description}
        </p>
        <CodeBlock code={importStatement} className="mt-4" />
      </header>

      {doc.guide && doc.guide.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">Guide</h2>
          <div className="space-y-4">
            {doc.guide.map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <h3 className="mb-2 text-sm font-medium">{section.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Preview</h2>
        <div className="rounded-xl border border-border bg-background p-6">
          <Demo />
        </div>
      </section>

      {doc.examples && doc.examples.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">Examples</h2>
          <div className="space-y-6">
            {doc.examples.map((example) => {
              const ExampleDemo = example.Demo;
              return (
                <div key={example.title}>
                  <h3 className="mb-1 text-sm font-medium">{example.title}</h3>
                  {example.description && (
                    <p className="text-muted-foreground mb-3 text-sm">
                      {example.description}
                    </p>
                  )}
                  <div className="rounded-xl border border-border bg-background p-6">
                    <ExampleDemo />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {doc.usage && doc.usage.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">Usage</h2>
          <div className="space-y-6">
            {doc.usage.map((example) => (
              <div key={example.title}>
                <h3 className="mb-1 text-sm font-medium">{example.title}</h3>
                {example.description && (
                  <p className="text-muted-foreground mb-3 text-sm">
                    {example.description}
                  </p>
                )}
                <CodeBlock code={example.code} />
              </div>
            ))}
          </div>
        </section>
      )}

      {doc.notes && doc.notes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-medium">Notes</h2>
          <ul className="space-y-2">
            {doc.notes.map((note) => (
              <li
                key={note}
                className="text-muted-foreground flex gap-2 text-sm leading-relaxed"
              >
                <span className="text-foreground mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-lg font-medium">
          {doc.kind === "hook" ? "Options & Return" : "Props"}
        </h2>
        <PropsTable props={doc.props} />
      </section>
    </div>
  );
}
