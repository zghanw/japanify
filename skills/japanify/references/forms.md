# Forms for Japan / 日本向けフォーム

Japanese users fill in forms with an IME, expect name and address in Japanese order, and give up on forms that reject full-width input. Every rule below is something a Japanese frontend developer does without being asked.

## What to ask for

Collect only what the purpose needs (APPI data minimization) and keep the field order below.

| Purpose | Fields |
|---|---|
| Newsletter, LINE, app download | メールアドレス only |
| SaaS free trial (無料トライアル) | 会社名, お名前, メールアドレス, 電話番号, パスワード or a magic link; no address |
| 資料請求 / 資料ダウンロード (PDF by email) | 会社名, 部署名 (任意), お名前, フリガナ (任意), メールアドレス, 電話番号, 従業員数; no address, no password |
| お問い合わせ | お名前, フリガナ, メールアドレス, 電話番号 (任意), お問い合わせ種別, 内容 |
| Reservation (clinic, salon, restaurant) | お名前, フリガナ, 電話番号, メールアドレス, 第1希望 / 第2希望, 人数 or 症状; no address |
| EC order, 会員登録, documents by post | Full name, フリガナ and address block below |

## Field order and labels

| Field | Rule |
|---|---|
| お名前 | Two fields, 姓 then 名 (family name first). Labels 姓 / 名. Accept Latin names, never force kanji. |
| フリガナ | Two fields, セイ / メイ. Katakana label means katakana is expected; a hiragana label (ふりがな) means hiragana. Use `name="family-name-phonetic"` / `name="given-name-phonetic"`. Do not invent `autocomplete` values such as `family-name-kana`; nonstandard values switch off Chrome's Japanese autofill heuristics. |
| 郵便番号 | Only when you need an address. One field, 7 digits, hyphen optional, `inputmode="numeric"`, `autocomplete="postal-code"`. Auto-fills the address. Hint: 例：1000001（ハイフンなしでも可） |
| 都道府県 | `<select>` with all 47 prefectures in JIS X 0401 order (北海道 first, 沖縄県 last). |
| 市区町村 | `autocomplete="address-level2"` |
| 町名・番地 | `autocomplete="address-line1"` |
| 建物名・部屋番号 | Optional (任意). `autocomplete="address-line2"` |
| 電話番号 | `type="tel"`, accept 090-1234-5678, 09012345678 and full-width digits. Keep the user's hyphens on screen (`telDisplay`), send digits only (10 or 11 digits starting with 0). No country-code field. |
| メールアドレス | Single field plus a confirmation field (確認用) is still common on Japanese forms; paste must be allowed in both. Normalize full-width input with NFKC (`email` in japanify.js). |
| 生年月日 | 年 / 月 / 日 selects. Year options can show 1990年（平成2年）. Default the year near 1990, not the current year. |
| 性別 | Ask only if needed (APPI requires a stated purpose). Optional. 男性 / 女性 / その他 / 回答しない |
| 会社名・部署名・役職 | B2B forms ask these before the person's name. |

Do not ask for: Country (default Japan), First name before Last name, middle name, State/ZIP in US order.

## 必須 / 任意 badges

A text badge next to each label: red filled for 必須, grey outline for 任意. Put one note at the top: ※<span class="jp-req">必須</span>の項目は必ず入力してください。 Also set the `required` attribute so assistive tech knows.

These are `.jp-req` / `.jp-opt` in japanify.css; inputs inside `<form class="jp-form">` get 16px type. Use `.jp-form-table` for the desktop label / field table and `.jp-error-summary` for the error box.

Desktop B2B and EC forms use a two-column table layout (label cell about 30% wide on a #f5f5f5 background, field cell on white, 1px #ddd borders). Mobile stacks label above field. Inputs are at least 16px font-size so iOS Safari does not zoom on focus (iOS is about 60% of Japanese mobile traffic).

## Full-width / half-width (全角・半角)

Accept both, normalize on blur, never show 「半角で入力してください」. `normalize('NFKC')` folds full-width digits and Latin letters and half-width katakana. It does not fold the long-vowel and hyphen variants (ー ‐ − －), so strip non-digits from numeric fields.

Everything below ships in `assets/japanify.js` as `japanify.digits`, `telDisplay`, `email`, `toKatakana`, `isKatakana`, `isTel`, `isZip` and `normalizeOnBlur(form)`.

```js
const digits = (v) => v.normalize('NFKC').replace(/\D/g, '');
const toKatakana = (v) => v.normalize('NFKC').replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
const isTel = (v) => /^0\d{9,10}$/.test(digits(v));
const isZip = (v) => /^\d{7}$/.test(digits(v));
```

## IME-safe Enter

Pressing Enter to confirm a kanji conversion must not submit a search box, chat input or single-line form. Safari fires `compositionend` before that `keydown`, so `isComposing` alone is not enough; also check `keyCode === 229`.

```js
input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
  e.preventDefault();
  submit();
});
// React: if (e.nativeEvent.isComposing || e.keyCode === 229) return;
```

A plain `<form>` with a submit button is already IME-safe in modern browsers; the bug appears when you attach your own Enter handler.

## Postal code to address

| Option | When |
|---|---|
| yubinbango.js | Browser only, no key, accepts full-width input. Add `class="h-adr"` on the form and `p-postal-code`, `p-region`, `p-locality`, `p-street-address` on fields, plus `<span class="p-country-name" hidden>Japan</span>`. |
| zipcloud API | Free JSON: `https://zipcloud.ibsnet.co.jp/api/search?zipcode=1000001` returns `results[0].address1/2/3`. Good for React/Vue where you set state yourself. |
| Japan Post 郵便番号・デジタルアドレスAPI | Official, free with registration, server-side. Also resolves the 7-character デジタルアドレス. |
| ajaxzip3 | Legacy. Does not fire `change`, so framework state never updates. Avoid in new code. |

```js
async function fillAddress(zipInput, form) {
  const zip = digits(zipInput.value);
  if (zip.length !== 7) return;
  const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`).then((r) => r.json()).catch(() => null);
  const a = res?.results?.[0];
  if (!a) return; // leave fields editable; never block submit on lookup failure
  form.elements['address-level1'].value = a.address1;
  form.elements['address-level2'].value = a.address2 + a.address3;
  form.elements['address-line1'].focus();
}
```

## Prefecture list (JIS X 0401 order)

```js
const PREFS = '北海道,青森県,岩手県,宮城県,秋田県,山形県,福島県,茨城県,栃木県,群馬県,埼玉県,千葉県,東京都,神奈川県,新潟県,富山県,石川県,福井県,山梨県,長野県,岐阜県,静岡県,愛知県,三重県,滋賀県,京都府,大阪府,兵庫県,奈良県,和歌山県,鳥取県,島根県,岡山県,広島県,山口県,徳島県,香川県,愛媛県,高知県,福岡県,佐賀県,長崎県,熊本県,大分県,宮崎県,鹿児島県,沖縄県'.split(',');
select.innerHTML = '<option value="">選択してください</option>' + PREFS.map((p) => `<option value="${p}">${p}</option>`).join('');
```

## Furigana while typing

`vanilla-autokana` reads IME input and fills the kana field: `AutoKana.bind('#sei', '#kana-sei', { katakana: true })`. Keep the kana field editable and run `toKatakana` on blur, because autofill and paste bypass the IME.

## Complete markup

```html
<form class="jp-form h-adr" action="/confirm" method="post" novalidate>
  <span class="p-country-name" hidden>Japan</span>
  <p class="form-note">※<span class="jp-req">必須</span>の項目は必ず入力してください。</p>
  <fieldset>
    <legend>お名前<span class="jp-req">必須</span></legend>
    <label>姓<input id="sei" name="family-name" autocomplete="family-name" required></label>
    <label>名<input id="mei" name="given-name" autocomplete="given-name" required></label>
  </fieldset>
  <fieldset>
    <legend>フリガナ<span class="jp-req">必須</span></legend>
    <label>セイ<input id="kana-sei" name="family-name-phonetic" required></label>
    <label>メイ<input id="kana-mei" name="given-name-phonetic" required></label>
  </fieldset>
  <label>郵便番号<span class="jp-req">必須</span>
    <input class="p-postal-code" name="postal-code" autocomplete="postal-code" inputmode="numeric" maxlength="8" aria-describedby="zip-hint" required></label>
  <small id="zip-hint">例：1000001（ハイフンなしでも可）</small>
  <label>都道府県<span class="jp-req">必須</span><select class="p-region" name="address-level1" autocomplete="address-level1" required></select></label>
  <label>市区町村<span class="jp-req">必須</span><input class="p-locality" name="address-level2" autocomplete="address-level2" required></label>
  <label>町名・番地<span class="jp-req">必須</span><input class="p-street-address" name="address-line1" autocomplete="address-line1" required></label>
  <label>建物名・部屋番号<span class="jp-opt">任意</span><input name="address-line2" autocomplete="address-line2"></label>
  <label>電話番号<span class="jp-req">必須</span><input type="tel" name="tel" autocomplete="tel" inputmode="tel" required></label>
  <label>メールアドレス<span class="jp-req">必須</span><input type="email" name="email" autocomplete="email" required></label>
  <div class="privacy-box" tabindex="0">個人情報の取り扱いについて（本文）</div>
  <label class="agree"><input type="checkbox" name="agree" required> <a href="/privacy/">プライバシーポリシー</a>に同意する</label>
  <button type="submit">入力内容を確認する</button>
</form>
<script src="https://yubinbango.github.io/yubinbango/yubinbango.js" charset="UTF-8"></script>
```

## Flow and messages

- Orders, 会員登録, お問い合わせ, 資料請求 by post and reservations go 入力 → 確認 → 完了 (input, confirm, thanks), with a 3-step indicator (`.jp-steps`). The confirm screen repeats every value read-only with 「修正する」 and 「送信する」 buttons. SaaS trial sign-ups, newsletter and search forms may skip the confirm step.
- Low-commitment CTAs get their own short form: 資料ダウンロード must not lead to the full trial sign-up with a password.
- Submit label names the next step: 入力内容を確認する, 確認画面へ, 送信する, 同意して申し込む. Never "Submit".
- Error messages name the field and the fix: 「郵便番号を7桁の数字で入力してください」「メールアドレスの形式が正しくありません（例：taro@example.com）」. Summary at the top: 「入力内容をご確認ください（2件）」 linking to each field. Show errors in red (#d7000f) text under the field plus a light red field background (#fff0f0). Do not apologize for user errors.
- Completion page: 「お問い合わせありがとうございました。」 plus when they will hear back: 「2営業日以内に担当者よりご連絡いたします。」
- Contact forms show business hours for phone: 受付時間 平日10:00〜18:00（土日祝・年末年始を除く）.

## Reservation form (clinic, salon, restaurant)

- Ask for 第1希望 and 第2希望 (and 第3希望 if slots are scarce). Each is a date plus a time slot.
- Build the choices from the real schedule so closed days cannot be picked: a select of the next 14 to 30 open days (10月16日（金）), then a select of that day's slots, or an ○ / △ / × calendar (`.cal` in layout-and-components.md). Native `type="date"` shows the browser's own format and cannot disable 休診日, so use it only with validation that names the closed day: 「11月3日（火・祝）は休診日です。別の日をお選びください。」
- Generate slots per weekday (平日 9:30〜18:30, 土曜 9:30〜16:30) and remove past times for today.
- Completion wording makes the status clear: 「仮予約を受け付けました。予約はまだ確定していません。確定のご連絡を2営業日以内にお送りします。」 Add the phone number for changes and the cancellation rule.
- Children's clinics ask for the guardian (保護者) and the child (お子さま) separately, each with フリガナ, plus the child's 生年月日 as 年 / 月 / 日 selects with 和暦 labels (2020年（令和2年）).
