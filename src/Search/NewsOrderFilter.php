<?php

namespace Deltamichael\Asirem\Search;

use Flarum\Extension\ExtensionManager;
use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\Search\ValidateFilterTrait;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class NewsOrderFilter implements FilterInterface
{
    use ValidateFilterTrait;

    public function __construct(protected ExtensionManager $extensions)
    {
    }

    public function getFilterKey(): string
    {
        return 'asiremNews';
    }

    public function filter(SearchState $state, string|array $value, bool $negate): void
    {
        $tagId = $this->asInt($value);
        $query = $state->getQuery();

        if ($this->extensions->isEnabled('huseyinfiliz-stickiest')) {
            $query->leftJoin('discussion_sticky_tag as asirem_news_sticky', function ($join) use ($tagId) {
                $join->on('discussions.id', '=', 'asirem_news_sticky.discussion_id')
                    ->where('asirem_news_sticky.tag_id', '=', $tagId);
            });
            $query->orderByDesc('discussions.is_stickiest')->orderByDesc('asirem_news_sticky.tag_id');
        }

        if ($this->extensions->isEnabled('flarum-sticky')) {
            $query->orderByDesc('discussions.is_sticky');
        }
    }
}
