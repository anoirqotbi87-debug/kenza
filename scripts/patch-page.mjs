// patch-page.mjs v21 — fix truncated startLesson line 481 (syntax error), category sentinel __all__
import fs from "node:fs";

const P = "src/app/page.tsx";
let s = fs.readFileSync(P, "utf8");
const report = [];
let applied = 0;

function fix(name, oldS, newS) {
  const n = s.split(oldS).length - 1;
  if (n > 0) {
    s = s.split(oldS).join(newS);
    report.push(name + ": OK" + (n > 1 ? " x" + n : ""));
    applied += 1;
  } else {
    report.push(name + ": MISSING");
  }
}

// A) Idempotent guards from previous versions
fix("A1-rename-def",
  'const tr = (lang: string, fr: string, en: string, es: string, ar: string) =>',
  'const trL = (lang: string, fr: string, en: string, es: string, ar: string) =>');
fix("A2-rename-calls", "tr(lang,", "trL(lang,");

// B) Idempotent repair of "{tr(" wrapper corruptions
(function () {
  const marker = '"' + "{tr(" + '"';
  let count = 0;
  let idx = s.indexOf(marker);
  while (idx !== -1) {
    const frStart = idx + marker.length;
    const frEnd = s.indexOf('"', frStart);
    if (frEnd === -1) break;
    const closeInner = s.indexOf(")}", frEnd);
    if (closeInner === -1) break;
    const endQuote = s.indexOf('"', closeInner + 2);
    if (endQuote === -1) break;
    const fr = s.slice(frStart, frEnd);
    const newLit = '"' + fr + '"';
    s = s.slice(0, idx) + newLit + s.slice(endQuote + 1);
    count += 1;
    idx = s.indexOf(marker, idx + newLit.length);
  }
  report.push("B-repair-wrapped: " + count);
  if (count > 0) applied += 1;
})();

// E) New fixes
fix("E1-startlesson-truncated",
  'const index = lessons.findIndex((item) => item\n    const canStart =',
  'const index = lessons.findIndex((item) => item.id === id);\n    const canStart =');
fix("E2-category-sentinel-init",
  'useState("Tout voir")',
  'useState("__all__")');
fix("E3-category-sentinel-reset",
  'setCategory("Tout voir")',
  'setCategory("__all__")');

// D) Sanity checks
report.push("D-tr-def-count: " + (s.split("const tr =").length - 1));
report.push("D-trL-def: " + (s.includes("const trL = (lang") ? "OK" : "MISSING"));
report.push("D-wrapped-left: " + (s.indexOf('"' + "{tr(" + '"') === -1 ? "OK" : "FAIL"));
report.push("D-home-export: " + (s.includes("export default function Home") ? "OK" : "FAIL"));
report.push("D-trL-calls: " + (s.split("trL(lang,").length - 1));
report.push("D-findindex-ok: " + (s.includes("findIndex((item) => item.id === id)") ? "OK" : "FAIL"));

// F) Write file + dumps (400-line chunks)
fs.writeFileSync(P, s);
const lines = s.split("\n");
const CH = 400;
for (let c = 0; c * CH < lines.length; c++) {
  const chunk = lines.slice(c * CH, (c + 1) * CH)
    .map((l, i) => String(c * CH + i + 1).padStart(4, "0") + "|" + l).join("\n");
  fs.writeFileSync("docs/dump-" + (c + 1) + ".txt", chunk);
}
fs.writeFileSync("docs/verify.json", report.join("\n"));
console.log("applied=" + applied);
console.log(report.join("\n"));
