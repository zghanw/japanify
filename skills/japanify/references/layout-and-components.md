# Layout and components / レイアウトとコンポーネント

Page recipes and component CSS taken from the measured sites (benchmarks.md). Pick the archetype first; it decides width, density, type mode and section order.

## Archetypes

| Archetype | Reference sites | Width | Type mode | Above-the-fold target (desktop) |
|---|---|---|---|---|
| Portal / news top | Yahoo! JAPAN, livedoor news, dメニュー | Fixed 950 to 1,050px, 3 columns or main + 300px rail | Dense, 13 to 14px | 50 to 110 links, 500 to 900 chars |
| EC mall or shop | 楽天市場, Yahoo!ショッピング | 1,000 to 1,200px | Dense, 12 to 14px | Banner + category nav + 25 to 40 links |
| Product page | 楽天市場 item | 950 to 1,000px, 2 columns | Dense, price large | Gallery, title, price, cart button |
| Article / blog | note, Ameba, livedoor Blog, TRILL | 620 to 740px column (+ 300px rail on blogs) | Reading, 16 to 18px / 1.8 to 2.0 | Title, date, author, first paragraph |
| Data / utility | tenki.jp, ウェザーニュース | Fixed 1,048 to 1,070px, main + 300 to 336px side | Dense, tables at 12px | The main data table or map |
| Corporate / B2B LP | docomo, freee, SmartHR, Sansan | Max 1,100 to 1,220px | LP mode (`.jp-lp`): 15 to 16px / 1.7 to 1.8 | Hero with 2 CTAs + trust numbers, 10 to 40 links |
| Local business listing | 食べログ store pages | 980 to 1,140px | Dense, 12 to 14px | Name, score, 予約 button, access and hours |
| Local business own site | clinics, salons, restaurants, shops | 960 to 1,100px | LP mode, 15 to 16px / 1.7, UD font for medical | Name, 予約 + 電話, hours, access |
| Community / app | pixiv | Fixed 1,016px | Dense, 14px, pill buttons | Tabs + feed |

Mobile: one column, 16px side padding, body 13 to 14px (16px for reading and LP), sticky header 44 to 56px, bottom-fixed CTA bar on EC and booking pages. Set `--jp-sticky-offset` to the header height so anchor links do not land under it.

### Mobile headers

- Portal (Yahoo! JAPAN mobile, livedoor news): 44 to 50px bar with logo, ログイン and a menu icon; full-width search below it; then scrolling category tabs. Headline rows become 16px bold titles with a 45 to 52px thumbnail and a relative time in 11px grey (8時間前), on white cards over #eee.
- EC: sticky 50px bar with メニュー (drawer), logo, 検索 icon and カート with count; the search field sits below and scrolls away. The desktop left genre nav moves into the drawer, and the 営業日カレンダー moves into ご利用ガイド near the footer. Product pages add a sticky bottom bar with price and カートに入れる.
- LP and local business: sticky 56px bar with logo, 電話 icon and the main CTA; on clinics and salons a fixed bottom bar with 電話で予約 and WEB予約.
- ▲TOP appears only after the first screen has scrolled away.

## Page recipes (top to bottom)

### Portal / news top
1. Utility bar (small links: ヘルプ, ログイン, 新規登録) 2. Header: logo, large search box with 検索 button, service icons 3. Category tabs for news (主要 / 経済 / エンタメ / スポーツ / 国内 / 国際 / IT / 科学 / 地域) 4. Headline list with update time, NEW marks and comment counts, thumbnail of the top story 5. Right rail: login box, weather (today and tomorrow, max red, min blue), ranking, notices 6. Left rail or below: service list with small icons 7. Footer with company and legal links. Regional portals add a 警報・注意報 bar under the header (JMA colors), 交通・運行情報 with problems listed first and 「その他の路線は平常どおり運転しています」, ごみ出し for today, a 地域設定 (お住まいの地域：静岡市葵区 ▼) and a 文字サイズ 標準 / 大 toggle.

### EC shop top (楽天市場 style shop or own D2C shop)
1. Thin top bar: 【全国送料無料】5,400円（税込）以上のご注文で送料無料 / 平日15時までのご注文で当日発送 2. Header: logo with tagline, search with example keywords, phone (フリーダイヤル + 受付時間), ログイン, お気に入り, カート with count 3. Category nav 4. Main banner + 2 or 3 sub-banners (seasonal: お歳暮, 母の日, 期間限定) 5. お知らせ list (date, label, title) 6. ランキング 1 to 5 with crown badges, stars and review counts 7. Browse by category, by budget (〜1,000円 / 〜3,000円), by use (ギフト, 自分用) 8. 新着商品 9. Gift options (のし, ラッピング, 金額の入らない明細書) 10. Shop story (こだわり, 店長あいさつ) 11. Customer reviews (age group, prefecture) 12. ご利用ガイド: 支払い方法, 送料, 配送日時指定, 返品・交換 13. 営業日カレンダー (closed days in red) 14. Newsletter or LINE 友だち追加 15. Footer with 特定商取引法に基づく表記 and company address 16. Floating ▲TOP button.

### Product page
Breadcrumb (TOP > カテゴリ > 商品) / image gallery with thumbnails / long product title (keywords are normal) / review stars + count / price block (1,980円（税込）, 送料無料, ポイント◯倍) / variation selects / 数量 / large カートに入れる button + お気に入り / delivery estimate (最短◯月◯日お届け) / shop info / long description, often image-based, then spec table (商品名, 内容量, 原材料, 賞味期限, 保存方法, 製造者) / reviews / related and recently viewed items. Mobile: sticky bottom bar with price and カートに入れる.

### Article / blog
Breadcrumb / category label / h1 (20px mobile, 28 to 32px desktop) / date (2026年10月14日) and author / eyecatch / table of contents (目次) for long posts / body in reading mode / share row (X, Facebook, はてなブックマーク, LINE) / author box / related articles / comments / ranking in the side rail. Ads labelled PR or 広告.

### Corporate / B2B SaaS LP
1. Sticky header with nav, phone + hours, 資料ダウンロード (outline) and 無料で試す (filled); 資料ダウンロード opens its own short form (forms.md) 2. Hero: concrete benefit headline (noun ending), sub-copy, 2 CTAs, trust numbers with ※ footnotes (導入社数, 継続率, 満足度) and a product screenshot 3. Logo wall (導入企業) 4. こんなお悩みありませんか？ with check items or speech bubbles 5. 選ばれる3つの理由 (POINT 01 to 03) 6. 機能一覧 with check marks 7. 導入事例 (company, department, title, 様, result number) 8. 料金プラン table (税込 or 税抜 labelled, ○ / △ / － marks) 9. 導入の流れ STEP 1 to 4 10. セキュリティ・サポート (国内データセンター, ISMS, Pマーク, SSO) 11. よくあるご質問 (Q/A) 12. Closing CTA band with 3 options (資料, 試用, 電話) 13. Form (see forms.md) 14. Footer with 運営会社 and legal links.

Section headings on Japanese LPs usually carry a small English eyebrow label above the Japanese title (`.jp-eyebrow`): REASON / 選ばれる理由, FEATURES / 機能一覧, CASE / 導入事例, PRICE / 料金プラン, FLOW / 導入の流れ, FAQ / よくあるご質問. Trust numbers, client logos and certifications must be real; on a demo or a new product, mark them as samples (※掲載している社名・数値はサンプルです).

### Local business (restaurant, clinic, salon)
Own sites run looser than the 食べログ listing: LP type mode, 15 to 16px body, photos of the owner or staff, and the first screen limited to name, catch copy, 予約 and 電話, hours and access. Clinics must follow 医療広告ガイドライン (trust-and-legal.md): no ratings, patient reviews, before/after photos or superlatives on the clinic's own site.

Listing-style block order: Name + genre + area / rating and review count (listings and restaurants only) / 予約 and 電話 buttons / photo strip / info table (店名, ジャンル, 予約・お問い合わせ, 住所 with map, 交通手段 (◯◯駅から徒歩5分), 営業時間, 定休日, 予算, 支払い方法 (カード, 電子マネー, QRコード), 席数, 駐車場, 禁煙・喫煙) / menu with tax-inclusive prices / LINE 友だち追加 / access map. Clinics add a 診療時間 table (days across, 午前 / 午後 rows, ○ / × / ▲ marks with a legend).

### Data / utility
Search by place or postal code (〒・住所を入力) plus 現在地 / date tabs / main table or map / tabs for granularity (今日・明日, 1時間, 2週間) / related indexes / ranking / news. Freshness stamp on every block (17:00発表, 17:30現在).

## Components

### Header and nav

```css
.utility-bar{font-size:11px;color:#666;display:flex;justify-content:flex-end;gap:12px;padding:4px 0}
.gnav{display:flex;background:#0061ca}                           /* tenki.jp */
.gnav a{flex:1;padding:12px 0;color:#fff;font-weight:700;font-size:14px;text-align:center}
.gnav a + a{border-left:1px solid rgba(255,255,255,.3)}
.search{display:flex;height:40px}
.search input{flex:1;border:2px solid #0061ca;border-right:0;padding:0 10px;font-size:16px}
.search button{width:80px;background:#0061ca;color:#fff;font-weight:700;border:0;border-radius:0 4px 4px 0}
```

### お知らせ list (notices)

```html
<ul class="news">
  <li><time datetime="2026-10-14">2026.10.14</time><span class="label label--important">重要</span><a href="#">年末年始の営業について</a></li>
  <li><time datetime="2026-10-01">2026.10.01</time><span class="label">お知らせ</span><a href="#">お歳暮ギフトの早期割引受付を開始しました<span class="new">NEW</span></a></li>
</ul>
```
```css
.news li{display:flex;gap:12px;align-items:baseline;padding:10px 0;border-bottom:1px dotted #ccc;font-size:14px}
.news time{color:#666;font-size:13px;flex-shrink:0;font-feature-settings:"tnum"}
.label{flex-shrink:0;min-width:5.5em;padding:1px 6px;border:1px solid #999;font-size:11px;text-align:center;color:#555}
.label--important{border-color:#d7000f;color:#d7000f}
.new{color:#d7000f;font-size:11px;font-weight:700}
```

### Headline list (portal)

```css
/* Yahoo! JAPAN top: 14px rows, line-height 1, 12px apart, titles of about 15 to 16 characters */
.headlines li{display:flex;align-items:center;gap:4px;margin-bottom:12px;font-size:14px;line-height:1}
.headlines li::before{content:"・";color:#999}
.headlines a{color:#1d3994;text-decoration:none}
.headlines a:hover{text-decoration:underline}
.comments{font-size:10px;color:#698ac1;white-space:nowrap}   /* speech-bubble icon + count */
.comments.hot{color:#ff929b}
.badge-new{padding:0 5px;border-radius:8px;background:#f5a623;color:#fff;font-size:10px;font-weight:700}
.updated{font-size:10px;color:#666}          /* 10/14(水) 17:24更新, above the list */
```

Yahoo-style tabs joined to the panel:

```css
.ytabs{display:flex;background:#f1f5ff;border:1px solid #9eb4db;border-bottom:0}
.ytabs a{height:35px;line-height:35px;padding:0 8px;font-size:12px;color:#1d3994;position:relative}
.ytabs a + a::before{content:"";position:absolute;left:0;top:50%;width:1px;height:16px;margin-top:-8px;background:#cedaf3}
.ytabs a[aria-selected=true]{background:#fff;color:#000;font-weight:700;border-inline:1px solid #9eb4db;margin:0 -1px}
```

### Tabs

```css
.tabs{display:flex;border-bottom:2px solid #1d53a4}
.tabs a{flex:1;padding:10px 0;text-align:center;font-weight:700;font-size:14px;background:#d9d9d4;color:#1d53a4}
.tabs a[aria-selected=true]{background:#1d53a4;color:#fff}       /* tenki.jp */
/* pixiv-style text tabs: active bold with a 4px bar on top */
.tabs-text a{color:#858585;padding:12px 16px}
.tabs-text a[aria-selected=true]{color:#1f1f1f;font-weight:700;box-shadow:inset 0 4px 0 #0096fa}
```

### Ranking list

```css
.rank{counter-reset:r}
.rank li{counter-increment:r;display:grid;grid-template-columns:32px 64px 1fr;gap:8px;align-items:center;padding:8px 0;border-bottom:1px solid #eee}
.rank li::before{content:counter(r);display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:#999;color:#fff;font-weight:700;font-size:13px}
.rank li:nth-child(1)::before{background:#d4a017}   /* gold */
.rank li:nth-child(2)::before{background:#a5a9b0}   /* silver */
.rank li:nth-child(3)::before{background:#b87333}   /* bronze */
```
Show the change: 「前日 2位」, 「初登場」, ↑ ↓ arrows. Label ranks as 1位.

### Badges

| Badge | Style |
|---|---|
| NEW / 新着 | Red or orange text or pill, 10 to 11px bold |
| 重要 | Red outline or red fill |
| 送料無料 | Red fill white text, or red outline, 11px |
| ポイント◯倍 | Red or orange text, bold |
| PR / 広告 | Grey pill, 10px |
| 期間限定 / 数量限定 | Red or dark-red fill |
| 予約受付中 | Green or blue fill |
| 速報 | Red fill white text |

```css
.chip{display:inline-block;padding:1px 6px;font-size:11px;font-weight:700;line-height:1.5;border-radius:2px;vertical-align:middle}
.chip--red{background:#d7000f;color:#fff}
.chip--outline{border:1px solid #d7000f;color:#d7000f;background:#fff}
.chip--pr{background:#eee;color:#666;font-weight:400}
```

### Price block

```html
<p class="price"><span class="num">1,980</span><span class="yen">円</span><span class="tax">（税込）</span><span class="ship">送料無料</span></p>
<p class="sub">990円／個（2個）</p>
<p class="sub">19ポイント（1倍）</p>
<p class="rating"><span class="stars" style="--rate:4.6" role="img" aria-label="5点中4.6点"></span> 4.6 <span class="count">(43件)</span></p>
<p class="sub">10/15 12:00までの注文で最短10/16お届け</p>
```
```css
/* 楽天市場: number in a Latin font, 円 about 0.58x in bold Japanese, small red lines underneath */
.price{color:#bf0000;line-height:1}
.price .num{font:700 24px/1 "Helvetica Neue",Arial,sans-serif}   /* 28px on the product page; 楽天 loads Roboto 500, system fonts need 700 */
.price .yen{font-size:14px;font-weight:700;padding:0 4px 0 1px}
.price .tax{font-size:11px;color:#333}
.price .ship{font-size:14px;font-weight:700;margin-left:6px}
.sub{font-size:12px;color:#bf0000;margin:4px 0 0}
.rating{font-size:12px;color:#f2ab00;font-weight:700}.rating .count{color:#717171;font-weight:400}
/* fractional stars without glyphs: an SVG star mask over a gold/grey split */
.stars{display:inline-block;width:5em;height:1em;vertical-align:-.1em;
  background:linear-gradient(90deg,#f2ab00 calc(var(--rate) / 5 * 100%),#e1e1e1 0);
  --star:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z'/%3E%3C/svg%3E");
  -webkit-mask:var(--star) 0 0/1em 1em repeat-x;mask:var(--star) 0 0/1em 1em repeat-x}
.price-before{font-size:11px;color:#717171;text-decoration:line-through}   /* 通常価格 */
```

Tax label: the law requires the tax-inclusive total (総額表示), not the word 税込. 楽天市場 prints bare prices that already include tax; 食べログ and most own-brand shops print （税込）. For a new site, add （税込） or one clear note (※表示価格はすべて税込です).

Restaurant course price (食べログ): `<del>4,500円</del> <em>4,000</em>円（税込）` with the number in Arial 18px #e64c30 and 円（税込） at 10px. Price ranges use the full-width form ￥3,000～￥3,999.

### Buttons

| Context | Primary | Secondary |
|---|---|---|
| EC (cart, buy) | 楽天市場: #bf0000 fill, white 14px regular weight, 48px tall, min-width 192px, radius 4px. かごに追加 and 購入手続きへ share the color | White, 1px rgba(0,0,0,.2) border, radius 4px |
| Booking | 食べログ: orange gradient #ffaa00 to #ff9600, white bold, radius 3px (fails 4.5:1; use #c04f00 for real text). Red stays reserved for prices and scores | Light gradient #fff to #f4f4f4, 1px #d2d2d2 |
| B2B lead | Orange fill for 資料請求 / 無料で試す, or brand fill | Outline in brand color |
| Corporate | Brand fill pill (docomo: #cc0033, radius 70px, min-height 50px) | White pill with 1px #b2b2b2 border |
| Community / app | Brand fill pill 40px tall (pixiv #0096fa) | rgba(0,0,0,.04) pill |
| Editorial | Near-black fill, radius 8px (note #08131a) | White with 1px near-black border |
| LINE | #06c755, white, 「LINEで友だち追加」「LINEでログイン」 | |

Arrow and chevron decorations are normal: 詳しく見る ＞, 一覧を見る ›. Buttons often carry a micro-copy second line: `14日間 無料で試してみる` / `クレジットカード登録不要`.

### Info table (store, company, spec)

```css
.info{width:100%;border-collapse:collapse;font-size:14px}
.info th{width:28%;padding:12px;background:#f5f5f5;border:1px solid #ddd;text-align:left;font-weight:700;vertical-align:top}
.info td{padding:12px;border:1px solid #ddd}
@media (max-width:600px){.info th,.info td{display:block;width:auto}.info th{border-bottom:0}}
```

### Product grid and filters (楽天市場 search)

```css
.grid{display:grid;grid-template-columns:repeat(4,260px)}                 /* no gaps; cards carry padding */
.card{padding:16px;background:#fff}
.card img{width:100%;aspect-ratio:1;object-fit:contain}
.card .title{margin-top:12px;font-size:14px;line-height:21px;font-feature-settings:"palt";display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden}
.facets{width:207px;font-size:12px}
.facets h3{padding:12px 16px;font-size:14px;font-weight:700;border-top:1px solid #e2e2e2}
.facets li{line-height:24px}
```
Facets: 送料 (すべて / 送料無料), ジャンル tree, 価格 (two inputs 「円 ～ 円」 + 検索), ブランド with さらに表示 / 閉じる. Sort select 並べ替え: 標準 / 価格の安い順 / 価格の高い順 / 新着順 / レビュー件数順. Result count: 「コーヒー豆」の検索結果 1〜45件（188,641件）. Mobile: one-column list with a 104px thumbnail, a row of 32px filter chips and a 絞り込み button.

### Reviews and ratings

- Stars in gold or orange (#f2ab00 楽天, #fa0 食べログ) with the score next to them, then the count: 4.6 (43件) or 160 人.
- Review row: reviewer name, their review count, title in bold with a dotted underline, 12px body cut off with 「…詳細を見る」, visit or purchase date (2024/06 訪問, 購入者), helpfulness (参考になった).
- Summary block: average, star distribution bars (5 to 1), レビューを書く button.

### Reservation calendar (食べログ)

```css
.cal td{padding:8px 0;text-align:center;border:1px solid #e9e9e9}
.cal .sat{background:#e6f7ff;color:#06c}
.cal .sun,.cal .holiday{background:#ffeeee;color:#e64c30}
.cal .is-selected{background:#fcf4ce;border-color:#fa0}
.cal .is-full{color:#b3b3b6}            /* 満席 or × */
.cal .is-closed::after{content:"休"}
```
Availability marks: ◎ (空席あり), △ (残りわずか), × (満席), 休 (定休日), with a legend. Party-size and time selects next to it, then 予約する.

### Coupons

Ticket-shaped rows on #fcf0da with a notched or dashed edge, a short title in 14px bold, the condition in 11px (※ご予約時に要提示, 2名様以上), and a 詳細 button. EC coupons go in the title or a red outline tag: 【先着300円OFFクーポン】.

### Clinic hours table (診療時間)

```html
<table class="hours jp-hours"><caption>診療時間（○：診療　▲：14:00まで　×：休診）</caption>
<tr><th></th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th class="sat">土</th><th class="sun">日・祝</th></tr>
<tr><th>9:00〜12:30</th><td>○</td><td>○</td><td>○</td><td>×</td><td>○</td><td>○</td><td>×</td></tr>
<tr><th>14:30〜18:30</th><td>○</td><td>○</td><td>○</td><td>×</td><td>○</td><td>▲</td><td>×</td></tr>
</table>
```

Put ○ △ × in a Japanese-first font (`.jp-hours td` in japanify.css does this); under a Latin-first stack they render small. Wide tables on mobile go in `.jp-scroll` with a 「横にスクロールできます」 hint above them.

### Data table (weather style)

```css
.data{width:100%;table-layout:fixed;border-collapse:collapse;font-size:12px;text-align:center}
.data th,.data td{border:1px solid #ccc;padding:4px 2px}
.data thead th{background:#f4f4ee}
.data .past{color:#bbb}
.max,.high{color:#d7000f}.min,.low{color:#0062d6}   /* tenki.jp uses #ff0000 / #0096ff; darkened for 4.5:1 */
.sat{color:#0062d6}.sun,.holiday{color:#d7000f}
```

### Breadcrumb

```css
.breadcrumb{display:flex;flex-wrap:wrap;gap:4px;font-size:12px;color:#666;padding:8px 0}
.breadcrumb li + li::before{content:"＞";margin-right:4px;color:#999}
.breadcrumb a{color:#0b5daa}
```

### STEP flow, FAQ, check list, speech bubble

```html
<ol class="steps"><li><span class="step">STEP 1</span><h3>お問い合わせ</h3><p>フォームから必要事項をご入力ください。</p></li></ol>
<details class="faq"><summary><span class="q" aria-hidden="true">Q</span>無料トライアル後に自動で課金されますか？</summary>
  <p><span class="a" aria-hidden="true">A</span>いいえ。有料プランへ移行するまで料金は発生しません。</p></details>
<ul class="checklist"><li>初期費用0円</li><li>最短即日で導入</li></ul>
```
```css
.step{display:inline-block;padding:2px 10px;border-radius:999px;background:#0061ca;color:#fff;font-size:12px;font-weight:700;letter-spacing:.08em}
.faq summary{display:flex;gap:12px;padding:16px;font-weight:700;cursor:pointer;border-bottom:1px solid #ddd}
.faq .q{color:#0061ca;font-size:18px}.faq .a{color:#d7000f;font-size:18px;margin-right:12px}
.checklist li{list-style:none;padding-left:1.6em;position:relative}
.checklist li::before{content:"";position:absolute;left:.3em;top:.35em;width:.45em;height:.8em;border:solid #0a8f3c;border-width:0 .18em .18em 0;transform:rotate(45deg)}
```

### Footer

```html
<footer class="footer">
  <nav><a href="/company/">会社概要</a><a href="/contact/">お問い合わせ</a><a href="/privacy/">プライバシーポリシー</a><a href="/terms/">利用規約</a><a href="/tokushoho/">特定商取引法に基づく表記</a><a href="/external/">外部送信ポリシー</a><a href="/sitemap/">サイトマップ</a></nav>
  <address>株式会社サンプル　〒422-8000 静岡県静岡市葵区◯◯1-2-3　TEL 054-000-0000（受付時間 平日9:00〜17:00）</address>
  <small>&copy; 2026 Sample Inc.</small>
</footer>
<a class="pagetop" href="#top" aria-label="ページの先頭へ">▲<br>TOP</a>
```
```css
.footer{background:#f5f5f5;font-size:12px;color:#555;padding:24px 16px;text-align:center}
.footer nav{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 16px;margin-bottom:12px}
.footer address{font-style:normal;margin-bottom:8px}
.pagetop{position:fixed;right:16px;bottom:16px;width:48px;height:48px;display:grid;place-items:center;background:#333;color:#fff;font-size:10px;line-height:1.1;text-align:center;border-radius:4px}
```

### Banners

Japanese banners carry a lot of text: headline, sub-copy, price or discount, period (11月30日（月）まで), and a small CTA. That is normal. Make them HTML text over an image or give them full alt text. Use 2 to 4 banners side by side or a carousel with a pause button.

## Spacing

- Dense pages: 24 to 40px between modules, 8 to 12px between a heading and its content, 10px gutters in tile grids.
- Reading and LP pages: 64 to 96px between sections on desktop, 48 to 64px on mobile.
- Border-based separation (1px #ddd, #e5e5e5, dotted #ccc) is used more than shadows. Shadows, when used, are soft and small (`0 2px 4px rgba(0,0,0,.15)` or `.25`).
- Radii are small: 0 to 4px on portals and EC, 8px on modern sites, full pills for buttons on app-like sites.
