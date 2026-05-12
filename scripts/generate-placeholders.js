#!/usr/bin/env node
/**
 * 為缺失的專案截圖生成純色 PNG 佔位圖片（純 Node.js，無需依賴）。
 * 每張圖片 1200x750。
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const BASE = path.resolve(__dirname, "..");
const PUBLIC = path.join(BASE, "public");
const W = 1200, H = 750;

const MISSING = [
  ["/projects/ai_debt_scanner/home.png",       "#1a1a2e", "AIDebtScanner",     "首頁 Home"],
  ["/projects/ai_debt_scanner/dashboard.png",  "#1a1a2e", "AIDebtScanner",     "儀表板 Dashboard"],
  ["/projects/allvibe/home.png",               "#0d1117", "AllVibe",           "首頁 Home"],
  ["/projects/allvibe/explore.png",            "#0d1117", "AllVibe",           "探索 Explore"],
  ["/projects/autolens/home.png",              "#16213e", "AutoLens",          "首頁 Home"],
  ["/projects/broadvize/home.png",             "#0f3460", "Broadvize",         "首頁 Home"],
  ["/projects/broadvize/editor.png",           "#0f3460", "Broadvize",         "編輯器 Editor"],
  ["/projects/carbon/home.png",                "#161b22", "Carbon",            "首頁 Home"],
  ["/projects/cardflow/home.png",              "#1e1e2e", "CardFlow",          "首頁 Home"],
  ["/projects/cardflow/card.png",              "#1e1e2e", "CardFlow",          "名片 Card"],
  ["/projects/codeltp/home.png",               "#0a0a1a", "CodeLTP",           "首頁 Home"],
  ["/projects/codeltp/learning.png",           "#0a0a1a", "CodeLTP",           "學習 Learning"],
  ["/projects/fliptok/home.png",               "#010101", "FlipTok",           "首頁 Home"],
  ["/projects/fliptok/browse.png",             "#010101", "FlipTok",           "瀏覽 Browse"],
  ["/projects/liminal/home.png",               "#1a0a2e", "Liminal",           "首頁 Home"],
  ["/projects/nexusos/home.png",               "#050a0e", "NexusOS",           "首頁 Home"],
  ["/projects/nexusos/chat.png",               "#050a0e", "NexusOS",           "聊天 Chat"],
  ["/projects/openring/home.png",              "#0d1117", "OpenRing",          "首頁 Home"],
  ["/projects/openring/agent.png",             "#0d1117", "OpenRing",          "AI Agent"],
  ["/projects/promptly/popup.png",             "#1e1e2e", "Promptly",          "彈出視窗 Popup"],
  ["/projects/promptly/suggest.png",           "#1e1e2e", "Promptly",          "建議 Suggest"],
  ["/projects/resumeai/home.png",              "#0f172a", "ResumeAI",          "首頁 Home"],
  ["/projects/resumeai/preview.png",           "#0f172a", "ResumeAI",          "預覽 Preview"],
  ["/projects/skyvize/home.png",               "#0c1445", "Skyvize",           "首頁 Home"],
  ["/projects/skyvize/patrol.png",             "#0c1445", "Skyvize",           "巡邏 Patrol"],
  ["/projects/specformula/home.png",           "#1e1e1e", "SpecFormula",       "首頁 Home"],
  ["/projects/taipei_dashboard/home.png",      "#001529", "台北城市儀表板",      "首頁 Home"],
  ["/projects/threads_story_recap/home.png",   "#0a0a0a", "ThreadsStoryRecap", "首頁 Home"],
  ["/projects/threads_story_recap/story.png",  "#0a0a0a", "ThreadsStoryRecap", "故事 Story"],
  ["/projects/ticktive/home.png",              "#1a1a2e", "Ticktive",          "首頁 Home"],
  ["/projects/ticktive/dashboard.png",         "#1a1a2e", "Ticktive",          "儀表板 Dashboard"],
  ["/projects/toolnest/home.png",              "#0d1117", "ToolNest",          "首頁 Home"],
  ["/projects/veyo_shop/home.png",             "#1a0a0a", "VeyoShop",          "首頁 Home"],
  ["/projects/veyo_shop/cart.png",             "#1a0a0a", "VeyoShop",          "購物車 Cart"],
  ["/projects/vibe_workshop/home.png",         "#0a1628", "VibeWorkshop",      "首頁 Home"],
  ["/projects/vibe_workshop/dashboard.png",    "#0a1628", "VibeWorkshop",      "儀表板 Dashboard"],
  ["/projects/vibeacademy/home.png",           "#0d0d2b", "VibeAcademy",       "首頁 Home"],
  ["/projects/vibegame/home.png",              "#0a0a1a", "VibeGame",          "首頁 Home"],
  ["/projects/vibegame/detail.png",            "#0a0a1a", "VibeGame",          "詳情 Detail"],
  ["/projects/voxel_world/home.png",           "#0a1a0a", "VoxelWorld",        "首頁 Home"],
  ["/projects/voxel_world/gameplay.png",       "#0a1a0a", "VoxelWorld",        "遊戲畫面 Gameplay"],
  ["/projects/zettelify/home.png",             "#1a1a0a", "Zettelify",         "首頁 Home"],
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function makePngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  const combined = Buffer.concat([typeBytes, data]);
  crcBuf.writeUInt32BE(crc32(combined) >>> 0, 0);
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

// CRC32 表
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makePng(width, height, [r, g, b]) {
  // 構建掃描線
  const rowSize = 1 + width * 3; // filter byte + RGB pixels
  const raw = Buffer.allocUnsafe(rowSize * height);
  for (let y = 0; y < height; y++) {
    const base = y * rowSize;
    raw[base] = 0; // filter type: None
    for (let x = 0; x < width; x++) {
      raw[base + 1 + x * 3] = r;
      raw[base + 1 + x * 3 + 1] = g;
      raw[base + 1 + x * 3 + 2] = b;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdrData = Buffer.allocUnsafe(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makePngChunk("IHDR", ihdrData);
  const idat = makePngChunk("IDAT", compressed);
  const iend = makePngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

let created = 0, skipped = 0;

for (const [relPath, bgHex, projectName, pageName] of MISSING) {
  const fullPath = path.join(PUBLIC, relPath);
  const dir = path.dirname(fullPath);

  fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(fullPath)) {
    console.log(`SKIP  ${relPath}`);
    skipped++;
    continue;
  }

  const rgb = hexToRgb(bgHex);
  const png = makePng(W, H, rgb);
  fs.writeFileSync(fullPath, png);
  console.log(`OK    ${relPath}  (${projectName} - ${pageName})`);
  created++;
}

console.log(`\n完成！建立 ${created} 張，略過 ${skipped} 張。`);
console.log("⚠  這些是純色佔位圖，請用真實截圖替換。");
