<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

class AppointmentConflictException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('O profissional ou paciente já possui uma consulta nesse intervalo.');
    }
}
