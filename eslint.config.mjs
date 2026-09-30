import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // `no-explicit-any` et `no-unused-vars` restent en `warn` : plus aucune occurrence
  // dans src/, mais une régression ponctuelle ne doit pas bloquer toute la CI.
  {
    rules: {
      // `no-explicit-any` : plus aucun `any` dans src/, gardé en `warn` par prudence.
      "@typescript-eslint/no-explicit-any": "warn",
      // Convention `_` : un identifiant préfixé est volontairement inutilisé, ce qui
      // permet d'omettre une clé par destructuration — `const { a: _a, ...rest }`.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
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
