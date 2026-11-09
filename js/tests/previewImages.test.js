import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PREVIEW_IMAGE, getFirstPostImages } from '../src/forum/utils/previewImages.js';

function image(src, emoji = false) {
  return {
    getAttribute: () => src,
    classList: { contains: (name) => name === 'emoji' && emoji },
  };
}

test('news uses the shared fallback when there is no image or the first image is an emoji', () => {
  const originalParser = globalThis.DOMParser;
  const originalApp = globalThis.app;
  const originalWindow = globalThis.window;
  let images = [];
  globalThis.DOMParser = class {
    parseFromString() {
      return { querySelectorAll: () => images };
    }
  };
  globalThis.app = { forum: { attribute: () => 'https://forum.example.test/forum' } };
  globalThis.window = { location: { href: 'https://forum.example.test/forum' } };

  try {
    const discussion = { firstPost: () => ({ contentHtml: () => '<p>content</p>' }) };
    const newsImage = () => getFirstPostImages(discussion, true)[0] || DEFAULT_PREVIEW_IMAGE;

    assert.equal(newsImage(), DEFAULT_PREVIEW_IMAGE);
    images = [image('emoji.png', true), image('article.jpg')];
    assert.equal(newsImage(), DEFAULT_PREVIEW_IMAGE);
    assert.equal(getFirstPostImages(discussion)[0], 'https://forum.example.test/forum/emoji.png');
    images = [image('article.jpg'), image('emoji.png', true)];
    assert.equal(newsImage(), 'https://forum.example.test/forum/article.jpg');
    images = [image('javascript:alert(1)')];
    assert.equal(newsImage(), DEFAULT_PREVIEW_IMAGE);
  } finally {
    globalThis.DOMParser = originalParser;
    globalThis.app = originalApp;
    globalThis.window = originalWindow;
  }
});
