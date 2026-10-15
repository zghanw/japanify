#!/usr/bin/env node
// japanify check: static lint for Japan-readiness. Zero dependencies, Node 18+.
// usage: node check.mjs <file-or-dir> [...]      (exit 1 when an error is found)
//        node check.mjs --self-test
// ponytail: regex heuristics over source text, not a parser. It catches the mechanical
// misses; layout, density and copy quality still need a screenshot and a human read.
import fs from 'node:fs';
import path from 'node:path';

const EXT = /\.(html?|css|scss|sass|less|m?jsx?|tsx?|vue|svelte|astro|php|erb|liquid|njk|hbs|ejs)$/i;
const STYLE_OR_SCRIPT_ONLY = /\.(css|scss|sass|less|m?js|ts)$/i;
const MARKUP = /\.(html?|vue|svelte|astro|php|erb|liquid|njk|hbs|ejs)$/i;
const JP = /[\p{sc=Hira}\p{sc=Kana}\p{sc=Han}]/u;
const JP_FONT = /Hiragino|ヒラギノ|Meiryo|メイリオ|Noto Sans (JP|CJK)|Noto Serif JP|BIZ UD|Yu ?Gothic|YuGothic|游|Yu ?Mincho|M PLUS|Zen |Mincho|明朝|IPA|Osaka|MS P?Gothic|ＭＳ/i;

const blank = (s) => s.replace(/[^\n]/g, ' ');

// Views with identical length so every index maps to the real line:
//   code: source without HTML, CSS and JS comments
//   text: visible copy only (markup files): no tags, attributes, <style> or <script> bodies
function views(src, file) {
  const code = src
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:"'`\\\w])(\/\/[^\n]*)/g, (m, p, c) => p + blank(c));
  const text = STYLE_OR_SCRIPT_ONLY.test(file) ? blank(code)
    : code.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, blank).replace(/<[^>]*>/g, blank);
  // css: stylesheet text only (whole file for CSS / JS, <style> bodies for markup)
  let css = code;
  if (MARKUP.test(file)) {
    css = blank(code);
    for (const m of code.matchAll(/(<style\b[^>]*>)([\s\S]*?)<\/style>/gi)) {
      const start = m.index + m[1].length;
      css = css.slice(0, start) + m[2] + css.slice(start + m[2].length);
    }
  }
  return { code, text, css };
}

const firstOf = (s, re) => s.search(re);
const px = (n, unit) => (unit === 'rem' || unit === 'em' ? n * 16 : n);
const FORM_CONTROL = /<(input\b(?![^>]*type=["']?(hidden|checkbox|radio|submit|button|image|reset|file|range|color)\b)[^>]*>|select\b|textarea\b)/i;

// [severity, id, test({code,text,src,file}) -> index | -1, message]
const RULES = [
  ['error', 'html-lang', ({ code, file }) => /\.html?$/i.test(file) && /<html\b/i.test(code) && !/<html[^>]*\blang=["']?ja/i.test(code) ? firstOf(code, /<html\b/i) : -1,
    'Set <html lang="ja">. Without it browsers pick Chinese glyph shapes, auto-phrase line breaking is off and screen readers use the wrong voice.'],
  ['error', 'ime-enter', ({ code }) => {
    for (const m of code.matchAll(/key\s*===?\s*["']Enter["']|keyCode\s*===?\s*13\b|which\s*===?\s*13\b/g)) {
      const around = code.slice(Math.max(0, m.index - 400), m.index + 300);
      if (!/isComposing|===?\s*229|composition(start|end)|composing/i.test(around)) return m.index;
    }
    return -1;
  }, 'Enter handler without an IME guard. Add `if (e.isComposing || e.keyCode === 229) return;` so confirming a kanji conversion does not submit. A plain <form> with a submit button needs no handler. (forms.md)'],
  ['error', 'autocomplete-invented', ({ code }) => firstOf(code, /autocomplete=["'][^"']*(kana|furigana|phonetic|ruby)[^"']*["']/i),
    'Invented autocomplete value. Use name="family-name-phonetic" and leave autocomplete off; nonstandard values disable Chrome Japanese autofill. (forms.md)'],
  ['warn', 'name-order', ({ code }) => {
    const g = firstOf(code, /given-name|first[\s_-]?name|firstName/i), f = firstOf(code, /family-name|last[\s_-]?name|lastName/i);
    return g >= 0 && f >= 0 && g < f ? g : -1;
  }, 'Given name comes before family name. Japanese forms ask 姓 then 名. (forms.md)'],
  ['warn', 'furigana-missing', ({ code, text }) => /<input\b/i.test(code) && (/family-name/.test(code) || /姓/.test(text)) && !/フリガナ|ふりがな|セイ|phonetic|kana/i.test(code) ? Math.max(firstOf(code, /family-name/), firstOf(text, /姓/)) : -1,
    'Name fields without フリガナ (セイ / メイ). Japanese forms collect the reading of the name. (forms.md)'],
  ['warn', 'postal-autofill', ({ code }) => {
    const i = firstOf(code, /<input\b[^>]*(postal|zip|yubin|郵便)/i);
    return i >= 0 && !/yubinbango|zipcloud|ajaxzip|postcode-jp|digital-?address|bindPostalCode|fillAddress|h-adr/i.test(code) ? i : -1;
  }, 'Postal code input without address auto-fill (yubinbango.js, zipcloud or bindPostalCode in japanify.js). Japanese users expect 郵便番号 to fill 都道府県 and 市区町村. (forms.md)'],
  ['warn', 'pref-order', ({ code }) => {
    const i = code.indexOf('青森県');           // only appears in prefecture lists
    if (i < 0) return -1;
    const h = code.lastIndexOf('北海道', i);
    if (h < 0 || i - h > 300) return i;      // JIS order starts 北海道, 青森県
    const list = code.slice(h, h + 3000);
    const pos = ['東京都', '大阪府', '沖縄県'].map((p) => list.indexOf(p));
    return pos.every((p, k) => p > 0 && (!k || p > pos[k - 1])) ? -1 : h;
  }, 'Prefectures not in JIS X 0401 order (北海道 first, 沖縄県 last). Use PREFS from japanify.js. (forms.md)'],
  ['warn', 'required-badge', ({ code, text }) => {
    const i = firstOf(code, /<(input|select|textarea)\b[^>]*\brequired\b/i);
    return i >= 0 && !/必須/.test(text) ? i : -1;
  }, 'Required fields with no visible 必須 badge. Put a 必須 / 任意 text badge next to each label. (forms.md)'],
  ['warn', 'privacy-link', ({ code, text }) => {
    const i = firstOf(code, /<input\b[^>]*type=["']?(email|tel)\b/i);
    return i >= 0 && !/<a\b[^>]*href=["'][^"']*privac/i.test(code) && !/プライバシー|個人情報/.test(text) ? i : -1;
  }, 'Form collects personal data with no visible プライバシーポリシー / 個人情報の取り扱い link or notice. (trust-and-legal.md)'],
  ['warn', 'tax-display', ({ text }) => {
    const i = firstOf(text, /\d[\d,]*\s*円|[¥￥]\s?\d/);
    return i >= 0 && !/税込|税抜|税別/.test(text) ? i : -1;
  }, 'Yen prices with no 税込 / 税抜 wording in the visible text. Consumer prices must be the tax-inclusive total (総額表示); say so with （税込） or a ※表示価格はすべて税込です note. (copy-and-locale.md)'],
  ['warn', 'foreign-currency', ({ text }) => firstOf(text, /(?<![\w$])\$\s?\d|\bUSD\b/),
    'Dollar price in the visible text. Show yen with 税込 / 税抜. (copy-and-locale.md)'],
  ['warn', 'us-date', ({ text }) => firstOf(text, /\b(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/20\d\d\b/),
    'US date order (MM/DD/YYYY). Use 2026/10/14 or 2026年10月14日（水）. (copy-and-locale.md)'],
  ['warn', 'tokushoho', ({ text }) => {
    const i = firstOf(text, /カートに入れる|かごに追加|購入手続き|ご注文|月額|年額|定期購入|定期便|有料プラン|サブスクリプション/);
    return i >= 0 && !/特定商取引法|特商法/.test(text) ? i : -1;
  }, 'Paid offering (cart, order, subscription) with no 特定商取引法に基づく表記 link. Required for online sales to consumers; B2B-only services are exempt but most still show it. (trust-and-legal.md)'],
  ['warn', 'thin-font-first', ({ code }) => firstOf(code, /(font-family|--[\w-]+)\s*:\s*["']?(Yu ?Gothic|YuGothic|游ゴシック|system-ui)\b/i),
    'Yu Gothic or system-ui first renders thin on Windows. Start with "Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,sans-serif. (typography.md)'],
  ['warn', 'no-jp-font', ({ code }) => {
    const fams = [...code.matchAll(/font-family\s*:\s*([^;}{]+)/gi)].filter((m) => !/^\s*(inherit|initial|unset|var\()/i.test(m[1]) && !/monospace|icon/i.test(m[1]));
    if (!fams.length) return -1;
    const props = [...code.matchAll(/--[\w-]+\s*:\s*([^;}{]+)/gi)].map((m) => m[1]);
    return [...fams.map((m) => m[1]), ...props].some((v) => JP_FONT.test(v)) ? -1 : fams[0].index;
  }, 'No Japanese font named in any font stack. Kanji fall back to the browser default (often thin Yu Gothic or MS PGothic on Windows). (typography.md)'],
  ['warn', 'italic', ({ code, src }) => JP.test(src) ? firstOf(code, /font-style\s*:\s*italic/i) : -1,
    'Italic on a Japanese page. Browsers fake-slant kanji; emphasize with bold, color or 傍点. (typography.md)'],
  ['warn', 'negative-tracking', ({ code }) => firstOf(code, /letter-spacing\s*:\s*-\s*0?\.\d+(em|px)/i),
    'Negative letter-spacing. Japanese text is set solid or slightly open; tight Latin-style tracking collides kana. (typography.md)'],
  ['warn', 'giant-type', ({ code }) => {
    for (const m of code.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem)\b/gi)) if (px(+m[1], m[2]) > 40) return m.index;
    for (const m of code.matchAll(/font-size\s*:\s*clamp\([^,]+,[^,]+,\s*(\d+(?:\.\d+)?)(px|rem)\s*\)/gi)) if (px(+m[1], m[2]) > 40) return m.index;
    const t = firstOf(code, /\btext-([5-9]xl)\b/);
    return t;
  }, 'Display type above 40px. The largest headings on the top 10 Japanese sites are 32 to 40px; huge Western-style heroes read as foreign. (typography.md)'],
  ['warn', 'input-zoom', ({ css, code }) => {
    let best = 0, inherit = false, small = -1;
    for (const m of css.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      if (!/input|select|textarea|form|field|control/i.test(m[1])) continue;
      const d = m[2].match(/font(?:-size)?\s*:[^;]*?(\d+(?:\.\d+)?)(px|rem)\b/i);
      if (d) { const v = px(+d[1], d[2]); best = Math.max(best, v); if (v < 16 && small < 0) small = m.index + m[1].length; }
      if (/font(-size)?\s*:\s*inherit/i.test(m[2])) inherit = true;
    }
    if (small >= 0 && best < 16) return small;
    const body = css.match(/(?:^|[\s,}])(html|body)\s*\{[^}]*font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem)/i);
    const ok = best >= 16 || (inherit && body && px(+body[2], body[3]) >= 16);
    const c = firstOf(code, FORM_CONTROL);
    return c >= 0 && !ok ? c : -1;
  }, 'Form controls below 16px (browser default is 13.33px). iOS Safari, about 60% of Japanese mobile, zooms in on focus. Set inputs to 16px. (typography.md)'],
  ['info', 'body-ink', ({ css: code }) => firstOf(code, /(?:^|[\s,}])(html|body)\s*\{[^}]*?(?<![-\w])color\s*:\s*(#000\b|#000000\b|black\b)/i),
    'Body text in pure black. The top sites use #333, #444 or #272727. (typography.md)'],
  ['info', 'body-tracking', ({ css: code }) => firstOf(code, /(?:^|[\s,}])(body|p)\s*\{[^}]*letter-spacing\s*:\s*(0?\.(0[5-9]|[1-9])\d*em|[1-9]\d*(\.\d+)?px)/i),
    'Letter-spacing on body text. The top sites set body text solid (0); tracking belongs on headings and buttons only. (typography.md)'],
  ['info', 'loose-leading', ({ css: code }) => {
    for (const m of code.matchAll(/(?:^|[\s,}])(body|p)\s*\{[^}]*line-height\s*:\s*(\d+(?:\.\d+)?)\s*[;}]/gi)) if (+m[2] > 2.1) return m.index;
    return -1;
  }, 'Line-height above 2.1 on body text. Reading pages measure 1.8 to 2.0, dense pages 1.3 to 1.5. (typography.md)'],
  ['info', 'line-break', ({ css: code, src }) => /\bbody\s*\{/.test(code) && JP.test(src) && !/line-break\s*:\s*strict/.test(code) ? firstOf(code, /\bbody\s*\{/) : -1,
    'No `line-break: strict`. Add it to body so lines never start with ゃ っ ー 。. (typography.md)'],
  ['info', 'jp-latin-space', ({ text }) => firstOf(text, /[\p{sc=Hira}\p{sc=Kana}] [A-Za-z]{2}|[A-Za-z]{2} [\p{sc=Hira}\p{sc=Kana}]/u),
    'Half-width space between kana and a Latin word inside a phrase (Slack と連携, PDF ファイル). Write Slackと連携. Spaces between phrases in headlines and listings are fine. (copy-and-locale.md)'],
  ['info', 'western-quotes', ({ text }) => firstOf(text, /[\p{sc=Hira}\p{sc=Kana}\p{sc=Han}][“”]|[“”][\p{sc=Hira}\p{sc=Kana}\p{sc=Han}]/u),
    'Curly quotes in Japanese text. Use 「」 and 『』. (copy-and-locale.md)'],
  ['info', 'webfont-body', ({ code }) => firstOf(code, /fonts\.googleapis\.com\/css2?\?family=Noto\+Sans\+JP/),
    'Noto Sans JP loaded from Google Fonts. None of the top 10 sites loads a Japanese web font for body text; the OS stack is faster. Fine for headings or brand copy. (typography.md)'],
  ['info', 'no-zoom', ({ code }) => firstOf(code, /user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i),
    'Zoom disabled in the viewport meta. Some Japanese sites do this, but it fails WCAG 1.4.4 / JIS X 8341-3. (trust-and-legal.md)'],
];

export function check(src, file = 'input.html') {
  const v = { ...views(src, file), src, file };
  const out = [];
  for (const [sev, id, test, msg] of RULES) {
    const i = test(v);
    if (i != null && i >= 0) out.push({ sev, id, line: src.slice(0, i).split('\n').length + (src[i] === '\n' ? 1 : 0), msg });
  }
  return out;
}

function walk(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return EXT.test(p) ? [p] : [];
  return fs.readdirSync(p).filter((n) => !/^(node_modules|\.git|dist|build|\.next|vendor)$/.test(n)).flatMap((n) => walk(path.join(p, n)));
}

function selfTest() {
  let failed = 0;
  const ids = (s, f = 'x.html') => check(s, f).map((x) => x.id);
  const expect = (cond, msg) => { if (!cond) { failed++; console.error(`FAIL: ${msg}`); } };
  const bad = `<html><body><form><input name="given-name"><input name="family-name"><input name="postal-code" required></form>
<p>価格 1,980円</p><footer>カートに入れる</footer><style>h1{font-size:72px;letter-spacing:-0.03em;font-family:Inter}</style>
<script>el.addEventListener('keydown',e=>{if(e.key==='Enter')send()})</script></body></html>`;
  const got = ids(bad);
  for (const id of ['html-lang', 'ime-enter', 'name-order', 'furigana-missing', 'postal-autofill', 'tax-display', 'tokushoho', 'giant-type', 'negative-tracking', 'no-jp-font', 'required-badge', 'input-zoom'])
    expect(got.includes(id), `expected ${id} on the bad page`);
  const good = `<html lang="ja"><body><form class="h-adr"><input name="family-name"><input name="given-name"><input name="family-name-phonetic">
<input name="postal-code"></form><p>1,980円（税込）</p><footer><a>特定商取引法に基づく表記</a> カートに入れる</footer>
<style>body{line-break:strict;font-family:"Hiragino Sans",Meiryo,sans-serif} input{font-size:16px}</style>
<script>el.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing||e.keyCode===229)return})</script></body></html>`;
  expect(ids(good).length === 0, `clean page flagged: ${ids(good)}`);
  // copy rules read visible text only, not comments or class names
  expect(!ids('<html lang="ja"><style>/* 円 at about 0.58x */ .jp-tax{}</style><p>PDFファイル</p></html>').includes('jp-latin-space'), 'CSS comment must not trigger jp-latin-space');
  expect(ids('<html lang="ja"><style>.jp-tax{color:red}</style><p>1,980円</p></html>').includes('tax-display'), 'class name .jp-tax must not satisfy tax-display');
  expect(ids('<p>Slack と連携</p>').includes('jp-latin-space'), 'expected jp-latin-space');
  expect(!ids('<p>受付 9:00〜17:00</p><p>1LDK 静岡駅 徒歩8分</p>').includes('jp-latin-space'), 'separators next to kanji and digits are fine');
  expect(ids('<p>テスト“です”</p>').includes('western-quotes'), 'expected western-quotes');
  // IME guard is checked per handler
  expect(ids(`<script>a.onkeydown=e=>{if(e.isComposing)return};\n${'x;'.repeat(300)}\nb.onkeydown=e=>{if(e.key==='Enter')go()}</script>`).includes('ime-enter'), 'second unguarded handler must be flagged');
  // privacy link must be visible, not a class name
  expect(ids('<html lang="ja"><input type="email"><div class="privacy-box"></div></html>').includes('privacy-link'), 'class name must not satisfy privacy-link');
  // postal rule needs an actual input, not a selector string
  expect(!ids("<script>q('[name=postal-code]')</script>").includes('postal-autofill'), 'selector string is not a postal input');
  // headings and inputs
  expect(ids('<style>h1{font-size:clamp(24px,4vw,48px)}</style>').includes('giant-type'), 'clamp max above 40px');
  expect(!ids('<style>h1{font-size:36px}</style>').includes('giant-type'), '36px heading is fine');
  expect(ids('<html lang="ja"><input type="text"></html>').includes('input-zoom'), 'unstyled input defaults to 13.33px');
  expect(ids('<style>input{font:14px/1.4 sans-serif}</style><input type="text">').includes('input-zoom'), 'font shorthand below 16px');
  expect(ids('<style>body{color:#000;letter-spacing:.1em}</style>').includes('body-tracking'), 'expected body-tracking');
  expect(ids('<script>const P=["沖縄県","大阪府","東京都","青森県","北海道"]</script>').includes('pref-order'), 'expected pref-order');
  expect(!ids('<address>東京都千代田区</address><script>const P=["北海道","青森県","東京都","大阪府","沖縄県"]</script>').includes('pref-order'), 'address before a correct list is fine');
  expect(ids('<style>:root{--f:"Yu Gothic",sans-serif}</style>').includes('thin-font-first'), 'thin font through a custom property');
  console.log(failed ? `self-test: ${failed} failure(s)` : 'self-test passed');
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const args = process.argv.slice(2);
  if (args[0] === '--self-test') selfTest();
  else {
    if (!args.length) { console.error('usage: node check.mjs <file-or-dir> [...]'); process.exit(2); }
    let errors = 0, total = 0;
    for (const f of args.flatMap(walk)) {
      for (const r of check(fs.readFileSync(f, 'utf8'), f)) {
        total++; if (r.sev === 'error') errors++;
        console.log(`${f}:${r.line}  ${r.sev.padEnd(5)}  ${r.id}  ${r.msg}`);
      }
    }
    console.log(total ? `\n${total} finding(s), ${errors} error(s).` : 'No findings.');
    process.exit(errors ? 1 : 0);
  }
}
