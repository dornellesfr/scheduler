<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'uuid', Rule::exists('patients', 'id')->where('id', config('app.demo_patient_id'))],
            'professional_id' => ['required', 'uuid', 'exists:professionals,id'],
            'scheduled_at' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! is_string($value) || ! preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,6})?)?(?:Z|[+-]\d{2}:\d{2})$/D', $value)) {
                        $fail('O campo scheduled_at deve estar em formato ISO 8601 com fuso horário explícito.');

                        return;
                    }

                    try {
                        $scheduledAt = CarbonImmutable::parse($value);
                    } catch (\Throwable) {
                        $fail('O campo scheduled_at deve conter uma data válida.');

                        return;
                    }

                    if ($scheduledAt->lessThanOrEqualTo(CarbonImmutable::now())) {
                        $fail('O campo scheduled_at deve representar uma data futura.');
                    }
                },
            ],
            'observations' => ['sometimes', 'nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'O campo patient_id é obrigatório.',
            'patient_id.uuid' => 'O campo patient_id deve ser um UUID válido.',
            'patient_id.exists' => 'O patient_id informado não corresponde ao paciente de demonstração.',
            'professional_id.required' => 'O campo professional_id é obrigatório.',
            'professional_id.uuid' => 'O campo professional_id deve ser um UUID válido.',
            'professional_id.exists' => 'O profissional informado não foi encontrado.',
            'scheduled_at.required' => 'O campo scheduled_at é obrigatório.',
            'scheduled_at.string' => 'O campo scheduled_at deve ser um texto.',
            'observations.string' => 'O campo observations deve ser um texto.',
        ];
    }
}
