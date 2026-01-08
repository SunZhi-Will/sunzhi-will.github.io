/**
 * 驗證腳本：檢查 GitHub Actions 環境下的腳本配置
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating GitHub Actions configuration...\n');

let errors = [];
let warnings = [];

// 檢查主腳本是否存在
const mainScript = path.join(__dirname, 'generate-ai-daily.js');
if (!fs.existsSync(mainScript)) {
    errors.push('Main script generate-ai-daily.js not found');
} else {
    console.log('✅ Main script exists');
}

// 檢查所有必需的模組檔案
const requiredModules = [
    'config.js',
    'utils/dateUtils.js',
    'utils/fileUtils.js',
    'utils/textUtils.js',
    'utils/postLoader.js',
    'utils/outputParser.js',
    'utils/sourceEnricher.js',
    'api/geminiClient.js',
    'api/geminiAPI.js',
    'prompts/articlePrompts.js',
    'agents/topicAnalyzer.js',
    'agents/postMatcher.js',
    'generators/imageGenerator.js',
    'processors/contentProcessor.js',
    'cleanup/reportCleanup.js',
];

requiredModules.forEach(modulePath => {
    const fullPath = path.join(__dirname, modulePath);
    if (!fs.existsSync(fullPath)) {
        errors.push(`Module not found: ${modulePath}`);
    } else {
        console.log(`✅ Module exists: ${modulePath}`);
    }
});

// 檢查 package.json 中的依賴
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = ['@google/genai', 'gray-matter'];
    
    requiredDeps.forEach(dep => {
        if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
            errors.push(`Required dependency missing: ${dep}`);
        } else {
            console.log(`✅ Dependency found: ${dep}`);
        }
    });
} else {
    errors.push('package.json not found');
}

// 檢查 GitHub Actions 工作流程檔案
const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'daily-ai-report.yml');
if (fs.existsSync(workflowPath)) {
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // 檢查關鍵配置
    if (!workflowContent.includes('GEMINI_API_KEY')) {
        warnings.push('GitHub Actions workflow may not have GEMINI_API_KEY configured');
    }
    
    if (!workflowContent.includes('node scripts/generate-ai-daily.js')) {
        errors.push('GitHub Actions workflow does not call generate-ai-daily.js');
    }
    
    if (!workflowContent.includes('npm ci')) {
        warnings.push('GitHub Actions workflow should use npm ci for consistent builds');
    }
    
    console.log('✅ GitHub Actions workflow file exists');
} else {
    warnings.push('GitHub Actions workflow file not found');
}

// 檢查環境變數處理
const mainScriptContent = fs.readFileSync(mainScript, 'utf8');
if (!mainScriptContent.includes('process.env.GEMINI_API_KEY')) {
    errors.push('Main script does not check for GEMINI_API_KEY environment variable');
} else {
    console.log('✅ Environment variable check exists in main script');
}

// 檢查目錄結構
const requiredDirs = [
    'content/blog',
];

requiredDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
        warnings.push(`Directory may not exist: ${dir} (will be created automatically)`);
    } else {
        console.log(`✅ Directory exists: ${dir}`);
    }
});

// 輸出結果
console.log('\n📊 Validation Results:');

if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All validations passed!');
    console.log('\n🚀 The script is ready for GitHub Actions automation.');
    process.exit(0);
} else {
    if (errors.length > 0) {
        console.error('\n❌ Errors found:');
        errors.forEach(error => console.error(`   - ${error}`));
    }
    
    if (warnings.length > 0) {
        console.warn('\n⚠️  Warnings:');
        warnings.forEach(warning => console.warn(`   - ${warning}`));
    }
    
    process.exit(errors.length > 0 ? 1 : 0);
}
