"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      animate={{ backgroundColor: isDark ? "#262626" : "#e5e5e5" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative w-10 h-[16px] border rounded-full cursor-pointer border-none outline-none"
    >
      <motion.span
        animate={{
          x: isDark ? -8 : 12,
          backgroundColor: isDark ? "#0a0a0a" : "#ffffff",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
        }}
        className="absolute -top-[4px] border left-1.5 w-6 h-6 shadow-lg rounded-full flex items-center justify-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Sun size={12} strokeWidth={2} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Moon size={12} strokeWidth={2} className="text-neutral-900" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
};

export default ThemeSwitcher;
