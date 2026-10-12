#!/usr/bin/env node
// 檢查文章標題放進桌面版目錄時會不會折成兩行。
// 目錄寬 176px（w-44），字級 12px（text-xs），H3 再內縮 12px。
// 寬度單位：一個中文字或全形標點 = 1，英數與半形符號 = 0.55。
// 用法：node .claude/skills/blog-interactive-article/check-headings.mjs content/blog/<slug>/article.zh-TW.mdx [...]
import fs from 'node:fs';

const LIMIT = { 2: 13, 3: 12, 4: 11 };

const width = (s) => [...s].reduce((w, c) => w + (/[\u0000-ÿ]/.test(c) ? 0.55 : 1), 0);
const clean = (s) =>
    s
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]/g, '')
        .trim();

let bad = 0;
for (const file of process.argv.slice(2)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    let fence = false;
    lines.forEach((line, i) => {
        if (line.startsWith('```')) fence = !fence;
        const m = !fence && line.match(/^(#{2,4})\s+(.*)$/);
        if (!m) return;
        const level = m[1].length;
        const text = clean(m[2]);
        const w = width(text);
        if (w > LIMIT[level]) {
            bad++;
            console.log(`${file}:${i + 1}  H${level}  ${w.toFixed(1)} > ${LIMIT[level]}  ${text}`);
        }
    });
}
if (bad) {
    console.log(`\n${bad} 個標題太長，目錄會折成兩行。`);
    process.exit(1);
}
console.log('標題長度都沒問題。');
