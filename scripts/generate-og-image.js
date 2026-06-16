const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PROFILE_PATH = path.join(__dirname, '..', 'public', 'profile.jpg');

// --- Font resolution ---
const excludePatterns = [/Braille/i, /Symbol/i, /Dingbats?/i, /Wingdings/i, /LastResort/i, /Keyboard/i, /Webdings/i];
const isExcluded = (name) => excludePatterns.some(p => p.test(name));

const preferredFonts = [
  'Monaco.ttf', 'Geneva.ttf',
  'Arial.ttf', 'Helvetica.ttf', 'Verdana.ttf', 'Tahoma.ttf',
];

const fontDirs = [
  '/System/Library/Fonts',
  '/System/Library/Fonts/Supplemental',
  '/Library/Fonts',
  path.join(require('os').homedir(), 'Library', 'Fonts'),
  '/usr/share/fonts/truetype',
  '/usr/share/fonts',
];

const notoSansPath = path.join(
  __dirname, '..', 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og',
  'noto-sans-v27-latin-regular.ttf'
);

function resolveFont() {
  for (const dir of fontDirs) {
    try {
      const files = fs.readdirSync(dir);
      for (const pref of preferredFonts) {
        if (files.includes(pref)) {
          const data = fs.readFileSync(path.join(dir, pref));
          console.log(`  Font: ${dir}/${pref}`);
          return data;
        }
      }
    } catch {}
  }
  for (const dir of fontDirs) {
    try {
      const files = fs.readdirSync(dir);
      const ttf = files.find(f => /\.(ttf|otf)$/i.test(f) && !isExcluded(f));
      if (ttf) {
        const data = fs.readFileSync(path.join(dir, ttf));
        console.log(`  Font (fallback): ${dir}/${ttf}`);
        return data;
      }
    } catch {}
  }
  try {
    const data = fs.readFileSync(notoSansPath);
    console.log('  Font (bundled): noto-sans-v27-latin-regular.ttf');
    return data;
  } catch {}
  return null;
}

// --- Helpers ---
const ACCENT = '#facc15';

const vnode = (type, props = {}, children) => {
  const node = { type, props: { ...props } };
  if (children !== undefined) node.props.children = children;
  return node;
};
const el = (type, style, children) => vnode(type, { style }, children);

function avatarRing(profileDataUrl, size) {
  const ringSize = size + 10;
  return el('div', { position: 'relative', flexShrink: 0, display: 'flex' }, [
    el('div', { position: 'absolute', inset: -5, borderRadius: '50%', width: ringSize, height: ringSize, background: 'linear-gradient(135deg, #facc15, #f59e0b, #7c3aed)', opacity: 0.6 }),
    vnode('img', { src: profileDataUrl, alt: 'Sun', width: size, height: size, style: { borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 2 } }),
  ]);
}

function branding(url) {
  return el('div', { position: 'absolute', bottom: 24, right: 32, fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.18)', zIndex: 10 }, url);
}

function pageLabel(label) {
  return el('div', { fontSize: 18, fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }, label);
}

// --- Shared backgrounds ---
function buildWideBackground() {
  return [
    el('div', { position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '48px 48px' }),
    el('div', { position: 'absolute', top: '-25%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.08), transparent)' }),
    el('div', { position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)' }),
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }),
  ];
}

function buildSquareBackground() {
  return [
    el('div', { position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }),
    el('div', { position: 'absolute', top: '-30%', left: '-30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.1), transparent)' }),
    el('div', { position: 'absolute', bottom: '-20%', right: '-20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)' }),
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` }),
  ];
}

const BG_WIDE = 'linear-gradient(135deg, #0a0a0a 0%, #18181b 30%, #0f172a 60%, #09090b 100%)';
const BG_SQUARE = 'linear-gradient(135deg, #0a0a0a 0%, #18181b 30%, #0f172a 60%, #09090b 100%)';

// --- Page definitions ---
const pages = [
  {
    name: 'home',
    label: '',
    title: 'Sun',
    subtitle: ['Software Engineer', 'AI Developer', 'Instructor'],
    tagline: 'Building tools that combine frontend excellence with AI-driven intelligence.',
    tags: ['Next.js', 'React', 'TypeScript', 'Python', 'Unity'],
  },
  {
    name: 'links',
    label: 'Links',
    title: 'Sun',
    subtitle: ['Software Engineer \u00B7 AI Developer \u00B7 Instructor'],
    tagline: 'Connect with me across social media and explore my work.',
    tags: [],
  },
  {
    name: 'blog',
    label: 'Blog',
    title: 'Thoughts & Insights',
    subtitle: ['by Sun'],
    tagline: 'Exploring software engineering, AI development, and the art of building great products.',
    tags: [],
  },
];

// --- Layout: Wide 1200x630 (avatar left, text right) ---
function buildWide(profileDataUrl, page) {
  const tagEls = page.tags.map((label, i) =>
    el('div', {
      padding: '7px 18px', borderRadius: 999, fontSize: 17, fontWeight: 600,
      background: i === 0 ? 'rgba(250,204,21,0.12)' : 'rgba(39,39,42,0.8)',
      border: i === 0 ? '1px solid rgba(250,204,21,0.25)' : '1px solid rgba(63,63,70,0.6)',
      color: i === 0 ? ACCENT : 'rgba(255,255,255,0.65)',
    }, label)
  );

  const roles = el('div', { display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, marginTop: 4 },
    page.subtitle.map((s, i) => {
      if (i > 0) {
        const dot = el('span', { width: 6, height: 6, borderRadius: '50%', background: ACCENT });
        return [dot, el('span', {}, s)];
      }
      return el('span', {}, s);
    }).flat()
  );

  return el('div', {
    width: 1200, height: 630, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: BG_WIDE, position: 'relative', overflow: 'hidden', fontFamily: 'System',
  }, [
    ...buildWideBackground(),
    el('div', { display: 'flex', alignItems: 'center', gap: 36, padding: '40px 56px', position: 'relative', zIndex: 10 }, [
      avatarRing(profileDataUrl, 200),
      el('div', { display: 'flex', flexDirection: 'column', gap: 4 }, [
        page.label ? pageLabel(page.label) : null,
        el('div', { fontSize: 68, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }, page.title),
        page.subtitle.length > 1 ? roles : el('div', { fontSize: 24, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4, maxWidth: 520, marginTop: 4 }, page.subtitle[0]),
        el('div', { fontSize: 19, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, maxWidth: 580, marginTop: 4 }, page.tagline),
        page.tags.length > 0 ? el('div', { display: 'flex', gap: 10, marginTop: 10 }, tagEls) : null,
      ].filter(Boolean)),
    ]),
    branding('sunzhi-will.github.io'),
  ]);
}

// --- Layout: Square 800x800 (avatar top, text centered below) ---
function buildSquare(profileDataUrl, page) {
  const tagEls = page.tags.map((label, i) =>
    el('div', {
      padding: '6px 16px', borderRadius: 999, fontSize: 15, fontWeight: 600,
      background: i === 0 ? 'rgba(250,204,21,0.12)' : 'rgba(39,39,42,0.8)',
      border: i === 0 ? '1px solid rgba(250,204,21,0.25)' : '1px solid rgba(63,63,70,0.6)',
      color: i === 0 ? ACCENT : 'rgba(255,255,255,0.65)',
    }, label)
  );

  return el('div', {
    width: 800, height: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: BG_SQUARE, position: 'relative', overflow: 'hidden', fontFamily: 'System',
  }, [
    ...buildSquareBackground(),
    el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '48px 40px', position: 'relative', zIndex: 10 }, [
      avatarRing(profileDataUrl, 240),
      el('div', { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 8 },
        [page.label ? pageLabel(page.label) : null,
          el('div', { fontSize: 56, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1, textAlign: 'center' }, page.title),
          el('div', { fontSize: 22, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, textAlign: 'center', marginTop: 2 }, page.subtitle.join(' \u00B7 ')),
          el('div', { fontSize: 17, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, textAlign: 'center', maxWidth: 500, marginTop: 4 }, page.tagline),
          page.tags.length > 0 ? el('div', { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }, tagEls) : null,
        ].filter(Boolean)),
    ]),
    branding('sunzhi-will.github.io'),
  ]);
}

// --- Main ---
async function main() {
  console.log('Generating OG images...\n');

  if (!fs.existsSync(PROFILE_PATH)) {
    console.error('  \u2717 profile.jpg not found, skipping');
    process.exit(0);
  }

  const fontData = resolveFont();
  if (!fontData) {
    console.error('  \u2717 No suitable font found. Skipping OG image generation.');
    process.exit(0);
  }

  const profileBase64 = fs.readFileSync(PROFILE_PATH).toString('base64');
  const profileDataUrl = `data:image/jpeg;base64,${profileBase64}`;

  const fontConfig = [{ name: 'System', data: fontData, weight: 400, style: 'normal' }];

  const sizes = [
    { suffix: '', build: buildWide, w: 1200, h: 630 },
    { suffix: '-square', build: buildSquare, w: 800, h: 800 },
  ];

  for (const page of pages) {
    for (const { suffix, build, w, h } of sizes) {
      const tree = build(profileDataUrl, page);
      const svg = await satori(tree, { width: w, height: h, fonts: fontConfig });
      const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: w } });
      const pngBuffer = resvg.render().asPng();
      const filename = `og-${page.name}${suffix}.png`;
      const outputPath = path.join(PUBLIC_DIR, filename);
      fs.writeFileSync(outputPath, pngBuffer);
      const stats = fs.statSync(outputPath);
      console.log(`  \u2713 ${filename} (${(stats.size / 1024).toFixed(1)}KB, ${w}x${h})`);
    }
  }

  console.log(`\nDone. ${pages.length * sizes.length} OG images generated in ${PUBLIC_DIR}`);
}

main().catch((e) => {
  console.error('  \u2717 OG image generation failed:', e.message);
  process.exit(0);
});
