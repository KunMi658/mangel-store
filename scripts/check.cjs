const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const html = fs.readFileSync(path.join(__dirname, '../public/index.html'), 'utf8');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mangel-inline-'));
let count = 0;
try {
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/application\/ld\+json/.test(match[1])) { JSON.parse(match[2]); continue; }
    if (/\bsrc\s*=/.test(match[1])) continue;
    const filename = path.join(temporary, `inline-${++count}.js`);
    fs.writeFileSync(filename, match[2]);
    execFileSync(process.execPath, ['--check', filename], { stdio: 'inherit' });
  }
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'unique IDs');
  for (const [, id] of html.matchAll(/href="#([^"]*)"/g)) assert.ok(ids.includes(id), `missing anchor #${id}`);
  console.log(`${count} inline scripts: node --check OK; JSON-LD, h1 and anchors OK.`);
} finally {
  for (const file of fs.readdirSync(temporary)) fs.unlinkSync(path.join(temporary, file));
  fs.rmdirSync(temporary);
}
