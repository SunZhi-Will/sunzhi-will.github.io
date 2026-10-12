---
name: blog-interactive-article
description: 在 sunzhi-will.github.io 撰寫、改寫或優化部落格文章（content/blog/**/article.zh-TW.mdx）與文章互動圖解（components/blog/interactive/）時使用。涵蓋目錄標題長度上限、文章結構、互動元件的極簡設計規則、驗證與部署。使用者說「寫一篇文章」「把這份稿子做成互動文章」「目錄標題太長」「優化文章 UI」「部署文章」時觸發。
---

# 部落格互動文章

## 1. 目錄標題長度（每次都要檢查）

桌面版目錄寬 176px、字級 12px，H3 再內縮 12px。標題超過下面的寬度就會折成兩行：

| 層級 | 上限（中文字數） |
| --- | --- |
| H2 `##` | 13 |
| H3 `###` | 12 |
| H4 `####` | 11 |

計算方式：中文字與全形標點算 1，英數、空白、半形符號算 0.55。「一、」這種編號也算在內。上限已經留了餘裕，實測約 14.5 個字才會真的折行。

寫完或改完文章一定要跑：

```bash
node .claude/skills/blog-interactive-article/check-headings.mjs content/blog/<slug>/article.zh-TW.mdx
```

有超過的就縮短，不要靠改目錄樣式解決。縮短的做法：

- 標題只留關鍵詞，完整的問句或說明搬到該節第一句內文。
  - 「為什麼 AI 做出來的網站常常不符合期待？」→ 標題「為什麼總是不對？」，內文開頭補上原句。
- 拿掉「第一個方法：」「到底」「那」「其實」這類贅字，改成「方法一：」。
- 「A，不代表 B」改成「A 不等於 B」。
- 系列小節用短名詞：「先找參考」「先定規則」「局部修改」。

## 2. 文章檔案

- 位置：`content/blog/YYYY-MM-DD-<英文 slug>/article.zh-TW.mdx`，封面 `cover.png`（1600×900）放同一個資料夾。
- frontmatter：`title`、`date`、`description`、`coverImage: "cover.png"`、`tags`、`lang: "zh-TW"`。
- description 寫出互動圖解數量，數字要和文章裡實際的元件數一致。
- 姓名一律寫「謝上智」，英文暱稱 Sun。社群參與者名單照使用者提供的寫，不要自己補。
- 全文不使用破折號（「——」「—」），改用逗號、冒號、括號。
- MDX 內文避免裸露的 `{`、`<`，元件只能用無 props 的 `<ComponentName />`。

## 3. 互動圖解

- 每個元件一個檔案，放 `components/blog/interactive/`，並在 `index.tsx` 用 `lazyWidget` 註冊，附上實測高度（mobile 375、tablet 700、desktop 1280）。
- 外框用 `InteractiveFrame`；版面零件用 `kit.tsx`：`Stage`、`Window`、`Segmented`、`Bubble`、`Meter`、`Note`、`Slider`。
- **極簡原則**：一個圖解只有一個主要操作（一個滑桿、一組切換、一個播放鍵）和一個主要畫面，下面用一行 `Note` 收尾。不要堆彩色底框、不要整段說明文字。
- 偏簡報式的動畫圖表：時間軸、漏斗、前後對照拖桿、SVG 路徑播放、紅線標註，避免「一排按鈕加一段字」。
- 不用 emoji，圖示一律用 `icons.tsx` 的 `Icon`。
- 顏色用設計 token（`text-fg`、`text-fg-body`、`bg-surface`、`border-line`、`bg-brand/10`）。黑底不用灰字。畫「網站樣機」的部分（例如 `uiMock.tsx`）才用固定色。
- 元件內不要用 `<p>` 與 `h2`～`h6`（會被內文處理器改寫或被目錄抓走）。
- 新的任意值 class（例如 `max-w-[340px]`）可能沒被產生，寬度上限改用 inline style。
- 尊重減少動態：自動播放或無限循環的動畫要用 `useReducedMotion`，無限循環再加 `useInView`，離開畫面就停止播放。
- 不要在 render 裡宣告元件（例如 `const Gap = () => …`），每次重繪都會重新掛載、動畫會斷。

## 3.1 動畫圖卡（照使用者的簡報風格）

文章裡只有文字的段落，例如程式碼區塊裡的幾句對話、引言金句、對照表、「以前 vs 現在」，改成一張會動的圖卡，不要用 ``` 區塊或 `>` 引言硬撐。

**風格來源是使用者最新的手刻簡報，不是舊的投影片渲染器。** 動手前先開來看實際畫面，不要只讀程式碼：

- 位置：`/Applications/Projects/other/GoogleAIStudioTeach/src/talks/`（看修改時間最新的，例如 `ai-5day-challenge`、`claude-code-live-202610`）。零件在各自的 `kit.tsx`，動畫在 `deck.module.css`。
- 看畫面：用 `.claude/launch.json` 的 `talks-ref`（在 3600 埠跑那個專案，不清 `.next`），開 `/dev/talks/<slug>?mode=print` 截整頁。不要用那邊的 `npm run dev`，它會先 `rm -rf .next`，影響使用者在那個專案的其他工作階段。
- 2026-10-12 第一版用了發光光球、漸層字、圓圈圖示徽章，被評為「太過 AI 製作的簡報」。原因是只參考了舊的 `src/slide-renderer/`，沒看最新的簡報。

這個 repo 的移植版：`slide.tsx`（零件）＋ `paper.module.css`（動畫）。

- 外框 `Card`：米色紙面（`#F6F2E9`）或深色桌面（`#1A1712`），左上角等寬字小標（■ 加標籤），右上角頁碼「01 / 07」，右下角「重播」。捲進畫面時整張重新掛載，CSS 動畫從頭播。
- 表達方式要用具體的東西：`Phone`＋`Chat`（模擬手機對話，`Typed` 逐字打出）、`Sticky`（便利貼，旋轉著貼上、楷體手寫字）、`Stamp`（蓋章）、`Sheet`（白紙卡片、表格）、`Mark`（螢光筆由左往右刷）、`Strike`（紅筆劃掉）、`Hand`（手寫批註）。
- 標題是粗黑體，強調字用 `Mark` 螢光筆，深色頁用實心金色字。**不要**用漸層字、發光光球、玻璃質感、彩色外框的圓形圖示。
- 內容要用真實的例子與數字（例如一疊被退回的版本稿、規格表的每一列），不要用抽象色塊或示意圓。
- 深色頁的次要文字用 `C.nightSub`，不用灰字。
- **只播一次**：第一次捲到才播（`useInView` 加 `once: true`），之後停在最終畫面，要再看按「重播」。捲回來自動重播會被嫌「一直重播」。
- **不要上下位移**：進場只用淡入、水平滑入、原地縮放或轉正。往上浮、從上方掉下、由上往下長高，捲動時看起來都像畫面在跳（2026-10-13 被退回）。`InteractiveFrame` 的進場也改成只淡入了。
- **循環動畫要有次數**：打字中的點、脈動圈之類播幾下就停，不要 `infinite`／`repeat: Infinity`。只在操作當下出現的（按下送出後的轉圈）不在此限。
- 讀動畫狀態的 `useCard()` 只能在 `<Card>` 的子元件裡呼叫。
- 原簡報是 1100×619 固定畫布，文章裡改成流動排版：手機寬度要檢查文字有沒有被切掉、蓋章有沒有壓到文字或「重播」鈕。
- 文字版的重點句要留在內文（電子報看不到互動元件），圖卡是視覺化，不是唯一來源。

## 4. 驗證

- `npx tsc --noEmit -p .` 與 `npx eslint components/blog/interactive`。
- 用 `preview_start`（blog-dev）開 dev server，再用專案內的 Playwright 腳本逐一捲到元件、點擊、截圖。內建預覽面板隱藏時動畫不會跑，所以不要用它的截圖判斷。
- 量高度時要先注入 `.widget-slot,.interactive-frame{min-height:0!important;height:auto!important}`，否則量到的是佔位高度。
- 目錄實測：桌面 1440 寬，逐章捲動後量 `.toc-scroll a` 的行數，全部應為 1。
- 正式版 build 不要在專案目錄跑：rsync 到 scratchpad、symlink `node_modules` 後在副本裡 `npm run build`。

## 5. 部署

- push `content/blog/**` 到 master 會觸發 GitHub Pages 部署與「Auto Send Newsletter on Push」電子報。**沒有使用者明確說要部署，不要 push。**
- **修改已發布的文章再 push，會把整篇文章重新寄給所有已驗證的訂閱者。** `send-newsletter.js` 裡「已寄過就跳過」的檢查（`lastArticleSent === slug`）實際上沒有作用：2026-10-12 修正目錄標題後重推，3 位訂閱者收到第二封。所以已發布文章的修正要先問使用者能不能接受重寄，或把多次修正合併成一次 push。
- 部署後用 `gh run list` 確認「Deploy Next.js site to Pages」成功，再 `curl` 正式網址確認 200。
- 網站有 Service Worker（scope `/blog`），舊讀者可能要重新整理才看到新版。
