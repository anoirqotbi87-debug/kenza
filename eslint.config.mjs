import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Non-blocking rule severity: legacy code uses `as any` casts and has
  // some unused vars; they are reported as warnings, not CI errors.
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      // Contenu FR/ES/AR : apostrophes et guillemets sont idiomatiques en JSX.
      // On garde la protection sur les caractères réellement dangereux (> et }).
      "react/no-unescaped-entities": ["error", { forbid: [">", "}"] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated service worker (Serwist output, also git-ignored).
    "public/sw.js",
  ]),
]);

export default eslintConfig;
