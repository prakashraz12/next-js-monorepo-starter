import type { PropDefinition } from "@/lib/types";

type PropsTableProps = {
  props: PropDefinition[];
};

export function PropsTable({ props }: PropsTableProps) {
  if (props.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No props documented yet.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3 font-medium">Prop</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Default</th>
            <th className="px-4 py-3 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr
              key={prop.name}
              className="border-b border-border last:border-0"
            >
              <td className="px-4 py-3 align-top font-mono text-xs">
                {prop.name}
                {prop.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </td>
              <td className="text-muted-foreground px-4 py-3 align-top font-mono text-xs">
                {prop.type}
              </td>
              <td className="text-muted-foreground px-4 py-3 align-top font-mono text-xs">
                {prop.default ?? "—"}
              </td>
              <td className="px-4 py-3 align-top">{prop.description ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
