import { readFileSync, writeFileSync } from 'node:fs';

const p = 'src/app/page.tsx';
let src = readFileSync(p, 'utf8');
let changed = false;

const count = (s, sub) => s.split(sub).length - 1;

const OLD_TOGGLE = "            <div className=\"lang-switcher\" role=\"group\" aria-label=\"Sélecteur de langue\">\n              <Globe size={13} className=\"lang-icon\" />\n              <button\n                type=\"button\"\n                onClick={() => setLanguage(\"fr\")}\n                className={`lang-btn ${uiLanguage !== \"ar\" ? \"lang-btn-active\" : \"\"}`}\n                aria-label=\"Passer en français\"\n              >\n                FR\n              </button>\n              <span className=\"lang-sep\">|</span>\n              <button\n                type=\"button\"\n                onClick={() => setLanguage(\"ar\")}\n                className={`lang-btn ${uiLanguage === \"ar\" ? \"lang-btn-active\" : \"\"}`}\n                aria-label=\"Passer en arabe\"\n              >\n                AR\n              </button>\n            </div>";
const NEW_TOGGLE = "            <div className=\"lang-switcher\" role=\"group\" aria-label=\"Sélecteur de langue\">\n              <Globe size={13} className=\"lang-icon\" />\n              <button\n                type=\"button\"\n                onClick={() => setLanguage(\"fr\")}\n                className={`lang-btn ${uiLanguage === \"fr\" ? \"lang-btn-active\" : \"\"}`}\n                aria-label=\"Passer en français\"\n              >\n                FR\n              </button>\n              <span className=\"lang-sep\">|</span>\n              <button\n                type=\"button\"\n                onClick={() => setLanguage(\"en\")}\n                className={`lang-btn ${uiLanguage === \"en\" ? \"lang-btn-active\" : \"\"}`}\n                aria-label=\"Switch to English\"\n              >\n                EN\n              </button>\n              <span className=\"lang-sep\">|</span>\n              <button\n                type=\"button\"\n                onClick={() => setLanguage(\"es\")}\n                className={`lang-btn ${uiLanguage === \"es\" ? \"lang-btn-active\" : \"\"}`}\n                aria-label=\"Cambiar a español\"\n              >\n                ES\n              </button>\n              <span className=\"lang-sep\">|</span>\n              <button\n                type=\"button\"\n                onClick={() => setLanguage(\"ar\")}\n                className={`lang-btn ${uiLanguage === \"ar\" ? \"lang-btn-active\" : \"\"}`}\n                aria-label=\"Passer en arabe\"\n              >\n                AR\n              </button>\n            </div>";
const NAV_ANCHOR = "{item.id === \"review\" && <span className=\"nav-count\">4</span>}\n              </button>\n            );\n          })}\n        </nav>";
const NAV_APPEND = "\n\n        <div className=\"sidebar-label\">EXPLORER</div>\n        <nav className=\"side-nav\" aria-label=\"Ressources d'étude\">\n          <a href=\"/etudier\" className=\"nav-item\">\n            <span>Étudier — Modules complets</span>\n          </a>\n          <a href=\"/grammaire\" className=\"nav-item\">\n            <span>Grammaire active</span>\n          </a>\n          <a href=\"/parler\" className=\"nav-item\">\n            <span>Pratique orale</span>\n          </a>\n          <a href=\"/revisions\" className=\"nav-item\">\n            <span>Révisions SRS</span>\n          </a>\n        </nav>";

// --- Patch 1: language toggle (idempotent) ---
if (!src.includes('Cambiar a español')) {
  const n = count(src, OLD_TOGGLE);
  if (n === 1) {
    src = src.replace(OLD_TOGGLE, NEW_TOGGLE);
    changed = true;
    console.log('patched: language toggle -> 4 languages (FR/EN/ES/AR)');
  } else {
    console.log('toggle pattern not unique, count:', n);
  }
} else {
  console.log('toggle already patched');
}

// --- Patch 2: EXPLORER sidebar section (idempotent) ---
if (!src.includes('sidebar-label">EXPLORER')) {
  const n = count(src, NAV_ANCHOR);
  if (n === 1) {
    src = src.replace(NAV_ANCHOR, NAV_ANCHOR + NAV_APPEND);
    changed = true;
    console.log('patched: EXPLORER sidebar section added');
  } else {
    console.log('nav anchor not unique, count:', n);
  }
} else {
  console.log('EXPLORER already present');
}

if (!changed) {
  console.log('Nothing to patch.');
  process.exit(0);
}
writeFileSync(p, src);
console.log('page.tsx patched successfully');
