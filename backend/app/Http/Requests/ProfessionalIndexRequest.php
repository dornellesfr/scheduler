<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfessionalIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'specialty_id' => ['required', 'uuid', 'exists:specialties,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'specialty_id.required' => 'O campo specialty_id é obrigatório.',
            'specialty_id.uuid' => 'O campo specialty_id deve ser um UUID válido.',
            'specialty_id.exists' => 'A especialidade informada não foi encontrada.',
        ];
    }
}
