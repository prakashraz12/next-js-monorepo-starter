import { cn } from "@repo/ui/lib/utils";

type SnookLogoProps = {
  className?: string;
  height?: number;
};

export function SnookLogo({ className, height = 48 }: SnookLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- large embedded SVG works best as a plain img
    <img
      src="/icons/logo.svg"
      alt="Snook App"
      className={cn("w-auto", className)}
      style={{ height }}
    />
  );
}
