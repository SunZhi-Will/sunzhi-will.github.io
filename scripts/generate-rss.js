/**
 * RSS Feed 生成腳本
 * 
 * 在 build 前執行，生成 /public/feed.xml
 * 供 Google News、Feedly、RSS 閱讀器等訂閱
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://sunzhi-will.github.io';
const SITE_NAME = "Sun's Blog";
const SITE_DESCRIPTION = 'Exploring software engineering, AI development, and the art of building great products.';
const SITE_LANGUAGE = 'zh-TW';

const postsDirectory = path.join(__dirname, '..', 'content/blog');

function getAllPostSlugs() {
    if (!fs.existsSync(postsDirectory)) return [];

    const entries = fs.readdirSync(postsDirectory, { withFileTypes: true });
    const slugs = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            const folderPath = path.join(postsDirectory, entry.name);
            const files = fs.readdirSync(folderPath);
            const mdFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));
            if (mdFile) {
                slugs.push(entry.name);
            }
        }
    }

    return slugs;
}

function getPostBySlug(slug) {
    const folderPath = path.join(postsDirectory, slug);
    if (!fs.existsSync(folderPath)) return null;

    const files = fs.readdirSync(folderPath);
    const mdFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));
    if (!mdFile) return null;

    const fullPath = path.join(folderPath, mdFile);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 解析 frontmatter
    const match = fileContents.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) return null;

    const frontmatter = {};
    const lines = match[1].split('\n');
    let currentKey = null;
    let currentArray = [];

    for (const line of lines) {
        const kvMatch = line.match(/^(\w+):\s*(.+)$/);
        if (kvMatch) {
            if (currentKey && Array.isArray(frontmatter[currentKey])) {
                frontmatter[currentKey] = currentArray;
            }
            currentKey = kvMatch[1];
            const value = kvMatch[2].trim();

            if (value.startsWith('[') && value.endsWith(']')) {
                // Array: [item1, item2]
                currentArray = value.slice(1, -1).split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
                frontmatter[currentKey] = currentArray;
            } else if (value.startsWith('- ')) {
                // Array start with - item format
                currentArray = [value.slice(2).trim().replace(/^['"]|['"]$/g, '')];
                frontmatter[currentKey] = currentArray;
            } else {
                currentArray = [];
                frontmatter[currentKey] = value.replace(/^['"]|['"]$/g, '');
            }
        } else if (line.trim().startsWith('- ') && currentKey) {
            const item = line.trim().slice(2).replace(/^['"]|['"]$/g, '');
            if (!Array.isArray(frontmatter[currentKey])) {
                frontmatter[currentKey] = [];
            }
            frontmatter[currentKey].push(item);
        }
    }

    if (currentKey && Array.isArray(frontmatter[currentKey]) && frontmatter[currentKey].length === 0) {
        // Already handled
    }

    const content = fileContents.slice(match[0].length);
    const description = frontmatter.description || '';

    return {
        slug,
        title: frontmatter.title || slug,
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        description: description,
        content,
        tags: frontmatter.tags || [],
        lang: frontmatter.lang || 'zh-TW',
    };
}

function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function generateRssFeed() {
    const slugs = getAllPostSlugs();
    const posts = slugs
        .map(getPostBySlug)
        .filter(Boolean)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const items = posts.map((post) => {
        // 提取前 200 字作為摘要
        const contentText = post.content
            ? post.content.replace(/[#*`\[\]]/g, '').trim().slice(0, 300)
            : post.description;

        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${escapeXml(post.description)}]]></description>
      <content:encoded><![CDATA[${escapeXml(contentText)}]]></content:encoded>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
    }).join('');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${BASE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="${BASE_URL}/blog" rel="alternate" type="text/html"/>
    ${items}
  </channel>
</rss>`;

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    fs.writeFileSync(path.join(publicDir, 'feed.xml'), feed, 'utf8');
    console.log('✅ RSS feed generated: public/feed.xml');
}

// 同時生成 Atom feed (Google News 偏好的格式)
function generateAtomFeed() {
    const slugs = getAllPostSlugs();
    const posts = slugs
        .map(getPostBySlug)
        .filter(Boolean)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const entries = posts.map((post) => `
  <entry>
    <title type="html"><![CDATA[${post.title}]]></title>
    <link rel="alternate" type="text/html" href="${BASE_URL}/blog/${post.slug}"/>
    <id>${BASE_URL}/blog/${post.slug}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary type="html"><![CDATA[${escapeXml(post.description)}]]></summary>
    ${post.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
    <author>
      <name>Sun (謝上智)</name>
      <uri>${BASE_URL}</uri>
    </author>
  </entry>`).join('');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE_NAME)}</title>
  <link rel="alternate" type="text/html" href="${BASE_URL}"/>
  <link rel="self" type="application/atom+xml" href="${BASE_URL}/feed.atom"/>
  <id>${BASE_URL}/</id>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Sun (謝上智)</name>
    <uri>${BASE_URL}</uri>
  </author>
  ${entries}
</feed>`;

    const publicDir = path.join(__dirname, '..', 'public');
    fs.writeFileSync(path.join(publicDir, 'feed.atom'), feed, 'utf8');
    console.log('✅ Atom feed generated: public/feed.atom');
}

generateRssFeed();
generateAtomFeed();
