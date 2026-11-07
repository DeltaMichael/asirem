<?php

/*
 * This file is part of afrux/asirem.
 *
 * Copyright (c) 2021 Sami Ilyes Mazouz.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Deltamichael\Asirem;

use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\Tags\Api\Controller\ListTagsController;
use Flarum\Tags\Tag;
use Flarum\Discussion\DiscussionRepository;
use Flarum\Discussion\Discussion;

return [
    new \Afrux\ThemeBase\Extend\Init('deltamichael-asirem'),
    new \Afrux\ThemeBase\Extend\Footer,
    new \Afrux\ThemeBase\Extend\UploadableBanner,
    new \Afrux\ThemeBase\Extend\ExposeLaravelVersionToDashboard,
    (new \Afrux\ThemeBase\Extend\DashboardLayout)
        ->splitToNavAndContent()
        ->normalizeStatusWidgetStructure()
        ->normalizeAdminHeaderStructure()
        ->normalizeExtensionPageStructure()
        ->normalizeUserTable()
        ->addExtensionsPage(),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less')
        ->content(function (Document $document) {
            $document->layoutView = "deltamichael-asirem::frontend.admin";
        }),

    (new Extend\View)
        ->namespace("deltamichael-asirem", __DIR__."/views"),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\ApiSerializer(TagSerializer::class))
        ->hasOne('lastPostedDiscussion', DiscussionSerializer::class)
        ->attribute('asiremArtworkUrl', function (TagSerializer $serializer, Tag $tag) {
            $path = $tag->background_path;

            if (!$path) {
                return null;
            }

            if (preg_match('/\Aasirem-tag-[0-9]+-[a-z0-9]{16}\.png\z/', $path)) {
                return resolve(\Illuminate\Contracts\Filesystem\Factory::class)->disk('flarum-assets')->url($path);
            }

            return $path;
        })
        ->attribute('unreadCount', function (TagSerializer $serializer, Tag $tag) {
        $actor = $serializer->getActor();
        if (!$actor || !$actor->exists) {
            return 0;
        }

        $discussionRepository = resolve(DiscussionRepository::class);
        $readIdsQuery = $discussionRepository->getReadIdsQuery($actor);

        return Discussion::query()
            ->whereVisibleTo($actor)
            ->whereHas('tags', function ($q) use ($tag) {
                $q->where('id', $tag->id);
            })
            ->where(function ($q) use ($readIdsQuery, $actor) {
                $q->whereNotIn('id', $readIdsQuery)
                  ->where('last_posted_at', '>', $actor->marked_all_as_read_at ?: 0);
            })
            ->distinct()
            ->count('id');
    }),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->hasOne('lastPostedUser', UserSerializer::class),

    (new Extend\ApiController(ListTagsController::class))
        ->addInclude('lastPostedDiscussion.lastPostedUser'),

    (new Extend\Routes('api'))
        ->post('/asirem/tags/{id:[0-9]+}/artwork', 'deltamichael-asirem.tag-artwork.upload', Controller\TagArtworkController::class)
        ->delete('/asirem/tags/{id:[0-9]+}/artwork', 'deltamichael-asirem.tag-artwork.delete', Controller\TagArtworkController::class),

    (new Extend\Event())
        ->listen(\Flarum\Tags\Event\Deleting::class, function ($event) {
            $path = $event->tag->background_path;

            if ($path && preg_match('/\Aasirem-tag-'.preg_quote((string) $event->tag->id, '/').'-[a-z0-9]{16}\.png\z/', $path)) {
                $event->tag->afterDelete(function () use ($path) {
                    resolve(\Illuminate\Contracts\Filesystem\Factory::class)->disk('flarum-assets')->delete($path);
                });
            }
        }),

    (new Extend\ServiceProvider)
    ->register(Provider\ForumFrontendProvider::class),

    (new Extend\Routes('forum'))
        ->get('/signup', 'deltamichael-asirem.signup', Controller\SignupController::class)
        ->get('/start', 'deltamichael-asirem.start', Controller\SignupController::class),
];
