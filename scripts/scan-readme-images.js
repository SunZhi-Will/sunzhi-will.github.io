#!/usr/bin/env node
/**
 * 從 GitHub README 提取截圖圖片 URL
 * 下載真實的 app 截圖來取代 GitHub Social Preview
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const BASE = path.resolve(__dirname, "..");
const PUBLIC = path.join(BASE, "public");

// 每個專案要抓幾張圖
const PROJECTS = [
  { key: "ai_debt_scanner",     owner: "sunzhi-will",  repo: "AIDebtScanner",           images: ["home.png", "dashboard.png"] },
  { key: "allvibe",             owner: "sunzhi-will",  repo: "allvibe",                 images: ["home.png", "explore.png"] },
  { key: "autolens",            owner: "SunZhi-Will",  repo: "autolens",                images: ["home.png"] },
  { key: "broadvize",           owner: "sunzhi-will",  repo: "broadvize",               images: ["home.png", "editor.png"] },
  { key: "carbon",              owner: "carbon-app",   repo: "carbon",                  images: ["home.png"] },
  { key: "cardflow",            owner: "sunzhi-will",  repo: "cardflow",                images: ["home.png", "card.png"] },
  { key: "codeltp",             owner: "sunzhi-will",  repo: "CodeLTP",                 images: ["home.png", "learning.png"] },
  { key: "fliptok",             owner: "sunzhi-will",  repo: "FilpTok",                 images: ["home.png", "browse.png"] },
  { key: "liminal",             owner: "SunZhi-Will",  repo: "Liminal",                 images: ["home.png"] },
  { key: "nexusos",             owner: "SunZhi-Will",  repo: "NexusOS",                 images: ["home.png", "chat.png"] },
  { key: "openring",            owner: "SunZhi-Will",  repo: "OpenRing",                images: ["home.png", "agent.png"] },
  { key: "promptly",            owner: "sunzhi-will",  repo: "promptly",                images: ["popup.png", "suggest.png"] },
  { key: "resumeai",            owner: "sunzhi-will",  repo: "resumeai",                images: ["home.png", "preview.png"] },
  { key: "skyvize",             owner: "sunzhi-will",  repo: "skyvize",                 images: ["home.png", "patrol.png"] },
  { key: "specformula",         owner: "SunZhi-Will",  repo: "specformula-desktop-app", images: ["home.png"] },
  { key: "taipei_dashboard",    owner: "SunZhi-Will",  repo: "Taipei-City-Dashboard",   images: ["home.png"] },
  { key: "threads_story_recap", owner: "sunzhi-will",  repo: "ThreadsStoryRecap",       images: ["home.png", "story.png"] },
  { key: "ticktive",            owner: "sunzhi-will",  repo: "InboxCRM",                images: ["home.png", "dashboard.png"] },
  { key: "toolnest",            owner: "SunZhi-Will",  repo: "toolnest",                images: ["home.png"] },
  { key: "veyo_shop",           owner: "sunzhi-will",  repo: "veyo-shop",               images: ["home.png", "cart.png"] },
  { key: "vibe_workshop",       owner: "SunZhi-Will",  repo: "vibe-workshop",           images: ["home.png", "dashboard.png"] },
  { key: "vibeacademy",         owner: "SunZhi-Will",  repo: "vibeacademy",             images: ["home.png"] },
  { key: "vibegame",            owner: "sunzhi-will",  repo: "vibegame",                images: ["home.png", "detail.png"] },
  { key: "voxel_world",         owner: "sunzhi-will",  repo: "voxel-world",             images: ["home.png", "gameplay.png"] },
  { key: "zettelify",           owner: "SunZhi-Will",  repo: "zettelify",               images: ["home.png"] },
];

function get(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/xhtml+xml,*/*"
      }
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(dest);
    const req = protocol.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        file.close(); fs.unlinkSync(dest);
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        const size = fs.statSync(dest).size;
        if (size < 2000) { fs.unlinkSync(dest); return reject(new Error(`Too small: ${size}B`)); }
        resolve(size);
      });
    });
    req.on("error", e => { file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(e); });
    req.setTimeout(30000, () => { req.destroy(); file.close(); if (fs.existsSync(dest)) fs.unlinkSync(dest); reject(new Error("Timeout")); });
  });
}

function extractImagesFromReadme(readme, owner, repo, defaultBranch = "main") {
  const imgUrls = [];
  
  // 匹配 Markdown 圖片語法: ![alt](url)
  const mdImgRe = /!\[.*?\]\(([^)]+)\)/g;
  let m;
  while ((m = mdImgRe.exec(readme)) !== null) {
    let url = m[1].trim().split(" ")[0]; // 去掉 title
    // 轉換相對路徑為 raw.githubusercontent.com
    if (!url.startsWith("http")) {
      url = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${url.replace(/^\.\//, "")}`;
    }
    // 過濾掉 badge、shields.io 等小圖
    if (url.includes("shields.io") || url.includes("badge") || url.includes("svg") || url.includes("githubusercontent.com/assets")) continue;
    imgUrls.push(url);
  }
  
  // 匹配 HTML img 標籤
  const htmlImgRe = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((m = htmlImgRe.exec(readme)) !== null) {
    let url = m[1].trim();
    if (!url.startsWith("http")) {
      url = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${url.replace(/^\.\//, "")}`;
    }
    if (url.includes("shields.io") || url.includes("badge") || url.includes("svg")) continue;
    imgUrls.push(url);
  }
  
  return [...new Set(imgUrls)]; // 去重
}

async function getReadme(owner, repo) {
  // 嘗試 main 和 master 分支
  for (const branch of ["main", "master"]) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    try {
      const r = await get(url);
      if (r.status === 200 && r.body.length > 100) {
        return { content: r.body, branch };
      }
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
  return null;
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log("=== 從 GitHub README 提取真實截圖 ===\n");
  
  const results = [];
  
  for (const project of PROJECTS) {
    const { key, owner, repo, images } = project;
    console.log(`\n📂 ${owner}/${repo}`);
    
    const readme = await getReadme(owner, repo);
    if (!readme) {
      console.log(`  ✗ README 取得失敗`);
      results.push({ key, owner, repo, imgUrls: [], status: "no_readme" });
      await sleep(500);
      continue;
    }
    
    const imgUrls = extractImagesFromReadme(readme.content, owner, repo, readme.branch);
    console.log(`  找到 ${imgUrls.length} 張圖片：`);
    imgUrls.slice(0, 6).forEach(u => console.log(`    ${u.substring(0, 100)}`));
    
    results.push({ key, owner, repo, imgUrls, images, branch: readme.branch });
    await sleep(500);
  }
  
  // 輸出結果供人工確認
  console.log("\n\n=== 結果摘要 ===");
  const outputFile = path.join(BASE, "scripts", "readme-images-found.json");
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`結果已存至 ${outputFile}`);
}

main().catch(console.error);
