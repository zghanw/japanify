# japanify

**English / 日本語** | [简体中文](README.zh-CN.md)

An agent skill that builds websites and web apps the way Japanese users expect them, or converts an existing site into one. Every rule comes from measuring the 10 most-used Japanese websites, not from guesses about "Japanese style".

日本のユーザーが毎日使っているサイトと同じ感覚のWebサイト・Webアプリを作る（または既存サイトを日本向けに作り替える）ためのエージェントスキルです。ルールはすべて、日本で最も使われているWebサイト上位10件を実測して得た数値にもとづいています。「和風っぽさ」の想像ではありません。

---

## Why / なぜ必要か

AI agents asked for a "Japanese website" tend to produce one of two things: a Western landing page translated into Japanese, or a tourist-poster version of Japan with cherry blossoms and brush fonts. Neither looks like the sites Japanese people actually use. Real Japanese sites have small, solid type, dense link-rich layouts, dark grey text, headings marked with bars, prices with 税込, forms with フリガナ and postal-code address fill, and a footer full of company and legal links.

AIエージェントに「日本向けのサイト」を頼むと、多くの場合「英語のLPをそのまま翻訳したもの」か「桜や筆文字を使った観光ポスター風のもの」が出てきます。どちらも、日本人が普段使っているサイトとは違います。実際の日本のサイトは、小さめでベタ組みの文字、情報量の多いレイアウト、黒ではなく濃いグレーの本文、バーや罫線で区切られた見出し、税込表示の価格、フリガナと郵便番号からの住所自動入力があるフォーム、会社情報と法令表記が並ぶフッターでできています。

japanify gives the agent those conventions as concrete numbers, page recipes, component CSS, form code and a checker.

japanify は、これらの慣習を具体的な数値・ページ構成・コンポーネントCSS・フォームのコード・チェックツールとしてエージェントに渡します。

## What it covers / 対応範囲

| Area / 分野 | Contents / 内容 |
|---|---|
| Typography / タイポグラフィ | OS font stacks, size scale, line-height for dense UI vs reading, `palt`, line breaking, vertical text, ruby / OSフォントのスタック、文字サイズ、情報密度の高いUIと読み物での行間、palt、改行ルール、縦書き、ルビ |
| Layout / レイアウト | 7 archetypes (portal, EC, article, data, corporate/B2B LP, local business, community) with widths, density targets and section order / ポータル、EC、記事、データ系、企業・BtoB LP、店舗・クリニック、コミュニティの7類型と、幅・密度・セクション順 |
| Components / コンポーネント | お知らせ list, headline list, tabs, ranking, badges, price block, buttons, info table, 診療時間 table, STEP, FAQ, footer / お知らせ、ニュース一覧、タブ、ランキング、バッジ、価格表示、ボタン、情報テーブル、診療時間表、STEP、Q&A、フッター |
| Forms / フォーム | 姓・名, フリガナ, 郵便番号 auto-fill, 都道府県, 全角・半角 normalization, IME-safe Enter, 必須・任意, confirm screen / 姓名、フリガナ、郵便番号からの住所入力、都道府県、全角半角の正規化、IME確定時のEnter対策、必須・任意、確認画面 |
| Copy and locale / 文言・ロケール | です・ます vs noun endings, CTA vocabulary, 「」【】※, dates, 和暦, 税込 prices, 万・億 / 文体、CTAの言葉選び、記号、日付、和暦、税込価格、万・億 |
| Trust and legal / 信頼・法令 | 特定商取引法に基づく表記, privacy policy, 外部送信規律, 会社概要, payments, LINE, JIS X 8341-3 |
| Tools / ツール | `japanify.css` (drop-in tokens), `japanify.js` (helpers), `check.mjs` (lint) |

## Install / インストール

**Claude Code (plugin)**: run inside Claude Code / Claude Code 内で実行

```text
/plugin marketplace add zghanw/japanify
/plugin install japanify@japanify
```

**Any agent that supports Agent Skills (skills CLI) / Agent Skills対応のエージェント**

```bash
npx skills add zghanw/japanify
```

**Manual / 手動**

Copy `skills/japanify` into your agent's skills folder: `~/.claude/skills/` for Claude Code (or `.claude/skills/` in a project), `~/.agents/skills/` for Codex, Copilot CLI and Gemini CLI.

`skills/japanify` フォルダを、使っているエージェントのスキルフォルダにコピーしてください。Claude Code は `~/.claude/skills/`（プロジェクト単位なら `.claude/skills/`）、Codex・Copilot CLI・Gemini CLI は `~/.agents/skills/` です。

## Usage / 使い方

The skill loads automatically when the task is about Japanese users. Example prompts:

日本向けの作業だと判断されると、スキルは自動で読み込まれます。たとえば次のように頼んでください。

- 「静岡の日本茶の通販サイトのトップページを作って」
- "Japanify this landing page for the Japanese market."
- 「このお問い合わせフォームを日本のユーザー向けに直して」
- "Review our checkout for Japanese users and fix what feels foreign."
- 「歯科クリニックのサイトを作って。診療時間表と予約ボタンも」

Run the checker on any project / チェックツールの実行:

```bash
node skills/japanify/scripts/check.mjs src/
```

It reports errors (missing `lang="ja"`, Enter handlers without an IME guard, invented autocomplete values) and warnings (name order, missing フリガナ, no postal-code fill, prices without 税込, no 特商法 link, oversized hero type, thin Windows fonts, and more).

`lang="ja"` の欠落、IME未対応のEnter処理などをエラーとして、姓名の順序、フリガナの欠落、郵便番号からの住所入力なし、税込表示なし、特商法リンクなし、大きすぎる見出し、Windowsで細く表示されるフォントなどを警告として報告します。

## The benchmark / ベンチマーク

Japan-origin, general-audience sites ranked by the mean of the Semrush and Similarweb Japan ranks (September 2026), measured on 2026-10-14 with headless Chromium at 1280px and on an iPhone viewport.

日本発・一般向けのサイトを、Semrush と Similarweb の日本国内順位（2026年9月）の平均で順位付けし、2026年10月14日にヘッドレスChromium（PC 1280px と iPhone 幅）で実測しました。

| # | Site / サイト | Median text size / 本文の中央値 | Line-height / 行間 | Notes / 特徴 |
|---|---|---|---|---|
| 1 | Yahoo! JAPAN | 14px | 1.4 | Fixed about 1,000px, 85 links above the fold / 固定幅、ファーストビューに85リンク |
| 2 | 楽天市場 | 12 to 13px | 1.3 to 1.5 | Red price #bf0000, dense badges / 赤の価格表示、多数のバッジ |
| 3 | pixiv | 14px | 1.4 to 1.6 | Fixed 1,016px, pill buttons, flat cards / 固定幅、ピル型ボタン |
| 4 | note | 16px (article 18px) | 1.5 (article 2.0) | 620px reading column, palt on headings only / 620pxの本文カラム |
| 5 | docomo | 14px | 1.3 to 1.5 | One structural brand red, 重要なお知らせ first / ブランド赤の構造的な使い方 |
| 6 | tenki.jp | 14px | 1.4 | 1,048px fixed, bar headings, red max / blue min / 最高気温は赤、最低気温は青 |
| 7 | ウェザーニュース | 13px | 1.5 | Arial-first digits, one radius and one shadow / 数字はArial |
| 8 | Ameba | 12 to 14px | 1.4 to 1.6 | Blog article and ranking UIs / ブログ記事とランキング |
| 9 | livedoor | 13 to 14px | 1.2 to 1.5 | 62 to 110 links above the fold / ファーストビューに62〜110リンク |
| 10 | TRILL | 14px | 1.5 | Women's lifestyle media / 女性向けライフスタイルメディア |
| + | 食べログ | 12 to 13px | 1.4 | Store info table, reservation UI / 店舗情報テーブル、予約UI |

Full numbers: [`skills/japanify/references/benchmarks.md`](skills/japanify/references/benchmarks.md) / 詳細な数値は benchmarks.md を参照してください。

## Repository layout / 構成

```
skills/japanify/
  SKILL.md                         entry point / エントリーポイント
  references/
    benchmarks.md                  measured top 10 / 実測データ
    typography.md
    layout-and-components.md
    forms.md
    copy-and-locale.md
    trust-and-legal.md
  assets/
    japanify.css                   drop-in tokens and components
    japanify.js                    helpers (IME, postal code, dates, yen)
  scripts/
    check.mjs                      Japan-readiness lint
.claude-plugin/                    Claude Code plugin manifest
```

## License / ライセンス

MIT
