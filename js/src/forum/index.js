import { extend, override } from 'flarum/common/extend';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import LinkButton from 'flarum/common/components/LinkButton';
import TagsPage from 'ext:flarum/tags/forum/components/TagsPage';
import TagHero from 'ext:flarum/tags/forum/components/TagHero';
import AsiremTagsPage from './components/TagsPage';
import { getSuperStickyDiscussions } from './components/FeaturedDiscussions';
import SignupPage from './components/SignupPage';
import StartPage from './components/StartPage';
import { truncate } from 'flarum/common/utils/string';

app.initializers.add('deltamichael-asirem', () => {
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
    const discussionListItemContent = vnode.children.find(
      (e) => e && e.tag === 'div' && e.attrs && e.attrs.className.includes('DiscussionListItem-content')
    );

    discussionListItemContent.children[0] = (
      <div className="DiscussionListItem-author-container">{[discussionListItemContent.children[0], discussionListItemContent.children[1]]}</div>
    );

    delete discussionListItemContent.children[1];

    discussionListItemContent.children[3] = <div className="DiscussionListItem-stats">{discussionListItemContent.children[3]}</div>;

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

      if (firstPost) {
        const excerpt = truncate(firstPost.contentPlain(), 175);

        items.add('excerpt', <div>{excerpt}</div>, -100);
      }
    }
  });

  override(TagsPage.prototype, 'view', AsiremTagsPage.prototype.view);

  app.routes['signup'] = { path: '/signup', component: SignupPage };
  app.routes['start'] = { path: '/start', component: StartPage };
});
