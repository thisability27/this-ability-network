import { expect, test } from '@playwright/test';
import { formatViolations, rules, runRule } from '../scripts/wcag-rules.mjs';

const routes = ['', 'events/', 'events/2024-10th-anniversary/'];
const contexts = [
  { name: 'desktop light', width: 1051, color: 'light' },
  { name: 'mobile light', width: 320, color: 'light' },
  { name: 'desktop dark', width: 1051, color: 'dark' },
];

async function check(page, only) {
  const violations = [];
  for (const rule of only ?? rules) {
    const width = await page.evaluate(() => innerWidth);
    if (rule.maxWidth && width > rule.maxWidth) continue;
    violations.push(...(await runRule(page, rule)));
  }
  expect(violations, formatViolations(violations)).toEqual([]);
}

for (const language of ['en', 'ko']) {
  for (const { name, width, color } of contexts) {
    test.describe(`${language} ${name}`, () => {
      test.use({ viewport: { width, height: 1000 }, colorScheme: color });
      test.beforeEach(async ({ context }) => {
        await context.addCookies([{ url: 'http://127.0.0.1:8776', name: 'tao-theme', value: color }]);
      });

      for (const route of routes) {
        test(`WCAG 2.2 rules on /${language}/${route}`, async ({ page }) => {
          await page.goto(`/${language}/${route}`);
          await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${color}\\b`));
          await page.evaluate(() => document.fonts.ready.then(() => undefined));
          await check(page);
        });
      }
    });
  }

  test.describe(`${language} open menus`, () => {
    test(`mobile menu open on /${language}/`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 1000 });
      await page.goto(`/${language}/`);
      await page.locator('.hextra-hamburger-menu').press('Enter');
      await expect(page.locator('.hextra-hamburger-menu')).toHaveAttribute('aria-expanded', 'true');
      await check(page, rules.filter((rule) => ['target-size-states', 'focus-not-obscured', 'focus-ring-contrast'].includes(rule.id)));
    });

    test(`desktop dropdown open on /${language}/`, async ({ page }) => {
      await page.setViewportSize({ width: 1051, height: 1000 });
      await page.goto(`/${language}/`);
      const toggle = page.locator('.hextra-nav-menu-toggle').first();
      await toggle.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await check(page, rules.filter((rule) => ['target-size-states', 'focus-not-obscured'].includes(rule.id)));
    });
  });
}

test.describe('rules report violations', () => {
  const find = (id) => rules.find((rule) => rule.id === id);
  const cases = [
    ['no-form-controls', '<input type="text"><select></select>', 2],
    ['no-drag-interaction', '<div draggable="true">x</div>', 1],
    ['no-media', '<video></video>', 1],
    ['target-size-states', '<a href="#a" style="display:inline-block;width:10px;height:10px">a</a><a href="#b" style="display:inline-block;width:10px;height:10px">b</a>', 2],
    ['focus-not-obscured', '<a id="t" href="#a">link</a><div style="position:fixed;inset:0;background:#fff"></div>', 1],
    ['focus-ring-contrast', '<style>a{outline:2px solid #ddd}</style><a href="#a">link</a>', 1],
    ['reflow-320', '<div style="width:600px;height:20px;background:#ccc"></div>', 2],
    ['text-spacing', '<p style="overflow:hidden;height:1.2em;width:200px;font:16px/1.2 sans-serif">Hello</p>', 1],
  ];
  for (const [id, html, count] of cases) {
    test(id, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 600 });
      await page.setContent(`<!doctype html><html lang="en"><body style="margin:0">${html}</body></html>`);
      const violations = await runRule(page, find(id));
      expect(violations, formatViolations(violations)).toHaveLength(count);
      for (const violation of violations) {
        expect(violation.criteria.length).toBeGreaterThan(0);
        expect(violation.selector).toBeTruthy();
        expect(violation.measured).toBeTruthy();
      }
    });
  }
});
