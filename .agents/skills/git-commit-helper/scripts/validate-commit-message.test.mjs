import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCommitMessage } from './validate-commit-message.mjs';

test('accepts a scoped Korean subject and body', () => {
  assert.deepEqual(
    validateCommitMessage('refactor(assets): \uC774\uBBF8\uC9C0\n\n\uBCF4\uAD00'),
    { valid: true },
  );
});

test('rejects a missing scope or non-ASCII type or scope', () => {
  assert.equal(validateCommitMessage('docs: \uBB38\uC11C\uD654').valid, false);
  assert.equal(validateCommitMessage('\uBB38\uC11C(site): \uBB38\uC11C\uD654').valid, false);
  assert.equal(validateCommitMessage('docs(\uC0AC\uC774\uD2B8): \uBB38\uC11C\uD654').valid, false);
});

test('rejects a Gitmoji in the subject', () => {
  assert.equal(validateCommitMessage('✨ feat(site): \uCD94\uAC00').valid, false);
  assert.equal(validateCommitMessage('feat(site): ✨ \uCD94\uAC00').valid, false);
});

test('rejects English subjects and generated merge subjects', () => {
  assert.equal(validateCommitMessage('feat(site): add a website').valid, false);
  assert.equal(validateCommitMessage('Merge pull request #42').valid, false);
});

test('rejects an uppercase scope', () => {
  assert.equal(validateCommitMessage('docs(Site): \uBB38\uC11C\uD654').valid, false);
});
