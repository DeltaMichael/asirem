import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';

export default class TagArtworkControl extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
    this.error = false;
  }

  request(method, body) {
    this.loading = true;
    this.error = false;

    const options = {
      method,
      url: `${app.forum.attribute('apiUrl')}/asirem/tags/${encodeURIComponent(this.attrs.model.id())}/artwork`,
    };

    if (body) {
      options.body = body;
      options.serialize = (value) => value;
    }

    app.request(options).then(
      (payload) => {
        app.store.pushPayload(payload);
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

  upload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || this.loading) return;

    const body = new FormData();
    body.append('image', file);
    this.request('POST', body);
  }

  view() {
    const tag = this.attrs.model;
    const imageUrl = tag.attribute('asiremArtworkUrl');

    return (
      <div className="Form-group Asirem-TagArtworkControl">
        <label>{app.translator.trans('deltamichael-asirem.admin.tag_artwork.label')}</label>
        {!tag.exists ? (
          <div className="helpText">{app.translator.trans('deltamichael-asirem.admin.tag_artwork.save_first')}</div>
        ) : (
          <div>
            <div className="helpText">{app.translator.trans('deltamichael-asirem.admin.tag_artwork.help')}</div>
            {imageUrl && <img className="Asirem-TagArtworkControl-preview" src={imageUrl} alt="" />}
            <input
              className="FormControl"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/bmp"
              aria-label={app.translator.trans('deltamichael-asirem.admin.tag_artwork.upload')}
              disabled={this.loading}
              onchange={(event) => this.upload(event)}
            />
            {imageUrl && (
              <Button className="Button" disabled={this.loading} onclick={() => this.request('DELETE')}>
                {app.translator.trans('deltamichael-asirem.admin.tag_artwork.remove')}
              </Button>
            )}
            {this.loading && <div role="status">{app.translator.trans('deltamichael-asirem.admin.tag_artwork.loading')}</div>}
            {this.error && <div role="alert">{app.translator.trans('deltamichael-asirem.admin.tag_artwork.error')}</div>}
          </div>
        )}
      </div>
    );
  }
}
