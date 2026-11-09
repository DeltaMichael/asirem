import { newsTagId } from '../utils/newsFeed.js';

class NewsUnread {
  constructor() {
    this.count = null;
    this.error = false;
    this.marking = false;
    this.pending = null;
  }

  scheduleRefresh() {
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.refresh(), 1500);
  }

  refresh() {
    const tagId = newsTagId(app.forum.attribute('asiremNewsTag'));
    if (!app.session.user || !tagId || this.marking) return Promise.resolve();
    if (this.pending) return this.pending;

    this.pending = app.store
      .find('tags', tagId)
      .then(
        (tag) => {
          this.count = tag.attribute('unreadCount');
          this.error = false;
        },
        (error) => {
          console.error('[Asirem] Could not load the news unread count', error);
          this.count = null;
          this.error = true;
        }
      )
      .finally(() => {
        this.pending = null;
        m.redraw();
      });

    return this.pending;
  }

  async markRead() {
    if (this.marking) return;
    this.marking = true;
    m.redraw();

    try {
      if (this.pending) await this.pending;
      const result = await app.request({ method: 'POST', url: `${app.forum.attribute('apiUrl')}/asirem/news/read` });
      result.read.forEach(({ id, lastReadPostNumber }) => {
        const discussion = app.store.getById('discussions', id);
        if (discussion) {
          discussion.pushData({
            attributes: { lastReadPostNumber: Math.max(discussion.lastReadPostNumber() || 0, lastReadPostNumber) },
          });
        }
      });
    } catch (error) {
      console.error('[Asirem] Could not mark news as read', error);
    } finally {
      this.marking = false;
      await this.refresh();
      m.redraw();
    }
  }
}

export default new NewsUnread();
