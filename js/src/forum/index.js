import { extend, override } from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import LinkButton from 'flarum/common/components/LinkButton';
import TagsPage from 'ext:flarum/tags/forum/components/TagsPage';
import TagHero from 'ext:flarum/tags/forum/components/TagHero';
import sortTags from 'ext:flarum/tags/common/utils/sortTags';
import AsiremTagsPage from './components/TagsPage';
import { getSuperStickyDiscussions } from './components/FeaturedDiscussions';
import SignupPage from './components/SignupPage';
import StartPage from './components/StartPage';
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

app.initializers.add('deltamichael-asirem', () => {
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

  extend(IndexSidebar.prototype, 'navItems', function (items) {
    items.add(
      'startHere',
      <LinkButton href={app.route('start')} icon="fas fa-compass">
        {app.translator.trans('deltamichael-asirem.forum.start.nav')}
      </LinkButton>,
      110
    );
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
});
