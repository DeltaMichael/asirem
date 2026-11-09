import { test } from 'node:test';
import assert from 'node:assert/strict';
import newsUnread from '../src/forum/states/newsUnread.js';

test('marks only returned cached discussions and refreshes the unread count', async () => {
  const savedApp = globalThis.app;
  const savedM = globalThis.m;
  const updates = [];
  let count = 3;
  const discussion = {
    lastReadPostNumber: () => 12,
    pushData: (data) => updates.push(data.attributes.lastReadPostNumber),
  };
  globalThis.m = { redraw() {} };
  globalThis.app = {
    session: { user: {} },
    forum: { attribute: (key) => (key === 'asiremNewsTag' ? '42' : '/api') },
    store: {
      find: async () => ({ attribute: () => count }),
      getById: (_type, id) => (id === '1' ? discussion : null),
    },
    request: async () => {
      count = 0;
      return {
        read: [
          { id: '1', lastReadPostNumber: 8 },
          { id: '2', lastReadPostNumber: 5 },
        ],
      };
    },
  };

  try {
    await newsUnread.refresh();
    assert.equal(newsUnread.count, 3);
    await newsUnread.markRead();
    assert.deepEqual(updates, [12]);
    assert.equal(newsUnread.count, 0);
    assert.equal(newsUnread.marking, false);
  } finally {
    globalThis.app = savedApp;
    globalThis.m = savedM;
  }
});

test('reports count failures rather than showing a stale unread count', async () => {
  const savedApp = globalThis.app;
  const savedM = globalThis.m;
  const savedError = console.error;
  let logged = false;
  globalThis.m = { redraw() {} };
  globalThis.app = {
    session: { user: {} },
    forum: { attribute: () => '42' },
    store: {
      find: async () => {
        throw new Error('offline');
      },
    },
  };
  console.error = () => {
    logged = true;
  };

  try {
    newsUnread.count = 5;
    await newsUnread.refresh();
    assert.equal(newsUnread.count, null);
    assert.equal(newsUnread.error, true);
    assert.equal(logged, true);
  } finally {
    globalThis.app = savedApp;
    globalThis.m = savedM;
    console.error = savedError;
  }
});
