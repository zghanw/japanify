# Typography / タイポグラフィ

Numbers in this file come from computed styles measured on the top Japan-origin sites in October 2026 (see benchmarks.md). Japanese type is set solid and small on utility pages and loose and large only for long-form reading. Pick the mode from the page, not from taste.

## Two modes

| | Dense UI mode (portal, EC, weather, community, carrier, dashboard) | Reading mode (article, blog post, column, long LP copy) |
|---|---|---|
| Measured on | Yahoo! JAPAN, Rakuten, tenki.jp, Weathernews, pixiv, docomo, Ameba, livedoor, Tabelog | Article bodies on note, Yahoo! News, livedoor News, TRILL |
| Body size | 14px desktop (Yahoo, tenki, pixiv, docomo, livedoor). 12 to 13px for lists and metadata (Rakuten, Tabelog, Weathernews) | 16px desktop (Yahoo! News, livedoor News, TRILL), 18px on note. 16 to 17px mobile |
| Share of text at 14px or below | 70 to 100% | 15 to 40% |
| Line-height | 1.3 to 1.5 (median 1.4); single-line link lists 1.0 to 1.25 | 1.8 to 2.0 (Yahoo! News 1.8, TRILL 1.8, livedoor News 1.9, note 2.0) |
| Letter-spacing | 0 on body text | 0 on body, .04 to .05em on headings with `palt` |
| Measure | Columns of 600 to 740px inside a 950 to 1100px page | 620px column, about 34 full-width characters per line |
| Paragraph gap | 8 to 16px | 30 to 36px, no first-line indent |
| Ink | #333, #444, #404040, #272727. Pure black is rare. | #08131A (note), #333 |

Consumer marketing blocks are the one place where tracking opens up: the Ameba portal sets headings at .1em and lead copy at .2em with line-height 2.0. Keep it to short leads and section titles.

A Western-style hero with 48 to 72px headlines and 1.6 to 1.8 line-height on every element is the single most common way an agent makes a page look non-Japanese. Even modern sites (note, docomo) keep headings at 20 to 32px.

## Font stack

None of the top 10 sites loads a Japanese web font for body text. They use the OS fonts: Hiragino on Apple, Meiryo or Noto Sans JP on Windows, Noto Sans JP on Android. Several put a Latin font first so digits and Latin letters render in a Latin design (note: Helvetica Neue, Weathernews: Arial, docomo: Roboto subset).

```css
:root{
  /* note.com's stack, Latin first, no web font */
  --jp-sans:"Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans","Noto Sans JP",Meiryo,sans-serif;
  /* universal design: public sector, finance, clinics, elderly users */
  --jp-ud:"Helvetica Neue",Arial,"Hiragino Kaku Gothic ProN","Hiragino Sans","BIZ UDPGothic",Meiryo,sans-serif;
  /* Mincho for editorial or traditional brands (note's article default on Apple) */
  --jp-serif:"Hiragino Mincho ProN","Yu Mincho",YuMincho,"Noto Serif JP",serif;
}
```

- Do not put `Yu Gothic` / `游ゴシック` or `system-ui` first. On Windows 10 both resolve to Yu Gothic Regular, which renders thin and faint. If a brand insists on Yu Gothic, use `font-weight:500` for body.
- A Google Fonts Japanese family (Noto Sans JP, M PLUS, Zen Kaku Gothic, Zen Maru Gothic, Shippori Mincho) is fine for headings, logos and brand copy. Request at most two weights, `display=swap`, or subset with `&text=` for a logo. Do not make it the body font of a dense page.
- Mincho is for headings and brand copy in traditional, luxury, literary and food contexts (ryokan, tea, sake, publishing). Windows Yu Mincho is thin, so use it at 20px and above.

## CSS baseline

```css
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{
  font-family:var(--jp-sans);
  font-size:14px; line-height:1.5; color:#333; letter-spacing:0;   /* dense UI */
  line-break:strict;          /* no line may start with ゃ っ ー 。 */
  overflow-wrap:anywhere;     /* long URLs and model numbers */
  text-autospace:normal;      /* gap between kanji and Latin, opt-in for Safari */
}
.article{font-size:16px;line-height:2;max-inline-size:40ic}    /* reading mode */
@media (min-width:768px){.article{font-size:18px}}
.article p{margin:0 0 1.75em}
h1,h2,h3,.btn,.nav a,.card-title{
  font-feature-settings:"palt"; letter-spacing:.04em; line-height:1.4;
  word-break:auto-phrase;     /* Chrome/Edge: wrap at phrase boundaries (BudouX built in) */
  text-wrap:balance;
}
em,i,cite{font-style:normal;font-weight:700}   /* never italicize Japanese */
.num{font-family:"Helvetica Neue",Arial,sans-serif;font-feature-settings:"tnum"}
.unit{font-size:.75em;margin-inline-start:.1em}  /* 23<span class="unit">℃</span>, 1,980<span class="unit">円</span> */
```

`palt` (proportional kana) tightens 「」、。 and kana. Use it on headings, nav, buttons, badges and card titles. Do not use it on body paragraphs: none of the measured sites does.

## Size scale

| Role | Dense UI | Reading / LP |
|---|---|---|
| Fine print, ※ notes, timestamps | 10 to 11px | 12px |
| Metadata, list rows, table cells | 12 to 13px | 14px |
| Body, nav | 14px | 16px (mobile), 18px (desktop article) |
| Card title | 14 to 16px bold | 16px bold |
| Section heading (h2) | 16 to 20px bold | 24 to 28px bold |
| Page title (h1) | 20 to 24px bold | 28 to 32px bold (20px mobile) |
| Price, key number | 16 to 24px bold, unit at .75em | 32 to 40px bold |

Weights: only 400 and 700. Bold carries hierarchy (Weathernews sets 89% of its home page in 700, pixiv 58%). Avoid 300 on Japanese text below 16px.

## Headings (見出し)

Japanese pages mark headings with bars and rules, not just size. Measured examples:

```css
/* tenki.jp h2: 10px brand bar on the left */
.h2-bar{border-left:10px solid #0061ca;padding:5px 10px;font-size:20px;line-height:1.2}
/* tenki.jp h3: 4px brand rule underneath */
.h3-rule{border-bottom:4px solid #0061ca;padding:5px 0;margin-bottom:10px}
/* docomo h2: 12x24 half-pill marker before the text */
.h2-tab{display:flex;align-items:center;gap:12px;font-size:24px;font-weight:700}
.h2-tab::before{content:"";width:12px;height:24px;background:#cc0033;border-radius:0 12px 12px 0}
/* Yahoo-style module title: bold text on a tinted strip */
.mod-title{padding:6px 10px;background:#f1f5ff;font-size:14px;font-weight:700}
```

Put the freshness stamp on the right of the heading in grey small text: `14日17:00発表`, `10/14(水)17:24更新`.

## Line breaking

- `line-break:strict` on body.
- `word-break:auto-phrase` on headings in Chrome/Edge; for Safari (60% of Japanese mobile) insert `<wbr>` at phrase boundaries in hero copy, or run BudouX at build time.
- Short labels in cards (docomo): `word-break:keep-all` plus an authored `<br>` where the phrase should break.
- Truncate list titles with `-webkit-line-clamp: 2` and names with one-line ellipsis.
- Never insert half-width spaces between Japanese and Latin to fake spacing (write PDFファイル).
- Never space out letters with real spaces (会　社　概　要).

## Vertical text and ruby

Vertical writing is for hero copy and short brand phrases on traditional brands, never for UI text.

```css
.tategaki{writing-mode:vertical-rl;font-feature-settings:"vpal";text-orientation:mixed}
.tcy{text-combine-upright:all}   /* 2-digit numbers upright: 創業<span class="tcy">20</span>年 */
```

```html
<ruby>小鳥遊<rp>（</rp><rt>たかなし</rt><rp>）</rp></ruby>
```

## Mobile

- Body stays 14px (Yahoo, tenki, docomo) or drops to 12 to 13px for dense lists (pixiv, Rakuten, Tabelog). Reading mode goes to 16px.
- Inputs must be 16px or larger or iOS Safari zooms on focus. pixiv keeps 14px visually with `font-size:16px; transform:scale(.875)`.
- iOS is about 60% of Japanese mobile traffic: check Hiragino rendering and Safari line breaking first.
