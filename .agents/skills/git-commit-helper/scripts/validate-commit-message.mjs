#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const subjectPattern = /^[a-z][a-z0-9-]*\([a-z][a-z0-9]*(?:-[a-z0-9]+)*\): (\S.*)$/u;

export function validateCommitMessage(message) {
  const subject = message.split(/\r?\n/u, 1)[0];
  const match = subjectPattern.exec(subject);

  if (!match || /^\p{Extended_Pictographic}/u.test(match[1])) {
    return { valid: false, reason: 'Use type(domain): Korean subject without a Gitmoji.' };
  }

  if (!/\p{Script=Hangul}/u.test(match[1])) {
    return { valid: false, reason: 'Use Korean in the subject.' };
  }

  return { valid: true };
}

function main() {
  const messagePath = process.argv[2];

  if (!messagePath) {
    process.stderr.write('Usage: validate-commit-message.mjs <message-file>\n');
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
