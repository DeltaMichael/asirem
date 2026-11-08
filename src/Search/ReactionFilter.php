<?php

namespace Deltamichael\Asirem\Search;

use Flarum\Search\Database\DatabaseSearchState;
use Flarum\Search\Filter\FilterInterface;
use Flarum\Search\SearchState;
use Flarum\Search\ValidateFilterTrait;

/**
 * @implements FilterInterface<DatabaseSearchState>
 */
class ReactionFilter implements FilterInterface
{
    use ValidateFilterTrait;

    public function getFilterKey(): string
    {
        return 'reaction';
    }

    public function filter(SearchState $state, string|array $value, bool $negate): void
    {
        $state->getQuery()->where('reaction_id', $negate ? '!=' : '=', $this->asInt($value));
    }
}
