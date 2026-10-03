# UI/UX 改版紀錄（2026-10）

這份文件記錄首頁、連結頁、報價頁與電子報的改版：改版前的問題、參考的做法、最後採用的設計語言，以及之後要動到這幾頁時該遵守的規則。部落格的文章頁不在這次範圍內。

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
- 文章分享卡：1200x630，左邊是字標、標題、日期與標籤，右邊是從文章封面裁出的插畫，輸出到 `public/blog-cards/<slug>/og.<lang>.png`。要產生哪些文章、插畫裁哪一塊，寫在腳本的 `POST_ART`。`lib/blog-images.ts` 的 `getBlogShareCard` 找得到就用在 `og:image`，找不到就退回文章自己的 `coverImage`。頁面上的封面一律用文章自己的插畫，不要換成純文字卡片。分享卡刻意不放在 `content/blog/`，因為 push 那個資料夾底下的任何檔案都會對該篇文章重寄電子報。

```bash
node scripts/generate-brand-assets.js        # 全部
node scripts/generate-brand-assets.js icons  # 只產生 LOGO 與 favicon
node scripts/generate-brand-assets.js og     # 只產生 OG 圖片（需要網路與 Playwright 的 Chromium）
node scripts/generate-brand-assets.js posts  # 只產生文章分享卡（同上）
```

## 電子報

電子報的每一個接觸點都用同一套語言：部落格裡的訂閱區塊、取消訂閱頁、驗證頁、驗證信、電子報本身。

### 改版前的問題

| 問題 | 細節 |
| --- | --- |
| 驗證成功卻顯示失敗 | 驗證頁在語言切換時會把同一條連結再送一次，第二次因為 token 已經用掉而被判定為無效。瀏覽器是英文、或訂閱語言與偵測語言不同的讀者，最後看到的是「驗證失敗」 |
| 信件裡的內容會憑空消失 | 文章裡的互動元件在信件中直接不見，引言顯示成 `> 文字`，圖片顯示成 `!連結`，表格顯示成一排直線，含數字的小標（`### 3. xxx`）被拆成一個 `###` 加一個從 1 開始的列表 |
| 取消訂閱頁與驗證頁跟著系統偏好變色 | 淺色系統下是淺底配深色主題的元件，文字幾乎看不到；頁面上也沒有任何可以回站內的連結 |
| 送出後不知道下一步 | 訂閱成功只有一行小字，沒有說要去收驗證信；按鈕在輸入前是灰的，看起來像壞掉 |
| 後端訊息原樣顯示 | 頻率限制、寄信失敗等訊息是英文，還會出現「請檢查 Google Apps Script 的執行日誌」這種給管理員看的字 |
| 文案與事實不符 | 寫「每週」寄送，實際上是有新文章才寄；自己寫的文章頁尾也標示「由 AI 自動生成」 |

### 現在的做法

- 訂閱區塊（`components/blog/NewsletterSubscribe.tsx`）：靠左的編輯式排版，看得見的欄位標籤取代提示字。送出成功後整個表單換成「去收信」的下一步說明，並顯示寄到哪個信箱。部落格目前有深淺兩種主題，深色用黃色按鈕，淺色用深色按鈕。
- 取消訂閱頁與驗證頁：共用 `components/blog/NewsletterPageShell.tsx`，沿用首頁那套寫死的深色版面。每一種結果都有自己的標題、說明與下一步按鈕：驗證頁分成完成、已驗證過、連結過期、連結無效、連結不完整、服務沒回應六種。
- 語言：信件連結帶 `?lang=`，頁面以它為準。後端回傳的訊息只用來判斷原因（`lib/newsletter-api.ts`），畫面文案一律用前端自己的翻譯，同一個畫面不會中英混雜。
- 取消訂閱連結帶上收件信箱，讀者點進去不用再打一次；寄信時也加上 `List-Unsubscribe` 標頭，Gmail 會在寄件者旁邊顯示內建的取消訂閱。
- 信件樣板（`scripts/send-newsletter.js` 的 `generateNewsletterHtml` 與 `markdownToHtml`）：顏色寫在 `EMAIL` 常數，與網站同一組。開頭是標題、摘要與「在網站上閱讀」按鈕，結尾再放一次。引言、圖片、表格、分隔線、程式碼都會轉成對應的版面。
- 互動元件：信件裡無法執行，改放一張「互動內容」卡片帶讀者回網頁版，開頭也會說明這篇有幾段互動內容。文章新增互動元件時不用改樣板，認不得的 MDX 元件一律走這條路。
- 信件大小：段落的字級與顏色由外層儲存格繼承，不在每一段重複寫。Gmail 會截斷超過約 102 KB 的信件，被截掉的正好是頁尾的取消訂閱連結，寄送時超過會在記錄裡警告。

### 預覽與部署

```bash
node scripts/preview-newsletter.js          # 最新一篇，輸出 HTML 檔到系統暫存資料夾，不會寄信
node scripts/preview-newsletter.js <slug>   # 指定文章
```

驗證信的樣板與「已驗證過」的回覆寫在 `scripts/google-apps-script-example.js`。這個檔案只是範本，改完要自己貼到 Google Apps Script 重新部署才會生效；在那之前，網站端仍然相容舊版的回覆。

## 設計 token（顏色分類與標題六級）

### 為什麼要做

| 問題 | 細節 |
| --- | --- |
| 標題分不出層級 | 文章內文 17px，H2 只有 20px、H3 18px，三者字重也一樣，讀者看不出哪裡是章節、哪裡是小節。H4 是 16px，比內文還小。H5、H6 完全沒有樣式 |
| 灰色有四套 | 部落格元件同時用 `gray`（約 360 處）、`zinc`、`stone`、`slate`，同一頁的灰色冷暖不一 |
| 顏色沒有分類 | 每個元件自己寫 `isDark ? 'text-zinc-200' : 'text-stone-600'`，部落格裡約 250 處。改一個顏色要找遍所有檔案，也說不出「這個灰是拿來做什麼的」 |
| 文章頁與列表頁底色不同 | 列表頁 `#0a0a0a`／`#faf9f7`，文章頁 `#000000`／`#ffffff` |

### 顏色分類

數值寫在 `app/tokens.css`，Tailwind 對照在 `tailwind.config.ts`。元件只寫語意名稱，深淺色由 `html` 上的 `.dark`／`.light` 自動切換，`.site` 範圍固定用深色。

| 分類 | Tailwind 名稱 | 用途 | 深色 | 淺色 |
| --- | --- | --- | --- | --- |
| 品牌 | `brand` | 色塊、線條、清單符號、H2 短線 | `yellow-400` | `amber-600` |
| | `brand-text` | 當文字用的強調色、連結、H5 | `yellow-300` | `amber-700` |
| | `brand-on` | 放在品牌色上的文字 | `#0a0a0a` | `stone-900` |
| 表面 | `canvas` | 頁面底色 | `#0a0a0a` | `#faf9f7` |
| | `surface` | 卡片 | `#111113` | 白 |
| | `surface-raised` | 滑過、彈出層 | `#1a1a1d` | `stone-100` |
| | `surface-sunken` | 程式碼、引言、表頭 | `#161619` | `#f3f1ed` |
| 文字 | `fg` | 標題、粗體 | `zinc-50` | `stone-900` |
| | `fg-body` | 內文 | `zinc-200` | `stone-800` |
| | `fg-muted` | 日期、說明、圖說 | `zinc-200` | `stone-600` |
| 線條 | `line` | 一般分隔線 | 白 10% | 黑 10% |
| | `line-strong` | 表格外框、H1 底線 | 白 22% | 黑 22% |
| 狀態 | `info`、`info-text` | 資訊提示 | `sky-400`／`sky-200` | `sky-600`／`sky-800` |
| | `success`、`success-text` | 成功 | `emerald-400`／`emerald-200` | `emerald-600`／`emerald-800` |
| | `warning`、`warning-text` | 注意 | `orange-400`／`orange-200` | `orange-600`／`orange-800` |
| | `danger`、`danger-text` | 錯誤 | `red-400`／`red-200` | `red-600`／`red-800` |

規則：

1. 每個主題只用一個灰階家族：深色是 `zinc`，淺色是 `stone`。新元件不要再寫 `gray`、`slate`。
2. 深色主題的 `fg-muted` 刻意和 `fg-body` 一樣，黑底不用灰字，層次靠字級與字重。
3. 品牌色仍然是唯一的裝飾用彩色。狀態色只用在需要表達好壞的地方（提示框、表單驗證結果），不拿來裝飾或分類文章。
4. 「注意」用橘色而不是黃色，避免和品牌色混在一起。
5. 底色要淡時用透明度：`bg-info/10`、`border-success/30`。`line` 本身已經是半透明色，不能再加 `/透明度`。
6. 部落格在 `ThemeProvider` 掛上 class 之前元件是以深色渲染，所以 `html` 還沒有 `.light` 時 `.blog-root` 先用深色數值。

### 標題六級

| 層級 | 字級（手機 → 桌面） | 字重 | 辨識記號 | 上方間距 |
| --- | --- | --- | --- | --- |
| 頁首主標題 | 30 → 44px | 700 | 只出現在文章頁頂（`ArticleHero`） | |
| H1 | 28 → 36px | 800 | 底下一條 2px 實線 | 4.5rem |
| H2 | 24 → 30px | 700 | 上方一條強調色短線（40 × 3px），章節的落點 | 4.5rem |
| H3 | 20 → 23px | 700 | 無記號，靠字級 | 3rem |
| H4 | 18 → 19px | 600 | 無記號 | 2.5rem |
| H5 | 16 → 17px | 600 | 與內文同大，用 `brand-text` | 2.25rem |
| H6 | 13px | 500 | 等寬、全大寫、字距 0.12em | 2.25rem |
| 內文 | 16 → 17px | 400 | 行高 1.9 | |

- 字級用 `clamp()`，手機與桌面之間平滑縮放，不需要另外寫手機版斷點。
- 相鄰兩級至少差 2px，而且每一級除了大小之外還有另一個可以辨識的特徵（字重、記號、顏色或字體），即使只看一個標題也認得出層級。
- 標題緊接著標題（例如 H2 底下直接是 H3）時，第二個標題的上方間距縮成 1.25rem。
- 文章內文的標題樣式在 `app/blog/blog.css`，選擇器排除 `.not-prose`。自己有排版的 MDX 元件（`Callout`、`StepGuide`、`StatsHighlight`、`ArticleConclusion`、互動元件）根節點都要加 `not-prose`。
- 元件裡需要同樣的字級時用 Tailwind 的 `text-h1` 到 `text-h6`、`text-body`、`text-display`。
- H2 到 H6 都會產生錨點連結與目錄項目（`lib/rehype-blog.ts`）。

### 已經改用 token 的地方

- 文章內文（`EnhancedArticleContent`）：原本深淺色各寫一份、MDX 與 HTML 又各寫一份的 class，合併成一個不分主題的 `PROSE_CLASS`。
- `globals.css` 的 `.prose` 顏色與表格：拿掉 `slate` 與 `.dark .prose` 分支。
- 提示框（`Callout`）：五種類型對應品牌與四個狀態色，圖示換成 Heroicons。
- 文章頁與列表頁底色：都改成 `bg-canvas`。文章頁背後的點陣從 12% 降到 5%，不再干擾內文。

其餘部落格元件（側欄、卡片、目錄、互動元件等）還是 `isDark` 分支，之後動到時順手改成 token 即可，不需要一次全改。

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
