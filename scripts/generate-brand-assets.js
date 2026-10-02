/**
 * 產生品牌素材：LOGO、favicon 與各頁的 OG 分享圖。
 *
 * 用法：
 *   node scripts/generate-brand-assets.js          全部重新產生
 *   node scripts/generate-brand-assets.js icons    只產生 LOGO 與 favicon
 *   node scripts/generate-brand-assets.js og       只產生 OG 圖片
 *   node scripts/generate-brand-assets.js posts    只產生文章的分享卡
 *
 * 圖示用 resvg 把 SVG 轉成 PNG。OG 圖片用 Playwright 開一頁 HTML 後截圖，
 * 這樣可以直接沿用網站的字體與 CSS 寫法（需要網路載入 Google Fonts，
 * 以及 `npx playwright install chromium`）。
 * 產出的檔案會直接進版控，CI 不會跑這支腳本。
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const PUBLIC = path.join(__dirname, '../public');
const POSTS = path.join(__dirname, '../content/blog');

// 顏色與 docs/uiux-redesign-2026.md 的設計語言一致
const BG = '#0a0a0a';
const INK = '#fafafa';
const ACCENT = '#facc15';

// 字標：兩個圓弧接成的 S，上端筆畫收成一顆太陽。
// 這組數值同時寫在 components/LogoIcon.tsx，改了要兩邊一起改。
const MARK_PATH = 'M55.4 14.8A18 18 0 1 0 50 50A18 18 0 1 1 33.1 74.2';
const MARK_DOT = { cx: 67.6, cy: 28.3, r: 7.5 };

function mark(color = INK) {
  return (
    `<path d="${MARK_PATH}" fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round"/>` +
    `<circle cx="${MARK_DOT.cx}" cy="${MARK_DOT.cy}" r="${MARK_DOT.r}" fill="${ACCENT}"/>`
  );
}

// 深色底的方形圖示。radius 為 0 時是滿版（iOS 會自己裁圓角）
function tileSvg({ radius = 22, scale = 0.8 } = {}) {
  const offset = (50 * (1 - scale)).toFixed(2);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" rx="${radius}" fill="${BG}"/>` +
    `<g transform="translate(${offset} ${offset}) scale(${scale})">${mark()}</g>` +
    `</svg>`
  );
}

function renderPng(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

// ICO 容器：檔頭加上每個尺寸的目錄，內容直接放 PNG
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}

function write(name, data) {
  fs.mkdirSync(path.dirname(path.join(PUBLIC, name)), { recursive: true });
  fs.writeFileSync(path.join(PUBLIC, name), data);
  console.log(`✅ ${name}`);
}

function generateIcons() {
  const tile = tileSvg();
  write('icon.svg', tile);
  write('logo.png', renderPng(tile, 512));
  write('favicon.png', renderPng(tile, 512));
  write('apple-icon.png', renderPng(tileSvg({ radius: 0, scale: 0.7 }), 180));
  write('favicon.ico', buildIco([16, 32, 48].map((size) => ({ size, png: renderPng(tile, size) }))));
}

const SITE = 'sunzhi-will.github.io';

const CARDS = [
  {
    name: 'og-home',
    label: 'Portfolio',
    pre: "Hi, I'm",
    title: 'Sun Zhi',
    lead: 'Software Engineer · AI Developer',
    body: 'I turn ideas into products people actually use.',
    topics: ['AI Apps', 'Full-Stack Web', 'Unity'],
    url: SITE,
    portrait: true,
    copies: ['og-image'],
  },
  {
    name: 'og-blog',
    label: 'Blog',
    pre: "Sun's",
    title: 'Blog',
    body: 'Notes on AI, product, startups and game development, written after building things myself.',
    rows: ['AI', 'Product', 'Startups', 'Game Dev'],
    topics: ['Essays', 'Field Notes'],
    url: `${SITE}/blog`,
  },
  {
    name: 'og-links',
    label: 'Links',
    pre: "Sun's",
    title: 'Links',
    body: 'Everywhere you can find me, in one place.',
    rows: ['Portfolio', 'Sunkoro Courses', 'GitHub', 'LinkedIn'],
    rowArrow: '↗',
    topics: ['Unity', 'AI', 'Next.js', 'LINE Bot'],
    url: `${SITE}/links`,
  },
  {
    name: 'og-pricing',
    label: 'Pricing',
    pre: 'SunCodeStudio',
    title: 'Pricing',
    body: 'Transparent pricing, tailored to your needs.',
    rows: ['Software Development', 'Teaching & Consulting'],
    topics: ['Quoted in TWD'],
    url: `${SITE}/pricing`,
    status: 'Available for hire',
    wideOnly: true,
  },
];

// 文章分享卡的介面文字，跟著文章語言走，同一張圖不混用兩種語言
const POST_COPY = {
  'zh-TW': { pre: 'Sun 的部落格' },
  en: { pre: "Sun's Blog" },
};

// 文章分享卡右側放的插畫：從文章封面裁出沒有標題字的那一塊（數值是佔原圖寬高的比例）。
// 只有列在這裡的文章會產生分享卡，其餘文章分享時直接用自己的封面。
// title 可以指定主標與副標，沒寫就從 frontmatter 的標題自動拆。
const POST_ART = {
  '2026-06-16-ai-judgement': { image: '9389b71c-2553-4051-b5d9-a9b2fef351ac.png', crop: { x: 0.505, y: 0.08, w: 0.495, h: 0.92 } },
  '2026-06-17-medical-ai-agent': {
    image: 'cover.png',
    crop: { x: 0.548, y: 0.1, w: 0.452, h: 0.8 },
    // 標題沒有句號可以拆，照原封面的主副標指定
    title: { 'zh-TW': { lead: 'AI 產品值不值錢，常常不是看它多聰明', rest: '醫療 AI Agent 給我的提醒' } },
  },
  '2026-06-25-entrepreneurship-after-kaohsiung': { image: 'cover.png', crop: { x: 0.52, y: 0.08, w: 0.48, h: 0.92 } },
};
const SENTENCE_END = '？！。?!';

// 與 components/blog/ArticleHero.tsx 相同：「一句話＋補充說明」的標題拆成主標與副標
function splitTitle(title) {
  for (let i = 0; i < title.length - 1; i++) {
    if (!SENTENCE_END.includes(title[i])) continue;
    const rest = title.slice(i + 1).trim();
    if (rest.length >= 4) return { lead: title.slice(0, i + 1), rest };
    break;
  }
  return { lead: title, rest: '' };
}

// 讀出有插畫設定的文章：標題、日期、標籤來自 frontmatter，語言用文章的預設語言（中文優先）
function loadPostCards() {
  const matter = require('gray-matter');
  const cards = [];
  for (const [slug, art] of Object.entries(POST_ART)) {
    const folder = path.join(POSTS, slug);
    const lang = Object.keys(POST_COPY).find((l) => fs.existsSync(path.join(folder, `article.${l}.mdx`)));
    if (!lang) continue;
    const { data } = matter(fs.readFileSync(path.join(folder, `article.${lang}.mdx`), 'utf8'));
    const image = fs.readFileSync(path.join(folder, art.image));
    cards.push({
      slug,
      lang,
      label: String(data.date || slug).slice(0, 10).replace(/-/g, '.'),
      pre: POST_COPY[lang].pre,
      post: art.title?.[lang] ?? splitTitle(String(data.title)),
      topics: (data.tags || []).slice(0, 2).map(String),
      art: {
        src: `data:image/png;base64,${image.toString('base64')}`,
        // PNG 檔頭第 16 到 24 位元組是寬與高
        width: image.readUInt32BE(16),
        height: image.readUInt32BE(20),
        crop: art.crop,
      },
    });
  }
  return cards;
}

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function cardHtml(card, shape, portraitSrc) {
  const rows = (card.rows || [])
    .map(
      (row, i) =>
        `<li><span class="eyebrow">${String(i + 1).padStart(2, '0')}</span><span class="row-title">${escapeHtml(row)}</span><span class="row-arrow">${card.rowArrow || '→'}</span></li>`
    )
    .join('');
  const status = (text) => `<span class="status"><i></i>${escapeHtml(text)}</span>`;

  const visual = card.portrait
    ? `<div class="portrait"><div class="halo"></div><div class="disc"></div><img src="${portraitSrc}" alt="">${status('Available for hire')}</div>`
    : `<ul class="rows">${rows}</ul>`;

  // 插畫區塊撐滿卡片高度（上下各留 28px），寬度跟著裁切範圍的比例走
  let artStyle = null;
  if (card.art) {
    const { width, height, crop } = card.art;
    const scale = (630 - 56) / (crop.h * height);
    artStyle = {
      width: Math.round(crop.w * width * scale),
      imgWidth: width * scale,
      left: -crop.x * width * scale,
      top: -crop.y * height * scale,
    };
  }

  return `<!doctype html>
<html lang="${card.lang || 'en'}">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500${card.lang === 'zh-TW' ? '&family=Noto+Sans+TC:wght@400;500;700' : ''}&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; }
  body {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${BG};
    color: #e4e4e7;
    font-family: 'Geist', 'Noto Sans TC', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .grid, .glow { position: absolute; pointer-events: none; }
  .grid {
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.09) 1px, transparent 1px);
    background-size: 28px 28px;
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 0%, black, transparent);
    mask-image: radial-gradient(ellipse 75% 70% at 50% 0%, black, transparent);
  }
  .glow {
    left: 5%;
    top: -55%;
    width: 90%;
    height: 120%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(250, 204, 21, 0.11), transparent);
  }
  .eyebrow {
    font-family: 'Geist Mono', 'Noto Sans TC', ui-monospace, monospace;
    font-size: 17px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    color: #e4e4e7;
  }
  header, main, footer { position: relative; }
  header { display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 12px; font-size: 26px; font-weight: 600; color: #f4f4f5; }
  .brand svg { width: 38px; height: 38px; }
  main { flex: 1; display: flex; min-height: 0; }
  .copy { min-width: 0; }
  .pre { color: #e4e4e7; }
  h1 { font-weight: 600; line-height: 1; letter-spacing: -0.04em; color: #fff; white-space: nowrap; }
  .lead { color: #fff; }
  .body { color: #e4e4e7; line-height: 1.45; text-wrap: balance; }
  footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .topics { display: flex; align-items: center; gap: 16px; }
  .topics::before { content: ''; width: 40px; height: 2px; background: ${ACCENT}; }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    background: rgba(20, 20, 22, 0.9);
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 500;
    color: #e4e4e7;
    white-space: nowrap;
  }
  .status i { width: 9px; height: 9px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.18); }

  /* 去背人像：做法與 components/home/Hero.tsx 的 Portrait 相同 */
  .portrait { position: relative; flex: none; }
  .portrait .halo { position: absolute; inset: -12%; border-radius: 50%; background: radial-gradient(closest-side, rgba(250, 204, 21, 0.13), transparent); }
  .portrait .disc {
    position: absolute;
    left: 5%;
    right: 5%;
    top: 12%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 28%, #52525b 0%, #27272a 55%, #18181b 100%);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  .portrait img {
    position: relative;
    display: block;
    width: 100%;
    filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.45));
    -webkit-mask-image: linear-gradient(to bottom, black 84%, transparent);
    mask-image: linear-gradient(to bottom, black 84%, transparent);
  }
  .portrait .status { position: absolute; left: -4%; bottom: 9%; }

  .rows { list-style: none; flex: none; }
  .rows li { display: flex; align-items: center; gap: 20px; border-top: 1px solid rgba(255, 255, 255, 0.14); }
  .rows li:last-child { border-bottom: 1px solid rgba(255, 255, 255, 0.14); }
  .row-title { flex: 1; font-weight: 500; color: #f4f4f5; white-space: nowrap; }
  .row-arrow { color: #e4e4e7; }

  /* 文章分享卡：左邊字標與標題，右邊是文章插畫。標題字級由頁面內的腳本縮到放得下為止 */
  body.post { padding-right: calc(var(--art-width) + 68px); }
  body.post .copy { width: 100%; }
  body.post h1 {
    margin-top: 14px;
    font-size: var(--title, 60px);
    font-weight: 700;
    line-height: 1.22;
    letter-spacing: -0.02em;
    white-space: normal;
  }
  body.post:lang(en) h1 { font-weight: 600; line-height: 1.1; letter-spacing: -0.035em; }
  body.post .rest {
    margin-top: 18px;
    font-size: calc(var(--title, 60px) * 0.5);
    font-weight: 500;
    line-height: 1.4;
    color: #e4e4e7;
  }
  .nowrap { white-space: nowrap; }
  .clause { display: inline-block; }
  .art {
    position: absolute;
    top: 28px;
    right: 28px;
    bottom: 28px;
    width: var(--art-width);
    overflow: hidden;
    border-radius: 28px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.14);
  }
  .art img { position: absolute; max-width: none; }

  /* 1200x630 */
  .wide { padding: 52px 64px 0; }
  .wide main { align-items: center; justify-content: space-between; gap: 48px; }
  .wide .pre { font-size: 28px; }
  .wide h1 { margin-top: 6px; font-size: 136px; }
  .wide .lead { margin-top: 26px; font-size: 34px; }
  .wide .body { margin-top: 22px; max-width: 590px; font-size: 25px; }
  .wide .lead + .body { margin-top: 12px; }
  .wide footer { height: 70px; }
  .wide .portrait { width: 440px; align-self: flex-end; margin-top: -40px; }
  .wide .rows { width: 400px; }
  .wide .rows li { height: 74px; }
  .wide .row-title { font-size: 25px; }
  .wide .row-arrow { font-size: 24px; }

  /* 800x800 */
  .square { padding: 52px 56px 0; }
  .square main { flex-direction: column; justify-content: flex-end; gap: 40px; padding-bottom: 40px; }
  .square .pre { font-size: 26px; }
  .square h1 { margin-top: 6px; font-size: 124px; }
  .square .lead { margin-top: 22px; font-size: 30px; }
  .square .body { margin-top: 18px; max-width: 600px; font-size: 24px; }
  .square .lead + .body { margin-top: 10px; }
  .square footer { height: 68px; }
  .square .eyebrow { font-size: 16px; }
  /* 方形版寬度不夠，頁尾只留網址 */
  .square .topics span { display: none; }
  .square .portrait { position: absolute; right: -8px; top: -4px; width: 350px; }
  .square .rows li { height: 66px; }
  .square .row-title { font-size: 24px; }
  .square .row-arrow { font-size: 22px; }
</style>
</head>
<body class="${shape}${card.post ? ' post' : ''}"${artStyle ? ` style="--art-width: ${artStyle.width}px"` : ''}>
  <div class="grid"></div>
  <div class="glow"></div>
  <header>
    <div class="brand"><svg viewBox="0 0 100 100">${mark('#f4f4f5')}</svg>Sun</div>
    ${card.status ? status(card.status) : `<span class="eyebrow">${escapeHtml(card.label)}</span>`}
  </header>
  <main>
    <div class="copy">
      <p class="pre">${escapeHtml(card.pre)}</p>
      ${card.post
        ? `<h1>${escapeHtml(card.post.lead)}</h1>${card.post.rest ? `<p class="rest">${escapeHtml(card.post.rest)}</p>` : ''}`
        : `<h1>${escapeHtml(card.title)}</h1>
      ${card.lead ? `<p class="lead">${escapeHtml(card.lead)}</p>` : ''}
      <p class="body">${escapeHtml(card.body)}</p>`}
    </div>
    ${card.post ? '' : visual}
  </main>
  <footer>
    <div class="topics eyebrow"><span>${card.topics.map(escapeHtml).join(' / ')}</span></div>
    ${card.url ? `<span class="eyebrow">${card.url}</span>` : ''}
  </footer>
  ${artStyle ? `<div class="art"><img src="${card.art.src}" alt="" style="width: ${artStyle.imgWidth}px; left: ${artStyle.left}px; top: ${artStyle.top}px"></div>` : ''}
</body>
</html>`;
}

// 在頁面內執行：中文標題優先在子句之間換行、詞不拆到兩行，再把字級縮到版面放得下
function fitPostTitle() {
  const main = document.querySelector('main');
  const copy = document.querySelector('.copy');
  if (document.documentElement.lang === 'zh-TW' && window.Intl && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('zh-Hant', { granularity: 'word' });
    const brackets = { '「': '」', '『': '』', '《': '》', '（': '）' };
    const splitClauses = (text) => {
      const clauses = [];
      let current = '';
      let closing = '';
      for (const char of text) {
        current += char;
        if (closing) {
          if (char === closing) closing = '';
        } else if (brackets[char]) {
          closing = brackets[char];
        } else if ('，：；？！。'.includes(char)) {
          clauses.push(current);
          current = '';
        }
      }
      if (current) clauses.push(current);
      return clauses;
    };
    for (const node of document.querySelectorAll('h1, .rest')) {
      const text = node.textContent;
      node.textContent = '';
      for (const clause of splitClauses(text)) {
        const block = document.createElement('span');
        block.className = 'clause';
        for (const { segment, isWordLike } of segmenter.segment(clause)) {
          if (isWordLike) {
            const word = document.createElement('span');
            word.className = 'nowrap';
            word.textContent = segment;
            block.appendChild(word);
          } else {
            block.appendChild(document.createTextNode(segment));
          }
        }
        node.appendChild(block);
      }
    }
  }
  let size = 60;
  document.body.style.setProperty('--title', `${size}px`);
  const setSize = (value) => document.body.style.setProperty('--title', `${value}px`);
  while (size > 36 && copy.offsetHeight > main.clientHeight - 40) {
    size -= 2;
    setSize(size);
  }
  // 再小一點就能讓每個子句各佔一行的話，縮到那個字級；縮到 48px 還做不到就維持原樣
  const wraps = () => [...document.querySelectorAll('h1 .clause')].some((clause) => clause.offsetHeight > size * 1.22 * 1.5);
  const fitted = size;
  while (size > 48 && wraps()) {
    size -= 2;
    setSize(size);
  }
  if (wraps()) {
    size = fitted;
    setSize(size);
  }
}

async function generatePostCards() {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  try {
    for (const card of loadPostCards()) {
      const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
      await page.setContent(cardHtml(card, 'wide', ''), { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(fitPostTitle);
      await page.evaluate(() => document.fonts.ready);
      const png = await page.screenshot({ type: 'png' });
      await page.close();
      write(`blog-cards/${card.slug}/og.${card.lang}.png`, png);
    }
  } finally {
    await browser.close();
  }
}

async function generateOgImages() {
  const { chromium } = require('playwright');
  const portraitSrc = `data:image/png;base64,${fs.readFileSync(path.join(PUBLIC, 'profile-cutout.png')).toString('base64')}`;
  const shapes = { wide: { width: 1200, height: 630 }, square: { width: 800, height: 800 } };

  const browser = await chromium.launch();
  try {
    for (const card of CARDS) {
      for (const [shape, viewport] of Object.entries(shapes)) {
        if (shape === 'square' && card.wideOnly) continue;
        const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
        await page.setContent(cardHtml(card, shape, portraitSrc), { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);
        const png = await page.screenshot({ type: 'png' });
        await page.close();

        write(`${card.name}${shape === 'square' ? '-square' : ''}.png`, png);
        if (shape === 'wide') (card.copies || []).forEach((copy) => write(`${copy}.png`, png));
      }
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const target = process.argv[2];
  if (!target || target === 'icons') generateIcons();
  if (!target || target === 'og') await generateOgImages();
  if (!target || target === 'posts') await generatePostCards();
}

main().catch((error) => {
  console.error('❌ 產生品牌素材失敗:', error);
  process.exit(1);
});
