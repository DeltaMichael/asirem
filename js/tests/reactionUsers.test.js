import assert from 'node:assert/strict';
import test from 'node:test';
import formatReactionUsers from '../src/forum/utils/formatReactionUsers.js';

const names = Array.from({ length: 11 }, (_, i) => `User ${i + 1}`);
const format = (users) => formatReactionUsers(users, (user) => user, 'No named reactions');

test('shows an explicit message when no named reactions are available', () => {
  assert.equal(format([]), 'No named reactions');
  assert.equal(format([null]), 'No named reactions');
});

test('shows one or ten names without an ellipsis', () => {
  assert.equal(format(names.slice(0, 1)), 'User 1');
  assert.equal(format(names.slice(0, 10)), names.slice(0, 10).join('\n'));
});

test('shows only the first ten names and an ellipsis for eleven reactions', () => {
  assert.equal(format(names), `${names.slice(0, 10).join('\n')}\n...`);
});
