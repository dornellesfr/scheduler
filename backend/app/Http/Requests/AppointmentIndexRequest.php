<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\AppointmentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AppointmentIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'uuid', Rule::in([config('app.demo_patient_id')])],
            'status' => ['sometimes', 'string', Rule::enum(AppointmentStatus::class)],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'O campo patient_id é obrigatório.',
            'patient_id.uuid' => 'O campo patient_id deve ser um UUID válido.',
            'patient_id.in' => 'O patient_id informado não corresponde ao paciente de demonstração.',
            'status.string' => 'O campo status deve ser um texto.',
            'status.enum' => 'O status informado é inválido.',
        ];
    }
}
