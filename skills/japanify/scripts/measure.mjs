#!/usr/bin/env node
// japanify measure: render a page at desktop 1280 and iPhone 390 and compare its typography and
// density with the archetype ranges measured on the top Japanese sites (references/benchmarks.md).
// usage: node measure.mjs <url-or-file> <portal|ec|article|data|lp|local|community> [--shots <dir>]
// needs Playwright: `npm i -D playwright && npx playwright install chromium` (or set CHROME_PATH)
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

// [median text px], [% of text at 14px or less], [median line-height], [links above the fold, desktop],
// track: max % of text with letter-spacing (headings, buttons, card titles and LP leads are tracked; body text is not)
const RANGES = {
  portal: { size: [13, 14], small: [85, 100], lh: [1.3, 1.5], fold: [50, 110], track: 15 },     // Yahoo! JAPAN, livedoor
  ec: { size: [12, 14], small: [85, 100], lh: [1.3, 1.5], fold: [25, 60], track: 15 },           // 楽天市場
  article: { size: [15, 18], small: [10, 50], lh: [1.7, 2.0], fold: [5, 40], track: 30 },         // note, Yahoo! News, TRILL
  data: { size: [12, 14], small: [70, 100], lh: [1.3, 1.5], fold: [20, 60], track: 25 },         // tenki.jp, ウェザーニュース
  lp: { size: [13, 16], small: [40, 85], lh: [1.5, 1.8], fold: [10, 40], track: 30 },  // docomo, B2B SaaS
  local: { size: [13, 16], small: [40, 95], lh: [1.4, 1.8], fold: [10, 50], track: 30 },         // 食べログ, clinic own sites
  community: { size: [12, 14], small: [85, 100], lh: [1.4, 1.6], fold: [10, 40], track: 15 },    // pixiv
};

const [target, archetype, ...rest] = process.argv.slice(2);
if (!target || !RANGES[archetype]) {
  console.error(`usage: node measure.mjs <url-or-file> <${Object.keys(RANGES).join('|')}> [--shots <dir>]`);
  process.exit(2);
}
const shots = rest[0] === '--shots' ? rest[1] : null;
const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(path.resolve(target)).href;

let chromium;
try { ({ chromium } = await import('playwright')); } catch {
  try { ({ chromium } = await import('playwright-core')); } catch {
    console.error('Playwright not found. Run: npm i -D playwright && npx playwright install chromium');
    process.exit(2);
  }
}

function measure() {
  const add = (m, k, n) => { m[k] = (m[k] || 0) + n; };
  const visible = (el) => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const size = {}, lh = {}, fam = {}, ink = {}; let chars = 0, fold = 0, tracked = 0; const xs = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = w.nextNode());) {
    const t = n.textContent.replace(/\s+/g, ''); const el = n.parentElement;
    if (!t || !el || !visible(el)) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(), c = t.length;
    chars += c; if (r.top + scrollY < innerHeight) fold += c; xs.push(r.left, r.right);
    add(size, parseFloat(cs.fontSize), c);
    if (cs.lineHeight !== 'normal') add(lh, +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2), c);
    if (parseFloat(cs.letterSpacing) > 0) tracked += c;
    add(fam, cs.fontFamily.split(',')[0].replace(/"/g, '').trim(), c); add(ink, cs.color, c);
  }
  const median = (m) => { const e = Object.entries(m).map(([k, v]) => [+k, v]).sort((a, b) => a[0] - b[0]); const tot = e.reduce((a, [, v]) => a + v, 0); let acc = 0; for (const [k, v] of e) { acc += v; if (acc >= tot / 2) return k; } return 0; };
  const top = (m) => Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0];
  xs.sort((a, b) => a - b);
  const links = [...document.querySelectorAll('a[href]')].filter(visible);
  return {
    size: median(size), lh: median(lh),
    small: Math.round((100 * Object.entries(size).filter(([k]) => +k <= 14).reduce((a, [, v]) => a + v, 0)) / (chars || 1)),
    tracked: Math.round((100 * tracked) / (chars || 1)),
    band: Math.round((xs[Math.floor(xs.length * 0.95)] || 0) - (xs[Math.floor(xs.length * 0.05)] || 0)),
    foldChars: fold, foldLinks: links.filter((a) => a.getBoundingClientRect().top + scrollY < innerHeight).length,
    font: top(fam), ink: top(ink), lang: document.documentElement.lang,
  };
}

const exe = process.env.CHROME_PATH;
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const profiles = {
  desktop: { viewport: { width: 1280, height: 800 } },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1' },
};
const r = RANGES[archetype];
const grade = (v, [lo, hi]) => (v >= lo && v <= hi ? 'ok   ' : 'CHECK');
for (const [name, opts] of Object.entries(profiles)) {
  const ctx = await browser.newContext({ ...opts, locale: 'ja-JP', timezoneId: 'Asia/Tokyo' });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await page.screenshot({ path: path.join(shots, `${name}.png`) }); }
  const m = await page.evaluate(measure);
  console.log(`\n${name} (${archetype})  lang=${m.lang}  font=${m.font}  ink=${m.ink}  content width=${m.band}px`);
  console.log(`  ${grade(m.size, r.size)} median text size   ${m.size}px          target ${r.size.join(' to ')}px`);
  console.log(`  ${grade(m.small, r.small)} text at 14px or less ${m.small}%          target ${r.small.join(' to ')}%`);
  console.log(`  ${grade(m.lh, r.lh)} median line-height   ${m.lh}           target ${r.lh.join(' to ')}`);
  console.log(`  ${m.tracked <= r.track ? 'ok   ' : 'CHECK'} tracked text         ${m.tracked}%           target ${r.track}% or less (never on body text)`);
  if (name === 'desktop') console.log(`  ${grade(m.foldLinks, r.fold)} links above the fold ${m.foldLinks}           target ${r.fold.join(' to ')}  (${m.foldChars} characters)`);
  await ctx.close();
}
await browser.close();
