import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Ignore caches, third-party, and generated bundles from linting
  { ignores: [
    "node_modules/**",
    ".next/**",
    "app/generated/**",
    "generated/**",
  ] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Relax a few rules to keep builds green while we iterate
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-this-alias": "off",
    },
  },
];

export default eslintConfig;
