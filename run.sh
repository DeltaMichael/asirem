#!/bin/sh

cd ./js
npm run build
cd ../../../
composer require deltamichael/asirem 1.0.0-dev
composer dump-autoload
php flarum cache:clear
php flarum assets:publish
php -S localhost:8000 -t public
