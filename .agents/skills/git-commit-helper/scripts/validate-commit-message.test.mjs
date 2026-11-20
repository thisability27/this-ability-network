import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCommitMessage } from './validate-commit-message.mjs';

test('범위가 있는 한글 제목과 본문을 허용한다', () => {
  assert.deepEqual(
    validateCommitMessage('refactor(assets): 원본 이미지를 분리\n\nJPEG 파일을 보관합니다.'),
    { valid: true },
  );
});

test('영문 유형이나 범위가 빠진 제목을 거부한다', () => {
  assert.equal(validateCommitMessage('docs: 작업 규칙을 문서화').valid, false);
  assert.equal(validateCommitMessage('문서(site): 작업 규칙을 문서화').valid, false);
  assert.equal(validateCommitMessage('docs(사이트): 작업 규칙을 문서화').valid, false);
});

test('Gitmoji가 붙은 제목을 거부한다', () => {
  assert.equal(validateCommitMessage('✨ feat(site): 사이트를 추가').valid, false);
  assert.equal(validateCommitMessage('feat(site): ✨ 사이트를 추가').valid, false);
});

test('영문 제목과 자동 생성된 영문 병합 제목을 거부한다', () => {
  assert.equal(validateCommitMessage('feat(site): add a website').valid, false);
  assert.equal(validateCommitMessage('Merge pull request #42').valid, false);
});

test('대문자가 포함된 범위를 거부한다', () => {
  assert.equal(validateCommitMessage('docs(Site): 작업 규칙을 문서화').valid, false);
});
