#!/usr/bin/env node
// japanify check: static lint for Japan-readiness. Zero dependencies, Node 18+.
// usage: node check.mjs <file-or-dir> [...]      (exit 1 when an error is found)
//        node check.mjs --self-test
// ponytail: regex heuristics over source text, not a parser. It catches the mechanical
// misses; layout, density and copy quality still need a screenshot and a human read.
import fs from 'node:fs';
import path from 'node:path';

const EXT = /\.(html?|css|scss|sass|less|jsx?|tsx?|vue|svelte|astro|php|erb|liquid|njk|hbs|ejs)$/i;
const JP = /[\p{sc=Hira}\p{sc=Kana}\p{sc=Han}]/u;

// [severity, id, test(src, file) -> index|-1|null, message]
const RULES = [
  ['error', 'html-lang', (s, f) => /\.html?$/i.test(f) && /<html\b/i.test(s) && !/<html[^>]*\blang=["']?ja/i.test(s) ? s.search(/<html\b/i) : -1,
    'Set <html lang="ja">. Without it browsers pick Chinese glyph shapes, auto-phrase line breaking is off and screen readers use the wrong voice.'],
  ['error', 'ime-enter', (s) => {
    const i = s.search(/(key\s*===?\s*["']Enter["']|keyCode\s*===?\s*13|which\s*===?\s*13)/);
    return i >= 0 && !/isComposing|keyCode\s*===?\s*229|compositionend/.test(s) ? i : -1;
  }, 'Enter handler without an IME guard. Add `if (e.isComposing || e.keyCode === 229) return;` so confirming a kanji conversion does not submit. (forms.md)'],
  ['error', 'autocomplete-invented', (s) => s.search(/autocomplete=["'][^"']*(kana|furigana|phonetic|ruby)[^"']*["']/i),
    'Invented autocomplete value. Use name="family-name-phonetic" and leave autocomplete off; nonstandard values disable Chrome Japanese autofill. (forms.md)'],
  ['warn', 'name-order', (s) => {
    const g = s.search(/given-name|first[\s_-]?name|firstName/i), f = s.search(/family-name|last[\s_-]?name|lastName/i);
    return g >= 0 && f >= 0 && g < f ? g : -1;
  }, 'Given name comes before family name. Japanese forms ask 姓 then 名. (forms.md)'],
  ['warn', 'furigana-missing', (s) => /family-name|姓/.test(s) && /<(input|form)\b/i.test(s) && !/フリガナ|ふりがな|セイ|phonetic|kana/i.test(s) ? s.search(/family-name|姓/) : -1,
    'Name fields without フリガナ (セイ / メイ). Japanese forms collect the reading of the name. (forms.md)'],
  ['warn', 'postal-autofill', (s) => /postal-code|郵便番号/.test(s) && /<input\b/i.test(s) && !/yubinbango|zipcloud|ajaxzip|postcode-jp|digital-?address|fillAddress|h-adr/i.test(s) ? s.search(/postal-code|郵便番号/) : -1,
    'Postal code field without address auto-fill (yubinbango.js or zipcloud). Japanese users expect 郵便番号 to fill 都道府県 and 市区町村. (forms.md)'],
  ['warn', 'tax-display', (s) => /\d[\d,]*\s*円|¥\s?\d/.test(s) && !/税込|税抜|税別|tax/i.test(s) ? s.search(/\d[\d,]*\s*円|¥\s?\d/) : -1,
    'Yen prices with no 税込 / 税抜 wording anywhere. Consumer prices must be the tax-inclusive total (総額表示); say so with （税込） or a ※表示価格はすべて税込です note. (copy-and-locale.md)'],
  ['warn', 'foreign-currency', (s) => JP.test(s) ? s.search(/(?<![\w$])\$\s?\d+(\.\d+)?(?![\w{])|\bUSD\b/) : -1,
    'Dollar price on a Japanese page. Show yen with 税込 / 税抜. (copy-and-locale.md)'],
  ['warn', 'us-date', (s) => JP.test(s) ? s.search(/\b(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/20\d\d\b/) : -1,
    'US date order (MM/DD/YYYY). Use 2026/10/14 or 2026年10月14日（水）. (copy-and-locale.md)'],
  ['warn', 'tokushoho', (s) => /カートに入れる|購入手続き|add-to-cart|addToCart|カート|ご注文/.test(s) && /<footer\b/i.test(s) && !/特定商取引法|特商法/.test(s) ? s.search(/<footer\b/i) : -1,
    'Selling online without a 特定商取引法に基づく表記 link. It is legally required for EC in Japan. (trust-and-legal.md)'],
  ['warn', 'privacy-link', (s) => /type=["']?(email|tel)/i.test(s) && !/プライバシー|個人情報|privacy/i.test(s) ? s.search(/type=["']?(email|tel)/i) : -1,
    'Form collects personal data with no プライバシーポリシー / 個人情報の取り扱い link. (trust-and-legal.md)'],
  ['warn', 'thin-font-first', (s) => s.search(/font-family\s*:\s*["']?(Yu ?Gothic|YuGothic|游ゴシック|system-ui)/i),
    'Yu Gothic or system-ui first renders thin on Windows. Start with "Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,sans-serif. (typography.md)'],
  ['warn', 'no-jp-font', (s) => {
    const m = [...s.matchAll(/font-family\s*:\s*([^;}{]+)/gi)].find((x) => !/inherit|var\(|monospace|icon|serif\s*$/i.test(x[1]) && !/Hiragino|ヒラギノ|Meiryo|メイリオ|Noto Sans (JP|CJK)|BIZ UD|Yu|游|M PLUS|Zen |Mincho|明朝|sans-serif|system-ui|-apple-system/i.test(x[1]));
    return m ? m.index : -1;
  }, 'font-family with no Japanese font and no generic fallback. Japanese glyphs will fall back unpredictably. (typography.md)'],
  ['warn', 'italic', (s) => JP.test(s) ? s.search(/font-style\s*:\s*italic/i) : -1,
    'Italic on a Japanese page. Browsers fake-slant kanji; emphasize with bold, color or 傍点. (typography.md)'],
  ['warn', 'negative-tracking', (s) => s.search(/letter-spacing\s*:\s*-\s*0?\.\d+(em|px)/i),
    'Negative letter-spacing. Japanese text is set solid or slightly open; tight Latin-style tracking collides kana. (typography.md)'],
  ['warn', 'giant-type', (s) => {
    for (const m of s.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)(px|rem)/gi)) if ((m[2] === 'rem' ? m[1] * 16 : +m[1]) >= 56) return m.index;
    for (const m of s.matchAll(/\btext-(6xl|7xl|8xl|9xl)\b/g)) return m.index;
    return -1;
  }, 'Display type at 56px or more. The largest headings on the top 10 Japanese sites are 32 to 40px; huge Western-style heroes read as foreign. (typography.md)'],
  ['warn', 'input-zoom', (s) => {
    for (const m of s.matchAll(/(input|select|textarea)[^{}]*\{[^}]*font-size\s*:\s*(\d+(?:\.\d+)?)px/gi)) if (+m[2] < 16) return m.index;
    return -1;
  }, 'Form control font-size below 16px. iOS Safari (about 60% of Japanese mobile) zooms in on focus. (typography.md)'],
  ['info', 'line-break', (s) => /\.css$|<style|styled|css`/i.test(s) && JP.test(s) && !/line-break\s*:\s*strict/.test(s) ? 0 : -1,
    'No `line-break: strict`. Add it to body so lines never start with ゃ っ ー 。. (typography.md)'],
  ['info', 'jp-latin-space', (s) => {
    const m = s.match(/>[^<]*?(?:[\p{sc=Hira}\p{sc=Kana}\p{sc=Han}] [A-Za-z]{2}|[A-Za-z]{2} [\p{sc=Hira}\p{sc=Kana}\p{sc=Han}])[^<]*</u);
    return m ? m.index : -1;
  }, 'Half-width space between Japanese and Latin text (PDF ファイル). Write PDFファイル and let `text-autospace` add the gap. (copy-and-locale.md)'],
  ['info', 'western-quotes', (s) => s.search(/[\p{sc=Hira}\p{sc=Kana}\p{sc=Han}][“”]|[“”][\p{sc=Hira}\p{sc=Kana}\p{sc=Han}]/u),
    'Curly quotes in Japanese text. Use 「」 and 『』. (copy-and-locale.md)'],
  ['info', 'webfont-body', (s) => s.search(/fonts\.googleapis\.com\/css2?\?family=Noto\+Sans\+JP/),
    'Noto Sans JP loaded from Google Fonts. None of the top 10 sites loads a Japanese web font for body text; the OS stack is faster. Fine for headings or brand copy. (typography.md)'],
  ['info', 'no-zoom', (s) => s.search(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/i),
    'Zoom disabled in the viewport meta. Some Japanese sites do this, but it fails WCAG 1.4.4 / JIS X 8341-3. (trust-and-legal.md)'],
];

export function check(src, file = 'input.html') {
  const out = [];
  for (const [sev, id, test, msg] of RULES) {
    const i = test(src, file);
    if (i != null && i >= 0) out.push({ sev, id, line: src.slice(0, i).split('\n').length, msg });
  }
  return out;
}

function walk(p) {
  const st = fs.statSync(p);
  if (st.isFile()) return EXT.test(p) ? [p] : [];
  return fs.readdirSync(p).filter((n) => !/^(node_modules|\.git|dist|build|\.next|vendor)$/.test(n)).flatMap((n) => walk(path.join(p, n)));
}

function selfTest() {
  const ids = (s, f) => check(s, f).map((x) => x.id);
  const bad = `<html><body><form><input name="given-name"><input name="family-name"><input name="postal-code"></form>
<p>価格 1,980円</p><footer>カート</footer><style>h1{font-size:72px;letter-spacing:-0.03em;font-family:Inter}</style>
<script>el.addEventListener('keydown',e=>{if(e.key==='Enter')send()})</script></body></html>`;
  const got = ids(bad, 'x.html');
  for (const id of ['html-lang', 'ime-enter', 'name-order', 'furigana-missing', 'postal-autofill', 'tax-display', 'tokushoho', 'giant-type', 'negative-tracking', 'no-jp-font'])
    console.assert(got.includes(id), `expected ${id}`);
  const good = `<html lang="ja"><body><form class="h-adr"><input name="family-name"><input name="given-name"><input name="family-name-phonetic">
<input name="postal-code"></form><p>1,980円（税込）</p><footer><a>特定商取引法に基づく表記</a> カート</footer>
<style>body{line-break:strict;font-family:"Hiragino Sans",Meiryo,sans-serif}</style>
<script>el.addEventListener('keydown',e=>{if(e.key!=='Enter'||e.isComposing||e.keyCode===229)return})</script></body></html>`;
  console.assert(ids(good, 'x.html').length === 0, `clean page flagged: ${ids(good, 'x.html')}`);
  console.assert(ids('<p>PDF ファイル</p>').includes('jp-latin-space'), 'expected jp-latin-space');
  console.assert(!ids('<p>受付 9:00〜17:00</p>').includes('jp-latin-space'), 'label + time is fine');
  console.assert(ids('<p>テスト“です”</p>').includes('western-quotes'), 'expected western-quotes');
  console.log('self-test done');
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
