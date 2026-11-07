<?php

namespace Deltamichael\Asirem;

use Flarum\Api\Context;
use Flarum\Api\Schema;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\DiscussionRepository;
use Flarum\Extend;
use Flarum\Tags\Api\Resource\TagResource;
use Flarum\Tags\Tag;

return [
    (new Extend\Frontend('forum'))
        ->removeRoute('tags')
        ->route('/tags', 'tags', Content\Tags::class)
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less')
        ->route('/signup', 'signup')
        ->route('/start', 'start'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\ApiResource(TagResource::class))
        ->fields(function () {
            return [
                Schema\Str::make('asiremArtworkUrl')
                    ->get(function (Tag $tag) {
                        $path = $tag->background_path;

                        if (!$path) {
                            return null;
                        }

                        if (preg_match('/\Aasirem-tag-[0-9]+-[a-z0-9]{16}\.png\z/', $path)) {
                            return resolve(\Illuminate\Contracts\Filesystem\Factory::class)->disk('flarum-assets')->url($path);
                        }

                        return $path;
                    }),
                Schema\Integer::make('unreadCount')
                    ->get(function (Tag $tag, Context $context) {
                        $actor = $context->getActor();

                        if (!$actor->exists) {
                            return 0;
                        }

                        $discussionRepository = resolve(DiscussionRepository::class);
                        $readIdsQuery = $discussionRepository->getReadIdsQuery($actor);

                        return Discussion::query()
                            ->whereVisibleTo($actor)
                            ->whereHas('tags', function ($query) use ($tag) {
                                $query->where('id', $tag->id);
                            })
                            ->where(function ($query) use ($readIdsQuery, $actor) {
                                $query->whereNotIn('id', $readIdsQuery)
                                    ->where('last_posted_at', '>', $actor->marked_all_as_read_at ?: 0);
                            })
                            ->distinct()
                            ->count('id');
                    }),
                        Schema\Relationship\ToOne::make('lastPostedUser')
                            ->type('users')
                            ->includable(),
            ];
        }),

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
];