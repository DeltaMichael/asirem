import { extend, override } from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import CommentPost from 'flarum/forum/components/CommentPost';
import Discussion from 'flarum/common/models/Discussion';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import HeaderSecondary from 'flarum/forum/components/HeaderSecondary';
import LinkButton from 'flarum/common/components/LinkButton';
import TagsPage from 'ext:flarum/tags/forum/components/TagsPage';
import TagHero from 'ext:flarum/tags/forum/components/TagHero';
import TagLinkButton from 'ext:flarum/tags/forum/components/TagLinkButton';
import sortTags from 'ext:flarum/tags/common/utils/sortTags';
import AsiremTagsPage from './components/TagsPage';
import { getSuperStickyDiscussions } from './components/FeaturedDiscussions';
import SignupPage from './components/SignupPage';
import StartPage from './components/StartPage';
import EventPage from './components/EventPage';
import NewsPage from './components/NewsPage';
import NewsNavButton from './components/NewsNavButton';
import ReactionUsersTooltip from './components/ReactionUsersTooltip';
import { isNavigationTagVisible } from './utils/tagNavigation';
import { newsTagId } from './utils/newsFeed';
import newsUnread from './states/newsUnread';
import { truncate } from 'flarum/common/utils/string';

extend(DiscussionListState.prototype, 'requestParams', function (params) {
  params.include.push('firstPost');
});

extend(DiscussionControls, 'controls', function (items, discussion, context) {
  if (context instanceof DiscussionListItem && items.toArray().length === 0) {
    items.add(
      'copyLink',
      <Button
        icon="fas fa-link"
        onclick={() => {
          const url = new URL(app.route.discussion(discussion), window.location.href).href;
          navigator.clipboard?.writeText(url);
        }}
      >
        {app.translator.trans('deltamichael-asirem.forum.discussion.copy_link')}
      </Button>
    );
  }
});

app.initializers.add(
  'deltamichael-asirem',
  () => {
    const PostReactionCounts = flarum.reg.get('fof-reactions', 'forum/components/PostReactionCounts');
    const ReactionComponent = flarum.reg.get('fof-reactions', 'common/components/ReactionComponent');

    if (PostReactionCounts && ReactionComponent) {
      const reactionTooltipMedia = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
      reactionTooltipMedia.addEventListener('change', () => m.redraw());

      extend(ReactionComponent.prototype, 'view', function (vnode) {
        if (this.attrs.asiremHideTitle) {
          delete vnode.attrs.title;
          delete vnode.attrs.asiremHideTitle;
        }
      });

      extend(PostReactionCounts.prototype, 'view', function (vnode) {
        if (!vnode || !reactionTooltipMedia.matches) return;

        const buttons = vnode.children[0].children;
        vnode.children[0].children = buttons.map((button) => {
          const icon = button.children[0].children[0];
          icon.attrs.asiremHideTitle = true;

          return <ReactionUsersTooltip key={icon.attrs.reaction.id()} post={this.attrs.post} reaction={icon.attrs.reaction} button={button} />;
        });
      });

      extend(CommentPost.prototype, 'oninit', function () {
        this.subtree.check(() => this.attrs.post._asiremReactionTooltipRevision);
        this.subtree.check(() => reactionTooltipMedia.matches);
      });
    }

    extend(CommentPost.prototype, 'footerItems', function (items) {
      items.remove('reactionCounts');
    });

    extend(CommentPost.prototype, 'actionItems', function (items) {
      const post = this.attrs.post;
      const counts = post.reactionCounts?.();

      if (!PostReactionCounts || post.isHidden() || !counts || !Object.values(counts).some((count) => count > 0)) {
        return;
      }

      items.add('reactionCounts', PostReactionCounts.component({ post }), 6);
    });

    extend(DiscussionListItem.prototype, 'oninit', function () {
      const discussion = this.attrs.discussion;
      const firstPostLink = discussion.rawRelationship('firstPost');
      const discussionList = app.discussions;

      if (app.currentTag() && firstPostLink && !discussion.firstPost() && !discussionList._asiremRefreshingFirstPosts) {
        discussionList._asiremRefreshingFirstPosts = true;
        discussionList
          .refresh()
          .catch(() => {})
          .finally(() => {
            discussionList._asiremRefreshingFirstPosts = false;
          });
      }
    });

    extend(TagHero.prototype, 'bodyItems', function (items) {
      const imageUrl = this.attrs.model.attribute('asiremArtworkUrl');

      if (imageUrl) {
        items.add('asiremArtwork', <img className="Asirem-TagHero-artwork" src={imageUrl} alt="" />, 70);
      }
    });

    extend(TagLinkButton.prototype, 'linkItems', function (items, tag) {
      const imageUrl = tag?.attribute('asiremArtworkUrl');

      if (imageUrl) {
        items.remove('icon');
        items.add('icon', <img className="Button-icon Asirem-TagArtwork" src={imageUrl} alt="" />, 100);
      }
    });

    extend(IndexSidebar.prototype, 'navItems', function (items) {
      const tags = app.store.all('tags');
      tags.filter((tag) => !isNavigationTagVisible(tag)).forEach((tag) => items.remove('tag' + tag.id()));
      if (!app.current.get('noTagsList')) {
        const more = tags
          .filter((tag) => tag.position() === null && isNavigationTagVisible(tag))
          .sort((a, b) => b.discussionCount() - a.discussionCount());
        const currentTag = app.currentTag();
        more.slice(0, 3).forEach((tag) => {
          if (!items.has('tag' + tag.id())) {
            items.add(
              'tag' + tag.id(),
              <TagLinkButton
                model={tag}
                params={app.search.state.stickyParams()}
                active={currentTag === tag || (currentTag && currentTag.parent() === tag)}
              >
                {tag.name()}
              </TagLinkButton>,
              -14
            );
          }
        });
        if (more.length <= 3) items.remove('moreTags');
      }
      if (newsTagId(app.forum.attribute('asiremNewsTag'))) {
        items.add(
          'news',
          <LinkButton href={app.route('news')} icon="fas fa-newspaper">
            {app.translator.trans('deltamichael-asirem.forum.news.nav')}
          </LinkButton>,
          108
        );
      }
      items.add(
        'startHere',
        <LinkButton href={app.route('start')} icon="fas fa-compass">
          {app.translator.trans('deltamichael-asirem.forum.start.nav')}
        </LinkButton>,
        110
      );
      if (app.session.user) {
        items.add(
          'eventHub',
          <LinkButton href={app.route('event')} icon="fas fa-video">
            {app.translator.trans('deltamichael-asirem.forum.event.nav')}
          </LinkButton>,
          105
        );
      }
    });

    extend(HeaderSecondary.prototype, 'items', function (items) {
      if (app.session.user && newsTagId(app.forum.attribute('asiremNewsTag'))) {
        items.add('asiremNews', <NewsNavButton />, 14);
      }
    });

    override(Discussion.prototype, 'save', function (original, data, ...args) {
      const request = original(data, ...args);
      if (data?.lastReadPostNumber) {
        request.then(
          () => newsUnread.scheduleRefresh(),
          () => {}
        );
      }
      return request;
    });

    extend(TagsPage.prototype, 'oninit', function () {
      this.featuredDiscussions = [];

      app.tagList
        .load(['lastPostedUser'])
        .then((tags) => {
          this.tags = sortTags(tags.filter((tag) => !tag.isChild()));
          m.redraw();
        })
        .catch(() => {});

      app.store
        .find('discussions', {
          filter: { stickiest: true },
          sort: '-lastPostedAt',
          page: { limit: 20 },
          include: 'tags,firstPost',
        })
        .then((discussions) => {
          this.featuredDiscussions = getSuperStickyDiscussions(discussions);
          m.redraw();
        })
        .catch(() => {
          this.featuredDiscussions = [];
          m.redraw();
        });
    });

    extend(DiscussionListItem.prototype, 'view', function (vnode) {
      if (this.attrs.discussion.tags() && this.attrs.discussion.tags()[0] && this.attrs.discussion.tags()[0].color()) {
        vnode.attrs.style = { '--tag-color': this.attrs.discussion.tags()[0].color(), ...(vnode.attrs.style || {}) };
      }

      if (this.attrs.discussion.isUnread()) {
        vnode.attrs.className += ' DiscussionListItem--unread';
      }
    });

    extend(DiscussionListItem.prototype, 'infoItems', function (items) {
      if (!items.has('excerpt')) {
        const firstPost = this.attrs.discussion.firstPost();
        const content = firstPost?.contentPlain();

        if (content) {
          const excerpt = truncate(content, 175);

          items.add('excerpt', <div>{excerpt}</div>, -100);
        }
      }
    });

    override(TagsPage.prototype, 'view', AsiremTagsPage.prototype.view);

    app.routes['signup'] = { path: '/signup', component: SignupPage };
    app.routes['start'] = { path: '/start', component: StartPage };
    app.routes['news'] = { path: '/news', component: NewsPage };
    app.routes['event'] = { path: '/event', component: EventPage };
  },
  -100
);
