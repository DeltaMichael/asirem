import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redirectToStart, submitRegistrationModal } from '../src/forum/utils/registration.js';

test('redirects to the start page on the configured forum base URL', () => {
  const savedApp = globalThis.app;
  const savedWindow = globalThis.window;
  globalThis.app = { forum: { attribute: () => 'https://example.test/forum' } };
  globalThis.window = { location: { href: '' } };

  try {
    redirectToStart();
    assert.equal(window.location.href, 'https://example.test/forum/start');
  } finally {
    globalThis.app = savedApp;
    globalThis.window = savedWindow;
  }
});

test('modal registration preserves the submitted data and redirects on success', async () => {
  const savedApp = globalThis.app;
  const savedWindow = globalThis.window;
  const data = { username: 'test', token: 'token', nickname: 'Test' };
  let prevented = false;
  let request;
  const modal = {
    submitData: () => data,
    onerror() {},
    loaded() {
      assert.fail('successful registration should not invoke the failure handler');
    },
  };
  globalThis.app = {
    forum: { attribute: () => 'https://example.test/forum' },
    request: (options) => {
      request = options;
      return Promise.resolve();
    },
  };
  globalThis.window = { location: { href: '' } };

  try {
    await submitRegistrationModal(modal, { preventDefault: () => (prevented = true) });
    assert.equal(prevented, true);
    assert.equal(modal.loading, true);
    assert.equal(request.url, 'https://example.test/forum/register');
    assert.equal(request.method, 'POST');
    assert.equal(request.body, data);
    assert.equal(typeof request.errorHandler, 'function');
    assert.equal(window.location.href, 'https://example.test/forum/start');
  } finally {
    globalThis.app = savedApp;
    globalThis.window = savedWindow;
  }
});

test('modal registration retains Flarum error handling without redirecting', async () => {
  const savedApp = globalThis.app;
  const savedWindow = globalThis.window;
  const error = new Error('registration failed');
  let receivedError;
  const modal = {
    submitData: () => ({}),
    onerror() {},
    loaded(reason) {
      assert.equal(this, modal);
      receivedError = reason;
    },
  };
  globalThis.app = {
    forum: { attribute: () => 'https://example.test/forum' },
    request: () => Promise.reject(error),
  };
  globalThis.window = { location: { href: '' } };

  try {
    await submitRegistrationModal(modal, { preventDefault() {} });
    assert.equal(receivedError, error);
    assert.equal(window.location.href, '');
  } finally {
    globalThis.app = savedApp;
    globalThis.window = savedWindow;
  }
});
