# Repository Guidance

## Project

This package is a Flarum 1.8 theme extension. `extend.php` registers its forum and admin assets, view namespace, API extensions, service provider, and forum route. PHP extension code lives in `src/`; the frontend has separate admin and forum entry points under `js/src/`, with styles in `less/`, translations in `locale/`, and Blade views in `views/`.

## Development

- Keep changes scoped to the relevant Flarum surface and follow nearby conventions.
- Build frontend assets from `js/` with `npm run build`.
- Check frontend types from `js/` with `npm run check-typings`.
- Check frontend formatting from `js/` with `npm run format-check`.
- The repository does not define a PHP test command; do not assume one exists.
- Do not hand-edit generated frontend output when the source under `js/src/` or `less/` is the appropriate place to change.