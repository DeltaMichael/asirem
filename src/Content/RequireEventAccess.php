<?php

namespace Deltamichael\Asirem\Content;

use Flarum\Frontend\Document;
use Flarum\Http\Exception\RouteNotFoundException;
use Flarum\Http\RequestUtil;
use Psr\Http\Message\ServerRequestInterface;

class RequireEventAccess
{
    public function __invoke(Document $document, ServerRequestInterface $request): void
    {
        if (RequestUtil::getActor($request)->isGuest()) {
            throw new RouteNotFoundException();
        }
    }
}
