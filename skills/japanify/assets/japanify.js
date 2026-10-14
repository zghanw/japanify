// japanify.js: small helpers every Japanese frontend needs. ES module, no dependencies.
// Browser: import { imeSafeEnter, bindPostalCode } from './japanify.js'
// Check:   node japanify.js --self-test

export const PREFS = '北海道,青森県,岩手県,宮城県,秋田県,山形県,福島県,茨城県,栃木県,群馬県,埼玉県,千葉県,東京都,神奈川県,新潟県,富山県,石川県,福井県,山梨県,長野県,岐阜県,静岡県,愛知県,三重県,滋賀県,京都府,大阪府,兵庫県,奈良県,和歌山県,鳥取県,島根県,岡山県,広島県,山口県,徳島県,香川県,愛媛県,高知県,福岡県,佐賀県,長崎県,熊本県,大分県,宮崎県,鹿児島県,沖縄県'.split(',');

// Full-width or half-width in, half-width digits out. NFKC does not fold ー ‐ − －, so strip non-digits.
export const digits = (v) => String(v).normalize('NFKC').replace(/\D/g, '');
export const toKatakana = (v) => String(v).normalize('NFKC').replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
export const isTel = (v) => /^0\d{9,10}$/.test(digits(v));
export const isZip = (v) => /^\d{7}$/.test(digits(v));

// Enter that confirms an IME conversion must not submit. Safari fires compositionend first, so also check 229.
export function imeSafeEnter(el, onEnter) {
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    onEnter(e);
  });
}

export function fillPrefSelect(select, placeholder = '選択してください') {
  select.innerHTML = `<option value="">${placeholder}</option>` + PREFS.map((p) => `<option value="${p}">${p}</option>`).join('');
}

// 郵便番号 -> 都道府県 / 市区町村 via zipcloud. Never blocks the form if the lookup fails.
export function bindPostalCode(zipInput, { pref, city, street }) {
  const run = async () => {
    zipInput.value = digits(zipInput.value);
    if (!isZip(zipInput.value)) return;
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipInput.value}`).then((r) => r.json());
      const a = res?.results?.[0];
      if (!a) return;
      pref.value = a.address1;
      city.value = a.address2 + a.address3;
      pref.dispatchEvent(new Event('change', { bubbles: true }));
      city.dispatchEvent(new Event('input', { bubbles: true }));
      street?.focus();
    } catch { /* offline or API down: the user types the address */ }
  };
  zipInput.addEventListener('input', () => digits(zipInput.value).length === 7 && run());
  zipInput.addEventListener('blur', run);
}

// Normalize on blur instead of rejecting full-width input.
export function normalizeOnBlur(form) {
  form.querySelectorAll('input[type=tel],[name=postal-code],[autocomplete=postal-code]').forEach((el) => el.addEventListener('blur', () => { el.value = digits(el.value); }));
  form.querySelectorAll('[name$=phonetic]').forEach((el) => el.addEventListener('blur', () => { el.value = toKatakana(el.value); }));
}

const TZ = { timeZone: 'Asia/Tokyo' };
const parts = (d, o, loc = 'ja-JP') => Object.fromEntries(new Intl.DateTimeFormat(loc, { ...TZ, ...o }).formatToParts(d).map((x) => [x.type, x.value]));
export const longDate = (d) => { const p = parts(d, { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }); return `${p.year}年${p.month}月${p.day}日（${p.weekday}）`; };
export const slashDate = (d) => { const p = parts(d, { year: 'numeric', month: '2-digit', day: '2-digit' }); return `${p.year}/${p.month}/${p.day}`; };
export const shortDate = (d) => { const p = parts(d, { month: 'numeric', day: 'numeric', weekday: 'short' }); return `${p.month}/${p.day}(${p.weekday})`; };
export const wareki = (d) => new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { ...TZ, era: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(d);
export const weekdayClass = (d) => ({ 土: 'jp-sat', 日: 'jp-sun' })[parts(d, { weekday: 'short' }).weekday] || '';

export const yen = (n) => `${Math.round(n).toLocaleString('ja-JP')}円`;
export const taxIncluded = (n, rate = 0.1) => Math.floor(n * (1 + rate)); // 8% for food, drink and newspapers
export const compact = (n) => new Intl.NumberFormat('ja-JP', { notation: 'compact', maximumFractionDigits: 1 }).format(n); // 1.2万, 3.4億

if (typeof process !== 'undefined' && process.argv?.includes('--self-test')) {
  const eq = (a, b) => console.assert(a === b, `${a} !== ${b}`);
  eq(digits('０９０－１２３４－５６７８'), '09012345678');
  eq(isTel('090-1234-5678'), true);
  eq(isZip('１００－０００１'), true);
  eq(toKatakana('やまだ ﾀﾛｳ'), 'ヤマダ タロウ');
  const d = new Date('2026-10-14T03:00:00Z');
  eq(longDate(d), '2026年10月14日（水）');
  eq(slashDate(d), '2026/10/14');
  eq(shortDate(d), '10/14(水)');
  eq(wareki(d), '令和8年10月14日');
  eq(yen(taxIncluded(1800)), '1,980円');
  eq(compact(123456789), '1.2億');
  eq(PREFS.length, 47);
  console.log('self-test done');
}
