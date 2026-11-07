import Component from 'flarum/common/Component';
import IndexSidebar from 'flarum/forum/components/IndexSidebar';
import PageStructure from 'flarum/forum/components/PageStructure';
import WelcomeHero from 'flarum/forum/components/WelcomeHero';
import Link from 'flarum/common/components/Link';

export default class StartPage extends Component {
  view() {
    const isLoggedIn = Boolean(app.session.user);

    return (
      <PageStructure className="Asirem-StartPage" hero={() => <WelcomeHero />} sidebar={() => <IndexSidebar />}>
        <main className="Asirem-StartPage-content">
          <header className="Asirem-StartPage-intro">
            <p className="Asirem-StartPage-eyebrow">{app.translator.trans('deltamichael-asirem.forum.start.eyebrow')}</p>
            <h2 className="Asirem-StartPage-title">{app.translator.trans('deltamichael-asirem.forum.start.title')}</h2>
            <p className="Asirem-StartPage-description">{app.translator.trans('deltamichael-asirem.forum.start.description')}</p>
            <div className="Asirem-StartPage-actions">
              <Link href={app.route(isLoggedIn ? 'index' : 'signup')} className="Button Button--primary">
                {app.translator.trans(
                  isLoggedIn ? 'deltamichael-asirem.forum.start.browse_discussions' : 'deltamichael-asirem.forum.start.create_account'
                )}
              </Link>
              <Link className="Button" href="/tags">
                {app.translator.trans('deltamichael-asirem.forum.start.browse_tags')}
              </Link>
            </div>
          </header>

          <ol className="Asirem-StartPage-steps">
            <li className="Asirem-StartPage-step">
              <span className="Asirem-StartPage-stepNumber" aria-hidden="true">
                01
              </span>
              <h3>{app.translator.trans('deltamichael-asirem.forum.start.rules_title')}</h3>
              <p>{app.translator.trans('deltamichael-asirem.forum.start.rules_description')}</p>
              <Link href="/t/rules" className="Asirem-StartPage-stepLink">
                {app.translator.trans('deltamichael-asirem.forum.start.rules_link')}
              </Link>
            </li>
            <li className="Asirem-StartPage-step">
              <span className="Asirem-StartPage-stepNumber" aria-hidden="true">
                02
              </span>
              <h3>{app.translator.trans('deltamichael-asirem.forum.start.tags_title')}</h3>
              <p>{app.translator.trans('deltamichael-asirem.forum.start.tags_description')}</p>
              <Link href="/tags" className="Asirem-StartPage-stepLink">
                {app.translator.trans('deltamichael-asirem.forum.start.tags_link')}
              </Link>
            </li>
            <li className="Asirem-StartPage-step">
              <span className="Asirem-StartPage-stepNumber" aria-hidden="true">
                03
              </span>
              <h3>{app.translator.trans('deltamichael-asirem.forum.start.conversations_title')}</h3>
              <p>{app.translator.trans('deltamichael-asirem.forum.start.conversations_description')}</p>
              <Link href={app.route('index')} className="Asirem-StartPage-stepLink">
                {app.translator.trans('deltamichael-asirem.forum.start.conversations_link')}
              </Link>
            </li>
          </ol>
        </main>
      </PageStructure>
    );
  }
}
