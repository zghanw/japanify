# Trust, legal pages and accessibility / 信頼・法令表記・アクセシビリティ

Japanese users check the footer before they buy, register or contact. Missing company details read as a scam.

## Footer links users expect

会社概要 (or 運営会社) / お問い合わせ / プライバシーポリシー (or 個人情報保護方針) / 利用規約 / 特定商取引法に基づく表記 (if selling anything) / 外部送信ポリシー or Cookieポリシー / サイトマップ / アクセシビリティ方針 (public sector and large companies).

Copyright line in small type, usually English: `© 2026 Example Inc.` or `Copyright © 2026 株式会社Example All Rights Reserved.`

## 特定商取引法に基づく表記 (required for any online sale)

Required for EC, paid subscriptions and paid digital content, including individuals selling online. Render as a two-column `<table>` or `<dl>`:

販売業者 / 運営統括責任者 / 所在地 / 電話番号 / メールアドレス / 販売価格（各商品ページに税込で表示） / 商品代金以外の必要料金（送料、振込手数料、代引き手数料） / 支払方法 / 支払時期 / 商品の引渡時期 / 返品・交換について（返品特約） / 申込みの有効期限 (if any) / 動作環境 (software) / 定期購入の場合は回数と総額.

Address and phone may be replaced with 「請求があった場合には遅滞なく開示いたします」, but the return policy can never be omitted. The order confirmation screen must show quantity, total price including shipping, payment method, delivery date and cancellation terms.

## プライバシーポリシー (APPI)

Must cover: business name, address and representative; 利用目的; 第三者提供 and 共同利用; 安全管理措置; 開示等の請求手続; 苦情・相談窓口; handling of cookie IDs and other 個人関連情報.

## External transmission notice (外部送信規律, since June 2023)

Media, SNS, search and app-like services must tell users what their analytics and ad tags send and to whom. The Japanese norm is a footer link (外部送信ポリシー) and at most a slim, dismissible notice bar. A GDPR-style blocking consent wall is not expected and feels foreign.

```html
<div class="cookie-notice" role="region" aria-label="Cookieについて">
  <p>当サイトではCookieを使用しています。詳しくは<a href="/external-transmission/">外部送信ポリシー</a>をご覧ください。</p>
  <button type="button">閉じる</button>
</div>
```

## 会社概要 page

`<table>` or `<dl>` with: 社名 / 所在地 (with a map) / 設立 / 代表者 (代表取締役 山田太郎) / 資本金 / 従業員数 / 事業内容 / 主要取引先 / 取引銀行 / 許認可・登録番号 (古物商許可, 宅建業免許, 登録番号 for インボイス制度 T+13 digits).

## Trust signals that move Japanese users

- Real company name with 株式会社, address, phone number with 受付時間.
- 導入実績 numbers with ※ source notes, client logo walls (導入企業), 導入事例 with company, department, title and 様.
- Media coverage (メディア掲載実績), awards, Pマーク (with registration number) and ISMS / ISO 27001 badges when actually certified.
- Reviews with star average, review count, and reviewer age group and prefecture (30代・女性・静岡県).
- For shops: 店長 or staff photos with a greeting (店長あいさつ), a business-day calendar (営業日カレンダー) with closed days in red, shipping and payment guide (ご利用ガイド).
- For B2B: domestic data center (国内データセンター), SSO, security checklist support (セキュリティチェックシート対応), invoice payment (請求書払い).

## Claims and industry rules

These laws decide what a page may say. An agent building a demo or a new product must not invent proof.

| Law | Applies to | What it means for the page |
|---|---|---|
| 景品表示法 (misleading representations, stealth marketing) | Every commercial site | Numbers such as 導入社数, 継続率, 満足度, No.1, 最安 need a real source and a ※ note with survey name, period and sample. Client logos, reviews, awards and certifications (Pマーク, ISMS) must be real. Sponsored content carries 広告 or PR. On demos, label all of it as sample data. 二重価格 (crossed-out 通常価格) only if that price was really charged for a meaningful period. |
| 医療広告ガイドライン (医療法) | Clinics, dental, hospitals, 美容医療 | No patient testimonials or 口コミ, no star ratings, no before/after photos without full treatment details, no superlatives (日本一, 最先端, 絶対) and no comparisons with other clinics. Show 標榜科目, hours, access and the doctor's qualifications. 自由診療 prices must come with the treatment content, typical period and count, and main risks and side effects. |
| 薬機法 (pharmaceutical and medical device law) | Food, tea, supplements, cosmetics, health goods | No efficacy or medical claims for food and cosmetics (痩せる, 血圧が下がる, 治る, シミが消える). Describe taste, origin, ingredients, production and how to enjoy it. |
| 特定商取引法 | Online sales to consumers | 特定商取引法に基づく表記 page; final confirmation screen with total, delivery, payment and cancellation terms. |

## Payments and identity

- Card brand row must include JCB. Common methods: クレジットカード (VISA, Mastercard, JCB, AMEX, Diners), PayPay, 楽天ペイ, d払い, au PAY, メルペイ, Amazon Pay, Apple Pay, コンビニ払い, 銀行振込, 代金引換 (state the 手数料), 後払い (NP後払い, Paidy).
- LINE is the default login and share channel (over 100M domestic users). Login button: background #06C755, white text, label 「LINEでログイン」, unmodified LINE icon. The brand green with white text is about 2.3:1; LINE mandates it, so keep the label 14px or larger and bold. Shop and clinic sites add a LINE 友だち追加 button or QR code with a coupon incentive.
- Share row on media and blogs: X (ポスト), Facebook, はてなブックマーク, LINE (LINEで送る). On mobile, prefer `navigator.share`.
- Desktop pages often show a 「スマートフォンでアクセス」 QR code.

## Accessibility (JIS X 8341-3)

- JIS X 8341-3:2016 matches WCAG 2.0 levels A/AA/AAA. Build to WCAG 2.2 AA. Since April 2024 the amended 障害者差別解消法 makes reasonable accommodation a duty for private businesses.
- Conformance wording: 準拠 (fully tested, results published), 一部準拠, 配慮. Never claim 準拠 without published test results.
- Contrast 4.5:1 for text. Light grey (#999) on white fails; Japanese portals use #666 or darker for secondary text.
- Banners that are images of text (very common in Japan) need full alt text.
- Do not space out characters with real spaces (会　社　概　要); screen readers spell them. Use `letter-spacing`.
- Use `lang="ja"` on `<html>` and `lang="en"` on English passages.
- Digital Agency design system (デジタル庁デザインシステム, DADS) is the public-sector reference: body 16px or larger, line-height 1.7 to 1.75, primary blue #0017c1, error red #ce0000, focus ring black outline plus yellow #ffd43d.

```css
:focus-visible{outline:2px solid #1a1a1a;outline-offset:2px;box-shadow:0 0 0 4px #ffd43d}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
```
