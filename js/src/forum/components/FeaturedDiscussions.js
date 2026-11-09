import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import humanTime from 'flarum/common/helpers/humanTime';
import { DEFAULT_PREVIEW_IMAGE, getFirstPostImages } from '../utils/previewImages';

export function getSuperStickyDiscussions(discussions, limit = 20) {
  return discussions
    .filter((discussion) => typeof discussion.isStickiest === 'function' && discussion.isStickiest())
    .slice(0, limit);
}

export default class FeaturedDiscussions extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.activeIndex = 0;
    this.isPaused = false;
    this.isAutoScrolling = false;
    this.autoplayTimer = null;
    this.resumeTimer = null;
    this.autoScrollTimer = null;
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    this.viewport = vnode.dom.querySelector('.Asirem-FeaturedDiscussions-viewport');

    if (this.attrs.discussions.length > 1) {
      this.autoplayTimer = window.setInterval(() => {
        if (!this.isPaused) {
          this.goToSlide(this.activeIndex + 1, true);
        }
      }, 5000);
    }
  }

  onremove(vnode) {
    window.clearInterval(this.autoplayTimer);
    window.clearTimeout(this.resumeTimer);
    window.clearTimeout(this.autoScrollTimer);
    super.onremove(vnode);
  }

  goToSlide(index, automatic = false) {
    const count = this.attrs.discussions.length;

    if (!count) return;

    this.activeIndex = ((index % count) + count) % count;
    this.isAutoScrolling = automatic;

    const card = this.viewport?.querySelectorAll('.Asirem-FeaturedDiscussions-card')[this.activeIndex];

    if (card && this.viewport) {
      const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      this.viewport.scrollTo({
        left: card.offsetLeft,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }

    window.clearTimeout(this.autoScrollTimer);
    this.autoScrollTimer = window.setTimeout(() => {
      this.isAutoScrolling = false;
    }, 700);

    m.redraw();
  }

  pauseAutoplay() {
    this.isPaused = true;
    window.clearTimeout(this.resumeTimer);
  }

  resumeAutoplay(delay = 0) {
    window.clearTimeout(this.resumeTimer);

    if (delay) {
      this.isPaused = true;
      this.resumeTimer = window.setTimeout(() => {
        this.isPaused = false;
      }, delay);
    } else {
      this.isPaused = false;
    }
  }

  onScroll(event) {
    const viewport = event.currentTarget;
    const cards = Array.from(viewport.querySelectorAll('.Asirem-FeaturedDiscussions-card'));

    if (!cards.length) return;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - viewport.scrollLeft);

      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    if (closestIndex !== this.activeIndex) {
      this.activeIndex = closestIndex;
      m.redraw();
    }

    if (!this.isAutoScrolling) {
      this.resumeAutoplay(2500);
    }
  }

  view() {
    const discussions = this.attrs.discussions;
    const slideIndex = Math.min(this.activeIndex, discussions.length - 1);

    if (slideIndex !== this.activeIndex) {
      this.activeIndex = slideIndex;
    }

    return (
      <section
        className="Asirem-FeaturedDiscussions"
        aria-labelledby="Asirem-FeaturedDiscussions-title"
        onpointerenter={(event) => event.pointerType === 'mouse' && this.pauseAutoplay()}
        onpointerleave={(event) => event.pointerType === 'mouse' && this.resumeAutoplay()}
        onfocusin={() => this.pauseAutoplay()}
        onfocusout={(event) => !event.currentTarget.contains(event.relatedTarget) && this.resumeAutoplay()}
      >
        <header className="Asirem-FeaturedDiscussions-header">
          <div>
            <h2 id="Asirem-FeaturedDiscussions-title">
              {app.translator.trans('deltamichael-asirem.forum.featured.title')}
            </h2>
            <p>{app.translator.trans('deltamichael-asirem.forum.featured.description')}</p>
          </div>
          {discussions.length > 1 && (
            <div className="Asirem-FeaturedDiscussions-controls">
              <span className="Asirem-FeaturedDiscussions-counter">
                {app.translator.trans('deltamichael-asirem.forum.featured.counter', {
                  current: slideIndex + 1,
                  total: discussions.length,
                })}
              </span>
              <button
                type="button"
                className="Button Button--icon Asirem-FeaturedDiscussions-control"
                aria-label={app.translator.trans('deltamichael-asirem.forum.featured.previous')}
                title={app.translator.trans('deltamichael-asirem.forum.featured.previous')}
                onclick={() => this.goToSlide(slideIndex - 1)}
              >
                <i className="icon fas fa-chevron-left" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                className="Button Button--icon Asirem-FeaturedDiscussions-control"
                aria-label={app.translator.trans('deltamichael-asirem.forum.featured.next')}
                title={app.translator.trans('deltamichael-asirem.forum.featured.next')}
                onclick={() => this.goToSlide(slideIndex + 1)}
              >
                <i className="icon fas fa-chevron-right" aria-hidden="true"></i>
              </button>
            </div>
          )}
          <Link href={app.route('index')} className="Asirem-FeaturedDiscussions-all">
            {app.translator.trans('deltamichael-asirem.forum.featured.view_all')}
          </Link>
        </header>

        <div
          className="Asirem-FeaturedDiscussions-viewport"
          aria-live="polite"
          oncreate={(vnode) => {
            this.viewport = vnode.dom;
          }}
          onscroll={(event) => this.onScroll(event)}
          onpointerdown={(event) => event.pointerType === 'touch' && this.pauseAutoplay()}
          onpointerup={(event) => event.pointerType === 'touch' && this.resumeAutoplay(2500)}
          onpointercancel={(event) => event.pointerType === 'touch' && this.resumeAutoplay(1000)}
        >
          {discussions.map((discussion, index) => this.viewCard(discussion, index))}
        </div>
      </section>
    );
  }

  viewCard(discussion, index) {
    const tag = discussion.tags?.()?.[0];
    const images = getFirstPostImages(discussion);
    const imageUrl = images[0] || DEFAULT_PREVIEW_IMAGE;
    const lastPostedAt = discussion.lastPostedAt();
    const replyCount = discussion.commentCount();

    return (
      <Link
        key={discussion.id()}
        href={app.route.discussion(discussion)}
        className="Asirem-FeaturedDiscussions-card"
        aria-current={index === this.activeIndex ? 'true' : undefined}
        style={{ '--featured-color': tag?.color?.() || 'var(--primary-color)' }}
      >
        <div className={`Asirem-FeaturedDiscussions-media${images.length ? '' : ' Asirem-FeaturedDiscussions-media--default'}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={images.length ? discussion.title() : app.forum.attribute('title')} />
          ) : (
            <span className="Asirem-FeaturedDiscussions-defaultMark" aria-hidden="true">BWS</span>
          )}
          {images.length > 1 && (
            <span className="Asirem-FeaturedDiscussions-photoCount">
              {images.length} {app.translator.trans('deltamichael-asirem.forum.featured.photos')}
            </span>
          )}
        </div>
        <div className="Asirem-FeaturedDiscussions-copy">
          {tag && <span className="Asirem-FeaturedDiscussions-tag">{tag.name()}</span>}
          <h3>{discussion.title()}</h3>
          <p className="Asirem-FeaturedDiscussions-excerpt">{discussion.firstPost()?.contentPlain?.()}</p>
          <div className="Asirem-FeaturedDiscussions-meta">
            <span>
              {replyCount}{' '}
              {app.translator.trans(
                `deltamichael-asirem.forum.featured.${replyCount === 1 ? 'one_reply' : 'many_replies'}`
              )}
            </span>
            {lastPostedAt && <time datetime={lastPostedAt}>{humanTime(lastPostedAt)}</time>}
          </div>
        </div>
      </Link>
    );
  }
}