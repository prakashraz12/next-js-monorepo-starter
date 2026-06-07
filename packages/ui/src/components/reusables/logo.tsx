"use client";

import Image from "next/image";
import {
  BYAPAR_SATHI_DARK_LOGO,
  BYAPAR_SATHI_LIGHT_LOGO,
  BYAPAR_SATHI_LIGHT_MASCOTT_LOGO,
  BYAPAR_SATHI_DARK_MASCOTT_LOGO,
} from "@repo/ui/assets";
import { useTheme } from "next-themes";

type LogoProps = {
  width?: number;
  height?: number;
  mode?: "light" | "dark";
  variant?: "full" | "icon";
};

const Logo = ({ width, height, mode, variant = "full" }: LogoProps) => {
  const { theme } = useTheme();

  const currentMode = mode ?? theme ?? "light";

  const src =
    variant === "full"
      ? currentMode === "dark"
        ? BYAPAR_SATHI_DARK_LOGO
        : BYAPAR_SATHI_LIGHT_LOGO
      : currentMode === "dark"
        ? BYAPAR_SATHI_DARK_MASCOTT_LOGO
        : BYAPAR_SATHI_LIGHT_MASCOTT_LOGO;

  return (
    <Image
      src={src}
      alt="Byapar Sathi Logo"
      width={width || 200}
      height={height || 60}
      className="pointer-events-none"
    />
  );
};

export default Logo;
