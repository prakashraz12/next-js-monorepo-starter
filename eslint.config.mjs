import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: [
      "apps/**",
      "packages/ui/**",
      "packages/eslint-config/**",
      "packages/typescript-config/**",
    ],
  },
];
