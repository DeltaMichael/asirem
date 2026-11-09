import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newsRequestParams, newsTagId } from '../src/forum/utils/newsFeed.js';

test('accepts only positive numeric tag IDs', () => {
  assert.equal(newsTagId(' 42 '), '42');
  for (const value of [null, '', '0', '-1', '123x', '1,2']) {
    assert.equal(newsTagId(value), null);
  }
});

test('requests the selected tag in creation order with preview relationships and pagination', () => {
  assert.deepEqual(newsRequestParams('news', '42', 20), {
    filter: { tag: 'news', asiremNews: '42' },
    sort: '-createdAt',
    page: { offset: 20, limit: 20 },
    include: 'user,tags,firstPost',
  });
});
