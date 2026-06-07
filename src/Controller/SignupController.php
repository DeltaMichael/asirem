<?php
namespace Deltamichael\Asirem\Controller;

use Flarum\Http\Controller\AbstractHtmlController;
use Flarum\Frontend\Frontend;
use Psr\Http\Message\ServerRequestInterface as Request;

class SignupController extends AbstractHtmlController
{
    protected function render(Request $request)
    {
        $frontend = app('flarum.frontend.forum');
        return $frontend->document($request);
    }
}