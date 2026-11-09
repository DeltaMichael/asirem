<?php

use Flarum\Database\Migration;

return Migration::addColumns('tags', [
    'asirem_hide_from_navigation' => ['boolean', 'default' => false],
]);
