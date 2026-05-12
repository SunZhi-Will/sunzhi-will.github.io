#!/usr/bin/env node
/**
 * 重試下載被 rate limit 的 GitHub Social Preview 圖片
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const BASE = path.resolve(__dirname, "..");
const PUBLIC = path.join(BASE, "public");

const RETRY = [
  { images: ["/projects/ai_debt_scanner/home.png", "/projects/ai_debt_scanner/dashboard.png"], owner: "sunzhi-will", repo: "AIDebtScanner" },
  { images: ["/projects/broadvize/home.png", "/projects/broadvize/editor.png"], owner: "sunzhi-will", repo: "broadvize" },
  { images: ["/projects/carbon/home.png"], owner: "carbon-app", repo: "carbon" },
  { images: ["/projects/codeltp/home.png", "/projects/codeltp/learning.png"], owner: "sunzhi-will", repo: "CodeLTP" },
  { images: ["/projects/fliptok/home.png", "/projects/fliptok/browse.png"], owner: "sunzhi-will", repo: "FilpTok" },
  { images: ["/projects/liminal/home.png"], owner: "SunZhi-Will", repo: "Liminal" },
  { images: ["/projects/openring/home.png", "/projects/openring/agent.png"], owner: "SunZhi-Will", repo: "OpenRing" },
  { images: ["/projects/promptly/popup.png", "/projects/promptly/suggest.png"], owner: "sunzhi-will", repo: "promptly" },
  { images: ["/projects/specformula/home.png"], owner: "SunZhi-Will", repo: "specformula-desktop-app" },
  { images: ["/projects/ticktive/home.png", "/projects/ticktive/dashboard.png"], owner: "sunzhi-will", repo: "InboxCRM" },
  { images: ["/projects/vibe_workshop/home.png", "/projects/vibe_workshop/dashboard.png"], owner: "SunZhi-Will", repo: "vibe-workshop" },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadFile(url, dest, attempt = 1) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const req = https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        file.close(); fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest, attempt).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode === 429) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(new Error(`429_RATE_LIMIT`));
        return;
      }
      if (res.statusCode !== 200) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        const stats = fs.statSync(dest);
        if (stats.size < 1000) {
          fs.unlinkSync(dest);
          reject(new Error(`Too small: ${stats.size}B`));
        } else {
          resolve(stats.size);
        }
      });
    });
    req.on("error", err => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(err); });
    req.setTimeout(20000, () => { req.destroy(); file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(new Error("Timeout")); });
  });
}

async function main() {
  console.log("=== 重試被 Rate Limit 的圖片（間隔 3 秒）===\n");
  
  for (const { images, owner, repo } of RETRY) {
    const ogUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;
    const firstDest = path.join(PUBLIC, images[0]);
    fs.mkdirSync(path.dirname(firstDest), { recursive: true });

    let ogData = null;
    let attempts = 0;
    
    while (attempts < 3) {
      attempts++;
      try {
        const size = await downloadFile(ogUrl, firstDest);
        console.log(`✓ ${images[0]}  (${(size/1024).toFixed(0)}KB) ← ${owner}/${repo}`);
        ogData = fs.readFileSync(firstDest);
        break;
      } catch (err) {
        if (err.message === "429_RATE_LIMIT" && attempts < 3) {
          console.log(`⏳ 429 rate limit，等待 5 秒後重試 (${attempts}/3)...`);
          await sleep(5000);
        } else {
          console.log(`✗ FAIL ${images[0]}  ${err.message} (${attempts} 次嘗試)`);
          break;
        }
      }
    }
    
    if (ogData) {
      for (let i = 1; i < images.length; i++) {
        const dest = path.join(PUBLIC, images[i]);
        fs.writeFileSync(dest, ogData);
        console.log(`  ✓ COPY ${images[i]}`);
      }
    }
    
    await sleep(3000); // 每個專案間隔 3 秒
  }
  
  console.log("\n=== 重試完成 ===");
}

main().catch(console.error);
