const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');

const PUBLIC = '/Applications/Projects/nextjs/sunzhi-will.github.io/public/projects';
const PROJ = '/Applications/Projects/nextjs';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function waitForPort(port, timeout) {
  timeout = timeout || 50000;
  return new Promise(function(resolve, reject) {
    var start = Date.now();
    function check() {
      var req = http.request({ host: 'localhost', port: port, path: '/' }, function() { resolve(); });
      req.on('error', function() {
        if (Date.now() - start > timeout) reject(new Error('timeout port ' + port));
        else setTimeout(check, 1000);
      });
      req.end();
    }
    check();
  });
}

var TARGETS = [
  { dir: 'AIDebtScanner', key: 'ai_debt_scanner', port: 3020, dest: ['home.png', 'dashboard.png'] },
  { dir: 'InboxCRM',      key: 'ticktive',        port: 3021, dest: ['home.png', 'dashboard.png'] },
  { dir: 'NexusOS',       key: 'nexusos',         port: 3022, dest: ['home.png', 'chat.png'] },
  { dir: 'Liminal',       key: 'liminal',         port: 3023, dest: ['home.png'] },
];

// check which dirs exist
TARGETS = TARGETS.filter(function(t) {
  return fs.existsSync(PROJ + '/' + t.dir);
});

(async function() {
  console.log('=== 截圖本地專案 ===');
  var browser = await chromium.launch({ headless: true });
  
  for (var i = 0; i < TARGETS.length; i++) {
    var t = TARGETS[i];
    console.log('\n▶ ' + t.dir + ' (port ' + t.port + ')');
    
    var proc = spawn('npm', ['run', 'dev', '--', '--port', String(t.port)], {
      cwd: PROJ + '/' + t.dir,
      env: Object.assign({}, process.env, { PORT: String(t.port) }),
      stdio: 'ignore'
    });
    
    try {
      await waitForPort(t.port, 50000);
      await sleep(2000);
      var page = await browser.newPage();
      await page.setViewportSize({ width: 1280, height: 800 });
      
      for (var j = 0; j < t.dest.length; j++) {
        var d = t.dest[j];
        try {
          await page.goto('http://localhost:' + t.port, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await sleep(2000);
          var destPath = PUBLIC + '/' + t.key + '/' + d;
          await page.screenshot({ path: destPath });
          var sz = fs.statSync(destPath).size;
          console.log('  OK ' + d + ' (' + Math.round(sz/1024) + 'KB)');
        } catch(e) {
          console.log('  FAIL ' + d + ': ' + e.message.slice(0, 60));
        }
      }
      await page.close();
    } catch(e) {
      console.log('  FAIL launch: ' + e.message.slice(0, 80));
    }
    
    try { proc.kill('SIGTERM'); } catch(e) {}
    await sleep(1000);
  }
  
  await browser.close();
  console.log('\n=== 完成 ===');
})().catch(console.error);
