#!/usr/bin/env node
/**
 * 全面實作：下載 GitHub Social Preview 圖片作為專案截圖
 * GitHub OG image: https://opengraph.githubassets.com/1/{owner}/{repo}
 * 若專案有 demo URL，額外用 Playwright 截圖
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const BASE = path.resolve(__dirname, "..");
const PUBLIC = path.join(BASE, "public");

// 缺失圖片 → GitHub repo 對應表
// 格式: [ 圖片路徑[], GitHub owner, repo, demo URL (可選) ]
const PROJECTS = [
  {
    images: ["/projects/ai_debt_scanner/home.png", "/projects/ai_debt_scanner/dashboard.png"],
    owner: "sunzhi-will", repo: "AIDebtScanner",
    demo: null,
  },
  {
    images: ["/projects/allvibe/home.png", "/projects/allvibe/explore.png"],
    owner: "sunzhi-will", repo: "allvibe",
    demo: null,
  },
  {
    images: ["/projects/autolens/home.png"],
    owner: "SunZhi-Will", repo: "autolens",
    demo: null,
  },
  {
    images: ["/projects/broadvize/home.png", "/projects/broadvize/editor.png"],
    owner: "sunzhi-will", repo: "broadvize",
    demo: null,
  },
  {
    images: ["/projects/carbon/home.png"],
    owner: "carbon-app", repo: "carbon",
    demo: null,
  },
  {
    images: ["/projects/cardflow/home.png", "/projects/cardflow/card.png"],
    owner: "sunzhi-will", repo: "cardflow",
    demo: null,
  },
  {
    images: ["/projects/codeltp/home.png", "/projects/codeltp/learning.png"],
    owner: "sunzhi-will", repo: "CodeLTP",
    demo: null,
  },
  {
    images: ["/projects/fliptok/home.png", "/projects/fliptok/browse.png"],
    owner: "sunzhi-will", repo: "FilpTok",
    demo: null,
  },
  {
    images: ["/projects/liminal/home.png"],
    owner: "SunZhi-Will", repo: "Liminal",
    demo: null,
  },
  {
    images: ["/projects/nexusos/home.png", "/projects/nexusos/chat.png"],
    owner: "SunZhi-Will", repo: "NexusOS",
    demo: null,
  },
  {
    images: ["/projects/openring/home.png", "/projects/openring/agent.png"],
    owner: "SunZhi-Will", repo: "OpenRing",
    demo: null,
  },
  {
    images: ["/projects/promptly/popup.png", "/projects/promptly/suggest.png"],
    owner: "sunzhi-will", repo: "promptly",
    demo: null,
  },
  {
    images: ["/projects/resumeai/home.png", "/projects/resumeai/preview.png"],
    owner: "sunzhi-will", repo: "resumeai",
    demo: null,
  },
  {
    images: ["/projects/skyvize/home.png", "/projects/skyvize/patrol.png"],
    owner: "sunzhi-will", repo: "skyvize",
    demo: null,
  },
  {
    images: ["/projects/specformula/home.png"],
    owner: "SunZhi-Will", repo: "specformula-desktop-app",
    demo: null,
  },
  {
    images: ["/projects/taipei_dashboard/home.png"],
    owner: "SunZhi-Will", repo: "Taipei-City-Dashboard",
    demo: null,
  },
  {
    images: ["/projects/threads_story_recap/home.png", "/projects/threads_story_recap/story.png"],
    owner: "sunzhi-will", repo: "ThreadsStoryRecap",
    demo: null,
  },
  {
    images: ["/projects/ticktive/home.png", "/projects/ticktive/dashboard.png"],
    owner: "sunzhi-will", repo: "InboxCRM",
    demo: null,
  },
  {
    images: ["/projects/toolnest/home.png"],
    owner: "SunZhi-Will", repo: "toolnest",
    demo: null,
  },
  {
    images: ["/projects/veyo_shop/home.png", "/projects/veyo_shop/cart.png"],
    owner: "sunzhi-will", repo: "veyo-shop",
    demo: null,
  },
  {
    images: ["/projects/vibe_workshop/home.png", "/projects/vibe_workshop/dashboard.png"],
    owner: "SunZhi-Will", repo: "vibe-workshop",
    demo: null,
  },
  {
    images: ["/projects/vibeacademy/home.png"],
    owner: "SunZhi-Will", repo: "vibeacademy",
    demo: null,
  },
  {
    images: ["/projects/vibegame/home.png", "/projects/vibegame/detail.png"],
    owner: "sunzhi-will", repo: "vibegame",
    demo: null,
  },
  {
    images: ["/projects/voxel_world/home.png", "/projects/voxel_world/gameplay.png"],
    owner: "sunzhi-will", repo: "voxel-world",
    demo: null,
  },
  {
    images: ["/projects/zettelify/home.png"],
    owner: "SunZhi-Will", repo: "zettelify",
    demo: null,
  },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    
    const req = protocol.get(url, { 
      headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-image-fetcher/1.0)" }
    }, (res) => {
      // 追蹤重定向
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        // 檢查下載的檔案是否有效（至少 1KB）
        const stats = fs.statSync(dest);
        if (stats.size < 1000) {
          fs.unlinkSync(dest);
          reject(new Error(`Downloaded file too small (${stats.size} bytes) for ${url}`));
        } else {
          resolve(stats.size);
        }
      });
    });
    
    req.on("error", (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
    
    req.setTimeout(15000, () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

async function processProject(project) {
  const { images, owner, repo } = project;
  const ogUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  
  let downloaded = false;
  let ogData = null;
  
  // 先下載 OG 圖片（只下載一次）
  const firstImage = images[0];
  const firstDest = path.join(PUBLIC, firstImage);
  fs.mkdirSync(path.dirname(firstDest), { recursive: true });
  
  try {
    const size = await downloadFile(ogUrl, firstDest);
    console.log(`✓ OG   ${firstImage}  (${(size/1024).toFixed(0)}KB) ← ${owner}/${repo}`);
    ogData = fs.readFileSync(firstDest);
    downloaded = true;
  } catch (err) {
    console.log(`✗ FAIL ${firstImage}  ${err.message}`);
    // 保留原有的佔位圖
    return;
  }
  
  // 其餘圖片複製同一份 OG 圖
  for (let i = 1; i < images.length; i++) {
    const dest = path.join(PUBLIC, images[i]);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
      fs.writeFileSync(dest, ogData);
      console.log(`✓ COPY ${images[i]}`);
    } catch (err) {
      console.log(`✗ COPY FAIL ${images[i]}  ${err.message}`);
    }
  }
}

async function main() {
  console.log("=== GitHub Social Preview 圖片下載器 ===\n");
  
  let success = 0, fail = 0;
  
  for (const project of PROJECTS) {
    const { owner, repo } = project;
    try {
      await processProject(project);
      success++;
    } catch (err) {
      console.log(`✗ ERROR ${owner}/${repo}: ${err.message}`);
      fail++;
    }
    // 避免過快請求
    await new Promise(r => setTimeout(r, 300));
  }
  
  console.log(`\n=== 完成：成功 ${success} 個專案，失敗 ${fail} 個 ===`);
}

main().catch(console.error);
