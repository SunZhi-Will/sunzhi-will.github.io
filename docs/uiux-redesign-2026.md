# UI/UX 改版紀錄（2026-10）

這份文件記錄首頁、連結頁、報價頁的改版：改版前的問題、參考的做法、最後採用的設計語言，以及之後要動到這幾頁時該遵守的規則。部落格不在這次範圍內。

## 改版目標

1. 更簡約：一套顏色、一套字級、一套元件語言，貫穿所有頁面。
2. 更多展示動畫：動畫要讓內容更好讀、讓作品更有份量，而不是裝飾。

## 改版前的問題

| 問題 | 細節 | 影響 |
| --- | --- | --- |
| 首頁過長 | 桌面 27,754px、手機 43,943px。44 個專案全部以完整卡片攤開 | 幾乎沒有人會捲到底，最重要的作品被稀釋 |
| 淺色系統下首頁卡片壞掉 | `.card-modern` 的底色跟著系統偏好變成白色，文字卻固定是淺色 | 專案與活動卡片出現白底淺字，內容無法閱讀 |
| 四個頁面四種風格 | 首頁純黑加黃色粒子、部落格鋅灰、連結頁紫色漸層加彩色圖示、報價頁海軍藍加綠色 | 像四個不同的網站 |
| 特效堆疊 | 粒子網路、旋轉虛線圈、全像卡片、三層閃光、漸層流動文字、六角形圖示同時出現 | 視線沒有落點，與「簡約」相反 |
| 手機導覽列溢出 | 五個區塊連結加語言切換在 390px 寬度下被裁切 | 「首頁」被切掉一半 |
| 首屏按鈕不一致 | 三顆按鈕三種樣式，站內連結全部另開分頁 | 主次不明，站內導覽被打斷 |
| 打字機游標錯位 | 游標用絕對定位貼在段落右側，離文字很遠 | 看起來像版面錯誤 |
| 語言選擇不會記住 | 每次進站都重新偵測，各頁各自判斷 | 換頁後語言跳回去 |

## 參考的做法

- 作品集趨勢：深色為主、以大字級排版當主視覺、4 到 5 個有深度的區塊勝過 8 個淺的、細膩的進場動畫勝過炫技（[Colorlib](https://colorlib.com/wp/developer-portfolios/)、[Awwwards minimal 精選](https://www.awwwards.com/awwwards/collections/minimal/)、[RemoteWorks](https://remoteworks.pro/blog/portfolio-design-trends-2026)）。
- 動畫時間：多數介面動畫落在 100 到 500ms，越常出現的動畫要越短、越不明顯（[NN/g](https://www.nngroup.com/articles/animation-duration/)）。
- 效能：只對 `transform` 與 `opacity` 做動畫，`will-change` 節制使用（[web.dev](https://web.dev/articles/animations-guide)）。
- 捲動動畫：`whileInView` 做進場、`useScroll` 加 `useTransform` 做捲動連動（[Motion 文件](https://motion.dev/docs/react-scroll-animations)）。
- 無障礙：尊重 `prefers-reduced-motion`。

## 設計語言

### 顏色

寫死在 `.site` 範圍內（`app/globals.css`），不跟隨系統偏好，也不受部落格主題切換影響。

| 用途 | 值 |
| --- | --- |
| 背景 | `#0a0a0a` |
| 卡片表面 | `#111113` |
| 細線 | `white/10` |
| 標題 | `white` |
| 內文、小標、說明、箭頭 | `zinc-200` |
| 強調色（唯一） | `yellow-400`（`#facc15`） |
| 狀態點 | `emerald-400` |

黑底上不用灰色文字（`zinc-300` 以下），層次靠字級與字重拉開，不靠調暗。沒有邊框或底線回饋的文字按鈕，滑過時改用強調色。

同一個畫面只用一種語言：英文版不夾中文，中文版不夾英文（品牌名除外）。OG 圖片一律英文。

強調色只用在：滑過的標題、進度線、主要聯絡按鈕、清單圓點。同一個畫面不要出現第二個彩色。

### 字體與字級

- 內文：Geist Sans，中文退回系統字體。
- 小標（編號、年份、分類）：`.eyebrow`，Geist Mono、12px、字距 0.12em、全大寫。
- 大標用 `clamp()`，首屏姓名最大到 10.5rem，區塊標題 `text-4xl` 到 `text-6xl`。

### 版面

- 內容最大寬度 `max-w-6xl`，靠左對齊的編輯式排版。
- 用細線分隔，不用發光邊框與陰影堆疊。
- 區塊間距 `py-20 md:py-32`。

## 動畫清單

所有可重用的動畫都在 `components/motion/`。

| 元件 | 效果 | 使用位置 |
| --- | --- | --- |
| `SplitText` | 文字由遮罩下方逐字升起 | 首屏姓名、所有區塊標題、聯絡標語 |
| `ScrollHighlight` | 文字隨捲動逐字由暗轉亮 | 關於我的開場段 |
| `CountUp` | 數字進入畫面時由 0 數上去 | 年資、專案數、活動數 |
| `Marquee` | 無限跑馬燈，捲動越快跑越快，方向跟著捲動方向 | 技術能力 |
| `Magnetic` | 按鈕被游標輕輕吸過去 | 主要按鈕 |
| `Spotlight` | 卡片內跟隨游標的微光 | 服務項目、報價卡 |
| `Reveal` | 進入畫面時淡入上移 | 一般內容 |

頁面層級的動畫：

- 首屏：內容隨捲動淡出並後退，職稱每 2.6 秒由下往上輪播。
- 導覽列：捲動後收成膠囊，選中項目的底色在連結之間滑動，底部細線顯示閱讀進度；手機版點擊後島嶼向下展開。
- 精選專案：桌面版卡片置頂堆疊，後一張蓋上來時前一張縮小後退。
- 作品格：切換分類時卡片以版面動畫重新排列。
- 工作經歷：左側細線隨捲動向下延伸，項目可展開收合。
- 詳情彈窗：由下升起，內容切換時交叉淡入。

### 動畫規則

1. 只對 `transform` 與 `opacity` 做動畫。高度展開（手風琴、手機選單）是唯二的例外，元素很小。
2. 進場動畫只播一次。
3. 曲線統一用 `EASE_OUT`（`components/motion/ease.ts`）。
4. 頁面最外層包 `<MotionConfig reducedMotion="user">`。訪客開啟「減少動態效果」時，位移與縮放自動停用，跑馬燈靜止，CSS 循環動畫停止。
5. `style` 屬性不要依 `useReducedMotion()` 分支（伺服器端與瀏覽器端結果不同會造成 hydration 不一致）。改成讓動畫的終點等於起點。

## 品牌素材

LOGO、favicon 與 OG 分享圖都由 `scripts/generate-brand-assets.js` 產生，產出的檔案直接進版控（CI 不會跑這支腳本）。

- 字標：兩個圓弧接成的 S，上端筆畫收成一顆 `yellow-400` 的太陽。站內用 `components/LogoIcon.tsx`（線條跟著 `currentColor`，深淺色主題都能用），路徑數值與腳本裡的 `MARK_PATH` 相同，改了要兩邊一起改。
- 圖示：`icon.svg`、`favicon.ico`（16、32、48）、`favicon.png`、`logo.png`、`apple-icon.png`，都是 `#0a0a0a` 底的方形圖示。
- OG 圖片：首頁、部落格、連結頁、報價頁各一張 1200x630（首頁、部落格、連結頁另有 800x800）。版面沿用首屏的寫法：左上字標、白色英文大標、底部細線與等寬小標。文案寫在腳本的 `CARDS`。

```bash
node scripts/generate-brand-assets.js        # 全部
node scripts/generate-brand-assets.js icons  # 只產生 LOGO 與 favicon
node scripts/generate-brand-assets.js og     # 只產生 OG 圖片（需要網路與 Playwright 的 Chromium）
```

## 資訊架構

首頁順序從「關於、技術、活動、專案」改成「關於、專案、技術、活動、聯絡」，作品往前移。

專案區改成三層：

1. 精選：排序最前面的 4 個專案，置頂堆疊的大卡。數量由 `components/home/Work.tsx` 的 `FEATURED_COUNT` 控制，順序沿用 `data/translations/projects/index.ts` 的 `timelineOrder`。
2. 全部專案：分類篩選加縮圖格，預設顯示 9 個，可展開全部。
3. 詳情彈窗：完整說明、成果、技術、連結、媒體輪播。可用方向鍵切換上下一個，Esc 關閉。

活動區與專案區共用同一組卡片與彈窗（`ShowcaseItem`）。

## 成果

| 指標 | 改版前 | 改版後 |
| --- | --- | --- |
| 首頁高度（桌面 1440px） | 27,754px | 12,608px |
| 首頁高度（手機 390px） | 43,943px | 14,682px |
| 首頁 First Load JS | 296 kB | 218 kB |
| 報價頁 First Load JS | 194 kB | 157 kB |
| JS chunks 總大小 | 2.1 MB | 1.6 MB |

JS 變小主要來自移除 tsParticles 與 HeroUI。

## 檔案對照

| 新檔案 | 用途 |
| --- | --- |
| `components/motion/*` | 動畫基礎元件 |
| `components/home/*` | 首頁各區塊、導覽列、背景、詳情彈窗 |
| `data/translations/home.ts` | 新版面的介面文案 |
| `data/tech-stacks.ts` | 技術清單（從 `app/page.tsx` 搬出） |
| `lib/use-site-lang.ts` | 語言偏好（存在 `localStorage` 的 `site-lang`）與區塊捲動 |
| `lib/use-media-query.ts` | 訂閱 media query |
| `types/global.d.ts` | `window.__lenis` 型別 |

已刪除：`components/` 根目錄下的 `Hero`、`About`、`Activities`、`Projects`、`Footer`、`DynamicIslandNav`、`FloatingButtons`、`GlowingButton`、`GradientBackground`、`ParticlesBackground`、`NavDot`、`TechIcon`、`TechStackGrid`、`ProjectMedia`，以及 `globals.css` 裡對應的特效樣式。

## 待辦

- 移除已不再使用的套件：`@heroui/react`、`@tsparticles/react`、`@tsparticles/slim`、`tsparticles`、`react-masonry-css`、`react-grid-layout`、`@types/react-grid-layout`。
- 專案分類有重複：`行動開發` 與 `移動應用開發` 是同一類，篩選列會出現兩顆。
- `/pricing` 中文版「軟體專案接案」只有 2 個方案，英文版有 4 個。
- 兩場雙北黑客松用了同一張照片，活動區看起來像重複。
- 部分專案封面是登入頁或 GitHub 預設圖（NexusOS、Threado、Skyvize、ResumeAI），在縮圖格裡辨識度低，值得換成產品主畫面。
