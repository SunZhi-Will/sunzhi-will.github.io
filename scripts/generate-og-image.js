const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

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

const vnode = (type, props = {}, children) => {
  const node = { type, props: { ...props } };
  if (children !== undefined) node.props.children = children;
  return node;
};

const el = (type, style, children) => vnode(type, { style }, children);

function buildBackground(accentColor, glowColor) {
  return [
    el('div', {
      position: 'absolute', inset: 0, opacity: 0.04,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }),
    el('div', { position: 'absolute', top: '-25%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}, transparent)` }),
    el('div', { position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${glowColor}, transparent)` }),
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, transparent, ${accentColor.replace(/[\d.]+\)$/, '1)')}, transparent)` }),
  ];
}

function buildBranding(url) {
  return el('div', { position: 'absolute', bottom: 24, right: 32, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.2)', zIndex: 10 }, [
    el('span', {}, url),
  ]);
}

// --- Homepage OG: personal brand card ---
function buildHomeTree() {
  return el('div', {
    width: OG_WIDTH, height: OG_HEIGHT,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 30%, #0f172a 60%, #09090b 100%)',
    position: 'relative', overflow: 'hidden', fontFamily: 'System',
  }, [
    ...buildBackground('rgba(250,204,21,0.08)', 'rgba(124,58,237,0.06)'),
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, transparent, #facc15, transparent)' }),
    el('div', { display: 'flex', flexDirection: 'column', gap: 12, padding: '48px 64px', position: 'relative', zIndex: 10 }, [
      el('div', { fontSize: 56, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }, 'Sun'),
      el('div', { display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 4 }, [
        el('span', {}, 'Software Engineer'), el('span', { width: 4, height: 4, borderRadius: '50%', background: '#facc15' }), el('span', {}, 'AI Developer'), el('span', { width: 4, height: 4, borderRadius: '50%', background: '#facc15' }), el('span', {}, 'Instructor'),
      ]),
      el('div', { fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, maxWidth: 560, marginTop: 4 }, 'Building tools that combine frontend excellence with AI-driven intelligence.'),
      el('div', { display: 'flex', gap: 10, marginTop: 10 },
        ['Next.js', 'React', 'TypeScript', 'Python', 'Unity'].map((label, i) =>
          el('div', {
            padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: i === 0 ? 'rgba(250,204,21,0.12)' : 'rgba(39,39,42,0.8)',
            border: i === 0 ? '1px solid rgba(250,204,21,0.25)' : '1px solid rgba(63,63,70,0.6)',
            color: i === 0 ? '#facc15' : 'rgba(255,255,255,0.65)',
          }, label)
        ),
      ),
    ]),
    buildBranding('sunzhi-will.github.io'),
  ]);
}

// --- Links OG: simpler card with purple accent ---
function buildLinksTree() {
  return el('div', {
    width: OG_WIDTH, height: OG_HEIGHT,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1c0a2e 30%, #0f172a 60%, #09090b 100%)',
    position: 'relative', overflow: 'hidden', fontFamily: 'System',
  }, [
    ...buildBackground('rgba(168,85,247,0.08)', 'rgba(59,130,246,0.06)'),
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, transparent, #a855f7, transparent)' }),
    el('div', { display: 'flex', flexDirection: 'column', gap: 10, padding: '48px 64px', position: 'relative', zIndex: 10 }, [
      el('div', { fontSize: 18, fontWeight: 700, color: '#a855f7', letterSpacing: '0.08em', textTransform: 'uppercase' }, 'Links'),
      el('div', { fontSize: 48, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 2 }, 'Sun'),
      el('div', { fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, maxWidth: 560, marginTop: 4 }, 'Software Engineer · AI Developer · Instructor'),
      el('div', { fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, maxWidth: 560 }, 'Connect with me across social media and explore my work.'),
    ]),
    buildBranding('sunzhi-will.github.io/links'),
  ]);
}

// --- Blog OG: content-focused, different layout ---
function buildBlogTree() {
  return el('div', {
    width: OG_WIDTH, height: OG_HEIGHT,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 30%, #0f172a 60%, #09090b 100%)',
    position: 'relative', overflow: 'hidden', fontFamily: 'System',
  }, [
    ...buildBackground('rgba(34,211,238,0.07)', 'rgba(99,102,241,0.05)'),
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)' }),
    el('div', { display: 'flex', flexDirection: 'column', gap: 10, padding: '48px 64px', position: 'relative', zIndex: 10 }, [
      el('div', { fontSize: 16, fontWeight: 700, color: '#22d3ee', letterSpacing: '0.08em', textTransform: 'uppercase' }, 'Blog'),
      el('div', { fontSize: 44, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15, marginTop: 2 }, 'Thoughts & Insights'),
      el('div', { fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginTop: 4 }, 'by Sun'),
      el('div', { fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, maxWidth: 560, marginTop: 4 }, 'Exploring software engineering, AI development, and the art of building great products.'),
    ]),
    buildBranding('sunzhi-will.github.io/blog'),
  ]);
}

async function generateImage(name, treeBuilder) {
  const fontData = resolveFont();
  if (!fontData) {
    console.error(`  \u2717 Skipping ${name}: no font available`);
    return;
  }

  const tree = treeBuilder();
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

async function main() {
  console.log('Generating OG images...\n');

  const images = [
    { name: 'og-home.png', builder: buildHomeTree },
    { name: 'og-links.png', builder: buildLinksTree },
    { name: 'og-blog.png', builder: buildBlogTree },
  ];

  // Resolve font once, share across all images
  const fontData = resolveFont();
  if (!fontData) {
    console.error('  \u2717 No suitable font found. Skipping OG image generation.');
    process.exit(0);
  }

  for (const { name, builder } of images) {
    const tree = builder();
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
