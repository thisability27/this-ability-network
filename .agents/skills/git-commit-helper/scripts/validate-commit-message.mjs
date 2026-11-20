#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const subjectPattern = /^[a-z][a-z0-9-]*\([a-z][a-z0-9]*(?:-[a-z0-9]+)*\): (\S.*)$/u;

export function validateCommitMessage(message) {
  const subject = message.split(/\r?\n/u, 1)[0];
  const match = subjectPattern.exec(subject);

  if (!match || /^\p{Extended_Pictographic}/u.test(match[1])) {
    return { valid: false, reason: '제목을 Gitmoji 없이 type(domain): 한글 제목 형식으로 작성하세요.' };
  }

  if (!/\p{Script=Hangul}/u.test(match[1])) {
    return { valid: false, reason: '제목에 한글을 사용하세요.' };
  }

  return { valid: true };
}

function main() {
  const messagePath = process.argv[2];

  if (!messagePath) {
    process.stderr.write('사용법: validate-commit-message.mjs <메시지-파일>\n');
    process.exitCode = 2;
    return;
  }

  const result = validateCommitMessage(readFileSync(messagePath, 'utf8'));

  if (!result.valid) {
    process.stderr.write(`${result.reason}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
