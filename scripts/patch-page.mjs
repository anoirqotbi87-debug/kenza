// patch-page.mjs v24 — minimal: programmatic T4 (AR savePrompt, no fragile anchor) + dumps
import fs from "node:fs";

const report = [];
const P = "src/app/page.tsx";
const TRF = "src/lib/i18n/translations.ts";

// ---- T4: insert headerLogin/checkEmail into AR auth + savePrompt sibling ----
let s = fs.readFileSync(TRF, "utf8");
if (s.includes("savePrompt") && s.includes("\u0627\u062d\u0641\u0638 \u062a\u0642\u062f\u0651\u0645\u064a")) {
  report.push("T4-ar-saveprompt: OK (already present)");
} else {
  const idx = s.lastIndexOf("continueGuest:");
  if (idx < 0) {
    report.push("T4-ar-saveprompt: MISSING (no continueGuest found)");
  } else {
    const closeMatch = /\n(\s*)\},/.exec(s.slice(idx));
    if (!closeMatch) {
      report.push("T4-ar-saveprompt: MISSING (no closing brace after continueGuest)");
    } else {
      const closeIdx = idx + closeMatch.index;
      const region = s.slice(idx, closeIdx).trim();
      const needsComma = !/[,\[{]$/.test(region);
      const head = (needsComma ? "," : "") + "\n      headerLogin: \"\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644\", checkEmail: \"\u062a\u0645 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062d\u0633\u0627\u0628. \u0623\u0643\u0651\u062f \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0639\u0628\u0631 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u062a\u064a \u0623\u0631\u0633\u0644\u0646\u0627\u0647\u0627 \u0644\u0644\u062a\u0648\u060c \u062b\u0645 \u0639\u062f \u0625\u0644\u0649 \u0647\u0646\u0627: \u0633\u064a\u062a\u0645 \u062d\u0641\u0638 \u062a\u0642\u062f\u0651\u0645\u0643.\"";
      const sp = [
        "    savePrompt: {",
        "      title: \"\u0644\u0627 \u062a\u0641\u0642\u062f \u062a\u0642\u062f\u0651\u0645\u0643\",",
        "      body: \"\u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a \u0644\u0627\u062d\u062a\u0641\u0627\u0638 \u0628\u0646\u0642\u0627\u0637 XP \u0648\u0633\u0644\u0633\u0644\u0629 \u0623\u064a\u0627\u0645\u0643\u060c \u0648\u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629 \u0639\u0644\u0649 \u0623\u064a \u062c\u0647\u0627\u0632.\",",
        "      reminderTitle: \"\u062a\u0642\u062f\u0651\u0645\u0643 \u063a\u064a\u0631 \u0645\u062d\u0641\u0648\u0638 \u0628\u0639\u062f\",",
        "      reminderBody: \"\u0644\u062f\u064a\u0643 \u0628\u0627\u0644\u0641\u0639\u0644 {xp} XP \u0648{lessons} \u062f\u0631\u0648\u0633 \u0645\u0643\u062a\u0645\u0644\u0629. \u0625\u0646\u0647\u0627 \u0645\u062d\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u0647\u0630\u0627 \u0627\u0644\u062c\u0647\u0627\u0632 \u0641\u0642\u0637: \u0623\u0646\u0634\u0626 \u062d\u0633\u0627\u0628\u064b\u0627 \u0645\u062c\u0627\u0646\u064a\u064b\u0627 \u062d\u062a\u0649 \u0644\u0627 \u062a\u0641\u0642\u062f \u0634\u064a\u0626\u064b\u0627.\",",
        "      cta: \"\u0627\u062d\u0641\u0638 \u062a\u0642\u062f\u0651\u0645\u064a\",",
        "      later: \"\u0644\u0627\u062d\u0642\u064b\u0627\",",
        "      reassurance: \"\u0645\u062c\u0627\u0646\u064a \u00b7 30 \u062b\u0627\u0646\u064a\u0629 \u00b7 \u0639\u0628\u0631 \u062c\u0648\u062c\u0644 \u0623\u0648 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\"",
        "    },"
      ].join("\n");
      const closing = closeMatch[0];
      const newBlock = head + closing + "\n" + sp;
      s = s.slice(0, closeIdx) + newBlock + s.slice(closeIdx + closing.length);
      fs.writeFileSync(TRF, s);
      report.push("T4-ar-saveprompt: OK (inserted programmatically)");
    }
  }
}

// ---- dumps ----
const DUMP_MODE = (process.env.DUMP_MODE || "on") === "on";
report.push("DUMP_MODE: " + (DUMP_MODE ? "on" : "off"));
if (DUMP_MODE) {
  const s2 = fs.readFileSync(P, "utf8");
  const lines = s2.split("\n");
  const CH = 400;
  for (let c = 0; c * CH < lines.length; c++) {
    const chunk = lines.slice(c * CH, (c + 1) * CH)
      .map((l, i) => String(c * CH + i + 1).padStart(4, "0") + "|" + l).join("\n");
    fs.writeFileSync("docs/dump-" + (c + 1) + ".txt", chunk);
  }
  const tr = fs.readFileSync(TRF, "utf8");
  const trLines = tr.split("\n");
  const TRC = 220;
  for (let c = 0; c * TRC < trLines.length; c++) {
    const chunk = trLines.slice(c * TRC, (c + 1) * TRC)
      .map((l, i) => String(c * TRC + i + 1).padStart(4, "0") + "|" + l).join("\n");
    fs.writeFileSync("docs/tr-dump-" + (c + 1) + ".txt", chunk);
  }
}
fs.writeFileSync("docs/verify.json", report.join("\n"));
console.log(report.join("\n"));