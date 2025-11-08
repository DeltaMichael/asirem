<?php

/*
 * This file is part of afrux/asirem.
 *
 * Copyright (c) 2021 Sami Ilyes Mazouz.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Afrux\Asirem;

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
];
