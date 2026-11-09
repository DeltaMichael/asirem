export const DEFAULT_PREVIEW_IMAGE = 'https://forums.bwzone.eu/assets/files/2026-11-07/1794020977-834598-bwz-white-jpg.png';

export function getFirstPostImages(discussion, fallbackOnFirstEmoji = false) {
  const content = discussion.firstPost()?.contentHtml?.();

  if (!content || typeof DOMParser === 'undefined') {
    return [];
  }

  const document = new DOMParser().parseFromString(content, 'text/html');
  const images = Array.from(document.querySelectorAll('img[src]'));

  if (fallbackOnFirstEmoji && images[0]?.classList.contains('emoji')) {
    return [];
  }

  return images
    .map((image) => image.getAttribute('src'))
    .filter(Boolean)
    .map((src) => {
      try {
        const baseUrl = new URL(app.forum.attribute('baseUrl') || window.location.href, window.location.href);
        baseUrl.pathname = baseUrl.pathname.endsWith('/') ? baseUrl.pathname : `${baseUrl.pathname}/`;
        const url = new URL(src, baseUrl.href);

        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
      } catch (_error) {
        return null;
      }
    })
    .filter(Boolean);
}
