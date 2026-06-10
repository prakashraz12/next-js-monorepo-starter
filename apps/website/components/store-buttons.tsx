import Image from "next/image";
import { cn } from "@repo/ui/lib/utils";
import { APP_STORE_URL, PLAY_STORE_URL } from "../lib/download-links";

export function StoreButtons({
  variant = "light",
}: {
  variant?: "hero" | "light";
}) {
  const isHero = variant === "hero";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:opacity-90"
        aria-label="Get it on Google Play"
      >
        <Image
          src="/icons/playstore.png"
          alt="Get it on Google Play"
          width={160}
          height={48}
          className="h-12 w-auto"
        />
      </a>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="transition hover:opacity-90"
        aria-label="Download on the App Store"
      >
        <Image
          src="/icons/appstore.png"
          alt="Download on the App Store"
          width={160}
          height={48}
          className="h-12 w-auto"
        />
      </a>
      <span
        className={cn(
          "inline-flex h-12 items-center rounded-xl border px-5 text-sm font-medium",
          isHero
            ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
            : "border-[#26a579]/30 bg-[#26a579]/10 text-[#1f8c66]",
        )}
      >
        Web — Coming Soon
      </span>
    </div>
  );
}
