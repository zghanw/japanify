// japanify.js: small helpers every Japanese frontend needs. No dependencies.
// Classic script:  <script src="japanify.js"> (no inline content), then japanify.imeSafeEnter(input, send)
// ES module:       import './japanify.js'; const { digits, longDate } = globalThis.japanify;
// Single-file page: paste this file into a <script> tag as is.
// Check:           node japanify.js --self-test
(function () {
  const PREFS = '北海道,青森県,岩手県,宮城県,秋田県,山形県,福島県,茨城県,栃木県,群馬県,埼玉県,千葉県,東京都,神奈川県,新潟県,富山県,石川県,福井県,山梨県,長野県,岐阜県,静岡県,愛知県,三重県,滋賀県,京都府,大阪府,兵庫県,奈良県,和歌山県,鳥取県,島根県,岡山県,広島県,山口県,徳島県,香川県,愛媛県,高知県,福岡県,佐賀県,長崎県,熊本県,大分県,宮崎県,鹿児島県,沖縄県'.split(',');

  // NFKC folds full-width digits, Latin and half-width kana. It does not fold the dash family
  // (hyphen U+2010 to bar U+2015, minus U+2212, katakana long mark U+30FC), so map those to "-".
  const DASHES = /[\u2010-\u2015\u2212\u30fc\uff70]/g;
  const nfkc = (v) => String(v ?? '').normalize('NFKC');
  const digits = (v) => nfkc(v).replace(/\D/g, '');                       // store and compare
  const telDisplay = (v) => nfkc(v).replace(DASHES, '-').replace(/[^\d-]/g, ''); // keep the user's hyphens
  const email = (v) => nfkc(v).trim();
  const toKatakana = (v) => nfkc(v).replace(/[\u3041-\u3096]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
  const isKatakana = (v) => /^[\u30a1-\u30f6\u30fc\s\u3000]+$/.test(toKatakana(v));
  const isTel = (v) => /^0\d{9,10}$/.test(digits(v));
  const isZip = (v) => /^\d{7}$/.test(digits(v));

  // Enter that confirms an IME conversion must not submit. Safari fires compositionend first, so also check 229.
  // A plain <form> with a submit button is already safe; use this only for custom Enter handlers.
  function imeSafeEnter(el, onEnter) {
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
      e.preventDefault();
      onEnter(e);
    });
  }

  function fillPrefSelect(select, placeholder = '選択してください') {
    select.innerHTML = `<option value="">${placeholder}</option>` + PREFS.map((p) => `<option value="${p}">${p}</option>`).join('');
  }

  // 郵便番号 -> 都道府県 / 市区町村 via zipcloud. Never blocks the form if the lookup fails.
  function bindPostalCode(zipInput, { pref, city, street }) {
    const run = async () => {
      if (!isZip(zipInput.value)) return;
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits(zipInput.value)}`).then((r) => r.json());
        const a = res?.results?.[0];
        if (!a) return;
        pref.value = a.address1;
        city.value = a.address2 + a.address3;
        pref.dispatchEvent(new Event('change', { bubbles: true }));
        city.dispatchEvent(new Event('input', { bubbles: true }));
        street?.focus();
      } catch { /* offline or API down: the user types the address */ }
    };
    zipInput.addEventListener('input', () => isZip(zipInput.value) && run());
    zipInput.addEventListener('blur', run);
  }

  // Accept full-width input and fix it on blur instead of rejecting it. Submit digits(tel) to the server.
  function normalizeOnBlur(form) {
    const on = (sel, fn) => form.querySelectorAll(sel).forEach((el) => el.addEventListener('blur', () => { el.value = fn(el.value); }));
    on('input[type=tel]', telDisplay);
    on('[autocomplete=postal-code],[name=postal-code]', digits);
    on('input[type=email]', email);
    on('[name$=phonetic]', toKatakana);
  }

  const TZ = { timeZone: 'Asia/Tokyo' };
  const parts = (d, o, loc = 'ja-JP') => Object.fromEntries(new Intl.DateTimeFormat(loc, { ...TZ, ...o }).formatToParts(d).map((x) => [x.type, x.value]));
  const longDate = (d) => { const p = parts(d, { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }); return `${p.year}年${p.month}月${p.day}日（${p.weekday}）`; };
  const slashDate = (d) => { const p = parts(d, { year: 'numeric', month: '2-digit', day: '2-digit' }); return `${p.year}/${p.month}/${p.day}`; };
  const shortDate = (d) => { const p = parts(d, { month: 'numeric', day: 'numeric', weekday: 'short' }); return `${p.month}/${p.day}(${p.weekday})`; };
  const wareki = (d) => new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { ...TZ, era: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  const weekdayClass = (d) => ({ 土: 'jp-sat', 日: 'jp-sun' })[parts(d, { weekday: 'short' }).weekday] || '';

  const yen = (n) => `${Math.round(n).toLocaleString('ja-JP')}円`;
  const taxIncluded = (n, rate = 0.1) => Math.floor(n * (1 + rate)); // 8% (軽減税率) for food, drink and newspapers
  const compact = (n) => new Intl.NumberFormat('ja-JP', { notation: 'compact', maximumFractionDigits: 1 }).format(n); // 1.2万, 3.4億

  const api = { PREFS, digits, telDisplay, email, toKatakana, isKatakana, isTel, isZip, imeSafeEnter, fillPrefSelect, bindPostalCode, normalizeOnBlur, longDate, slashDate, shortDate, wareki, weekdayClass, yen, taxIncluded, compact };
  globalThis.japanify = api;

  if (typeof process !== 'undefined' && process.argv?.includes('--self-test')) {
    let failed = 0;
    const eq = (a, b) => { if (a !== b) { failed++; console.error(`FAIL: ${a} !== ${b}`); } };
    eq(digits('０９０－１２３４－５６７８'), '09012345678');
    eq(telDisplay('０９０ー１２３４ー５６７８'), '090-1234-5678');
    eq(isTel('090-1234-5678'), true);
    eq(isZip('１００－０００１'), true);
    eq(email(' ｔａｒｏ＠ｅｘａｍｐｌｅ．ｃｏｍ '), 'taro@example.com');
    eq(toKatakana('やまだ ﾀﾛｳ'), 'ヤマダ タロウ');
    eq(isKatakana('やまだ　たろう'), true);
    eq(isKatakana('山田'), false);
    const d = new Date('2026-10-14T03:00:00Z');
    eq(longDate(d), '2026年10月14日（水）');
    eq(slashDate(d), '2026/10/14');
    eq(shortDate(d), '10/14(水)');
    eq(wareki(d), '令和8年10月14日');
    eq(weekdayClass(new Date('2026-10-17T03:00:00Z')), 'jp-sat');
    eq(yen(taxIncluded(1800)), '1,980円');
    eq(yen(taxIncluded(1000, 0.08)), '1,080円');
    eq(compact(123456789), '1.2億');
    eq(PREFS.length, 47);
    console.log(failed ? `self-test: ${failed} failure(s)` : 'self-test passed');
    process.exit(failed ? 1 : 0);
  }
})();
