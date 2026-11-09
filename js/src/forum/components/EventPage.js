import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import PageStructure from 'flarum/forum/components/PageStructure';
import { truncate } from 'flarum/common/utils/string';
import { configuredId, streamUrl } from '../utils/eventSettings';

export default class EventPage extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    const baseUrl = app.forum.attribute('baseUrl');
    this.discussionId = configuredId(app.forum.attribute('asiremEventDiscussion'), /^\/d\/([1-9]\d*)(?:[/-]|$)/, baseUrl, window.location.href);
    this.channelId = configuredId(app.forum.attribute('asiremEventChannel'), /^\/chat\/c\/([1-9]\d*)(?:[/-]|$)/, baseUrl, window.location.href);
    this.stream = streamUrl(app.forum.attribute('asiremEventStream'));
    this.title = app.forum.attribute('asiremEventTitle') || app.translator.trans('deltamichael-asirem.forum.event.title');
    this.discussionStatus = this.discussionId ? 'loading' : 'unconfigured';
    this.chatStatus = this.channelId ? 'loading' : 'unconfigured';
    this.removed = false;
    app.setTitle(this.title);

    if (this.discussionId) this.loadDiscussion();
    if (this.channelId) this.loadChat();
  }

  onremove(vnode) {
    super.onremove(vnode);
    this.removed = true;
    if (this.chatState) {
      if (this.chatState.activeChannelId === Number(this.channelId)) {
        this.chatState.closeOverlays();
        this.chatState.setActiveChannel(this.previousChannelId);
      }
      if (this.suspendedDrawer) this.chatState.resumeDrawer();
    }
  }

  async loadDiscussion() {
    try {
      this.discussion = await app.store.find('discussions', this.discussionId, { include: 'firstPost' });
      this.discussionStatus = 'ready';
    } catch (error) {
      console.error('[Asirem] Could not load event discussion', error);
      this.discussionStatus = 'error';
    }
    if (!this.removed) m.redraw();
  }

  async loadChat() {
    const chat = flarum.extensions?.['ramon-chat'];
    const lazy = chat && flarum.reg.checkModule('ramon-chat', 'forum/utils/lazy');

    if (
      !chat ||
      !chat.chatState ||
      !lazy?.loadChatUi ||
      !app.forum.attribute('canUseChat') ||
      !app.session.user ||
      app.session.user.preferences()?.['ramon-chat.enabled'] === false
    ) {
      this.chatStatus = 'unavailable';
      return;
    }

    try {
      const [ui, channel] = await Promise.all([
        lazy.loadChatUi(),
        app.store.find('chat-channels', this.channelId),
        chat.chatState.loadChannels(),
        chat.chatState.loadDrafts(),
      ]);
      if (this.removed) return;

      this.chatUi = ui;
      this.channel = channel;
      this.chatState = chat.chatState;
      this.previousChannelId = this.chatState.activeChannelId;
      this.suspendedDrawer = this.chatState.drawerOpen;
      if (this.suspendedDrawer) this.chatState.suspendDrawer();
      this.chatState.closeOverlays();
      this.chatState.setActiveChannel(Number(this.channelId));
      this.chatStatus = 'ready';
    } catch (error) {
      console.error('[Asirem] Could not load event chat', error);
      this.chatStatus = 'error';
    }
    if (!this.removed) m.redraw();
  }

  discussionView() {
    const t = (key) => app.translator.trans(`deltamichael-asirem.forum.event.${key}`);
    if (this.discussionStatus !== 'ready') return <p>{t(`discussion_${this.discussionStatus}`)}</p>;

    const excerpt = this.discussion.firstPost()?.contentPlain();
    return (
      <div>
        <h3>{this.discussion.title()}</h3>
        {excerpt ? <p>{truncate(excerpt, 300)}</p> : null}
        <Link href={app.route.discussion(this.discussion)} className="Button Button--primary">
          {t('open_discussion')}
        </Link>
      </div>
    );
  }

  chatView() {
    const t = (key) => app.translator.trans(`deltamichael-asirem.forum.event.${key}`);
    if (this.chatStatus !== 'ready') return <p className="Asirem-EventPage-message">{t(`chat_${this.chatStatus}`)}</p>;

    const { ChannelView, ThreadPanel, PinnedPanel } = this.chatUi;
    const state = this.chatState;
    return (
      <div className="Asirem-EventPage-chatBody">
        <ChannelView channel={this.channel} state={state} embedded />
        {state.activeThreadId ? (
          <ThreadPanel channel={this.channel} state={state} threadId={state.activeThreadId} onClose={() => (state.activeThreadId = null)} />
        ) : state.showPinned ? (
          <PinnedPanel channel={this.channel} state={state} embedded onClose={() => (state.showPinned = false)} />
        ) : null}
      </div>
    );
  }

  view() {
    const t = (key) => app.translator.trans(`deltamichael-asirem.forum.event.${key}`);
    return (
      <PageStructure className="Asirem-EventPage">
        <main className="Asirem-EventPage-content">
          <h1>{this.title}</h1>
          <div className="Asirem-EventPage-layout">
            <div className="Asirem-EventPage-main">
              <section className="Asirem-EventPage-player" aria-label={t('stream')}>
                {this.stream ? (
                  <iframe
                    src={this.stream}
                    title={t('stream')}
                    referrerpolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; fullscreen; picture-in-picture"
                    allowfullscreen
                  />
                ) : (
                  <p className="Asirem-EventPage-message">{t('stream_unavailable')}</p>
                )}
              </section>
              <section className="Asirem-EventPage-discussion">
                <h2>{t('discussion')}</h2>
                {this.discussionView()}
              </section>
            </div>
            <section className="Asirem-EventPage-chat">
              <div className="Asirem-EventPage-chatHeader">
                <h2>{t('chat')}</h2>
                {this.chatStatus === 'ready' ? <Link href={app.route('chat.channel', { id: this.channelId })}>{t('open_chat')}</Link> : null}
              </div>
              {this.chatView()}
            </section>
          </div>
        </main>
      </PageStructure>
    );
  }
}
