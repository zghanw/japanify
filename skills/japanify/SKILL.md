---
name: japanify
description: Use when building, converting, localizing or reviewing a website or web app for Japanese users or the Japanese market (日本向けサイト, 日本語UI, Japan-ready, "make it look Japanese", ローカライズ), including Japanese e-commerce, portals, media, corporate and SaaS landing pages, local business sites and forms with names, addresses or prices in yen.
---

# japanify

## Overview

Japanese users judge a site in seconds by conventions they never name: small solid type, dense link-rich layouts, dark grey text, bar-marked headings, tax-inclusive yen, 姓・名 with フリガナ, postal-code address fill, and a footer full of company and legal links. This skill encodes those conventions as numbers measured on the 10 most-used Japanese websites (Yahoo! JAPAN, 楽天市場, pixiv, note, docomo, tenki.jp, ウェザーニュース, Ameba, livedoor, TRILL) plus 食べログ.

**Core principle:** build what Japanese users already use every day, measured, not what "Japanese style" looks like from outside. No cherry blossoms, no washi textures, no forced Mincho, no 72px hero.

## When to use

- Building a new site or app for Japan, or converting an existing (often Western) site for Japanese users.
- Reviewing a Japanese page that "feels off" or "looks translated".
- Any form that collects Japanese names, addresses or phone numbers; any page that shows yen prices.

Not for: pages in Japanese aimed at overseas readers with a Western brand system they must keep (still apply forms.md, copy-and-locale.md and the engineering rules below).

## Workflow

1. **Pick the archetype** from the table below. It decides width, density, type mode and section order. If converting, classify what the page does, not how it looks now.
2. **Set tokens** from the Quick reference. Start from `assets/japanify.css` (copy it in, override `--jp-brand` and friends) unless the project has its own system; then map the same values into it.
3. **Lay out the page** with the recipe in `references/layout-and-components.md`.
4. **Write the copy in Japanese** following `references/copy-and-locale.md`. Rewrite, do not translate sentence by sentence.
5. **Build forms** with `references/forms.md` and `assets/japanify.js` (IME-safe Enter, postal code fill, normalization).
6. **Add trust and legal pieces** from `references/trust-and-legal.md` (footer links, 特定商取引法に基づく表記, 会社概要, 外部送信 notice).
7. **Verify.** Run `node scripts/check.mjs <src-dir>` and fix every error and warning that applies. Then screenshot desktop 1280px and iPhone 390px and compare against `references/benchmarks.md`: text size share, line-height, links above the fold, content width.

| Archetype | Like | Width | Body | Line-height | Above the fold |
|---|---|---|---|---|---|
| Portal / news | Yahoo! JAPAN, livedoor news | Fixed 950 to 1,050px, main + 300px rail | 14px, lists 13px | 1.4 | 50 to 110 links |
| EC shop / mall | 楽天市場 | 1,000 to 1,200px | 12 to 14px | 1.3 to 1.5 | Banners + category nav, 25 to 40 links |
| Article / blog | note, Yahoo! News, TRILL, Ameba | 620 to 740px column (+ 300px rail) | 16px (note 18px desktop) | 1.8 to 2.0 | Title, date, author |
| Data / utility | tenki.jp, ウェザーニュース | Fixed 1,048 to 1,070px | 14px, tables 12px | 1.4 | The main table or map |
| Corporate / B2B LP | docomo, SmartHR-type SaaS | Max 1,100 to 1,220px | 14 to 16px | 1.6 to 1.8 | Hero, 2 CTAs, trust numbers with ※ |
| Local business | 食べログ store page, clinics | 960 to 1,100px | 13 to 14px | 1.4 to 1.5 | Name, rating, 予約 + 電話, hours |
| Community / app | pixiv | Fixed 1,016px | 14px | 1.5 | Tabs + feed |

## Quick reference (measured)

| Item | Value |
|---|---|
| Font stack | `"Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,sans-serif`. No Japanese web font for body text (none of the top 10 loads one). Never Yu Gothic or system-ui first. |
| Text size | 70 to 100% of text at 14px or less on utility pages. Metadata 11 to 12px. h1 20 to 32px. Nothing on the top sites goes above 40px. |
| Line-height | Dense UI 1.3 to 1.5. Reading 1.8 to 2.0. |
| Tracking | 0 on body. `font-feature-settings:"palt"` + .04em only on headings, nav, buttons, card titles. |
| Text color | #333 / #444 / #272727, not #000. Secondary #666. |
| Links | Deep blue (#1d3994, #0b5daa, #2355a5), underline on hover only on dense pages. Navigation lists may use body color with a › chevron (docomo). |
| Headings | Bars and rules: 6 to 10px left bar, 3 to 4px bottom rule, tinted strip, or a brand marker. |
| Radius / shadow | 0 to 4px on portals and EC, 8px on modern sites, pills for app buttons. Borders over shadows. |
| Line breaking | `line-break:strict`, `word-break:auto-phrase` on headings, no spaces between Japanese and Latin (PDFファイル). |
| Prices | Tax-inclusive total, labelled `1,980円（税込）` or covered by one ※表示価格はすべて税込です note. Number in a Latin font, 円 about 0.6x and bold. EC price red #bf0000. |
| Dates | 2026年10月14日（水）, 2026/10/14, 10/14(水). 土 blue, 日・祝 red. 24-hour time. Asia/Tokyo. |
| Mobile | iOS is about 60% of Japanese mobile: test Safari first. Inputs 16px. Sticky header 44 to 56px. |

## Engineering rules that are never optional

- `<html lang="ja">`.
- Every custom Enter handler checks `e.isComposing || e.keyCode === 229` (IME conversion).
- Names: 姓 then 名, plus フリガナ (セイ / メイ). Never First name / Last name order.
- Address: 郵便番号 (auto-fills 都道府県 and 市区町村) → 都道府県 select in JIS order → 市区町村 → 番地 → 建物名 (任意).
- Accept full-width input and normalize on blur. Never reject 全角.
- Consumer prices show the tax-inclusive total (総額表示).
- Selling online requires a 特定商取引法に基づく表記 page linked from the footer.
- 必須 / 任意 text badges next to every label.
- No italics on Japanese text. No faux bold. No negative letter-spacing.

## Converting an existing site

Keep the brand color, logo and content. Change: type system (stack, sizes, line-heights, tracking), width and density (add the sections Japanese users expect for that archetype), headings (bars and rules), copy (rewrite in Japanese register), CTAs (add the lower-commitment second CTA such as 資料ダウンロード), forms (Japanese field order and helpers), prices and dates, and the footer (company, legal, contact with hours). Remove: oversized hero type, decorative gradients that replace content, first-name testimonials, dollar prices, "Cancel anytime" style one-liners without detail.

## Common mistakes

| Mistake | Fix |
|---|---|
| "Japanese aesthetic" clichés: sakura, washi, red-and-white, Mincho everywhere | Use the archetype's real conventions. Mincho only for traditional brands' headings. |
| Western hero: 56 to 72px headline, one sentence, huge whitespace | 28 to 40px headline with a concrete benefit, sub-copy, 2 CTAs and trust numbers with ※ notes. |
| line-height 1.8 and letter-spacing on every element | Dense UI 1.4 to 1.5 and 0 tracking; 1.8 to 2.0 only for reading text; palt only on headings. |
| Noto Sans JP from Google Fonts as the body font | OS stack. Web fonts only for logo or headings. |
| Sparse page with 5 links above the fold | Japanese users expect choices up front: notices, rankings, categories, side rail. |
| Machine-translated copy (あなたの, もっと学ぶ, 始めましょう！) | Noun-ending labels, です・ます body, established CTA words. |
| No company address, phone or legal pages | Footer with 会社概要, 特商法, プライバシーポリシー, 受付時間. |
| Search box that submits on IME Enter | `imeSafeEnter` from assets/japanify.js. |
| Prices without 税込, dates in MM/DD/YYYY | `yen()`, `longDate()` from assets/japanify.js. |

## Red flags: stop and re-check

- You chose sizes or line-heights without looking at the archetype row.
- Any heading above 40px, any body text above 18px.
- A form with no フリガナ, no 郵便番号 auto-fill, or First name first.
- Prices with no 税込 wording anywhere, a footer without company details.
- You have not run `scripts/check.mjs` or looked at a 390px screenshot.

## Files

| File | Use it for |
|---|---|
| `references/benchmarks.md` | Measured numbers per site, ranking method, per-site rules |
| `references/typography.md` | Font stacks, sizes, line-height, palt, line breaking, vertical text, ruby |
| `references/layout-and-components.md` | Archetype recipes, section order, component CSS |
| `references/forms.md` | Name, furigana, address, phone, IME, validation, confirm flow |
| `references/copy-and-locale.md` | Register, CTA vocabulary, punctuation, dates, money, numbers |
| `references/trust-and-legal.md` | Footer, 特商法, privacy, 外部送信, payments, LINE, accessibility |
| `assets/japanify.css` | Drop-in tokens and components |
| `assets/japanify.js` | IME-safe Enter, postal code fill, normalization, date and yen formatters |
| `scripts/check.mjs` | Static Japan-readiness lint (`node scripts/check.mjs src/`) |
