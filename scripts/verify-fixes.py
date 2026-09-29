#!/usr/bin/env python3
"""Vérification ciblée des 3 correctifs d'audit visuel KENZA."""
import json, os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = "/workspace/audit-verify"
os.makedirs(OUT, exist_ok=True)
MOBILE = {"width": 390, "height": 844}
DESKTOP = {"width": 1440, "height": 900}

def set_lang(page, lang):
    page.goto(BASE + "/", wait_until="domcontentloaded")
    page.evaluate(
        """(lang) => {
            const raw = localStorage.getItem('darija-quest-storage');
            let obj = raw ? JSON.parse(raw) : {state:{},version:0};
            obj.state = obj.state || {};
            obj.state.uiLanguage = lang;
            localStorage.setItem('darija-quest-storage', JSON.stringify(obj));
        }""", lang)

results = {}
with sync_playwright() as p:
    browser = p.chromium.launch()

    # ---- A1 : sidebar RTL mobile fermée ----
    for lang in ["fr", "ar"]:
        ctx = browser.new_context(viewport=MOBILE, device_scale_factor=2)
        page = ctx.new_page()
        set_lang(page, lang)
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_selector(".sidebar", state="attached", timeout=15000)
        page.wait_for_timeout(1000)
        m = page.evaluate("""() => {
            const sb = document.querySelector('.sidebar');
            const r = sb.getBoundingClientRect();
            return {dir: document.documentElement.dir,
                    left: Math.round(r.left), right: Math.round(r.right),
                    vw: innerWidth,
                    visible: r.right > 0 && r.left < innerWidth && r.width > 0};
        }""")
        results[f"A1_sidebar_closed_{lang}"] = m
        page.screenshot(path=f"{OUT}/A1_{lang}_closed.png")
        ctx.close()

    # ---- A2 : overflow grammaire mobile ----
    for lang in ["fr", "en", "es", "ar"]:
        ctx = browser.new_context(viewport=MOBILE, device_scale_factor=2)
        page = ctx.new_page()
        set_lang(page, lang)
        page.goto(BASE + "/grammaire", wait_until="networkidle")
        page.wait_for_timeout(1200)
        m = page.evaluate("""() => {
            const doc = document.documentElement;
            const btns = [...document.querySelectorAll('button')].filter(b => b.className.includes('rounded-full'));
            const rights = btns.map(b => Math.round(b.getBoundingClientRect().right));
            const over = rights.filter(r => r > innerWidth + 2);
            return {dir: document.documentElement.dir, vw: innerWidth,
                    docScrollW: doc.scrollWidth,
                    hOverflow: doc.scrollWidth > innerWidth + 2,
                    btnCount: btns.length,
                    maxRight: rights.length ? Math.max(...rights) : null,
                    overflowButtons: over};
        }""")
        results[f"A2_grammaire_{lang}"] = m
        ctx.close()

    # ---- A3 : tap targets lang-btn desktop ----
    ctx = browser.new_context(viewport=DESKTOP, device_scale_factor=2)
    page = ctx.new_page()
    set_lang(page, "fr")
    page.goto(BASE + "/", wait_until="networkidle")
    page.wait_for_selector(".lang-btn", timeout=15000)
    page.wait_for_timeout(800)
    m = page.evaluate("""() => {
        const btns = [...document.querySelectorAll('.lang-btn')];
        return {count: btns.length,
                sizes: btns.map(b => { const r=b.getBoundingClientRect();
                    return Math.round(r.width)+'x'+Math.round(r.height); }),
                allOk: btns.every(b => { const r=b.getBoundingClientRect();
                    return r.width >= 30 && r.height >= 30; })};
    }""")
    results["A3_langbtn_desktop"] = m
    page.screenshot(path=f"{OUT}/A3_desktop.png")
    ctx.close()

    browser.close()

print(json.dumps(results, ensure_ascii=False, indent=2))
