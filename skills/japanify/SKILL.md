---
name: japanify
description: Use when building, converting, localizing or reviewing a website or web app for Japanese users or the Japanese market (日本向けサイト, 日本語UI, Japan-ready, "make it look Japanese", ローカライズ), including Japanese e-commerce, portals, media, corporate and SaaS landing pages, clinics and local business sites, and forms with names, addresses or prices in yen.
---

# japanify

## Overview

Japanese users judge a site in seconds by conventions they never name: small solid type, dense link-rich layouts, dark grey text, bar-marked headings, tax-inclusive yen, 姓・名 with フリガナ, postal-code address fill, and a footer full of company and legal links. This skill encodes those conventions as numbers measured on the 10 most-used Japanese websites (Yahoo! JAPAN, 楽天市場, pixiv, note, docomo, tenki.jp, ウェザーニュース, Ameba, livedoor, TRILL) plus 食べログ.

**Core principle:** build what Japanese users already use every day, measured, not what "Japanese style" looks like from outside. No cherry blossoms, no washi textures, no forced Mincho, no 72px hero.

## When to use

- Building a new site or app for Japan, or converting an existing (often Western) site for Japanese users.
- Reviewing a Japanese page that "feels off" or "looks translated".
- Any form that collects Japanese names, addresses or phone numbers; any page that shows yen prices.

## Workflow

1. **Pick the archetype** from the table below. It decides width, density, type mode and section order. If converting, classify what the page does, not how it looks now.
2. **Set tokens** from the Quick reference. Start from `assets/japanify.css` (paste it in, override `--jp-brand` and friends) unless the project has its own system; then map the same values into it.
3. **Lay out the page** with the recipe in `references/layout-and-components.md`.
4. **Write the copy in Japanese** following `references/copy-and-locale.md`. Rewrite, do not translate sentence by sentence.
5. **Build forms** with `references/forms.md` and `assets/japanify.js` (works as a plain `<script>` or an import).
6. **Add trust and legal pieces** from `references/trust-and-legal.md`, including the industry rules (医療広告ガイドライン, 薬機法, 景品表示法) when they apply.
7. **Verify.** `node scripts/check.mjs <src-dir>`: fix every error and the warnings that apply. Then `node scripts/measure.mjs <page> <archetype> --shots <dir>` (needs Playwright) and look at the desktop and 390px screenshots. Every line should say ok, or you should know why not.

| Archetype | Like | Width | Body | Line-height | Above the fold (desktop) |
|---|---|---|---|---|---|
| `portal` news, regional, search top | Yahoo! JAPAN, livedoor news | Fixed 950 to 1,050px, 3 columns or main + 300px rail | 14px, lists 13px | 1.4 | 50 to 110 links |
| `ec` shop or mall | 楽天市場 | 1,000 to 1,200px | 12 to 14px | 1.3 to 1.5 | Banners + category nav, 25 to 60 links |
| `article` media, blog | Yahoo! News, note, TRILL, Ameba | 620 to 740px column (+ 300px rail) | 16px (note 18px) | 1.8 to 2.0 | Title, date, author |
| `data` utility, dashboards | tenki.jp, ウェザーニュース | Fixed 1,048 to 1,070px | 14px, tables 12px | 1.4 | The main table or map |
| `lp` corporate, B2B SaaS | docomo, SmartHR-type SaaS | Max 1,100 to 1,220px | 15 to 16px | 1.7 to 1.8 | Hero, 2 CTAs, ※-noted numbers |
| `local` clinic, salon, restaurant own site | 食べログ store pages; DADS for type | 960 to 1,100px | 15 to 16px, UD font for medical and elderly | 1.6 to 1.8 | Name, 予約 + 電話, hours |
| `community` app-like feeds | pixiv | Fixed 1,016px | 14px | 1.5 | Tabs + feed |

Local business own sites are looser than the 食べログ listing they appear on; their type follows the Digital Agency design system (16px, 1.7) rather than a measured top-10 site.

## Quick reference (measured)

| Item | Value |
|---|---|
| Font stack | `"Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,sans-serif`. No Japanese web font for body text (none of the top 10 loads one). Never Yu Gothic or system-ui first. UD stack (`--jp-ud`) for medical, public, finance and elderly-facing sites. |
| Type modes | Dense UI 12 to 14px / 1.3 to 1.5 (default). LP and corporate 15 to 16px / 1.7 to 1.8 (`.jp-lp`). Reading 16 to 18px / 1.8 to 2.0 (`.jp-read`). |
| Headings | Dense pages h1 20 to 24px; LP hero h1 28 to 36px (22 to 26px mobile); article h1 24 to 32px. Nothing above 40px. Marked with bars and rules (6 to 10px left bar, 3 to 4px bottom rule, tinted strip). |
| Tracking | 0 on body. `font-feature-settings:"palt"` + .04em only on headings, nav, buttons, card titles. No `text-autospace` (none of the top sites use it). |
| Text color | #333 / #444 / #272727, not #000. Secondary #666. |
| Links | Dense pages: deep blue (#1d3994, #0b5daa, #2355a5), underline on hover. Brand LPs may use a darkened brand color at 4.5:1. Navigation lists may use body color with a › chevron. |
| Radius / shadow | 0 to 4px on portals and EC, 8px on modern sites, pills for app buttons. Borders over shadows. |
| Marks | ○ △ × ◎ in a Japanese-first font (`.jp-mark`); a Latin-first stack draws them tiny from Arial. |
| Prices | Tax-inclusive total, labelled `1,980円（税込）` or covered by one ※表示価格はすべて税込です note. Number in a Latin font, 円 about 0.6x and bold. EC price red #bf0000. |
| Dates | 2026年10月14日（水）, 2026/10/14, 10/14(水). 土 blue, 日・祝 red (contrast-safe #0062d6 / #d7000f). 24-hour time. Asia/Tokyo. |
| Mobile | iOS is about 60% of Japanese mobile: test Safari first. Inputs 16px. Sticky header 44 to 56px. `format-detection telephone=no` plus explicit `tel:` links. |

## Rules that are never optional

- `<html lang="ja">`.
- Any custom Enter handler checks `e.isComposing || e.keyCode === 229`. A plain `<form>` with a submit button needs no handler.
- When a form asks for a name: 姓 then 名, plus フリガナ (セイ / メイ). Never First name / Last name order.
- When a form needs an address (shipping, billing, documents by post): 郵便番号 that auto-fills 都道府県 and 市区町村, then 番地, then 建物名 (任意). Do not collect an address you do not need (APPI data minimization).
- Accept full-width input and normalize on blur. Never reject 全角.
- 必須 / 任意 text badges next to every label. Inputs at 16px.
- Consumer prices show the tax-inclusive total (総額表示).
- Selling online to consumers requires a 特定商取引法に基づく表記 page linked from the footer.
- Never present invented numbers, client logos, certifications, reviews or No.1 claims as real (景品表示法). Mark demo content as sample data.
- No italics on Japanese text. No faux bold. No negative letter-spacing. Text contrast 4.5:1.

## Converting an existing site

Keep the brand color (darkened if white text fails 4.5:1), logo and content. Change: type system (stack, sizes, line-heights, tracking), width and density (add the sections Japanese users expect for the archetype), headings (bars and rules), copy (rewrite in Japanese register), CTAs (add a lower-commitment second CTA such as 資料ダウンロード with its own short form), forms (Japanese field order and helpers), prices and dates, and the footer (company, legal, contact with hours). Remove: oversized hero type, decorative gradients that replace content, first-name testimonials, dollar prices, "Cancel anytime" style one-liners without detail.

## Common mistakes

| Mistake | Fix |
|---|---|
| "Japanese aesthetic" clichés: sakura, washi, red-and-white, Mincho everywhere | Use the archetype's real conventions. Mincho only for traditional brands' headings. |
| Western hero: 56 to 72px headline, one sentence, huge whitespace | 28 to 36px headline with a concrete benefit, sub-copy, 2 CTAs and trust numbers with ※ notes. |
| line-height 1.8 and letter-spacing on every element | Pick the type mode; tracking only on headings and buttons. |
| Noto Sans JP from Google Fonts as the body font | OS stack. Web fonts only for logo or headings. |
| Sparse page with 5 links above the fold | Japanese users expect choices up front: notices, rankings, categories, side rail. |
| Machine-translated copy (あなたの, もっと学ぶ, 始めましょう！) | Noun-ending labels, です・ます body, established CTA words. |
| No company address, phone or legal pages | Footer with 会社概要, 特商法, プライバシーポリシー, 受付時間. |
| Ratings and patient reviews on a clinic's own site | 医療広告ガイドライン forbids them; show hours, access, treatment details and prices with risks. |
| White text on bright orange or yellow buttons | Use `--jp-cta` (#c84b00) or the booking color (#c04f00). |

## Red flags: stop and re-check

- You chose sizes or line-heights without looking at the archetype row.
- Any heading above 40px.
- A name field without フリガナ, an address without 郵便番号 auto-fill, or First name first.
- Prices with no 税込 wording anywhere, a footer without company details.
- A trust number, logo or certification you made up and did not mark as sample data.
- You have not run `scripts/check.mjs` and `scripts/measure.mjs`, or not looked at a 390px screenshot.

## Files

| File | Use it for |
|---|---|
| `references/benchmarks.md` | Measured numbers per site, ranking method, per-site rules |
| `references/typography.md` | Font stacks, type modes, line-height, palt, line breaking, vertical text, ruby |
| `references/layout-and-components.md` | Archetype recipes, mobile headers, section order, component CSS |
| `references/forms.md` | Name, furigana, address, phone, IME, validation, confirm flow, 資料請求 and reservation recipes |
| `references/copy-and-locale.md` | Register, CTA vocabulary, headlines, punctuation, dates, money, titles |
| `references/trust-and-legal.md` | Footer, 特商法, privacy, 外部送信, industry rules, payments, LINE, accessibility |
| `assets/japanify.css` | Drop-in tokens and components (dense, `.jp-lp`, `.jp-read` modes) |
| `assets/japanify.js` | IME-safe Enter, postal code fill, normalization, date and yen formatters |
| `scripts/check.mjs` | Static Japan-readiness lint, no dependencies (`node scripts/check.mjs src/`) |
| `scripts/measure.mjs` | Rendered measurement against the archetype ranges (`node scripts/measure.mjs page.html lp --shots out/`) |
