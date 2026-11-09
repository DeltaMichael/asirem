export function configuredId(value, path, baseUrl, currentUrl) {
  const input = (value || '').trim();
  if (/^[1-9]\d*$/.test(input)) return input;
  if (!input) return null;

  try {
    const base = new URL(baseUrl, currentUrl);
    const url = new URL(input, `${base.href.replace(/\/$/, '')}/`);
    const prefix = base.pathname.replace(/\/$/, '');
    if (url.origin !== base.origin || !url.pathname.startsWith(`${prefix}/`)) return null;
    return url.pathname.slice(prefix.length).match(path)?.[1] || null;
  } catch {
    return null;
  }
}

export function streamUrl(value) {
  try {
    const url = new URL((value || '').trim());
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}
