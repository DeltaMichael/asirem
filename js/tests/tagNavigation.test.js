import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isNavigationTagVisible } from '../src/forum/utils/tagNavigation.js';

function tag(hidden, parent = null) {
  return {
    attribute: (name) => name === 'asiremHideFromNavigation' && hidden,
    parent: () => parent,
  };
}

test('hides tags and their children only when navigation visibility is disabled', () => {
  const visible = tag(false);
  const hidden = tag(true);
  assert.equal(isNavigationTagVisible(visible), true);
  assert.equal(isNavigationTagVisible(hidden), false);
  assert.equal(isNavigationTagVisible(tag(false, visible)), true);
  assert.equal(isNavigationTagVisible(tag(true, visible)), false);
  assert.equal(isNavigationTagVisible(tag(false, hidden)), false);
  assert.equal(isNavigationTagVisible(tag(false, false)), true);
});
