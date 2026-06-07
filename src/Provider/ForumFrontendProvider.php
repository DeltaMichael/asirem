<?php
namespace Deltamichael\Asirem\Provider;

use Illuminate\Support\ServiceProvider;
use Flarum\Frontend\Frontend;
use Deltamichael\Asirem\Controller\SignupController;

class ForumFrontendProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->when(SignupController::class)
            ->needs(Frontend::class)
            ->give(fn($c) => $c->make('flarum.frontend.forum'));
    }
}