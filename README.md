<p align=center>
<img src="https://lh3.googleusercontent.com/-CDid7LgrH-M/YNn460wKUMI/AAAAAAAAFdY/ttAl_XT055QzWO9bEWKPbzWBPzhPUg1UwCLcBGAsYHQ/s16000/asirem.png" alt="asirem_logo">
<h1 align=center>Asirem</h1>
<p align=center>
<img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"> <a href="https://packagist.org/packages/afrux/asirem"><img alt="Latest Stable Version" src="https://img.shields.io/packagist/v/afrux/asirem.svg?style=flat-square"></a> <a href="https://packagist.org/packages/afrux/asirem"><img alt="Total Downloads" src="https://img.shields.io/packagist/dt/afrux/asirem.svg?style=flat-square"></a> <a href="https://www.buymeacoffee.com/sycho"><img alt="donate" src="https://img.shields.io/badge/donate-buy%20me%20a%20coffee-%23ffde39?style=flat-square"></a>
</p><p align=center>
The weird <a href="http://flarum.org">Flarum</a> theme made with potatoes as fuel, by <a href="https://github.com/afrux">Afrux</a>.
</p><p align=center>
<img width="50%" src="https://lh3.googleusercontent.com/-N4b-Oqq18To/YNno5ZmnmGI/AAAAAAAAFdA/49F0UzmZFecHv7baBQTtM6a_JO5n7s_dwCLcBGAsYHQ/s16000/Dark_Dashboard_Front.png" alt="asirem_theme_dashboard_screenshot_1"><img width="50%" src="https://lh3.googleusercontent.com/-edU2_P66Vlo/YNnpaU1yjVI/AAAAAAAAFdI/LzAB9qdLbGMGWFzyyovTow770r8b8Fw7wCLcBGAsYHQ/s16000/Light_Dashboard_Front.png" alt="asirem_theme_dashboard_screenshot_1">
<img src="https://lh3.googleusercontent.com/-qhKeJv4373Y/YNnqrVK6MlI/AAAAAAAAFdQ/pcRH7ZobQdMJYiIQ2HTyjJnZpXqUHMg6QCLcBGAsYHQ/s16000/Screenshot%2Bfrom%2B2021-06-27%2B22-57-32.png" alt="asirem_theme_forum_screenshot_1">
</p>

### Installation

Install with composer:

```sh
composer require afrux/asirem
```

The following are nice to install with the theme as well:

```sh
composer require sycho/flarum-advanced-extension-categories
```

When FriendsOfFlarum Reactions is enabled, hovering or focusing a reaction on
hover-capable desktop layouts shows up to 10 named users, subject to the
discussion's reaction visibility permission. Anonymous reactions do not have
names to display; phone and touch-only layouts retain the standard controls.

### Event hub

The event hub is available to registered users at `/event` and in the forum navigation. Configure
its title, stream iframe source URL, discussion ID or forum URL, and chat channel
ID or forum URL in the Asirem extension settings. The stream provider must allow
embedding on the forum's domain. The stream URL is visible to registered users
and should not contain credentials or secrets. The hub accepts HTTP or HTTPS iframe source URLs without
restricting the provider. The player sends the forum origin to cross-origin
providers when the browser permits it, as required by some embedded players.

The desktop page shows a discussion preview linking to the full discussion.
Phones show only the player and chat. Chat requires the `ramon/chat` extension,
an enabled account, and permission to access the selected channel; discussion
visibility follows the forum's normal permissions.

### News feed and tag navigation

Set **News feed tag ID** in the Asirem settings to the numeric ID of a tag.
You can find it in the tag's API response at `/api/tags` (the `id` field).
The feed appears at `/news` and in forum navigation, newest discussions first.
Leave the setting blank to remove the navigation link.
News cards use the carousel's default image when the first post has no image or
its first image is an emoji.
Super-sticky, tag-sticky and sticky discussions appear first when the respective
extensions are enabled; other discussions are ordered by creation date. Signed-in
users see a header badge counting unread discussions in the selected tag. The
count refreshes periodically and when returning to the forum. **Mark news as
read** marks all currently visible discussions in that tag as read, including
those not yet loaded on the page; it does not mark other discussions as read.

Each tag has an independent **Hide from tag navigation** checkbox in its edit
dialog. It hides the tag from the tag page and sidebar, including children of a
hidden parent. This is presentation only: it does not restrict access, remove
discussion labels or tag-picker choices, hide discussions from All Discussions,
or disable direct tag URLs. Normal tag and discussion permissions still apply.

### Updating

```sh
composer update afrux/asirem --with-dependencies
php flarum migrate
php flarum cache:clear
```

### Links

- [Packagist](https://packagist.org/packages/afrux/asirem)
- [GitHub](https://github.com/afrux/asirem)
- [Discuss](https://discuss.flarum.org/d/27939-asirem-theme)
