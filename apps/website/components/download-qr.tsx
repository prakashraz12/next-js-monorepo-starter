"use client";

import QRCode from "react-qr-code";
import { cn } from "@repo/ui/lib/utils";
import { DOWNLOAD_URL } from "../lib/download-links";

function ArrowPointerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-6", className)}
      aria-hidden
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="17" r="2" fill="currentColor" />
    </svg>
  );
}

export function DownloadQr({
  variant = "light",
}: {
  variant?: "hero" | "light";
}) {
  const isHero = variant === "hero";

  return (
    <div className="relative w-fit pt-5 pr-6">
      <div className="absolute -top-1 right-0 z-20 rotate-6">
        <span className="whitespace-nowrap rounded-full bg-[#26a579] px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg">
          Scan to download app
        </span>
      </div>

      <ArrowPointerIcon
        className={cn(
          "absolute top-7 right-3 z-10 rotate-[135deg]",
          isHero ? "text-white" : "text-[#26a579]",
        )}
      />

      <div className="rounded-xl bg-white p-2.5 shadow-md ring-1 ring-black/5">
        <QRCode
          value={DOWNLOAD_URL}
          size={96}
          bgColor="#ffffff"
          fgColor="#1f2937"
          level="M"
          className="block rounded-md"
        />
      </div>
    </div>
  );
}
