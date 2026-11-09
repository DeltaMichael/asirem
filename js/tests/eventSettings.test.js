import { test } from 'node:test';
import assert from 'node:assert/strict';
import { configuredId, streamUrl } from '../src/forum/utils/eventSettings.js';

const discussion = /^\/d\/([1-9]\d*)(?:[/-]|$)/;
const channel = /^\/chat\/c\/([1-9]\d*)(?:[/-]|$)/;
const base = 'https://forum.example.test';

test('accepts discussion and channel IDs or local URLs', () => {
  assert.equal(configuredId(' 42 ', discussion, base), '42');
  assert.equal(configuredId('https://forum.example.test/d/42-title/3', discussion, base), '42');
  assert.equal(configuredId('/chat/c/12', channel, base), '12');
  assert.equal(configuredId('https://forum.example.test/forum/d/42-title', discussion, `${base}/forum`), '42');
  assert.equal(configuredId('d/42-title', discussion, `${base}/forum`), '42');
  assert.equal(configuredId('/d/42-title', discussion, '//forum.example.test', base), '42');
});

test('rejects invalid IDs, other sites, and paths outside the forum', () => {
  for (const value of ['', '0', '-1', '123x', 'https://other.example.test/d/42', '/d/42evil']) {
    assert.equal(configuredId(value, discussion, base), null);
  }
  assert.equal(configuredId('https://forum.example.test/forum-other/d/42', discussion, `${base}/forum`), null);
});

test('accepts HTTP iframe sources without a provider allowlist or credentials', () => {
  assert.equal(streamUrl('https://stream.example.test/embed?id=42'), 'https://stream.example.test/embed?id=42');
  assert.equal(streamUrl('http://another.example.test/player'), 'http://another.example.test/player');
  for (const value of ['', 'javascript:alert(1)', '<iframe src="https://example.test">', 'https://user:pass@example.test']) {
    assert.equal(streamUrl(value), null);
  }
});
