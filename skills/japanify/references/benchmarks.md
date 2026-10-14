# Benchmarks: the top 10 Japanese websites / 日本のトップ10サイト実測値

Measured on 2026-10-14 with headless Chromium (desktop 1280x800, iPhone 390x844, locale ja-JP), logged out. Every number is a computed style, weighted by the amount of visible text that uses it. Use this file to calibrate a page: if your numbers fall far outside these ranges, the page will not feel Japanese.

## Which sites, and why

Japan-origin, general-audience sites ranked by the mean of the Semrush per-domain Japan rank and the Similarweb Japan rank (both September 2026). Global platforms (Google, YouTube, X, Wikipedia, Amazon, Instagram, ChatGPT, LINE), adult sites and anonymous boards (5ch) were excluded because they do not represent Japanese design decisions.

| # | Site | Type | Semrush JP rank | Similarweb JP rank |
|---|---|---|---|---|
| 1 | Yahoo! JAPAN (yahoo.co.jp) | Portal, news | 3 | 2 |
| 2 | 楽天市場 (rakuten.co.jp) | E-commerce mall | 8 | 8 |
| 3 | pixiv (pixiv.net) | Illustration community | 5 | 12 |
| 4 | note (note.com) | Blogging, paid content | 12 | 14 |
| 5 | docomo (docomo.ne.jp, dメニュー) | Carrier, portal | 21 | 7 |
| 6 | tenki.jp | Weather, disaster info | 16 | 22 |
| 7 | ウェザーニュース (weathernews.jp) | Weather, live TV | about 20 | 24 |
| 8 | Ameba (ameblo.jp) | Blogging | 26 | 19 |
| 9 | livedoor (livedoor.jp) | Blog host, news portal | 11 | 49 |
| 10 | TRILL (trilltrill.jp) | Women's lifestyle media | 41 | 23 |
| 11 | 食べログ (tabelog.com) | Restaurant reviews, booking (extra reference) | 44 | 30 |

## Summary table (desktop unless noted)

| Page | Median text size | Text at 14px or less | Median line-height | Content width | Chars above fold | Links above fold | Body font (first family) | Text color |
|---|---|---|---|---|---|---|---|---|
| Yahoo! JAPAN top | 14px | 100% | 1.4 | 893px (1010 viewport) | 928 | 85 | Hiragino Kaku Gothic ProN, Meiryo | #1d3994 (links), #333 |
| Yahoo! JAPAN search | 14px | 86% | 1.4 | fluid | 1,759 | 30 | Arial, Hiragino Kaku Gothic ProN | #444 |
| 楽天市場 top | 12px | 94% | 1.3 | 256px nav + 960px main | 199 | 29 (768 total) | Meiryo, Hiragino Kaku Gothic ProN | #333 |
| 楽天市場 search | 13px | 97% | 1.5 | 207px filters + 1,072px grid | 919 | 29 (339 total) | Meiryo, Hiragino Kaku Gothic ProN | #333 |
| pixiv ranking | 14px | 58% | 1.4 | 1,016px fixed | 213 | 25 | system-ui, Hiragino Kaku Gothic ProN, Meiryo | #1f1f1f, #474747 |
| note top | 16px | 46% | 1.5 | fluid, 940px content | 1,932 | 57 | Helvetica Neue, Hiragino Sans | #08131a |
| note article | 18px | 39% | 2.0 | 620px reading column | 310 | 10 | Hiragino Mincho (Apple) / Meiryo (Windows) | #08131a |
| docomo top | 14px | 75% | 1.5 | 940 to 1,220px panels | 46 | 27 | Hiragino Kaku Gothic Pro, Meiryo | #272727 |
| dメニュー portal | 14px | 74% | 1.3 | 990px fixed | 645 | 66 | Hiragino Kaku Gothic ProN | #404040 |
| tenki.jp top | 14px | 76% | 1.4 | 1,048px fixed | 530 | 52 | Meiryo, Hiragino Kaku Gothic Pro | #444 |
| ウェザーニュース top | 13px | 77% | 1.5 | 1,070px | 287 | 19 | Arial, Hiragino Kaku Gothic ProN, Meiryo | #303030 |
| Ameba blog article | 14px | 76% | 1.5 | 1,020px | 551 | 36 | -apple-system, Hiragino | #333 range |
| Ameba ranking | 12px | 63% | 1.4 | 796px | 434 | 41 | Meiryo, system-ui | #08121a |
| livedoor news | 14px | 100% | 1.23 | 1,120px | 844 | 110 | Hiragino Kaku Gothic Pro, Meiryo | #2355a5 (links) |
| livedoor blog article | 13 to 13.5px | 79% | 1.36 to 1.5 | 927 to 977px | 1,574 to 1,952 | 62 to 80 | Hiragino Kaku Gothic Pro / Helvetica | #333 |
| TRILL article | 14px | 57% | 1.5 | 1,094px | 143 | 11 | -apple-system, Hiragino | #444 |
| 食べログ list | 13px | 93% | 1.4 | 1,140px fixed | 479 | 35 (354 total) | Meiryo, Hiragino Sans | #595960 |

### What the table says

1. Japanese UI text is small and set solid: 12 to 14px at line-height 1.3 to 1.5 on every utility page. Only long-form reading (note articles) goes to 16 to 18px at 2.0.
2. No site loads a Japanese web font for body text. All use OS fonts (Hiragino, Meiryo, Noto Sans JP), several with a Latin font first.
3. Letter-spacing is 0 on body text everywhere. `palt` plus .04 to .05em appears only on headings and card titles (note, Rakuten search).
4. Desktop layouts are fixed or capped at 950 to 1,100px, usually a main column of 600 to 740px plus a 280 to 336px side column.
5. Utility pages put 20 to 110 links above the fold. Brand and corporate pages (docomo top) are the exception, with a large hero.
6. Text is dark grey (#333, #444, #404040, #272727, #08131a), not pure black. Link blue is a deep blue (#1d3994, #0b5daa, #2355a5, #3d7699).
7. Mobile is often a separate build chosen by user agent (Yahoo m., tenki.jp /lite/, pixiv), and keeps 12 to 14px text.

## Per-site findings

### Yahoo! JAPAN (yahoo.co.jp): the reference portal

- Fixed canvas: `width:70.6em; min-width:990px`, viewport meta `width=1010`. Three columns 170 / 448 / 350px with about 11px gutters.
- Header 203px: one-line PR text link, service icon row (32px icons, 12px labels) with the logo in the middle, search band (#f1f5ff, search-type tabs ウェブ 画像 動画 知恵袋 地図, 401x34 input, 139x34 button #4070ff).
- Left column: about 30 services in 30px rows with 20px icons. Center: news tabs (35px tall, 12px, active tab white and bold, joined to the panel), 8 headlines and a photo topic, then a feed. Right column: 350px ad, login box, date and weather (high #eb0013, low #0a6cff), 雨雲レーダー, 運行情報, お知らせ.
- Root 62.5%, body 1.4rem. 14px carries 66% of text, 13px 14%, 11px 12%. Weights only 400 and 700. Radius 0 almost everywhere; 1px #9eb4db module frames, tinted modules #e6ecfe / #f1f5ff, one shadow on the whole page.
- All links one dark blue #1d3994, underline on hover only, no visited color on the desktop top. Meta text #666.
- Headline rows: 14px, line-height 1, 12px gap, about 15 to 16 characters, comment count in 10px #698ac1 right after the title (#ff929b when hot), a 30x12 NEW badge, and 「10/14(水) 17:24更新」 in 10px grey above the list.
- No palt, no letter-spacing. `word-break:break-all` on body. The ellipsis character is served from a Latin font (YJTop Ellipsis) so 「…」 sits on the baseline.
- News article: 640 + 300 columns, body 16px / 1.8 in #333, paragraphs start with an ideographic space U+3000, page background #f7f7f7.
- Mobile is a separate site (m.yahoo.co.jp): 16px bold titles, 52px thumbnails, white cards on #eee, active tab #ff6673, 44px tap targets. Ads labelled 広告; sponsored news under ニュースPR.
- Footer includes 会社概要, 利用規約, 免責事項, プライバシーポリシー, and on news, 特定商取引法の表示.

### Ameba (ameblo.jp): blog platform, the softer consumer end

- Width tokens: page 1,120px, main 640px, side 300px (article 620 + 300). Portal top is one 1,024px column.
- Portal body 16px / 1.6, weight 600 for emphasis, headings tracked .1em, lead copy .2em with line-height 2.0. Ink #08121a with .74 and .61 alpha steps.
- One green for actions: #298737 fill, #237b31 text, #e7f5e9 tint. Header pairs a filled 新規登録 pill with an outlined ログイン pill (32px tall); full CTAs are 48px pills. Secondary CTA orange #fe9019 (ブログをはじめる).
- Hairlines 1px rgba(8,18,26,.08), no shadows, cards radius 8px.
- Ranking rows 640x100: 80px avatar, 「1位」 with a colored trend arrow (up #ff547c, down #58b8ef), title 18px, inline フォロー and アメンバーになる buttons, 「10月13日更新」 next to the title.
- Blog article (user skin): body 14px / 1.6 in #444, h1 26px over a 1px rule, meta 「NEW! 2026年10月14日(水) 08時31分01秒」 in 12px, sidebar order プロフィール, 最新の記事, テーマ (with counts), 月別, Sunday-first カレンダー.
- Ads labelled AD (14px #999), sponsored posts PR, affiliate links 「Pick PR」.
- Footer includes 利用規約, プライバシーポリシー, 特定商取引法に基づく表記, 著作権等管理事業者許諾番号.

### 楽天市場 (rakuten.co.jp): the reference e-commerce mall

- Two layers: Rakuten's shell (modern, flat) and each merchant's own HTML (old-style tables, 12.8px text) that fills most of a product page.
- Shell stack `Meiryo,"Hiragino Kaku Gothic ProN","MS PGothic",sans-serif`; prices in RakutenRoboto / Roboto 500. Text #333 (58 to 89% of text), muted #717171. Body 12px on the top page (86% of text), 14px on search result titles.
- One accent, #bf0000, for price, CTAs, points, 送料無料 and the search button. Stars and ranking #f2ab00. Utility links (もっと見る, ログイン) #0078b5. Notices on #fff9c8 or #f7f7f7. Practically no shadows; hairlines #ececec / #e2e2e2.
- Header: 42px grey service bar (#717171, white 14px bold links), 74px header with a 760x40 search and six labelled icon shortcuts (買い物かご, お知らせ, 閲覧履歴, お気に入り, 購入履歴, myクーポン), then a welcome strip with 楽天会員登録(無料) and ログイン.
- Top page: 256px left genre nav + 960px main; banners fill the first screen. Section titles 20px bold with 「〜をもっと見る ›」 on the right.
- Search: 207px filter sidebar, 4 columns of 260px cards with no gaps, 16px card padding, 228px square images, titles 14px / 21px with `palt` and a 2-line clamp.
- Price: number 24px (cards) to 28px (product page) in a Latin font, 円 at about 0.58x in bold Japanese font, 〜 for ranges. The shell shows no 税込 label because every price already includes tax. Under the price, in small red lines: unit price, ポイント, rating, delivery promise (「10/15 12:00までの注文で最短10/16お届け」).
- CTAs かごに追加 and 購入手続きへ: #bf0000, 48px tall, radius 4px, 14px regular weight. Mobile product page has a sticky bottom bar with both.
- Tags: 10px bold outline (送料無料ライン, ソーシャルギフト可), chips radius 40px on rgba(0,0,0,.04). Ads start with [PR].
- Footer: trust statements, 4-column sitemap, notice bars, legal row separated by vertical bars (企業情報 | 個人情報保護方針 | ...).

### 食べログ (tabelog.com): reviews and reservations

- Fixed desktop widths: list 1,140px (300px filter sidebar + 40px + 800px main), detail 980px (660 + 20 + 300). 2px #fa0 rule above the header.
- Stack Meiryo first (desktop), Helvetica/Arial first on smartphone so digits render in a Latin font. Body 12px / 1.4 in #595960, strong text #13131e, links #06c (hover #ff9600).
- Warm neutrals: panels #faf8f5, borders #eeece4 / #e0dccc, labels #463f2d and #797152.
- Score: Arial bold, 22.68px on lists, 26px red #e10000 on the detail page. Stars #fa0 on #e1e1e1 (#ff6a00 from 3.5). Counts as 「160 人」 with the unit smaller.
- Booking CTA 予約する is an orange gradient (#ffaa00 to #ff9600), never red: red is reserved for scores and prices. Course prices: struck-through old price, new price in Arial 18px #e64c30, 円 (税込) at 10px.
- Header search is one inline row: エリア・駅 [例:銀座、渋谷], キーワード [例:焼肉、店名、個室], date, time, party size.
- Detail tabs: equal cells 45px tall with count bubbles (写真 1339, 口コミ 160), current tab filled #797152. Info table th 140px on #faf8f5, 13px.
- Reservation calendar: Saturday cells #e6f7ff, Sunday and holidays #ffeeee, selected #fcf4ce with a #fa0 border, closed days shown as 休.
- Reviews: dotted-underlined title, 12px body cut off with 「…詳細を見る」, 「2024/06 訪問」. Coupons look like tickets on #fcf0da.
- Default sort is labelled honestly: 「標準【予約・PR店舗優先順】」. Ads prefixed [PR].
- Footer: 利用規約, 個人情報保護方針, 外部送信（オプトアウト）, 企業情報, 口コミガイドライン, 「無断転載禁止」 in the copyright line.

### livedoor (livedoor.jp, livedoor News, livedoor Blog)

- News: 120px vertical nav + 700px main (620px inner) + 300px aside. www portal: 1,010px band, main 680 + gap 30 + aside 300.
- Text links carry the page: #2355a5 is 69 to 78% of all text on the portal and news pages. Headline lists are 12 items at 14px, line-height 1.23, 9px apart, no underline, beside one 300x200 photo lead.
- News headlines are written to 15 full-width characters (80% are 14 to 16), noun endings, no 。, a half-width space between phrases.
- New and sponsored marks sit inline after the title: red N (#e21919 / #cc0000), yellow PR label 29x14. The blog portal appends 【PR】 to the title text.
- Rank badges: 1 to 3 colored (#cc0000, or gold #f6d57c / silver #d9d9d9 / bronze #d29881), 4 and below grey #8c8c8c.
- Blog portal: 1,200px band, 3px brand bar on top of the header, cards radius 12px with `0 2px 4px rgba(0,0,0,.16)`, sections padded 80px and alternating #e5f6ff / #fff / #f5f5f5, pill CTA 48px tall (#40a3e7, radius 24px, 16px bold). Uses `font-feature-settings:"pkna"` with .05rem tracking on all text.
- News article: body 16px / 1.9 in a 620px column (#2d2d2d), mobile 16px / 1.8. h1 28px regular.
- Mobile makes list titles bold (6% bold on desktop, 86% on mobile) and adds a 45px thumbnail with 「8時間前」 in 11px #999 to every row.
- Footer: 運営会社, 利用規約, プライバシーポリシー, ガイドライン, ヘルプ. Cookie notice is a grey implied-consent bar with one 閉じる button.

### TRILL (trilltrill.jp): women's lifestyle media

- Desktop 1,094px: main 728 + gap 30 + sidebar 336. Header 100px: search pill on the left, centred wordmark, no top nav.
- Grayscale chrome only (#444 text, #888 secondary, #aaa meta, #ddd rules, #f4f5f7 boxes). The photos carry the color. 98% of text in weight 400.
- Article body 16px / 1.8 desktop, 17px / 1.6 mobile, paragraph gap 20px. In-body h2 is 16px between two 2px #ddd rules, 40px above and 20px below. h1 25px / 33px bold.
- List rows: 110px square thumbnail, 20px gap, 16px / 24px title clamped to 2 lines, source and date in 10px #aaa. Mobile: 70px thumbnail, 12px / 16px title in 3 lines.
- 人気 / 新着 segmented tabs 200x40 with a 2px #ddd border, the active tab filled #ddd with #222 bold text.
- Story titles of 45 to 51 characters using 「」, …, 【】 and →. Dates as 2026.10.4 (no zero padding).
- Mobile articles are cut at about 700px with a full-width 44px 「続きを読む」 pill. Partner articles show the partner logo and 元記事で読む.
- Sponsored items labelled [PR]; in-feed ads mimic list rows with the advertiser name in 10px grey.

### note (note.com): editorial reading, the modern minimal end

- Article body 18px / line-height 2.0 desktop, 16px / 2.0 mobile, in a 620px column (about 34 characters per line). Paragraph gap 36px (30px mobile), no first-line indent.
- h2 28px, h3 20px, weight 700, `font-feature-settings:"palt" 1; letter-spacing:.04em`. 54px above each h2.
- One near-black ink #08131a for text and primary buttons. Secondary text is the same ink at 66% alpha (#08131aa8), borders at 14% alpha. No brand blue. One warm accent #d13e5c for スキ (like) and discounts.
- Flat surfaces: no shadows on desktop, radius 8px, pills 9999px. Buttons 32 to 40px tall, 12 to 14px bold.
- Blockquote is a tinted block (#f5f8fa, padding 25px 36px), not a left rule.
- Card titles 16px bold with palt and .05em tracking, clamped to 2 to 3 lines. Feeds use relative dates (2日前); metadata uses 2026年8月18日 13:44.
- Footer is a row of small links including 特商法表記 and 資金決済法に基づく表示.

### tenki.jp: dense utility, the classic Japanese portal

- Fixed 1,048px page: main 692px + 20px gap + side 336px. Meiryo first, 14px, line-height 1.56, text #444.
- Links #0b5daa, hover turns orange #f89e1c. Brand blue #0061ca for the 8-item global nav (white bold, about 42px tall), heading bars and the search button.
- h2: 10px brand bar on the left, issue time (14日17:00発表) in grey at the right. h3: 4px brand rule underneath.
- Max temperature red #ff0000, min blue #0096ff. Saturday blue, Sunday and holidays red. Past hours greyed (#bbb), not hidden.
- JMA warning colors: 注意報 #f2e700 with black text, 警報 #ff2800, 危険警報 #aa00aa, 特別警報 #0c000c.
- Data tables: 12px centred cells, `1px solid #ccc`, header rows on #f4f4ee, `table-layout:fixed`, units at .75em.
- 40px between modules, 10px between heading and content. About 50 links in the first 800px.
- iPhone users are redirected to a separate /lite/ site with blue heading bars.

### ウェザーニュース (weathernews.jp): app-like cards on a data site

- PC width 1,070px: main 740px + 300px side, 30px gutter. Breakpoint 830px.
- Arial first so digits render in Arial; kana fall back to Hiragino or Meiryo. 13px median, 89% of top-page text bold.
- Numbers 15px/600, units 10px/300 with a 2px gap: 23℃, 3 m/s, 0ミリ.
- One radius (8px) and one shadow (`0 2px 4px rgba(0,0,0,.25)`) for every card, panels on #eef1f8.
- Segmented toggle: #eef1f8 track, selected segment #1d54af with white text and a small pointer.
- Fixed 44px mobile header with only logo, last location, 検索 and 現在地.

### pixiv (pixiv.net): image-led community

- Fixed 1,016px desktop column (body min-width 1,160px), artwork page main 704px + aside 288px.
- `system-ui` stack, no Japanese web font. Body 14px/22px desktop, 12px mobile. No palt, no letter-spacing anywhere.
- Four greys only: #1f1f1f, #474747, #858585, #adadad (visited). Brand blue #0096fa for actions, muted blue #3d7699 for tags.
- Every button is a pill, 40px tall, 14px bold. Secondary buttons are rgba(0,0,0,.04). Cards flat, radius 8px, 40px gaps.
- Ranking rows show 「1位」, 「前日 2位」, 「初登場」 and page by date (前の日).
- Ads labelled with a grey PR pill or 「スポンサー：社名」.

### docomo (docomo.ne.jp, dメニュー): corporate plus portal

- www: white panels on #f3f3f3, max 1,220px, radius 40px, 40px apart. Body 14px / 1.5, text #272727.
- One brand red #cc0033 used structurally: header band, footer band, heading marker (12x24 half pill), primary pill button.
- 重要なお知らせ（通信障害等） list directly under the hero: 49px rows, 1px #e5e5e5 rules, chevrons.
- Links in navigation lists are body colored with a right chevron, not blue.
- dメニュー portal: fixed 990px (743 + 238), 14px, news rows 70px with a 54px thumbnail, 16px bold one-line headline, 11px grey 10/14(水) 16:47 timestamp and a red NEW chip.
- Footer: red band of legal links including 外部送信 notice and 見やすさ・使いやすさの調整.
