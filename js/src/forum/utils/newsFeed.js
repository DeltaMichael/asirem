export function newsTagId(value) {
  const id = String(value || '').trim();
  return /^[1-9]\d*$/.test(id) ? id : null;
}

export function newsRequestParams(slug, tagId, offset) {
  return {
    filter: { tag: slug, asiremNews: tagId },
    sort: '-createdAt',
    page: { offset, limit: 20 },
    include: 'user,tags,firstPost',
  };
}
