"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { SnookLogo } from "./snook-logo";
import { WHATSAPP_URL } from "../lib/contact-links";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-zinc-200 bg-white shadow-sm"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <SnookLogo
            height={32}
            className={cn(!scrolled && "brightness-0 invert")}
          />
          <span
            className={cn(
              "text-base font-bold transition-colors duration-300",
              scrolled ? "text-zinc-900" : "text-white",
            )}
          >
            Snook App
          </span>
        </Link>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants(),
            "bg-[#26a579] text-white hover:bg-[#1f8c66]",
          )}
        >
          Contact Us
        </a>
      </div>
    </header>
  );
}
