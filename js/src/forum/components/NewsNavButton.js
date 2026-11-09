import Component from 'flarum/common/Component';
import Icon from 'flarum/common/components/Icon';
import Link from 'flarum/common/components/Link';
import extractText from 'flarum/common/utils/extractText';
import newsUnread from '../states/newsUnread';

export default class NewsNavButton extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.refresh = () => {
      if (!document.hidden) newsUnread.refresh();
    };
    this.refresh();
    this.timer = window.setInterval(this.refresh, 60000);
    document.addEventListener('visibilitychange', this.refresh);
    window.addEventListener('focus', this.refresh);
  }

  onremove(vnode) {
    super.onremove(vnode);
    window.clearInterval(this.timer);
    document.removeEventListener('visibilitychange', this.refresh);
    window.removeEventListener('focus', this.refresh);
  }

  view() {
    const label = extractText(
      app.translator.trans(newsUnread.error ? 'deltamichael-asirem.forum.news.unread_error' : 'deltamichael-asirem.forum.news.nav')
    );
    const count = newsUnread.count;
    const accessibleLabel = count > 0 ? extractText(app.translator.trans('deltamichael-asirem.forum.news.unread_count', { count })) : label;
    const digits = count > 99 ? '99+' : String(count);

    return (
      <Link
        className="Button Button--flat hasIcon Asirem-NewsNavButton"
        href={app.route('news')}
        title={accessibleLabel}
        aria-label={accessibleLabel}
      >
        <Icon name="fas fa-newspaper" className="Button-icon" />
        {count > 0 && (
          <span className="Bubble HeaderDropdownBubble" data-digits={digits.length} aria-hidden="true">
            {digits}
          </span>
        )}
        {newsUnread.error && (
          <span className="Bubble HeaderDropdownBubble" aria-hidden="true">
            !
          </span>
        )}
        <span className="Button-label">
          <span className="Button-labelText">{label}</span>
        </span>
      </Link>
    );
  }
}
