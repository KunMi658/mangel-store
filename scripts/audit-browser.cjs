// Run with Playwright available in NODE_PATH; see README.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const url = process.argv[2] || 'http://127.0.0.1:8788';
const output = process.argv[3] || path.join(require('node:os').tmpdir(), 'mangel-audit');
fs.mkdirSync(output, { recursive: true });

let browser;
(async () => {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  for (const width of [375, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [], failed = [], consoleErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') consoleErrors.push({ text: message.text(), url: message.location().url }); });
    page.on('requestfailed', request => failed.push({ url: request.url(), error: request.failure()?.errorText }));
    page.on('response', response => { if (response.status() >= 400) failed.push({ url: response.url(), status: response.status() }); });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('body').waitFor({ state: 'visible' });
    await page.screenshot({ path: path.join(output, `${width}-top.png`) });
    const initial = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      badAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))),
      smallTargets: [...document.querySelectorAll('a, button, summary')].filter(el => el.getBoundingClientRect().width && (el.getBoundingClientRect().height < 44 || el.getBoundingClientRect().width < 44)).map(el => el.id || el.textContent.trim()),
      counter: document.querySelector('.counter-card__number')?.textContent,
      whatsapp: [...document.querySelectorAll('a[href*="wa.me"]')].map(a => ({ id: a.id, href: a.href })),
    }));
    await page.locator('.nav__logo').click();
    if (width === 375) {
      await page.locator('#navToggle').focus();
      await page.keyboard.press('Enter');
      await page.keyboard.press('Tab');
      initial.menuKeyboard = await page.locator('.nav__link').first().evaluate(el => el === document.activeElement);
      initial.menuExpanded = await page.locator('#navToggle').getAttribute('aria-expanded');
      await page.keyboard.press('Escape');
      initial.menuClosed = await page.locator('#navToggle').getAttribute('aria-expanded');
    }
    const faq = page.locator('.faq-question').first();
    await faq.focus();
    await page.keyboard.press('Enter');
    initial.faqVisible = await page.locator('#faq-1').isVisible();
    await page.locator('#producto').scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(output, `${width}-catalog.png`) });
    initial.sound = {};
    await page.locator('#videoSoundBtn').click();
    initial.sound.on = await page.locator('#videoSoundBtn').getAttribute('aria-pressed');
    await page.locator('#videoSoundBtn').click();
    initial.sound.off = await page.locator('#videoSoundBtn').getAttribute('aria-pressed');
    results.push({ width, initial, errors, failed, consoleErrors });
    console.log('Checked', width);
    await context.close();
  }
  for (const mode of ['no-js', 'bootstrap-failure', 'reduced-motion']) {
    const context = await browser.newContext({ viewport: { width: 375, height: 900 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: 'reduce' });
    const page = await context.newPage();
    if (mode === 'bootstrap-failure') await page.route('**/*', async route => {
      if (route.request().resourceType() !== 'document') return route.continue();
      const response = await route.fetch();
      const html = (await response.text()).replace(/(<script>)([\s\S]*?)(<\/script>)/g, (all, open, code, close) => code.includes('navToggle') ? `${open}throw new Error('Simulated bootstrap failure');${close}` : all);
      await route.fulfill({ response, body: html });
    });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.locator('body').waitFor({ state: 'visible' });
    const state = await page.evaluate(() => ({ hiddenContent: [...document.querySelectorAll('.reveal')].filter(el => getComputedStyle(el).display !== 'none' && getComputedStyle(el).opacity === '0').length, navVisible: !!document.querySelector('.nav__link').getBoundingClientRect().height, smooth: getComputedStyle(document.documentElement).scrollBehavior }));
    await page.locator('.faq-question').first().click();
    state.faqVisible = await page.locator('#faq-1').isVisible();
    results.push({ mode, state });
    console.log('Checked', mode);
    await context.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  for (const result of results) {
    if (result.initial) {
      const { initial } = result;
      assert.equal(initial.h1, 1, 'one h1');
      assert.equal(initial.overflow, false, 'no page overflow');
      assert.deepEqual(initial.badAnchors, [], 'valid anchors');
      assert.deepEqual(initial.smallTargets, [], '44px targets');
      assert.deepEqual(result.errors, [], 'no page errors');
      assert.equal(initial.counter, '3.800', 'real static counter');
      assert.deepEqual(result.failed.filter(item => item.url.startsWith(new URL(url).origin) && item.error !== 'net::ERR_ABORTED'), [], 'no failed own resources');
      assert.deepEqual(result.consoleErrors.filter(item => item.url.startsWith(new URL(url).origin)), [], 'no own console errors');
      assert.equal(initial.faqVisible, true, 'keyboard FAQ');
      if (result.width === 375) { assert.equal(initial.menuKeyboard, true); assert.equal(initial.menuExpanded, 'true'); assert.equal(initial.menuClosed, 'false'); }
      assert.deepEqual(initial.sound, { on: 'true', off: 'false' });
      for (const link of initial.whatsapp) { const target = new URL(link.href); assert.equal(target.pathname, '/573233818212'); assert.ok(target.searchParams.get('text')); }
    } else {
      assert.equal(result.state.hiddenContent, 0, 'fail-safe content');
      assert.equal(result.state.faqVisible, true, 'native FAQ fallback');
      if (result.mode !== 'reduced-motion') assert.equal(result.state.navVisible, true, 'navigation fallback');
      assert.equal(result.state.smooth, 'auto', 'reduced motion scroll');
    }
  }
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });
