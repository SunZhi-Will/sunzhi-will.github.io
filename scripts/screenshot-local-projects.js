/**
 * 自動啟動各 Next.js 專案並截圖首頁
 * 每個專案：啟動 → 等待就緒 → 截圖 → 關閉
 */
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const PUBLIC = '/Applications/Projects/nextjs/sunzhi-will.github.io/public/projects';
const PROJ_ROOT = '/Applications/Projects/nextjs';

// [project_folder, public_key, port, [extra_pages]]
const PROJECTS = [
  { dir: 'allvibe',       key: 'allvibe',         port: 3001, pages: [{ path: '/', dest: 'home.png' }, { path: '/explore', dest: 'explore.png' }] },
  { dir: 'skyvize',       key: 'skyvize',         port: 3002, pages: [{ path: '/', dest: 'home.png' }, { path: '/', dest: 'patrol.png' }] },
  { dir: 'CardFlow',      key: 'cardflow',        port: 3003, pages: [{ path: '/', dest: 'home.png' }, { path: '/', dest: 'card.png' }] },
  { dir: 'toolnest',      key: 'toolnest',        port: 3004, pages: [{ path: '/', dest: 'home.png' }] },
  { dir: 'veyo-shop',     key: 'veyo_shop',       port: 3005, pages: [{ path: '/', dest: 'home.png' }, { path: '/cart', dest: 'cart.png' }] },
  { dir: 'zettelify',     key: 'zettelify',       port: 3006, pages: [{ path: '/', dest: 'home.png' }] },
  { dir: 'ResumeAI',      key: 'resumeai',        port: 3007, pages: [{ path: '/', dest: 'home.png' }, { path: '/', dest: 'preview.png' }] },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function waitForPort(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const req = http.request({ host: 'localhost', port, path: '/' }, () => {
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error(`Port ${port} not ready after ${timeout}ms`));
        } else {
          setTimeout(check, 1000);
        }
      });
      req.end();
    };
    check();
  });
}

async function screenshotProject(project, browser) {
  const { dir, key, port, pages } = project;
  const projectDir = path.join(PROJ_ROOT, dir);
  
  console.log(`\n▶ ${dir} (port ${port})`);
  
  // 啟動 dev server
  const proc = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
    cwd: projectDir,
    env: { ...process.env, PORT: String(port) },
    stdio: 'pipe',
    detached: false,
  });
  
  let killed = false;
  const kill = () => { if (!killed) { killed = true; try { proc.kill('SIGTERM'); } catch {} } };
  
  try {
    console.log(`  等待端口 ${port}...`);
    await waitForPort(port, 45000);
    await sleep(2000); // 等待渲染完成
    
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    
    for (const { path: pagePath, dest } of pages) {
      const url = `http://localhost:${port}${pagePath}`;
      const destPath = `${PUBLIC}/${key}/${dest}`;
      
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await sleep(2000);
        await page.screenshot({ path: destPath });
        const size = fs.statSync(destPath).size;
        console.log(`  ✓ ${dest}  (${Math.round(size/1024)}KB)`);
      } catch (e) {
        console.log(`  ✗ ${dest}: ${e.message.slice(0, 60)}`);
      }
    }
    
    await page.close();
  } catch (e) {
    console.log(`  ✗ 啟動失敗: ${e.message.slice(0, 80)}`);
  } finally {
    kill();
    await sleep(1000);
  }
}

(async () => {
  console.log('=== 自動截圖 Next.js 專案 ===\n');
  
  const browser = await chromium.launch({ headless: true });
  
  for (const project of PROJECTS) {
    await screenshotProject(project, browser);
  }
  
  await browser.close();
  console.log('\n=== 完成 ===');
})();
