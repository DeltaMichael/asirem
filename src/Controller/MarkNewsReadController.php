<?php

namespace Deltamichael\Asirem\Controller;

use Flarum\Discussion\Command\ReadDiscussion;
use Flarum\Discussion\Command\ReadDiscussionHandler;
use Flarum\Discussion\Discussion;
use Flarum\Discussion\DiscussionRepository;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Tag;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class MarkNewsReadController implements RequestHandlerInterface
{
    public function __construct(
        protected SettingsRepositoryInterface $settings,
        protected DiscussionRepository $discussions,
        protected ReadDiscussionHandler $reader
    ) {
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $actor = RequestUtil::getActor($request);
        $actor->assertRegistered();

        $tagId = $this->settings->get('deltamichael-asirem.news_tag');
        if (!is_string($tagId) || !preg_match('/\A[1-9][0-9]*\z/', trim($tagId))) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException();
        }

        $tag = Tag::whereVisibleTo($actor)->findOrFail(trim($tagId));
        $readIds = $this->discussions->getReadIdsQuery($actor);
        $query = Discussion::query()
            ->whereVisibleTo($actor)
            ->whereHas('tags', fn ($query) => $query->where('id', $tag->id))
            ->whereNotIn('discussions.id', $readIds)
            ->when($actor->marked_all_as_read_at, fn ($query) => $query->where('last_posted_at', '>', $actor->marked_all_as_read_at))
            ->orderBy('discussions.id');

        $read = [];
        foreach ($query->get(['discussions.id', 'discussions.last_post_number']) as $discussion) {
            $state = $this->reader->handle(new ReadDiscussion($discussion->id, $actor, $discussion->last_post_number));
            $read[] = [
                'id' => (string) $discussion->id,
                'lastReadPostNumber' => $state->last_read_post_number,
            ];
        }

        return new JsonResponse(['read' => $read]);
    }
}
