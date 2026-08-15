<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ProfessionalIndexRequest;
use App\Http\Resources\ProfessionalResource;
use App\Models\Professional;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProfessionalController extends Controller
{
    public function index(ProfessionalIndexRequest $request): AnonymousResourceCollection
    {
        return ProfessionalResource::collection(
            Professional::query()
                ->where('specialty_id', $request->validated('specialty_id'))
                ->orderBy('name')
                ->get(['id', 'name', 'specialty_id']),
        );
    }
}
