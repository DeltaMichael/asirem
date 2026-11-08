<?php

namespace Deltamichael\Asirem\Content;

use Flarum\Tags\Content\Tags as FlarumTags;
use Psr\Http\Message\ServerRequestInterface as Request;

class Tags extends FlarumTags
{
    protected function getTagsDocument(Request $request): array
    {
        return json_decode(
            $this->api
                ->withoutErrorHandling()
                ->withParentRequest($request)
                ->withQueryParams([
                    'include' => 'children,lastPostedDiscussion,lastPostedUser,parent',
                ])
                ->get('/tags')
                ->getBody(),
            true
        );
    }
}
