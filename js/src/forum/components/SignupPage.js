import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';

export default class SignupPage extends Component {
    oninit(vnode) {
        super.oninit(vnode);
        this.username = Stream('');
        this.nickname = Stream('');
        this.email = Stream('');
        this.password = Stream('');
        this.loading = false;
        this.success = false;
        this.error = null;
    }

    view() {
        return (
            <div className="LoginPage">
                <div className="LoginPage-container">
                    <h2>Регистрация</h2>

                    {this.error && (
                        <div className="Alert Alert--error">
                            <span>{this.error}</span>
                        </div>
                    )}

                    <form onsubmit={(e) => { e.preventDefault(); this.onsubmit(); }}>
                        <div className="Form-group">
                            <input
                                className="FormControl"
                                type="text"
                                placeholder="Потребителско име"
                                oninput={(e) => this.username(e.target.value)}
                                disabled={this.loading}
                            />
                        </div>

                        <div className="Form-group">
                            <input
                                className="FormControl"
                                type="text"
                                placeholder="Дисплей име"
                                oninput={(e) => this.nickname(e.target.value)}
                                disabled={this.loading}
                            />
                        </div>

                        <div className="Form-group">
                            <input
                                className="FormControl"
                                type="email"
                                placeholder="E-mail"
                                oninput={(e) => this.email(e.target.value)}
                                disabled={this.loading}
                            />
                        </div>

                        <div className="Form-group">
                            <input
                                className="FormControl"
                                name="password"
                                type="password"
                                autocomplete="new-password"
                                placeholder="Парола"
                                oninput={(e) => this.password(e.target.value)}
                                disabled={this.loading}
                            />
                        </div>

                        <Button
                            className="Button Button--primary Button--block"
                            loading={this.loading}
                            type="submit"
                        >
                            Регистрация
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    onsubmit() {
        this.loading = true;
        this.error = null;
        m.redraw();

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/users',
            body: {
                data: {
                    type: 'users',
                    attributes: {
                        username: this.username(),
                        nickname: this.nickname() ? this.nickname : this.username,
                        email: this.email(),
                        password: this.password(),
                    }
                }
            }
        })
        .then(() => {
            return app.session.login({
                identification: this.email(),
                password: this.password(),
            }); 
        })
        .then(() => {
            window.location.href = '/';
        }).catch((e) => {
            this.loading = false;
            this.error = e.response?.errors?.[0]?.detail || 'Регистрацията не беше успешна ;(';
            m.redraw();
        });
    }
}