import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import humanTime from 'flarum/common/helpers/humanTime';
import extractText from 'flarum/common/utils/extractText';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import PageStructure from 'flarum/forum/components/PageStructure';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';
import { DEFAULT_PREVIEW_IMAGE, getFirstPostImages } from '../utils/previewImages';
import { newsRequestParams, newsTagId } from '../utils/newsFeed';
import newsUnread from '../states/newsUnread';

export default class NewsPage extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    app.setTitle(extractText(app.translator.trans('deltamichael-asirem.forum.news.title')));
    this.discussions = [];
    this.loading = false;
    this.error = false;
    this.hasNext = false;
    this.tagId = newsTagId(app.forum.attribute('asiremNewsTag'));

    if (!this.tagId) {
      this.unconfigured = true;
      return;
    }

    this.loading = true;
    app.store.find('tags', this.tagId).then(
      (tag) => {
        this.tag = tag;
        this.loadPage();
      },
      () => {
        this.loading = false;
        this.error = true;
        m.redraw();
      }
    );
  }

  loadPage() {
    this.loading = true;
    this.error = false;
    app.store.find('discussions', newsRequestParams(this.tag.slug(), this.tagId, this.discussions.length)).then(
      (discussions) => {
        this.discussions.push(...discussions);
        this.hasNext = Boolean(discussions.payload?.links?.next);
        this.loading = false;
        m.redraw();
      },
      () => {
        this.loading = false;
        this.error = true;
        m.redraw();
      }
    );
  }

  retry() {
    if (this.tag) {
      this.loadPage();
    } else {
      this.loading = true;
      this.error = false;
      app.store.find('tags', this.tagId).then(
        (tag) => {
          this.tag = tag;
          this.loadPage();
        },
        () => {
          this.loading = false;
          this.error = true;
          m.redraw();
        }
      );
    }
  }

  viewCard(discussion) {
    const image = getFirstPostImages(discussion, true)[0] || DEFAULT_PREVIEW_IMAGE;
    const author = discussion.user();
    const date = discussion.createdAt();
    const replies = Math.max(0, discussion.commentCount() - 1);

    return (
      <Link key={discussion.id()} href={app.route.discussion(discussion)} className="Asirem-NewsPage-card">
        <div className="Asirem-NewsPage-media">
          <img src={image} alt="" />
        </div>
        <div className="Asirem-NewsPage-copy">
          {discussion.isUnread() && <span className="Asirem-NewsPage-unread">{app.translator.trans('deltamichael-asirem.forum.news.unread')}</span>}
          <h2>{discussion.title()}</h2>
          <p>{discussion.firstPost()?.contentPlain?.()}</p>
          <div className="Asirem-NewsPage-meta">
            {author && <span>{author.displayName()}</span>}
            {date && <time datetime={date.toISOString()}>{humanTime(date)}</time>}
            <span>
              {replies} {app.translator.trans(`deltamichael-asirem.forum.featured.${replies === 1 ? 'one_reply' : 'many_replies'}`)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  view() {
    return (
      <PageStructure className="Asirem-NewsPage" hero={() => <WelcomeHero />} sidebar={() => <IndexSidebar />}>
        <main className="Asirem-NewsPage-content">
          <div className="Asirem-NewsPage-header">
            <h1>{app.translator.trans('deltamichael-asirem.forum.news.title')}</h1>
            {app.session.user && this.tag && (
              <Button
                className="Button Button--icon"
                icon="fas fa-check"
                title={app.translator.trans('deltamichael-asirem.forum.news.mark_read')}
                aria-label={app.translator.trans('deltamichael-asirem.forum.news.mark_read')}
                loading={newsUnread.marking}
                disabled={newsUnread.marking}
                onclick={() => {
                  if (confirm(extractText(app.translator.trans('deltamichael-asirem.forum.news.mark_read_confirm')))) newsUnread.markRead();
                }}
              />
            )}
          </div>
          {this.discussions.map((discussion) => this.viewCard(discussion))}
          {this.unconfigured && <p>{app.translator.trans('deltamichael-asirem.forum.news.unconfigured')}</p>}
          {!this.unconfigured && !this.loading && !this.error && !this.discussions.length && (
            <p>{app.translator.trans('deltamichael-asirem.forum.news.empty')}</p>
          )}
          {this.loading && <LoadingIndicator />}
          {this.error && (
            <div role="alert">
              <p>{app.translator.trans('deltamichael-asirem.forum.news.error')}</p>
              <Button className="Button" onclick={() => this.retry()}>
                {app.translator.trans('deltamichael-asirem.forum.news.retry')}
              </Button>
            </div>
          )}
          {!this.error && !this.loading && this.hasNext && (
            <Button className="Button" onclick={() => this.loadPage()}>
              {app.translator.trans('deltamichael-asirem.forum.news.load_more')}
            </Button>
          )}
        </main>
      </PageStructure>
    );
  }
}
