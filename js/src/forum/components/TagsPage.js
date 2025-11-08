import IndexPage from 'flarum/components/IndexPage';
import Link from 'flarum/components/Link';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import listItems from 'flarum/helpers/listItems';
import humanTime from 'flarum/helpers/humanTime';

import tagIcon from 'flarum/tags/common/helpers/tagIcon';
import tagLabel from 'flarum/tags/common/helpers/tagLabel';
import sortTags from 'flarum/tags/common/utils/sortTags';

export default class TagsPage {

  oninit() {
    this.loading = true;
    app.store.find('tags', { include: 'lastPostedDiscussion,lastPostedDiscussion.lastPostedUser' })
      .then(tags => {
        this.tags = tags;
        this.loading = false;
        m.redraw();
      });
  }

  view() {
    if (this.loading) {
      return <LoadingIndicator />;
    }

    const pinned = this.tags.filter((tag) => tag.position() !== null).sort((a, b) => a.position() - b.position());
    const cloud = this.tags.filter((tag) => tag.position() === null);
    console.log(pinned);

    return (
      <div className="Asirem-TagsPage">
        {IndexPage.prototype.hero()} <div className="sideNavContainer container">
          <nav className="TagsPage-nav IndexPage-nav sideNav">
            <ul>{listItems(IndexPage.prototype.sidebarItems().toArray())}</ul>
          </nav>

          <div className="TagsPage-content sideNavOffset">
            <ul className="Asirem-TagTiles">
              {pinned.map((tag) => {
                const lastPostedDiscussion = tag.lastPostedDiscussion();
                const children = sortTags(tag.children() || []);
                const tagIconNode = tagIcon(tag, {}, { useColor: false });

                const lastPostNum = lastPostedDiscussion.lastPostNumber();
                const discussionId = lastPostedDiscussion.id();

                const tagSlug = tag.slug();
                const unread = tag.attribute('unreadCount');
                console.log(`${tag.slug()}: ${unread}`)
                const user = tag.lastPostedDiscussion().lastPostedUser(); if (tagIconNode.attrs.style && tagIconNode.attrs.style.backgroundColor) {
                  delete tagIconNode.attrs.style.backgroundColor;
                }

                return (
                  <li className={'Asirem-TagTile ' + (tag.color() ? 'colored' : '')} style={{ '--tag-bg': tag.color() }}>
                    <div className="Asirem-TagTile-badge">{unread > 0 && <span className="Asirem-TagTile-dot"></span>}{unread > 0 && (unread >= 20 ? '20+' : unread)}</div>

                    <Link className="Asirem-TagTile-info" href={app.route.tag(tag)}>
                      <div className="Asirem-TagTile-icon">{tagIconNode}</div>
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
                                {user.avatarUrl?.()
                                  ? (
                                    <span
                                      className="Avatar Avatar--image"
                                      style={{
                                        backgroundImage: `url(${user.avatarUrl?.()})`,
                                      }}
                                    />
                                  )
                                  : (
                                    <span
                                      className="Avatar Avatar--no-image"
                                      style={{
                                        backgroundColor: user.color?.(),
                                      }}
                                    >
                                      {user.displayName?.()?.[0]?.toUpperCase()}
                                    </span>
                                  )}
                              </div>

                              {/* Title link: allow it to shrink so time can sit at the right */}
                              <Link
                                href={app.route.discussion(lastPostedDiscussion, lastPostedDiscussion.lastPostNumber())}
                                className="Asirem-TagTile-lastPostedDiscussion-link"
                              >
                                <span className="Asirem-TagTile-lastPostedDiscussion-title">
                                  {lastPostedDiscussion.title()}
                                </span>
                              </Link>

                              {/* Time sits *outside* the link so it can be pushed to the far right */}
                              <time datetime={lastPostedDiscussion.lastPostedAt()}>
                                {humanTime(lastPostedDiscussion.lastPostedAt())}
                              </time>
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
        </div>
      </div>
    );
  }
}
