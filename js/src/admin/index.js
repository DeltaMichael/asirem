import { extend, override } from 'flarum/common/extend';
import PermissionsPage from 'flarum/admin/components/PermissionsPage';
import PermissionGrid from 'flarum/admin/components/PermissionGrid';
import EditTagModal from 'ext:flarum/tags/admin/components/EditTagModal';
import TagArtworkControl from './components/TagArtworkControl';
import Stream from 'flarum/common/utils/Stream';

app.initializers.add(
  'deltamichael-asirem',
  (app) => {
    const settings = [
      ['event_title', 'text'],
      ['event_stream', 'url'],
      ['event_discussion', 'text'],
      ['event_channel', 'text'],
    ];

    settings.forEach(([setting, type], index) => {
      app.registry.for('deltamichael-asirem').registerSetting(
        {
          setting: `deltamichael-asirem.${setting}`,
          type,
          label: app.translator.trans(`deltamichael-asirem.admin.event.${setting}`),
          help: app.translator.trans(`deltamichael-asirem.admin.event.${setting}_help`),
        },
        100 - index
      );
    });

    app.registry.for('deltamichael-asirem').registerSetting(
      {
        setting: 'deltamichael-asirem.news_tag',
        type: 'text',
        label: app.translator.trans('deltamichael-asirem.admin.news.tag'),
        help: app.translator.trans('deltamichael-asirem.admin.news.tag_help'),
      },
      110
    );

    extend(EditTagModal.prototype, 'oninit', function () {
      this.asiremHideFromNavigation = Stream(Boolean(this.tag.attribute('asiremHideFromNavigation')));
    });

    extend(EditTagModal.prototype, 'submitData', function (data) {
      data.asiremHideFromNavigation = this.asiremHideFromNavigation();
    });

    extend(EditTagModal.prototype, 'fields', function (items) {
      items.add('asiremArtwork', <TagArtworkControl model={this.tag} />, 15);
      items.add(
        'asiremHideFromNavigation',
        <div className="Form-group">
          <label className="checkbox">
            <input type="checkbox" bidi={this.asiremHideFromNavigation} />
            {app.translator.trans('deltamichael-asirem.admin.news.hide_tag')}
          </label>
          <div className="helpText">{app.translator.trans('deltamichael-asirem.admin.news.hide_tag_help')}</div>
        </div>,
        9
      );
    });

    extend(PermissionsPage.prototype, 'content', function (vnode) {
      if (vnode && vnode[0] && vnode[0].children && vnode[0].children[1]) {
        vnode[0].children[1].attrs.className += ' Button--dashed';
      }
    });

    override(PermissionGrid.prototype, 'view', function (original, vnode) {
      return [<div className="PermissionsPage-permissions-overflow">{original(vnode)}</div>];
    });

    extend(PermissionGrid.prototype, ['oncreate', 'onupdate'], function (vnode) {
      $('.PermissionGrid-child .Button--text').removeClass('Button--text');
    });
  },
  -999999
);
