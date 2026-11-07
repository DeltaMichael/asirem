<?php

namespace Deltamichael\Asirem\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Tags\Tag;
use Flarum\User\AvatarValidator;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use RuntimeException;
use Tobscure\JsonApi\Document;

class TagArtworkController extends AbstractShowController
{
    public $serializer = TagSerializer::class;

    protected $filesystem;
    protected $validator;
    protected $images;

    public function __construct(Factory $filesystem, AvatarValidator $validator, ImageManager $images)
    {
        $this->filesystem = $filesystem->disk('flarum-assets');
        $this->validator = $validator;
        $this->images = $images;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        RequestUtil::getActor($request)->assertAdmin();

        $tag = Tag::findOrFail(Arr::get($request->getQueryParams(), 'id'));
        $previousPath = $tag->background_path;
        $newPath = null;

        if ($request->getMethod() === 'POST') {
            $file = Arr::get($request->getUploadedFiles(), 'image');

            if (!$file instanceof UploadedFileInterface) {
                throw new ValidationException(['image' => 'An image file is required.']);
            }

            $this->validator->assertValid(['avatar' => $file]);
            $image = $this->images->make($file->getStream()->getMetadata('uri'));

            if (extension_loaded('exif')) {
                $image->orientate();
            }

            $newPath = 'asirem-tag-'.$tag->id.'-'.Str::lower(Str::random(16)).'.png';

            if (!$this->filesystem->put($newPath, (string) $image->fit(512, 512)->encode('png'))) {
                throw new RuntimeException('Unable to store tag artwork.');
            }
        }

        $tag->background_path = $newPath;

        try {
            $tag->save();
        } catch (\Throwable $exception) {
            if ($newPath) {
                $this->filesystem->delete($newPath);
            }
            throw $exception;
        }

        if ($previousPath && preg_match('/\Aasirem-tag-'.preg_quote((string) $tag->id, '/').'-[a-z0-9]{16}\.png\z/', $previousPath)) {
            $this->filesystem->delete($previousPath);
        }

        return $tag;
    }
}