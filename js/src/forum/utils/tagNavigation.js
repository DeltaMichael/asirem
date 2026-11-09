export function isNavigationTagVisible(tag) {
  const parent = tag.parent();
  return !tag.attribute('asiremHideFromNavigation') && (!parent || !parent.attribute('asiremHideFromNavigation'));
}
