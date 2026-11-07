<?php

namespace Deltamichael\Asirem\Controller;

use Flarum\Foundation\ValidationException;
use Flarum\Http\RequestUtil;
use Flarum\Tags\Tag;
use Flarum\User\AvatarValidator;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
use Psr\Http\Server\RequestHandlerInterface;
use RuntimeException;

class TagArtworkController implements RequestHandlerInterface
{
    protected $filesystem;
    protected $validator;
    protected $images;

    public function __construct(Factory $filesystem, AvatarValidator $validator, ImageManager $images)
    {
        $this->filesystem = $filesystem->disk('flarum-assets');
        $this->validator = $validator;
        $this->images = $images;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        RequestUtil::getActor($request)->assertAdmin();

        $tag = Tag::findOrFail(Arr::get($request->getQueryParams(), 'id'));
        $previousPath = $tag->asirem_artwork_path;
        $newPath = null;

        if ($request->getMethod() === 'POST') {
            $file = Arr::get($request->getUploadedFiles(), 'image');

            if (!$file instanceof UploadedFileInterface) {
                throw new ValidationException(['image' => 'An image file is required.']);
            }

            $this->validator->assertImageValid('image', $file);
            $image = $this->images->read($file->getStream()->getMetadata('uri'));

            if (extension_loaded('exif')) {
                $image->orient();
            }

            $newPath = 'asirem-tag-'.$tag->id.'-'.Str::lower(Str::random(16)).'.png';

            $image->cover(512, 512);

            if (!$this->filesystem->put($newPath, $image->toPng())) {
                throw new RuntimeException('Unable to store tag artwork.');
            }
        }

        $tag->asirem_artwork_path = $newPath;

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

        $artworkUrl = $tag->asirem_artwork_path;

        if ($artworkUrl && preg_match('/\Aasirem-tag-[0-9]+-[a-z0-9]{16}\.png\z/', $artworkUrl)) {
            $artworkUrl = $this->filesystem->url($artworkUrl);
        }

        return new JsonResponse([
            'data' => [
                'type' => 'tags',
                'id' => (string) $tag->id,
                'attributes' => [
                    'asiremArtworkUrl' => $artworkUrl,
                ],
            ],
        ], 200, ['Content-Type' => 'application/vnd.api+json']);
    }
}