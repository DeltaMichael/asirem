import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import PageStructure from 'flarum/forum/components/PageStructure';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';
import Link from 'flarum/common/components/Link';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import humanTime from 'flarum/common/helpers/humanTime';

import tagIcon from 'ext:flarum/tags/common/helpers/tagIcon';
import tagLabel from 'ext:flarum/tags/common/helpers/tagLabel';
import sortTags from 'ext:flarum/tags/common/utils/sortTags';
import FeaturedDiscussions, { getSuperStickyDiscussions } from './FeaturedDiscussions';
import { isNavigationTagVisible } from '../utils/tagNavigation';

export default class TagsPage {
  view() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    const tags = this.tags.map((tag) => app.store.getById('tags', tag.id()) || tag).filter(isNavigationTagVisible);
    const pinned = tags.filter((tag) => tag.position() !== null).sort((a, b) => a.position() - b.position());
    const cloud = tags.filter((tag) => tag.position() === null);
    const onlineUsersWidget = app.widgets.get('end')?.find((widget) => widget.key === 'onlineUsers');
    const forumStatisticsWidget = app.widgets.get('end')?.find((widget) => widget.key === 'forumStatistics');
    const onlineUsers = () => onlineUsersWidget?.component.component({ state: onlineUsersWidget.state });
    const forumStatistics = () => forumStatisticsWidget?.component.component({ state: forumStatisticsWidget.state });

    return (
      <PageStructure
        className="Asirem-TagsPage"
        hero={() => <WelcomeHero />}
        sidebar={() => (
          <div className="Asirem-TagsPage-sidebar">
            <IndexSidebar />
            {onlineUsersWidget && <div className="Asirem-TagsPage-onlineUsers Asirem-TagsPage-onlineUsers--desktop">{onlineUsers()}</div>}
            {forumStatisticsWidget && <div className="Asirem-TagsPage-forumStatistics">{forumStatistics()}</div>}
          </div>
        )}
      >
        <div className="TagsPage-content">
          {this.featuredDiscussions.length > 0 && <FeaturedDiscussions discussions={this.featuredDiscussions} />}
          {onlineUsersWidget && <div className="Asirem-TagsPage-onlineUsers Asirem-TagsPage-onlineUsers--mobile">{onlineUsers()}</div>}
          <ul className="Asirem-TagTiles">
            {pinned.map((tag) => {
              const lastPostedDiscussion = tag.lastPostedDiscussion();
              const children = sortTags((tag.children() || []).filter(isNavigationTagVisible));
              const artworkUrl = tag.attribute('asiremArtworkUrl');
              const tagIconNode = tagIcon(tag, {}, { useColor: false });

              const unread = tag.attribute('unreadCount');
              const lastPostedUserId = tag.data.relationships?.lastPostedUser?.data?.id;
              const user = lastPostedUserId ? app.store.getById('users', lastPostedUserId) : null;
              if (tagIconNode.attrs.style && tagIconNode.attrs.style.backgroundColor) {
                delete tagIconNode.attrs.style.backgroundColor;
              }

              return (
                <li className={'Asirem-TagTile ' + (tag.color() ? 'colored' : '')} style={{ '--tag-bg': tag.color() }}>
                  {unread > 0 && (
                    <div className="Asirem-TagTile-badge">
                      <span className="Asirem-TagTile-dot"></span>
                      {unread >= 20 ? '20+' : unread}
                    </div>
                  )}

                  <Link className="Asirem-TagTile-info" href={app.route.tag(tag)}>
                    <div className="Asirem-TagTile-icon">
                      {artworkUrl ? <img className="Asirem-TagTile-artwork" src={artworkUrl} alt="" /> : tagIconNode}
                    </div>
                    <div className="Asirem-TagTile-content">
                      <h3 className="Asirem-TagTile-name">{tag.name()}</h3>
                      <p className="Asirem-TagTile-description">{tag.description()}</p>
                      {children && children.length ? (
                        <div className="Asirem-TagTile-children">
                          {children.map((child) => [
                            <Link href={app.route.tag(child)} className="TagLabel">
                              {child.name()}
                            </Link>,
                            ' ',
                          ])}
                        </div>
                      ) : (
                        ''
                      )}
                      {lastPostedDiscussion ? (
                        <div className="Asirem-TagTile-lastPostedDiscussion">
                          <div className="Asirem-TagTile-lastPosterIcon">
                            {user?.avatarUrl?.() ? (
                              <span
                                className="Avatar Avatar--image"
                                style={{
                                  backgroundImage: `url(${user.avatarUrl()})`,
                                }}
                              />
                            ) : (
                              <span
                                className="Avatar Avatar--no-image"
                                style={{
                                  backgroundColor: user?.color?.(),
                                }}
                              >
                                {user?.displayName?.()?.[0]?.toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Title link: allow it to shrink so time can sit at the right */}
                          <Link
                            href={app.route.discussion(lastPostedDiscussion, lastPostedDiscussion.lastPostNumber())}
                            className="Asirem-TagTile-lastPostedDiscussion-link"
                          >
                            <span className="Asirem-TagTile-lastPostedDiscussion-title">{lastPostedDiscussion.title()}</span>
                          </Link>

                          {/* Time sits *outside* the link so it can be pushed to the far right */}
                          <time datetime={lastPostedDiscussion.lastPostedAt()}>{humanTime(lastPostedDiscussion.lastPostedAt())}</time>
                        </div>
                      ) : (
                        <span className="Asirem-TagTile-lastPostedDiscussion" />
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {cloud.length ? <div className="Asirem-TagCloud">{cloud.map((tag) => [tagLabel(tag, { link: true }), ' '])}</div> : ''}
        </div>
      </PageStructure>
    );
  }
}
