<?php

use Flarum\Database\Migration;

return Migration::addColumns('tags', [
    'asirem_artwork_path' => ['string', 'length' => 255, 'nullable' => true],
]);
