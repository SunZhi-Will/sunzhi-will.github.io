import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  // 讀取 profile.jpg 作為 base64 data URL
  const fs = await import('fs');
  const path = await import('path');
  const profilePath = path.join(process.cwd(), 'public', 'profile.jpg');
  const profileBuffer = fs.readFileSync(profilePath);
  const profileBase64 = profileBuffer.toString('base64');
  const profileDataUrl = `data:image/jpeg;base64,${profileBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 30%, #0f172a 60%, #09090b 100%)',
          fontFamily: '"Inter", "Noto Sans TC", system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Grid 背景 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* 光暈 */}
        <div
          style={{
            position: 'absolute',
            top: '-25%',
            left: '-10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(250,204,21,0.08), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)',
          }}
        />

        {/* 頂部裝飾線 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #facc15, transparent)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 48,
            padding: '48px 64px',
          }}
        >
          {/* 頭像 */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div
              style={{
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #facc15, #f59e0b, #7c3aed)',
                opacity: 0.6,
              }}
            />
            <img
              src={profileDataUrl}
              alt="Sun"
              width={160}
              height={160}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                position: 'relative',
                zIndex: 2,
              }}
            />
          </div>

          {/* 文字 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              謝上智 Sun
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '-0.01em',
              }}
            >
              Sun Zhi
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 18,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.5,
                marginTop: 4,
              }}
            >
              <span>Software Engineer</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#facc15', opacity: 0.6 }} />
              <span>AI Developer</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#facc15', opacity: 0.6 }} />
              <span>Instructor</span>
            </div>
            <div
              style={{
                fontSize: 16,
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.5,
                maxWidth: 560,
                marginTop: 4,
              }}
            >
              Building scalable tools that combine frontend excellence with AI-driven intelligence.
            </div>

            {/* 標籤 */}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              {[
                { label: 'Next.js', accent: true },
                { label: 'React' },
                { label: 'TypeScript' },
                { label: 'Python' },
                { label: 'Unity' },
              ].map((tag) => (
                <div
                  key={tag.label}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 999,
                    fontSize: 13,
                    fontWeight: 600,
                    background: tag.accent
                      ? 'rgba(250,204,21,0.12)'
                      : 'rgba(39,39,42,0.8)',
                    border: tag.accent
                      ? '1px solid rgba(250,204,21,0.25)'
                      : '1px solid rgba(63,63,70,0.6)',
                    color: tag.accent ? '#facc15' : 'rgba(255,255,255,0.65)',
                  }}
                >
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 網域 branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 32,
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.05em',
          }}
        >
          sunzhi-will.github.io
          <span style={{ color: 'rgba(250,204,21,0.4)', marginLeft: 4 }}>●</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
