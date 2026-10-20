'use strict';

const SETTINGS = window.LETTER_SETTINGS || { recipients: [], demoEnabled: true };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 650px)').matches;
const $ = (selector) => document.querySelector(selector);
const stages = ['introStage', 'envelopeStage', 'nameStage', 'letterStage'];
let animationTimer;
let stage = 'introStage';
let envelopeBusy = false;
let revealBusy = false;
let revealTimers = [];
let imageRequest = 0;

// Decorative only: gradients + highlights are drawn inline as scalable SVG.
const palette = [
  { name: 'milk', light: '#ffffff', body: '#faf6f0', shadow: '#d7cbc4', string: '#c9beb8', weight: 28 },
  { name: 'blush', light: '#fff0f2', body: '#f5d9e2', shadow: '#d7a7b5', string: '#d9b6c0', weight: 26 },
  { name: 'sage', light: '#eef6e7', body: '#d7e7d2', shadow: '#9ab89d', string: '#b0c8b2', weight: 20 },
  { name: 'butter', light: '#fff8e0', body: '#f5e7bd', shadow: '#d5bd79', string: '#dccb9e', weight: 17 },
  { name: 'rose', light: '#ffdcda', body: '#e8b6ba', shadow: '#ba818a', string: '#ce9ba1', weight: 9 }
];

function rand(min, max) { return min + Math.random() * (max - min); }
function oneOf(items) { return items[Math.floor(Math.random() * items.length)]; }
function colorChoice() {
  const r = rand(0, 100);
  let count = 0;
  for (const item of palette) { count += item.weight; if (r <= count) return item; }
  return palette[0];
}

function renderBalloonSVG(index, color, shape) {
  const g = `balloon-grad-${index}`;
  const h = `balloon-gloss-${index}`;
  const s = `balloon-soft-${index}`;
  const isHeart = shape === 'heart';
  const outline = isHeart
    ? 'M50 105 C38 94 8 75 7 48 C6 30 18 20 34 21 C42 22 47 28 50 33 C53 28 59 22 67 21 C83 20 95 30 93 48 C92 75 62 94 50 105 Z'
    : 'M50 8 C28 7 13 19 10 43 C6 72 26 97 50 107 C74 97 94 72 90 43 C87 19 72 7 50 8 Z';
  return `<svg viewBox="0 0 100 155" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${g}" cx="29%" cy="22%" r="87%">
        <stop offset="0%" stop-color="${color.light}" />
        <stop offset="32%" stop-color="${color.body}" />
        <stop offset="75%" stop-color="${color.body}" />
        <stop offset="100%" stop-color="${color.shadow}" />
      </radialGradient>
      <radialGradient id="${h}" cx="40%" cy="36%" r="62%">
        <stop offset="0%" stop-color="#fff" stop-opacity=".63" />
        <stop offset="45%" stop-color="#fff" stop-opacity=".15" />
        <stop offset="100%" stop-color="#fff" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="${s}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${color.shadow}" stop-opacity=".48" />
        <stop offset="30%" stop-color="${color.body}" stop-opacity="0" />
        <stop offset="100%" stop-color="${color.shadow}" stop-opacity=".32" />
      </linearGradient>
    </defs>
    <path d="M50 116 C42 127 59 133 49 143 C44 148 51 149 50 153" fill="none" stroke="${color.string}" stroke-width=".9" stroke-linecap="round" opacity=".77" />
    <path d="M49 105 L44 116 Q50 120 56 116 L51 105" fill="${color.body}" stroke="${color.shadow}" stroke-width=".55" />
    <path d="${outline}" fill="url(#${g})" stroke="${color.shadow}" stroke-opacity=".38" stroke-width=".7" />
    <path d="${outline}" fill="url(#${s})" opacity=".45" />
    <path d="${outline}" fill="url(#${h})" opacity=".45" />
    <path d="M24 35 C28 22 39 17 46 19" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="7.2" opacity=".27" />
    <ellipse cx="29" cy="48" rx="5.6" ry="12" transform="rotate(-16 29 48)" fill="#fff" opacity=".085" />
    <path d="M70 78 C67 88 61 94 53 98" stroke="${color.shadow}" stroke-width="3" fill="none" opacity=".13" stroke-linecap="round" />
  </svg>`;
}

function makeBalloons() {
  const container = $('#balloons');
  if (!container) return;
  container.replaceChildren();
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const count = reduceMotion ? 6 : (lowPower ? 12 : (mobile ? 19 : 30));
  for (let i = 0; i < count; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    const color = colorChoice();
    const shape = Math.random() < .24 ? 'heart' : 'oval';
    const scale = rand(mobile ? 45 : 55, mobile ? 98 : 124);
    balloon.style.setProperty('--left', `${rand(-3, 98).toFixed(2)}%`);
    balloon.style.setProperty('--size', `${scale.toFixed(1)}px`);
    balloon.style.setProperty('--duration', `${rand(13, 24).toFixed(2)}s`);
    balloon.style.setProperty('--delay', `${rand(-6, 4).toFixed(2)}s`);
    balloon.style.setProperty('--drift', `${rand(-90, 95).toFixed(1)}px`);
    balloon.style.setProperty('--sway', `${rand(2.9, 5.7).toFixed(2)}s`);
    balloon.style.opacity = rand(.55, .92).toFixed(2);
    balloon.innerHTML = `<span class="balloon-art">${renderBalloonSVG(i, color, shape)}</span>`;
    balloon.addEventListener('pointerdown', () => {
      if (reduceMotion) return;
      const art = balloon.firstElementChild;
      art.classList.remove('is-tapped');
      void art.offsetWidth;
      art.classList.add('is-tapped');
    });
    container.appendChild(balloon);
  }
}

function showStage(id) {
  stage = id;
  stages.forEach((stageId) => {
    const el = document.getElementById(stageId);
    const isCurrent = stageId === id;
    el.hidden = !isCurrent;
    el.classList.toggle('is-visible', isCurrent);
    if (isCurrent) el.scrollTop = 0;
  });
  document.body.dataset.stage = id;
  const target = id === 'nameStage' ? $('#recipientName') : document.querySelector(`#${id} h1, #${id} h2`);
  if (target) { target.tabIndex = id === 'nameStage' ? 0 : -1; target.focus({ preventScroll: true }); }
}

function showEnvelope() {
  clearTimeout(animationTimer);
  if (stage !== 'introStage') return;
  showStage('envelopeStage');
}

function openEnvelope() {
  if (envelopeBusy) return;
  envelopeBusy = true;
  const envelope = $('#openEnvelope');
  envelope.classList.add('is-open');
  window.setTimeout(() => {
    envelope.classList.remove('is-open');
    envelopeBusy = false;
    showStage('nameStage');
    $('#recipientName').focus({ preventScroll: true });
  }, reduceMotion ? 180 : 820);
}

// Strict exact/alias matching, but accent/case/spacing insensitive.
function normalizeName(input) {
  return String(input || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi').replace(/đ/g, 'd')
    .replace(/\s+/g, ' ').trim();
}
function matchRecipient(input) {
  const query = normalizeName(input);
  if (!query) return null;
  const matches = (SETTINGS.recipients || []).filter((person) => {
    if (!person.name || !person.name.trim()) return false;
    return [person.name, ...(person.aliases || [])]
      .some((name) => normalizeName(name) === query);
  });
  // Fail closed on duplicate identifiers; never choose the wrong person's letter.
  return matches.length === 1 ? matches[0] : null;
}
function validateRecipientNames() {
  const used = new Map();
  for (const person of SETTINGS.recipients || []) {
    if (!person.name || !person.name.trim()) continue;
    for (const name of new Set([person.name, ...(person.aliases || [])].map(normalizeName))) {
      if (!name) continue;
      const previousId = used.get(name);
      if (previousId && previousId !== person.id) {
        console.warn(`Trùng tên hoặc biệt danh: "${name}" ở ${previousId} và ${person.id}. Hãy sửa recipients.js để tránh phát nhầm thư.`);
      } else { used.set(name, person.id); }
    }
  }
}

function fillText(selector, value) { $(selector).textContent = value || ''; }
function renderRecipient(person) {
  if (revealBusy) return;
  const isDemo = person.id === 'demo';
  fillText('#letterTo', person.greeting ?? '');
  fillText('#letterHeading', person.heading ?? '');
  fillText('#letterSignature', person.signature ?? '');
  fillText('#portraitLabel', isDemo ? 'ảnh của bạn sẽ ở đây ♡' : `${person.name} ♡`);

  const paragraphs = $('#letterParagraphs');
  paragraphs.replaceChildren();
  const content = Array.isArray(person.paragraphs) ? person.paragraphs : [];
  const lines = content.length ? content : ['Nội dung lá thư này đang được chuẩn bị.'];
  for (const item of lines) {
    const p = document.createElement('p');
    if (item && typeof item === 'object' && item.strong) {
      const strong = document.createElement('strong');
      strong.textContent = String(item.text || '');
      p.appendChild(strong);
    } else {
      p.textContent = typeof item === 'string' ? item : String(item?.text || '');
    } // Text-only rendering: never inject user HTML.
    paragraphs.appendChild(p);
  }
  const img = $('#recipientPhoto');
  const fallback = $('#portraitFallback');
  $('#letterStage').classList.toggle('has-contain-photo', person.photoFit === 'contain');
  const requestId = ++imageRequest;
  img.hidden = true;
  fallback.hidden = false;
  img.removeAttribute('src');
  img.alt = person.name ? `Ảnh dành riêng cho ${person.name}` : 'Ảnh của người nhận';
  if (person.photo && !isDemo) {
    img.onload = () => { if (requestId !== imageRequest) return; img.hidden = false; fallback.hidden = true; };
    img.onerror = () => { if (requestId !== imageRequest) return; img.hidden = true; fallback.hidden = false; };
    img.src = person.photo;
  }
  startPaperReveal();
}

function clearRevealTimers() {
  for (const timer of revealTimers) window.clearTimeout(timer);
  revealTimers = [];
}

function scheduleReveal(callback, delay) {
  revealTimers.push(window.setTimeout(callback, delay));
}

function startPaperReveal() {
  clearRevealTimers();
  const overlay = $('#paperReveal');
  if (reduceMotion) {
    overlay.hidden = true;
    document.body.classList.remove('letter-arriving');
    showStage('letterStage');
    return;
  }
  revealBusy = true;
  document.body.classList.add('letter-arriving');
  overlay.hidden = false;
  $('.app-main').inert = true;
  overlay.classList.remove('is-playing', 'is-leaving');
  // Restart keyframe animations for every new recipient.
  void overlay.offsetWidth;
  overlay.classList.add('is-playing');
  // Unfold paper first, then reveal photo and letter under a fading overlay.
  scheduleReveal(() => showStage('letterStage'), 1850);
  scheduleReveal(() => overlay.classList.add('is-leaving'), 1990);
  scheduleReveal(() => {
    document.body.classList.remove('letter-arriving');
    overlay.hidden = true;
    overlay.classList.remove('is-playing', 'is-leaving');
    revealBusy = false;
    $('.app-main').inert = false;
    $('#letterStage').tabIndex = -1;
    $('#letterStage').focus({ preventScroll: true });
    clearRevealTimers();
  }, 2850);
}

function handleNameSubmit(event) {
  event.preventDefault();
  const raw = $('#recipientName').value;
  const error = $('#nameError');
  error.textContent = '';
  $('#recipientName').removeAttribute('aria-invalid');
  if (!normalizeName(raw)) {
    $('#recipientName').setAttribute('aria-invalid', 'true');
    error.textContent = 'Cậu nhập tên trước nhé ♡';
    return;
  }
  if (SETTINGS.demoEnabled && normalizeName(raw) === 'demo') {
    renderRecipient(demoPerson);
    return;
  }
  const recipient = matchRecipient(raw);
  if (!recipient) {
    $('#recipientName').setAttribute('aria-invalid', 'true');
    error.textContent = 'Chưa tìm thấy lá thư này. Cậu thử kiểm tra lại tên nhé ♡';
    return;
  }
  renderRecipient(recipient);
}

const demoPerson = {
  id: 'demo', name: 'Bạn xem thử', photo: '',
  greeting: 'Gửi cậu,',
  heading: 'Đây là lá thư mẫu ♡',
  paragraphs: [
    'Đây là nội dung để xem thử bố cục. Khi cậu điền tên, ảnh và lá thư thật của từng người vào tệp recipients.js, mỗi người sẽ có một trang thư riêng.',
    'Có thể viết nhiều đoạn, dài hoặc ngắn. Mỗi đoạn được trình bày thoáng để dễ đọc trên điện thoại.',
    'Nhớ thay toàn bộ phần nội dung mẫu bằng lời nhắn mà cậu thực sự muốn gửi nhé.'
  ],
  signature: 'Bản xem trước · ♡'
};

function wireUp() {
  validateRecipientNames();
  makeBalloons();
  $('#skipIntro').addEventListener('click', showEnvelope);
  $('#openEnvelope').addEventListener('click', openEnvelope);
  $('#nameForm').addEventListener('submit', handleNameSubmit);
  $('#recipientName').addEventListener('input', () => { $('#nameError').textContent = ''; $('#recipientName').removeAttribute('aria-invalid'); });
  $('#recipientName').addEventListener('focus', () => {
    setTimeout(() => { if (stage === 'nameStage') $('#recipientName').scrollIntoView({ block: 'center' }); }, 250);
  });
  $('#backToEnvelope').addEventListener('click', () => showStage('envelopeStage'));
  $('#backToName').addEventListener('click', () => {
    $('#recipientName').value = '';
    $('#nameError').textContent = '';
    showStage('nameStage');
  });
  $('#demoButton').hidden = !SETTINGS.demoEnabled;
  $('#demoButton').addEventListener('click', () => renderRecipient(demoPerson));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && stage === 'letterStage' && !revealBusy) showStage('nameStage');
  });
  if (reduceMotion) {
    showStage('envelopeStage');
  } else {
    animationTimer = window.setTimeout(showEnvelope, 4600);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireUp);
} else {
  wireUp();
}
