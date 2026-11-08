import Component from 'flarum/common/Component';
import Tooltip from 'flarum/common/components/Tooltip';
import formatReactionUsers from '../utils/formatReactionUsers';

export default class ReactionUsersTooltip extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.hovered = false;
    this.focused = false;
    this.requestId = 0;
    this.text = app.translator.trans('deltamichael-asirem.forum.reactions.loading');
    this.signature = this.reactionSignature();
  }

  reactionSignature() {
    const { post, reaction } = this.attrs;
    return `${post.reactionCounts()[reaction.id()]}:${post.userReaction()}`;
  }

  onbeforeupdate(vnode) {
    super.onbeforeupdate(vnode);
    const signature = this.reactionSignature();

    if (signature !== this.signature) {
      this.signature = signature;
      if (this.hovered || this.focused) this.loadUsers();
    }
  }

  onremove(vnode) {
    this.requestId++;
    super.onremove(vnode);
  }

  redraw() {
    const post = this.attrs.post;
    post._asiremReactionTooltipRevision = (post._asiremReactionTooltipRevision || 0) + 1;
    m.redraw();
  }

  loadUsers() {
    const { post, reaction } = this.attrs;
    const requestId = ++this.requestId;

    if (!post.discussion()?.canSeeReactions()) {
      this.text = app.translator.trans('deltamichael-asirem.forum.reactions.unavailable');
      return;
    }

    this.text = app.translator.trans('deltamichael-asirem.forum.reactions.loading');
    app.store
      .find(
        'post_reactions',
        {
          include: 'user',
          filter: { post: post.id(), reaction: reaction.id() },
          page: { limit: 11 },
        },
        undefined,
        { errorHandler: () => {} }
      )
      .then((reactions) => {
        if (requestId !== this.requestId) return;

        this.text = formatReactionUsers(
          reactions,
          (item) => app.store.getById('users', item.userId())?.displayName(),
          app.translator.trans('deltamichael-asirem.forum.reactions.no_named')
        );
        this.redraw();
      })
      .catch((error) => {
        if (requestId !== this.requestId) return;

        console.error('Unable to load reaction users', error);
        this.text = app.translator.trans('deltamichael-asirem.forum.reactions.error');
        this.redraw();
      });
  }

  activate(type) {
    const wasActive = this.hovered || this.focused;
    this[type] = true;
    if (!wasActive) this.loadUsers();
    this.redraw();
  }

  deactivate(type) {
    this[type] = false;
    this.redraw();
  }

  view() {
    const descriptionId = `asirem-reaction-users-${this.attrs.post.id()}-${this.attrs.reaction.id()}`;
    this.attrs.button.attrs['aria-describedby'] = descriptionId;

    return (
      <Tooltip text={this.text} tooltipVisible={this.hovered || this.focused} position="bottom">
        <span
          className="Asirem-ReactionUsersTooltip"
          onmouseenter={() => this.activate('hovered')}
          onmouseleave={() => this.deactivate('hovered')}
          onfocusin={() => this.activate('focused')}
          onfocusout={() => this.deactivate('focused')}
        >
          {this.attrs.button}
          <span id={descriptionId} className="sr-only" aria-live={this.focused ? 'polite' : 'off'}>
            {this.text}
          </span>
        </span>
      </Tooltip>
    );
  }
}
