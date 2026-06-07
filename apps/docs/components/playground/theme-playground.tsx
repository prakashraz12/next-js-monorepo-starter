"use client";

import { useMemo, useState } from "react";
import { cn } from "@repo/ui/lib/utils";
import { CodeBlock } from "@/components/docs/code-block";
import {
  colorPalettes,
  radiusPresets,
  getThemeCssVariables,
  generateThemeCss,
  type ThemeMode,
} from "@/lib/theme-presets";
import { PlaygroundPreview } from "./playground-preview";

const TOKEN_LABELS: {
  key: keyof ReturnType<typeof getThemeCssVariables>;
  label: string;
}[] = [
  { key: "--primary", label: "Primary" },
  { key: "--primary-foreground", label: "Primary FG" },
  { key: "--ring", label: "Ring" },
  { key: "--accent", label: "Accent" },
  { key: "--accent-foreground", label: "Accent FG" },
  { key: "--radius", label: "Radius" },
];

export function ThemePlayground() {
  const [paletteId, setPaletteId] = useState(colorPalettes[0]!.id);
  const [radiusId, setRadiusId] = useState("md");
  const [mode, setMode] = useState<ThemeMode>("light");

  const palette =
    colorPalettes.find((p) => p.id === paletteId) ?? colorPalettes[0]!;
  const radius =
    radiusPresets.find((r) => r.id === radiusId) ?? radiusPresets[2]!;

  const cssVariables = useMemo(
    () => getThemeCssVariables(palette, mode, radius),
    [palette, mode, radius],
  );

  const cssSnippet = useMemo(
    () => generateThemeCss(palette, mode, radius),
    [palette, mode, radius],
  );

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Theme Playground
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed">
          Experiment with color palettes and border radius. The preview updates
          live — copy the generated CSS into your app&apos;s{" "}
          <code className="text-foreground text-xs">globals.css</code>.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <ControlGroup title="Appearance">
            <div className="flex gap-1 rounded-lg border border-border p-1">
              {(["light", "dark"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    mode === value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="Color palette">
            <div className="grid grid-cols-3 gap-2">
              {colorPalettes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPaletteId(item.id)}
                  title={item.name}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all",
                    paletteId === item.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span
                    className="size-8 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.swatch }}
                  />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="Border radius">
            <div className="space-y-1.5">
              {radiusPresets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRadiusId(item.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors",
                    radiusId === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                  <span
                    className="border-primary size-6 shrink-0 border-2 bg-primary/20"
                    style={{ borderRadius: item.value }}
                  />
                </button>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup title="Active tokens">
            <div className="space-y-2">
              {TOKEN_LABELS.map(({ key, label }) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    {key === "--primary" || key === "--ring" ? (
                      <span
                        className="size-4 rounded border border-border"
                        style={{ backgroundColor: cssVariables[key] }}
                      />
                    ) : null}
                    <code className="bg-muted max-w-[120px] truncate rounded px-1.5 py-0.5 font-mono text-[10px]">
                      {cssVariables[key]}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </ControlGroup>
        </aside>

        <div className="space-y-6">
          <div
            className={cn(
              "rounded-xl border border-border p-8 transition-colors",
              mode === "dark" && "dark",
            )}
            style={cssVariables as React.CSSProperties}
          >
            <PlaygroundPreview />
          </div>

          <section>
            <h2 className="mb-3 text-lg font-medium">Generated CSS</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              Paste into <code>packages/ui/src/styles/globals.css</code> under{" "}
              <code>:root</code> or <code>.dark</code>.
            </p>
            <CodeBlock
              code={cssSnippet}
              title={mode === "dark" ? ".dark" : ":root"}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

function ControlGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}
