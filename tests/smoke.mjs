import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 960, height: 720 }, deviceScaleFactor: 1 });
const failures = [];
page.on('pageerror', error => failures.push(error.message));
page.on('console', message => { if (message.type() === 'error') failures.push(message.text()); });
const state = () => page.evaluate(() => window.__NOCTURNE__.getState());
const until = (fn, arg) => page.waitForFunction(fn, arg, { timeout: 90000, polling: 100 });
const log = text => console.log(`PASS ${text}`);

try {
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:5173', { waitUntil: 'networkidle', timeout: 90000 });
  await until(() => window.__NOCTURNE__?.getState().ready);
  await page.locator('#loading').waitFor({ state: 'hidden', timeout: 90000 });
  assert.match(await page.title(), /Nocturne/);
  assert.equal(await page.locator('#error-panel').isVisible(), false);
  log('WebGL scene and local assets initialize');

  // Software rendering in CI uses the same exposed performance setting as the player.
  await page.click('#settings-toggle');
  await page.selectOption('#quality', 'low');
  assert.equal((await state()).quality, 'low');
  await page.click('#settings-close');
  const initial = await state();
  await page.keyboard.down('KeyW');
  await until(z => window.__NOCTURNE__.getState().position[2] < z - 1, initial.position[2]);
  await page.keyboard.up('KeyW');
  const walked = await state();
  assert.ok(walked.position[2] < initial.position[2] - .9);
  log('WASD moves the character and the camera follows');

  const runStart = await state();
  await page.keyboard.down('ShiftLeft'); await page.keyboard.down('KeyW');
  await until(z => window.__NOCTURNE__.getState().position[2] < z - 2, runStart.position[2]);
  await page.keyboard.up('KeyW'); await page.keyboard.up('ShiftLeft');
  const ran = await state();
  const runSpeed = (runStart.position[2] - ran.position[2]) / (ran.simulationTime - runStart.simulationTime);
  assert.ok(runSpeed > 2.5, `Expected running speed above walking, got ${runSpeed}`);
  log('Shift increases movement speed');

  await page.keyboard.press('Space');
  await until(() => { const s = window.__NOCTURNE__.getState(); return !s.grounded && s.position[1] > .15; });
  await until(() => window.__NOCTURNE__.getState().grounded);
  log('Jump leaves the ground and lands');

  const beforeOrbit = await state();
  await page.mouse.move(430, 300); await page.mouse.down(); await page.mouse.move(630, 330, { steps: 5 }); await page.mouse.up();
  assert.ok(Math.abs((await state()).yaw - beforeOrbit.yaw) > .3);
  await page.mouse.wheel(0, -180);
  await until(d => window.__NOCTURNE__.getState().distance < d - .6, beforeOrbit.distance);
  log('Mouse orbit and wheel zoom');

  await page.click('#settings-toggle');
  await page.click('#reset-view');
  await page.keyboard.down('ShiftLeft'); await page.keyboard.down('KeyW');
  await until(() => { const p = window.__NOCTURNE__.getState().position; return Math.hypot(p[0], p[2] + 5) < 4.1; });
  await page.keyboard.up('KeyW'); await page.keyboard.up('ShiftLeft');
  await until(() => !document.getElementById('interaction').classList.contains('hidden'));
  await page.keyboard.press('KeyE');
  assert.equal((await state()).awakened, true);
  assert.match(await page.locator('#objective-text').textContent(), /remember your name/);
  log('Approach and awaken the orrery; objective updates');

  await page.keyboard.press('KeyQ');
  const cast = await state();
  assert.equal(cast.casts, 1); assert.ok(cast.energy < 100);
  log('Spell casting consumes arcana and creates a projectile');

  // Move directly into the central pedestal: the player must remain outside it.
  const beforeCollision = await state();
  await page.keyboard.down('KeyW');
  await until(t => window.__NOCTURNE__.getState().simulationTime > t + 1.9, beforeCollision.simulationTime);
  await page.keyboard.up('KeyW');
  const p = (await state()).position;
  assert.ok(Math.hypot(p[0], p[2] + 5) >= 1.38, 'Player penetrated the pedestal');
  log('Pedestal collision keeps the character outside solid geometry');

  await page.keyboard.press('KeyP'); assert.equal((await state()).photo, true);
  assert.equal(await page.locator('.topbar').isVisible(), false);
  await page.keyboard.press('KeyP'); assert.equal((await state()).photo, false);
  log('Photo mode hides and restores the interface');

  await page.click('#sound-toggle'); assert.equal((await state()).sound, true);
  await page.click('#sound-toggle'); assert.equal((await state()).sound, false);
  log('Ambient sound enables and mutes');

  await page.keyboard.press('Escape'); assert.equal((await state()).settings, true);
  await page.selectOption('#quality', 'medium'); assert.equal((await state()).quality, 'medium');
  await page.keyboard.press('Escape'); assert.equal((await state()).settings, false);
  await page.setViewportSize({ width: 1280, height: 800 });
  await until(() => Math.abs(window.__NOCTURNE__.camera.aspect - 1.6) < .001);
  log('Settings, quality selection, Escape, and viewport resize');

  assert.deepEqual(failures, [], 'Browser errors encountered');
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/playable-scene.png' });
  console.log('All 11 browser checks passed.');
  console.log(JSON.stringify(await state(), null, 2));
} finally {
  await browser.close();
}
