<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'professional' => new ProfessionalResource($this->whenLoaded('professional')),
            'specialty' => new SpecialtyResource($this->professional?->specialty),
            'scheduled_at' => $this->scheduled_at?->utc()->toISOString(),
            'ends_at' => $this->ends_at?->utc()->toISOString(),
            'status' => $this->status->value,
            'observations' => $this->observations,
        ];
    }
}
