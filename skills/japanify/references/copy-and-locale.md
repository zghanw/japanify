# Copy, dates, numbers and money / 文言・日付・数値・価格

Machine-translated Japanese is the fastest way to lose trust. Write copy the way the top Japanese sites do.

## Register

| Where | Form | Example |
|---|---|---|
| Body text, notices | です・ます | 10月20日より販売を開始します。 |
| Headings, nav, labels, buttons | Noun ending (体言止め) or dictionary form | 料金プラン / 無料で試す / 詳しく見る |
| Instructions | 〜してください | パスワードを入力してください。 |
| Customer-facing service text | Polite keigo, not double keigo | ご利用いただけます / ご確認ください / お客様 |

Buttons never use 〜してください. Avoid overusing 〜させていただきます. B2C copy is softer than B2B.

## CTA and label vocabulary

| Intent | Use | Avoid (machine-translation tells) |
|---|---|---|
| Learn more | 詳しく見る / 詳細はこちら | もっと学ぶ |
| See all | 一覧を見る / もっと見る / すべて見る | すべてを表示する |
| Sign up | 会員登録（無料） / 新規登録 / 無料ではじめる | サインアップ |
| Log in | ログイン | サインイン (acceptable in apps, but ログイン is the norm) |
| Try | 無料で試す / 無料トライアル | 今すぐ始めましょう！ |
| B2B lead | 資料請求 / 資料ダウンロード / お問い合わせ | 営業に連絡 |
| EC | カートに入れる / 買い物かごに入れる / 購入手続きへ / ご注文内容の確認 | 今すぐ購入 |
| Booking | 予約する / 空席確認・予約 / ネット予約 | |
| Form | 確認画面へ / 送信する / 戻る / 修正する | 送信 (bare is fine), Submit |
| Link to more | 料金プランはこちら (link the whole phrase) | bare こちら as the only link text |

## Japanese punctuation and symbols

- Full-width brackets and punctuation: 「」（）【】、。！？：. Never “ ” or , . inside Japanese text.
- 【】 tags titles and emphasis: 【重要】【期間限定】【2026年版】【送料無料】.
- ※ marks caveats in small text right under the claim: ※価格はすべて税込です。 Use ※1 ※2 for numbered footnotes. Any No.1 or percentage claim needs a ※ note with the survey source and date.
- 〜 (wave dash) for ranges: 10:00〜18:00, 10月14日（水）〜16日（金）.
- No half-width spaces between Japanese and Latin or digits. Write PDFファイル, 3つの理由. Let CSS `text-autospace` add the gap.
- Exclamation marks: none in UI, at most one full-width ！ in a marketing headline.
- Do not address the reader as あなた or say 私たちの. Write アカウント設定, not あなたのアカウント設定.
- Katakana loanwords keep the long-vowel mark: ユーザー, サーバー, メンバー, カテゴリー.

## Headlines and titles

- News and portal headlines (Yahoo! JAPAN, livedoor News): about 15 full-width characters (80% are 14 to 16), noun ending or 〜へ, no 。, and a half-width space where a particle or pause would go: サイゼリヤ 値上げを発表, 大谷 50本塁打に到達. Half-width digits and %.
- Lifestyle and story media (TRILL): 45 to 51 characters with 「quote」, …, → and 【】: 「うそ…」貯金が10分の1に減っていた理由とは
- Casual community titles use 【速報】【悲報】【朗報】【画像】 prefixes; avoid them on corporate sites.
- Freshness labels sit next to lists: 10/14(水) 17:24更新, 14日17:00発表, 17:30現在, 8時間前, 10月13日更新.

## Notices and status labels

- お知らせ list rows: date, category pill, title. `2026.10.14 [お知らせ] 年末年始の営業について`. NEW mark for about 7 days. 重要 in red.
- Common badge words: NEW, 新着, 重要, 速報, PR, 広告, 人気, おすすめ, 期間限定, 数量限定, 送料無料, ポイント◯倍, クーポン, ランキング1位, 予約受付中, 残りわずか, 完売.
- Sponsored content must carry 広告 or PR (景品表示法 stealth-marketing rule since October 2023).

## Errors and empty states

- System failure (apologize): 申し訳ございません。ただいまアクセスが集中しています。時間をおいて再度お試しください。
- User error (no apology, say what to fix): 郵便番号を7桁の数字で入力してください。
- 404: お探しのページが見つかりませんでした。 plus links to トップページ and サイトマップ and a search box.
- Empty search: 「抹茶」に一致する商品は見つかりませんでした。 plus spelling help and popular categories.
- Empty cart: カートに商品がありません。 plus 買い物を続ける.

## Dates and time

| Context | Format |
|---|---|
| Long, in prose | 2026年10月14日（水） |
| Lists and tables | 2026/10/14 or 2026.10.14 (corporate news) |
| Compact | 10/14(水) |
| Time | 24-hour, 14:30. Ranges with 〜 |
| Era (government, insurance, medical, legal) | 令和8年10月14日, often next to the Western year |
| Relative | 3分前 / 昨日 / 2日前 for feeds |

Saturday 土 in blue, Sunday 日 and holidays 祝 in red in calendars and date pickers. Weeks start on Sunday in most Japanese calendars (日 月 火 水 木 金 土). Always format in `Asia/Tokyo`.

```js
const tz = { timeZone: 'Asia/Tokyo' };
const p = (d, o) => Object.fromEntries(new Intl.DateTimeFormat('ja-JP', { ...tz, ...o }).formatToParts(d).map((x) => [x.type, x.value]));
const longDate = (d) => { const x = p(d, { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }); return `${x.year}年${x.month}月${x.day}日（${x.weekday}）`; };
new Intl.DateTimeFormat('ja-JP', { ...tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); // 2026/10/14
new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { ...tz, era: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(d); // 令和8年10月14日
new Intl.RelativeTimeFormat('ja', { numeric: 'auto' }).format(-1, 'day'); // 昨日
```

Holidays: the Cabinet Office CSV (syukujitsu.csv) or the `@holiday-jp/holiday_jp` package.

## Money

- Consumer prices must show the tax-inclusive total (総額表示, mandatory since April 2021): `1,980円（税込）` or `1,800円（税込1,980円）`. A tax-exclusive price alone is not allowed for consumers. The word 税込 is not itself required: 楽天市場 prints bare prices that already include tax. For a new site, write （税込） or one clear note (※表示価格はすべて税込です) so users do not have to guess. B2B price lists may show 税抜 / 税別 with a clear label.
- Retail and EC write `1,980円`; fashion and brand sites may write `¥1,980`; restaurant budgets use the full-width ￥3,000～￥3,999. Digits are half-width with commas.
- Price emphasis: the number is large, in a Latin font (Roboto or Arial), and 円 is about 0.6x its size in bold Japanese type. EC price color is red (#bf0000 on 楽天市場, #e64c30 on 食べログ).
- Show shipping on the same line or right below: 送料無料 / 送料別 / 送料込み / ◯円以上で送料無料.
- Points: ポイント10倍, 99ポイント獲得 next to the price on EC.
- `Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })` returns a full-width ￥ (U+FFE5). Use `currencyDisplay: 'name'` for 1,980円, or format the number and append 円.

```js
const yen = (n) => `${n.toLocaleString('ja-JP')}円`;
const taxIn = (n, rate = 0.1) => Math.floor(n * (1 + rate)); // 8% for food and drink, newspapers
// markup: <span class="price">1,980<small>円（税込）</small></span>
```

## Large numbers

Use 万 and 億, never K or M: 1.2万件, 累計3,000万ダウンロード, 1億2,345万円. `new Intl.NumberFormat('ja-JP', { notation: 'compact' }).format(123456789)` returns 1.2億.

## Converting English copy

Do not translate sentence by sentence. Rewrite:

| English pattern | Japanese pattern |
|---|---|
| "Ship work faster. Together." (short, clever) | チームの仕事を、ひとつの場所で見える化。 (concrete benefit, noun ending) |
| "Loved by teams everywhere" | 導入社数3,000社突破※ with a ※ source note |
| "Get started free" | 無料で試す + 資料ダウンロード as a second, lower-commitment CTA |
| "Cancel anytime" | いつでも解約できます。解約金はかかりません。 (spell out the reassurance) |
| Testimonial with first name only | 株式会社◯◯ 営業部 部長 山田太郎様 with company, department, title and 様 |
| "$12/user/month" | 1ユーザーあたり月額1,320円（税込） or 月額1,200円（税抜） for B2B with the label |
