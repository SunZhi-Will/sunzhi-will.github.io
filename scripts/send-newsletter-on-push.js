const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { sendNewsletter } = require('./send-newsletter');

/**
 * Normalizes and extracts unique slugs from changed file paths.
 * Matches patterns like content/blog/slug/article.zh-TW.mdx
 */
function extractSlugs(files) {
    const slugs = new Set();
    for (const file of files) {
        const parts = file.split('/');
        // Looking for files inside content/blog/<slug>/...
        if (parts.length >= 3 && parts[0] === 'content' && parts[1] === 'blog') {
            const slug = parts[2];
            // Verify it's a directory and contains article files
            const postFolder = path.join(__dirname, '..', 'content', 'blog', slug);
            if (fs.existsSync(postFolder) && fs.statSync(postFolder).isDirectory()) {
                if (fs.existsSync(path.join(postFolder, 'article.zh-TW.mdx')) ||
                    fs.existsSync(path.join(postFolder, 'article.en.mdx'))) {
                    slugs.add(slug);
                }
            }
        }
    }
    return Array.from(slugs);
}

/**
 * Gets the list of files changed in the push.
 * Attempts to use the Github event commits range, falling back to HEAD~1.
 */
function getChangedFiles() {
    // If run inside GitHub Actions, we can check if GITHUB_EVENT_PATH is set
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (eventPath && fs.existsSync(eventPath)) {
        try {
            const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
            const before = event.before;
            const after = event.after;
            
            // Check if before/after are valid commit SHAs
            if (before && after && before !== '0000000000000000000000000000000000000000') {
                console.log(`🔍 Detecting changes between ${before} and ${after}...`);
                const output = execSync(`git diff --name-only ${before} ${after}`, { encoding: 'utf8' });
                return output.split('\n').map(f => f.trim()).filter(Boolean);
            }
        } catch (e) {
            console.warn('⚠️ Failed to parse GitHub event payload, falling back to HEAD~1 diff:', e.message);
        }
    }

    try {
        console.log('🔍 Detecting changes using git diff HEAD~1 HEAD...');
        const output = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' });
        return output.split('\n').map(f => f.trim()).filter(Boolean);
    } catch (error) {
        console.warn('⚠️ git diff HEAD~1 failed:', error.message);
        return [];
    }
}

async function main() {
    console.log('=== Automated Push Newsletter Sender ===');
    
    const changedFiles = getChangedFiles();
    console.log(`📄 Changed files detected (${changedFiles.length}):`);
    changedFiles.forEach(f => console.log(`  - ${f}`));

    const slugs = extractSlugs(changedFiles);
    
    if (slugs.length === 0) {
        console.log('ℹ️ No new or modified articles detected in content/blog/. Skipping newsletter.');
        process.exit(0);
    }

    console.log(`\n📬 Found ${slugs.length} article(s) to process:`, slugs);

    for (const slug of slugs) {
        console.log(`\n🚀 Sending newsletter for: ${slug}`);
        try {
            // Under push-based sending, we bypass the AI-daily generation marker since it's manual
            await sendNewsletter(slug);
            console.log(`✅ Completed sending for: ${slug}`);
        } catch (error) {
            console.error(`❌ Error sending newsletter for ${slug}:`, error.message);
            // Continue to the next slug if there are multiple, but exit with failure code at the end
            process.exitCode = 1;
        }
    }
}

if (require.main === module) {
    main().catch((error) => {
        console.error('Unhandled error:', error);
        process.exit(1);
    });
}
