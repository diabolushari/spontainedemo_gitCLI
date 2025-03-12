<?php

namespace App\Http\Controllers\SubsetDocument;

use App\Http\Controllers\Controller;
use App\Services\SubsetDocumentGenerator\SubsetDocumentationGenerator;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetDocumentationController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(SubsetDocumentationGenerator $generator)
    {
        return $generator->generate();
    }
}
