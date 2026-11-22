import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { expect, test } from '@playwright/test';
import { rules } from '../scripts/wcag-rules.mjs';

const require = createRequire(import.meta.url);
const axe = require('axe-core');
const coverage = JSON.parse(readFileSync(new URL('../docs/wcag-coverage.json', import.meta.url), 'utf8'));

// W3C Recommendation "Web Content Accessibility Guidelines (WCAG) 2.2", 2024-12-12. 4.1.1 was removed in 2.2.
const levelA = [
  '1.1.1', '1.2.1', '1.2.2', '1.2.3', '1.3.1', '1.3.2', '1.3.3', '1.4.1', '1.4.2',
  '2.1.1', '2.1.2', '2.1.4', '2.2.1', '2.2.2', '2.3.1', '2.4.1', '2.4.2', '2.4.3', '2.4.4',
  '2.5.1', '2.5.2', '2.5.3', '2.5.4', '3.1.1', '3.2.1', '3.2.2', '3.2.6', '3.3.1', '3.3.2', '3.3.7', '4.1.2',
];
const levelAA = [
  '1.2.4', '1.2.5', '1.3.4', '1.3.5', '1.4.3', '1.4.4', '1.4.5', '1.4.10', '1.4.11', '1.4.12', '1.4.13',
  '2.4.5', '2.4.6', '2.4.7', '2.4.11', '2.5.7', '2.5.8', '3.1.2', '3.2.3', '3.2.4', '3.3.3', '3.3.4', '3.3.8', '4.1.3',
];
const byId = new Map(coverage.criteria.map((criterion) => [criterion.id, criterion]));
const axeRules = new Map(axe.getRules().map((rule) => [rule.ruleId, rule]));
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];
const tagOf = (id) => `wcag${id.replaceAll('.', '')}`;

test('coverage lists every WCAG 2.2 A and AA criterion with the right level', () => {
  expect(coverage.wcagVersion).toBe('2.2');
  expect(byId.size).toBe(coverage.criteria.length);
  expect(byId.has('4.1.1')).toBe(false);
  expect([...byId.keys()].sort()).toEqual([...levelA, ...levelAA].sort());
  for (const id of levelA) expect(byId.get(id).level, id).toBe('A');
  for (const id of levelAA) expect(byId.get(id).level, id).toBe('AA');
});

test('every criterion has a handling and not-applicable criteria keep a script guard', () => {
  for (const criterion of coverage.criteria) {
    const handled = criterion.axe.length + criterion.script.length + (criterion.manual ? 1 : 0) + (criterion.na ? 1 : 0);
    expect(handled, `${criterion.id} has no handling`).toBeGreaterThan(0);
    if (criterion.na) expect(criterion.script.length, `${criterion.id} is n/a without a script guard`).toBeGreaterThan(0);
  }
});

test('axe rule ids exist in the installed axe-core and are tagged for the criterion', () => {
  expect(coverage.axeCore, 'Review docs/wcag-coverage.json after upgrading axe-core').toBe(axe.version);
  for (const criterion of coverage.criteria) {
    for (const id of criterion.axe) {
      expect(axeRules.has(id), `${criterion.id}: axe rule "${id}" does not exist`).toBe(true);
      expect(axeRules.get(id).tags, `${criterion.id}: "${id}" is not tagged ${tagOf(criterion.id)}`).toContain(tagOf(criterion.id));
    }
  }
});

test('every axe rule tagged for an A or AA criterion is mapped', () => {
  for (const rule of axe.getRules(axeTags)) {
    for (const tag of rule.tags) {
      const match = tag.match(/^wcag(\d)(\d)(\d+)$/);
      const criterion = match && byId.get(`${match[1]}.${match[2]}.${match[3]}`);
      if (criterion) expect(criterion.axe, `axe rule "${rule.ruleId}" is missing under ${criterion.id}`).toContain(rule.ruleId);
    }
  }
});

test('script rule ids match the implementation in both directions', () => {
  const implemented = new Map(rules.map((rule) => [rule.id, rule]));
  expect(implemented.size).toBe(rules.length);
  for (const criterion of coverage.criteria) {
    for (const id of criterion.script) expect(implemented.has(id), `${criterion.id}: script rule "${id}" is not implemented`).toBe(true);
  }
  for (const rule of rules) {
    const mapped = coverage.criteria.filter((criterion) => criterion.script.includes(rule.id)).map((criterion) => criterion.id);
    expect(mapped.sort(), `criteria of rule "${rule.id}" differ from the mapping`).toEqual([...rule.criteria].sort());
  }
});
