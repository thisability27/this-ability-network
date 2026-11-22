// Project rules for WCAG 2.2 criteria that axe-core cannot check. Each rule is linked
// to success criteria in docs/wcag-coverage.json and reports a selector and a measurement.

const helpers = `window.__wcag = window.__wcag || {
  path(el) {
    const parts = [];
    for (let node = el; node && node.nodeType === 1 && node !== document.documentElement; node = node.parentElement) {
      if (node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
      let part = node.tagName.toLowerCase();
      const cls = [...node.classList].filter((c) => !c.includes(':')).slice(0, 2);
      if (cls.length) part += '.' + cls.map((c) => CSS.escape(c)).join('.');
      const same = node.parentElement && [...node.parentElement.children].filter((n) => n.tagName === node.tagName);
      if (same && same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      parts.unshift(part);
    }
    return parts.join(' > ');
  },
  rgba(value) {
    const ctx = (this.ctx ||= document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  },
  luminance([r, g, b]) {
    const [R, G, B] = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  visible(el) {
    if (!el.checkVisibility({ checkVisibilityCSS: true }) || el.closest('[inert]')) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && !(rect.width <= 1 && rect.height <= 1) && style.clip === 'auto';
  },
};`;

const targetSelector = 'a[href], button, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

async function install(page) {
  await page.evaluate(helpers);
}

// Press Tab through the page and call `measure` in the page for each focus stop.
async function walkFocus(page, measure, limit = 80) {
  await install(page);
  await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
  const stops = [];
  const seen = new Set();
  for (let index = 0; index < limit; index += 1) {
    await page.keyboard.press('Tab');
    const stop = await page.evaluate(measure);
    if (!stop || seen.has(stop.selector)) break;
    seen.add(stop.selector);
    stops.push(stop);
  }
  return stops;
}

const rules = [
  {
    id: 'focus-ring-contrast',
    criteria: ['1.4.11', '2.4.7'],
    title: 'Keyboard focus indicator is visible with at least 3:1 contrast against its surroundings',
    async run(page) {
      const stops = await walkFocus(page, async () => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {})));
        const w = window.__wcag;
        const style = getComputedStyle(el);
        let background = [255, 255, 255];
        const chain = [];
        for (let node = el.parentElement; node; node = node.parentElement) chain.unshift(node);
        for (const node of chain) {
          const [r, g, b, a] = w.rgba(getComputedStyle(node).backgroundColor);
          if (a > 0) background = background.map((base, i) => Math.round(base * (1 - a) + [r, g, b][i] * a));
        }
        const [hi, lo] = [w.luminance(w.rgba(style.outlineColor)), w.luminance(background)].sort((x, y) => y - x);
        return {
          selector: w.path(el), visible: el.matches(':focus-visible'),
          style: style.outlineStyle, width: parseFloat(style.outlineWidth),
          ratio: Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100,
          outline: style.outlineColor, background: `rgb(${background.join(', ')})`,
        };
      });
      return stops.filter((stop) => stop.visible).flatMap((stop) => {
        if (stop.style === 'none' || stop.width < 2) {
          return [{ selector: stop.selector, message: 'No outline of at least 2px', measured: `${stop.style} ${stop.width}px` }];
        }
        return stop.ratio >= 3 ? [] : [{ selector: stop.selector, message: 'Outline contrast below 3:1', measured: `${stop.ratio}:1 (${stop.outline} on ${stop.background})` }];
      });
    },
  },
  {
    id: 'focus-not-obscured',
    criteria: ['2.4.11'],
    title: 'A focused element is not entirely hidden behind fixed or sticky content',
    async run(page) {
      const stops = await walkFocus(page, async () => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        let steady = 0;
        for (let last = scrollY, frames = 0; steady < 3 && frames < 60; frames += 1) {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          steady = scrollY === last ? steady + 1 : 0;
          last = scrollY;
        }
        const rect = el.getBoundingClientRect();
        const points = [];
        for (const fx of [0.1, 0.5, 0.9]) {
          for (const fy of [0.1, 0.5, 0.9]) {
            const x = rect.left + rect.width * fx;
            const y = rect.top + rect.height * fy;
            if (x >= 0 && y >= 0 && x < innerWidth && y < innerHeight) points.push([x, y]);
          }
        }
        const clear = points.filter(([x, y]) => {
          const hit = document.elementFromPoint(x, y);
          return hit && (el.contains(hit) || hit.contains(el));
        });
        return {
          selector: window.__wcag.path(el), points: points.length, clear: clear.length,
          rect: [rect.left, rect.top, rect.width, rect.height].map(Math.round).join(','),
        };
      });
      return stops.filter((stop) => stop.clear === 0).map((stop) => ({
        selector: stop.selector,
        message: stop.points ? 'Focused element is covered by other content' : 'Focused element is outside the viewport',
        measured: `rect ${stop.rect}, visible points ${stop.clear}/${stop.points}`,
      }));
    },
  },
  {
    id: 'target-size-states',
    criteria: ['2.5.8'],
    title: 'Pointer targets are at least 24x24 CSS px or have 24px of spacing (checked in the current UI state)',
    async run(page) {
      await install(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      return page.evaluate((selector) => {
        const w = window.__wcag;
        const targets = [...document.querySelectorAll(selector)].filter((el) => w.visible(el));
        const rects = targets.map((el) => el.getBoundingClientRect());
        const found = [];
        targets.forEach((el, index) => {
          const rect = rects[index];
          if (rect.width >= 24 && rect.height >= 24) return;
          const style = getComputedStyle(el);
          const surrounding = el.parentElement?.textContent.replace(el.textContent, '').trim();
          if (style.display === 'inline' && surrounding) return;
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const crowded = rects.some((other, otherIndex) => {
            if (otherIndex === index || targets[otherIndex].contains(el) || el.contains(targets[otherIndex])) return false;
            const dx = Math.max(other.left - cx, 0, cx - other.right);
            const dy = Math.max(other.top - cy, 0, cy - other.bottom);
            return Math.hypot(dx, dy) < 12;
          });
          if (crowded) {
            found.push({
              selector: w.path(el), message: 'Target under 24x24 px without 24px spacing',
              measured: `${Math.round(rect.width * 10) / 10}x${Math.round(rect.height * 10) / 10}`,
            });
          }
        });
        return found;
      }, targetSelector);
    },
  },
  {
    id: 'reflow-320',
    criteria: ['1.4.10'],
    title: 'Content reflows at 320 CSS px wide without horizontal scrolling',
    maxWidth: 320,
    async run(page) {
      return page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= width) return [];
        return [...document.querySelectorAll('body *')]
          .filter((el) => el.getBoundingClientRect().right > width + 1 && el.checkVisibility())
          .slice(0, 5)
          .map((el) => ({
            selector: el.id ? `#${el.id}` : `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 2).join('.')}`,
            message: 'Content extends past the viewport',
            measured: `right ${Math.round(el.getBoundingClientRect().right)} > ${width}`,
          }))
          .concat([{ selector: 'html', message: 'Horizontal scroll width exceeds viewport', measured: `${document.documentElement.scrollWidth} > ${width}` }]);
      });
    },
  },
  {
    id: 'text-spacing',
    criteria: ['1.4.12'],
    title: 'No content is clipped when text spacing is increased',
    async run(page) {
      await install(page);
      return page.evaluate(() => {
        const clipped = () => [...document.querySelectorAll('body *')].filter((el) => {
          const style = getComputedStyle(el);
          if (style.overflow === 'visible' && style.overflowX === 'visible' && style.overflowY === 'visible') return false;
          if (!el.textContent.trim() || !window.__wcag.visible(el)) return false;
          return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
        }).map((el) => window.__wcag.path(el));
        const before = new Set(clipped());
        const style = document.createElement('style');
        style.textContent = '* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }';
        document.head.append(style);
        const found = clipped().filter((selector) => !before.has(selector)).map((selector) => ({
          selector, message: 'Text is clipped with WCAG text spacing applied', measured: 'line-height 1.5, letter 0.12em, word 0.16em, paragraph 2em',
        }));
        style.remove();
        return found;
      });
    },
  },
  {
    id: 'no-form-controls',
    criteria: ['1.3.5', '3.2.2', '3.3.1', '3.3.2', '3.3.3', '3.3.4', '3.3.7', '3.3.8'],
    title: 'The site has no form controls, so the input criteria stay not applicable',
    async run(page) {
      return page.evaluate(() => [...document.querySelectorAll(
        'form, input:not([type="hidden"]), textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"], [role="combobox"], [role="searchbox"]',
      )].map((el) => ({
        selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
        message: 'Form control found: review the not-applicable criteria in docs/wcag-coverage.json',
        measured: el.getAttribute('type') || el.tagName.toLowerCase(),
      })));
    },
  },
  {
    id: 'no-drag-interaction',
    criteria: ['2.5.7'],
    title: 'The site has no drag-only interaction',
    async run(page) {
      return page.evaluate(() => [...document.querySelectorAll(
        '[draggable="true"], [ondragstart], [ondrop], input[type="range"], [role="slider"]',
      )].map((el) => ({
        selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
        message: 'Draggable or slider element found: provide a single-pointer alternative',
        measured: el.getAttribute('role') || el.getAttribute('type') || 'draggable',
      })));
    },
  },
  {
    id: 'no-media',
    criteria: ['1.2.1', '1.2.2', '1.2.3', '1.2.4', '1.2.5', '1.4.2'],
    title: 'The site has no audio or video, so the media criteria stay not applicable',
    async run(page) {
      return page.evaluate(() => [...document.querySelectorAll('video, audio, iframe, embed, object')].map((el) => ({
        selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
        message: 'Media or embedded content found: review the media criteria in docs/wcag-coverage.json',
        measured: el.getAttribute('src') || el.tagName.toLowerCase(),
      })));
    },
  },
];

export { rules };

export async function runRule(page, rule) {
  const violations = await rule.run(page);
  return violations.map((violation) => ({ rule: rule.id, criteria: rule.criteria, ...violation }));
}

export function formatViolations(violations) {
  return violations
    .map((v) => `[${v.rule}] WCAG ${v.criteria.join(', ')}: ${v.message}\n  selector: ${v.selector}\n  measured: ${v.measured}`)
    .join('\n');
}
