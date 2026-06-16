const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PROFILE_PATH = path.join(__dirname, '..', 'public', 'profile.jpg');

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

const BG_GRADIENT = 'linear-gradient(135deg, #0a0a0a 0%, #18181b 30%, #0f172a 60%, #09090b 100%)';
const ACCENT = '#facc15';
const ACCENT_RGB = 'rgba(250,204,21,';

const vnode = (type, props = {}, children) => {
  const node = { type, props: { ...props } };
  if (children !== undefined) node.props.children = children;
  return node;
};

const el = (type, style, children) => vnode(type, { style }, children);

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

function buildBackground() {
  return [
    el('div', {
      position: 'absolute', inset: 0, opacity: 0.04,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }),
    el('div', { position: 'absolute', top: '-25%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.08), transparent)' }),
    el('div', { position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)' }),
  ];
}

function buildAccentLine() {
  return el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)` });
}

function buildAvatar(profileDataUrl) {
  return el('div', { position: 'relative', flexShrink: 0, display: 'flex' }, [
    el('div', { position: 'absolute', inset: -5, borderRadius: '50%', width: 210, height: 210, background: 'linear-gradient(135deg, #facc15, #f59e0b, #7c3aed)', opacity: 0.6 }),
    vnode('img', { src: profileDataUrl, alt: 'Sun', width: 200, height: 200, style: { borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 2 } }),
  ]);
}

function buildBranding(url) {
  return el('div', { position: 'absolute', bottom: 28, right: 36, display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.2)', zIndex: 10 }, [
    el('span', {}, url),
  ]);
}

function buildPageLabel(label) {
  return el('div', { fontSize: 20, fontWeight: 700, color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }, label);
}

function buildCard(children) {
  return el('div', { display: 'flex', alignItems: 'center', gap: 36, padding: '40px 56px', position: 'relative', zIndex: 10 }, children);
}

// Shared shell for all OG images
function buildShell(profileDataUrl, pageLabel, bodyChildren) {
  return el('div', {
    width: OG_WIDTH, height: OG_HEIGHT,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: BG_GRADIENT,
    position: 'relative', overflow: 'hidden', fontFamily: 'System',
  }, [
    ...buildBackground(),
    buildAccentLine(),
    buildCard([
      buildAvatar(profileDataUrl),
      el('div', { display: 'flex', flexDirection: 'column', gap: 6 }, [
        buildPageLabel(pageLabel),
        ...bodyChildren,
      ]),
    ]),
    buildBranding('sunzhi-will.github.io'),
  ]);
}

async function main() {
  console.log('Generating OG images...\n');

  const fontData = resolveFont();
  if (!fontData) {
    console.error('  \u2717 No suitable font found. Skipping OG image generation.');
    process.exit(0);
  }

  if (!fs.existsSync(PROFILE_PATH)) {
    console.error('  \u2717 profile.jpg not found, skipping');
    process.exit(0);
  }
  const profileBase64 = fs.readFileSync(PROFILE_PATH).toString('base64');
  const profileDataUrl = `data:image/jpeg;base64,${profileBase64}`;

  const tags = ['Next.js', 'React', 'TypeScript', 'Python', 'Unity'];
  const tagEls = tags.map((label, i) =>
    el('div', {
      padding: '8px 20px', borderRadius: 999, fontSize: 18, fontWeight: 600,
      background: i === 0 ? `${ACCENT_RGB}0.12)` : 'rgba(39,39,42,0.8)',
      border: i === 0 ? `1px solid ${ACCENT_RGB}0.25)` : '1px solid rgba(63,63,70,0.6)',
      color: i === 0 ? ACCENT : 'rgba(255,255,255,0.65)',
    }, label)
  );

  const images = [
    {
      name: 'og-home.png',
      label: '',
      body: [
        el('div', { fontSize: 72, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }, 'Sun'),
        el('div', { display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, marginTop: 4 }, [
          el('span', {}, 'Software Engineer'), el('span', { width: 6, height: 6, borderRadius: '50%', background: ACCENT }), el('span', {}, 'AI Developer'), el('span', { width: 6, height: 6, borderRadius: '50%', background: ACCENT }), el('span', {}, 'Instructor'),
        ]),
        el('div', { fontSize: 21, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, maxWidth: 580, marginTop: 4 }, 'Building tools that combine frontend excellence with AI-driven intelligence.'),
        el('div', { display: 'flex', gap: 12, marginTop: 10 }, tagEls),
      ],
    },
    {
      name: 'og-links.png',
      label: 'Links',
      body: [
        el('div', { fontSize: 64, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }, 'Sun'),
        el('div', { fontSize: 24, color: 'rgba(255,255,255,0.55)', lineHeight: 1.4, maxWidth: 520, marginTop: 4 }, 'Software Engineer \u00B7 AI Developer \u00B7 Instructor'),
        el('div', { fontSize: 19, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4, maxWidth: 520, marginTop: 4 }, 'Connect with me across social media and explore my work.'),
      ],
    },
    {
      name: 'og-blog.png',
      label: 'Blog',
      body: [
        el('div', { fontSize: 56, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }, 'Thoughts & Insights'),
        el('div', { fontSize: 26, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, marginTop: 6 }, 'by Sun'),
        el('div', { fontSize: 20, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, maxWidth: 520, marginTop: 4 }, 'Exploring software engineering, AI development, and the art of building great products.'),
      ],
    },
  ];

  for (const { name, label, body } of images) {
    const tree = buildShell(profileDataUrl, label, body);
    const svg = await satori(tree, {
      width: OG_WIDTH, height: OG_HEIGHT,
      fonts: [{ name: 'System', data: fontData, weight: 400, style: 'normal' }],
    });
    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } });
    const pngBuffer = resvg.render().asPng();
    const outputPath = path.join(PUBLIC_DIR, name);
    fs.writeFileSync(outputPath, pngBuffer);
    const stats = fs.statSync(outputPath);
    console.log(`  \u2713 ${name} (${(stats.size / 1024).toFixed(1)}KB)`);
  }

  console.log(`\nDone. ${images.length} OG images generated in ${PUBLIC_DIR}`);
}

main().catch((e) => {
  console.error('  \u2717 OG image generation failed:', e.message);
  process.exit(0);
});
