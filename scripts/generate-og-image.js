/**
 * 產生 OG 圖片（Open Graph 分享預覽圖）
 * 使用 Satori + Resvg 直接渲染 React-like VNode 到 PNG（無瀏覽器相依）
 * 在 prebuild 步驟執行，確保 static export 也有 OG image
 */
const { default: satori } = require('satori');
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'og-image.png');
const PROFILE_PATH = path.join(__dirname, '..', 'public', 'profile.jpg');

async function main() {
  console.log('🎨 Generating OG image...');

  if (!fs.existsSync(PROFILE_PATH)) {
    console.error('  ✗ profile.jpg not found, skipping');
    process.exit(0);
  }

  const profileBuffer = fs.readFileSync(PROFILE_PATH);
  const profileBase64 = profileBuffer.toString('base64');
  const profileDataUrl = `data:image/jpeg;base64,${profileBase64}`;

  // Resolve a TTF/OTF font for Satori. Checks system fonts (macOS/Linux),
  // then falls back to node_modules. Satori requires OTF/TTF (not TTC).
  // Exclude special-purpose fonts that don't render standard characters.
  const excludePatterns = [/Braille/i, /Symbol/i, /Dingbats?/i, /Wingdings/i, /LastResort/i, /Keyboard/i, /Webdings/i];
  const isExcluded = (name) => excludePatterns.some(p => p.test(name));

  // Priority-ordered list of good general-purpose font files to look for.
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

  // Bundled with @vercel/og (next/og) — reliable cross-platform fallback
  const notoSansPath = path.join(
    __dirname, '..', 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og',
    'noto-sans-v27-latin-regular.ttf'
  );

  let fontData;
  // First pass: look for preferred fonts by name
  for (const dir of fontDirs) {
    try {
      const files = fs.readdirSync(dir);
      for (const pref of preferredFonts) {
        if (files.includes(pref)) {
          fontData = fs.readFileSync(path.join(dir, pref));
          console.log(`  Font: ${dir}/${pref}`);
          break;
        }
      }
      if (fontData) break;
    } catch {}
  }
  // Second pass: any non-excluded TTF/OTF font
  if (!fontData) {
    for (const dir of fontDirs) {
      try {
        const files = fs.readdirSync(dir);
        const ttf = files.find(f => /\.(ttf|otf)$/i.test(f) && !isExcluded(f));
        if (ttf) {
          fontData = fs.readFileSync(path.join(dir, ttf));
          console.log(`  Font (fallback): ${dir}/${ttf}`);
          break;
        }
      } catch {}
    }
  }
  // Third pass: bundled Noto Sans from @vercel/og (works on macOS, Linux, CI)
  if (!fontData) {
    try {
      fontData = fs.readFileSync(notoSansPath);
      console.log(`  Font (bundled): noto-sans-v27-latin-regular.ttf`);
    } catch {}
  }

  if (!fontData) {
    console.error('  \u2717 No suitable TTF/OTF font found. Install a font like "noto-fonts" or skip this step.');
    process.exit(0);
  }

  const vnode = (type, props = {}, children) => {
    const node = { type, props: { ...props } };
    if (children !== undefined) {
      node.props.children = children;
    }
    return node;
  };

  const el = (type, style, children) => vnode(type, { style }, children);

  const tags = [
    { label: 'Next.js', accent: true },
    { label: 'React', accent: false },
    { label: 'TypeScript', accent: false },
    { label: 'Python', accent: false },
    { label: 'Unity', accent: false },
  ];

  const tree = el('div', {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 30%, #0f172a 60%, #09090b 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'System',
  }, [
    // Grid overlay
    el('div', {
      position: 'absolute', inset: 0, opacity: 0.04,
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
      backgroundSize: '48px 48px',
    }),
    // Glows
    el('div', { position: 'absolute', top: '-25%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(250,204,21,0.08), transparent)' }),
    el('div', { position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)' }),
    // Accent line
    el('div', { position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg, transparent, #facc15, transparent)' }),
    // Card content
    el('div', { display: 'flex', alignItems: 'center', gap: 48, padding: '48px 64px', position: 'relative', zIndex: 10 }, [
      // Avatar ring + image
      el('div', { position: 'relative', flexShrink: 0, display: 'flex' }, [
        el('div', { position: 'absolute', inset: -4, borderRadius: '50%', width: 168, height: 168, background: 'linear-gradient(135deg, #facc15, #f59e0b, #7c3aed)', opacity: 0.6 }),
        vnode('img', { src: profileDataUrl, alt: 'Sun', width: 160, height: 160, style: { borderRadius: '50%', objectFit: 'cover', position: 'relative', zIndex: 2 } }),
      ]),
      // Text content
      el('div', { display: 'flex', flexDirection: 'column', gap: 8 }, [
        el('div', { fontSize: 44, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }, 'Sun'),
        el('div', { display: 'flex', alignItems: 'center', gap: 10, fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginTop: 4 }, [
          el('span', {}, 'Software Engineer'),
          el('span', { width: 4, height: 4, borderRadius: '50%', background: '#facc15', opacity: 0.6 }),
          el('span', {}, 'AI Developer'),
          el('span', { width: 4, height: 4, borderRadius: '50%', background: '#facc15', opacity: 0.6 }),
          el('span', {}, 'Instructor'),
        ]),
        el('div', { fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, maxWidth: 560, marginTop: 4 }, 'Building scalable tools that combine frontend excellence with AI-driven intelligence.'),
        // Tags
        el('div', { display: 'flex', gap: 10, marginTop: 8 },
          tags.map(t => el('div', {
            padding: '5px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: t.accent ? 'rgba(250,204,21,0.12)' : 'rgba(39,39,42,0.8)',
            border: t.accent ? '1px solid rgba(250,204,21,0.25)' : '1px solid rgba(63,63,70,0.6)',
            color: t.accent ? '#facc15' : 'rgba(255,255,255,0.65)',
          }, t.label)),
        ),
      ]),
    ]),
    // Branding
    el('div', { position: 'absolute', bottom: 24, right: 32, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.2)', zIndex: 10 }, [
      el('span', {}, 'sunzhi-will.github.io'),
      el('span', { color: 'rgba(250,204,21,0.4)', fontSize: 8 }, '\u2022'),
    ]),
  ]);

  const svg = await satori(tree, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [{
      name: 'System',
      data: fontData,
      weight: 400,
      style: 'normal',
    }],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } });
  const pngBuffer = resvg.render().asPng();
  fs.writeFileSync(OUTPUT_PATH, pngBuffer);

  const stats = fs.statSync(OUTPUT_PATH);
  console.log(`  \u2713 OG image generated: ${OUTPUT_PATH} (${(stats.size / 1024).toFixed(1)}KB)`);
}

main().catch((e) => {
  console.error('  \u2717 OG image generation failed:', e.message);
  process.exit(0); // don't block build
});
