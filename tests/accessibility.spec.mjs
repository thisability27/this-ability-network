import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';
import axe from 'axe-core';

const require = createRequire(import.meta.url);
const readability = require.resolve('@mozilla/readability/Readability.js');
const home = '';
const archive = 'events/';
const details = [
  '2017-celebrating-supermoms',
  '2018-celebrating-supermoms',
  '2024-10th-anniversary',
  '2026-chla-fundraiser',
  '2027-international-event',
].map((slug) => `events/${slug}/`);
const standards = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];
const themes = [
  { name: 'desktop light', width: 1051, color: 'light', routes: [home, archive, ...details] },
  { name: 'mobile light', width: 320, color: 'light', routes: [home, archive] },
  { name: 'desktop dark', width: 1051, color: 'dark', routes: [home, archive] },
];

for (const language of ['en', 'ko']) {
  for (const { name, width, color, routes } of themes) {
    test.describe(`${language} ${name}`, () => {
      test.use({ viewport: { width, height: 1000 }, colorScheme: color });
      test.beforeEach(async ({ context }) => {
        await context.addCookies([{ url: 'http://127.0.0.1:8776', name: 'tao-theme', value: color }]);
      });

      for (const route of routes) {
        test(`WCAG checks on /${language}/${route}`, async ({ page }) => {
          await page.goto(`/${language}/${route}`, { waitUntil: 'domcontentloaded' });
          await expect(page.locator('html')).toHaveAttribute('lang', language);
          await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${color}\\b`));
          await expect(page.locator('main')).toBeVisible();
          await page.evaluate(() => document.fonts.ready.then(() => undefined));
          await page.evaluate(axe.source);
          const violations = await page.evaluate(async (tags) => {
            const result = await window.axe.run({ runOnly: { type: 'tag', values: tags } });
            return result.violations.map(({ id, nodes }) => ({
              id, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
            }));
          }, standards);
          expect(violations).toEqual([]);
          if (route === archive && width !== 320) {
            const target = color === 'dark'
              ? page.locator('.tao-event-years a').first()
              : page.locator('.hextra-card').first();
            for (const state of ['hover', 'focus']) {
              if (state === 'hover') {
                await target.hover();
              } else {
                await page.mouse.move(0, 0);
                await page.keyboard.press('Tab');
                await target.focus();
              }
              const failures = await target.evaluate(async (element) => {
                const result = await window.axe.run(element, { runOnly: ['color-contrast'] });
                return result.violations.flatMap((rule) => rule.nodes.map((node) => node.failureSummary));
              });
              expect(failures, `Contrast in the ${state} state`).toEqual([]);
            }
          }
          await expect(page.locator('main img:not([alt])')).toHaveCount(0);
          await expect(page.locator('main img[alt=""]:not([src$="network-logo-color.png"])')).toHaveCount(0);
          await expect(page.locator('.hextra-nav-container nav > a').first()).toHaveAccessibleName('This Ability Network');
          if (width === 320) {
            expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
          }
        });
      }
    });
  }

  const korean = language === 'ko';
  test(`${language} mobile keyboard navigation`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await page.goto(`/${language}/`);
    const sidebar = page.locator('.hextra-sidebar-container');
    const toggle = page.locator('.hextra-hamburger-menu');
    const firstLink = sidebar.locator('a[href="#network"]');
    await expect(sidebar).toBeHidden();
    await toggle.focus();
    await page.keyboard.press('Tab');
    await expect(page.locator('main a[href="#orchestra"]').first()).toBeFocused();
    await toggle.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(firstLink).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(sidebar).toBeHidden();
    await expect(toggle).toBeFocused();
    await page.keyboard.press('Enter');
    await firstLink.press('Enter');
    await expect(page).toHaveURL(/#network$/);
    await expect(sidebar).toBeHidden();
    await page.setViewportSize({ width: 1051, height: 1000 });
    await expect(page.locator('.hextra-nav-container a[href$="#network"]')).toBeVisible();
  });

  test(`${language} footer names follow visible language and theme`, async ({ page }) => {
    await page.goto(`/${language}/`);
    const footer = page.locator('.hextra-footer');
    await expect(footer.locator('.hextra-language-switcher')).toHaveAccessibleName(korean ? /^한국어,/ : /^English,/);
    const theme = footer.locator('.hextra-theme-toggle');
    await expect(theme).toHaveAccessibleName(korean ? /^밝은 테마,/ : /^Light,/);
    await theme.click();
    await footer.locator('[data-item="dark"]').click();
    await expect(theme).toHaveAccessibleName(korean ? /^어두운 테마,/ : /^Dark,/);
  });

  for (const route of [home, archive, details[2]]) {
    test(`${language} photo viewer keyboard on /${language}/${route}`, async ({ page }) => {
      await page.goto(`/${language}/${route}`);
      const photo = page.locator('main a[data-pswp-width]').first();
      await expect(photo.locator('img')).toHaveAttribute('alt', /\S/);
      await expect(photo.locator('xpath=ancestor::*[@data-pswp-inited="1"][1]')).toBeAttached();
      await photo.focus();
      await photo.press('Enter');
      const dialog = page.getByRole('dialog', { name: korean ? '사진 확대 보기' : 'Photo viewer' });
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      const close = dialog.getByRole('button', { name: korean ? '사진 확대 닫기' : 'Close photo viewer' });
      await expect(close).toBeVisible();
      await expect(dialog.locator('.pswp__button--arrow--prev')).toHaveAttribute('aria-label', korean ? '이전 사진' : 'Previous photo');
      await expect(dialog.locator('.pswp__button--arrow--next')).toHaveAttribute('aria-label', korean ? '다음 사진' : 'Next photo');
      for (const key of ['Shift+Tab', 'Tab', 'Tab', 'Tab']) {
        await page.keyboard.press(key);
        await expect(dialog.locator(':focus')).toHaveCount(1);
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
      await expect(photo).toBeFocused();
      await photo.press('Enter');
      await close.click();
      await expect(dialog).toBeHidden();
      await expect(photo).toBeFocused();
    });
  }

  test(`${language} reader extraction keeps the introduction and descriptions`, async ({ page }) => {
    await page.goto(`/${language}/`);
    await page.addScriptTag({ path: readability });
    const result = await page.evaluate(() => {
      const article = new window.Readability(document.cloneNode(true)).parse();
      const content = new DOMParser().parseFromString(article.content, 'text/html');
      return {
        headings: Array.from(content.querySelectorAll('h2'), (node) => node.textContent.trim()),
        text: article.textContent,
        heroAlt: content.querySelector('img[src$="orchestra-stage-trim.jpg"]')?.alt,
      };
    });
    expect(result.headings).toContain(korean ? '네트워크 소개' : 'About Our Network');
    expect(result.text).toContain('501(c)(3)');
    expect(result.heroAlt).toContain(korean ? '지휘자' : 'conductor');
  });
}
