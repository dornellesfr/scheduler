<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

class AppointmentStateException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('A consulta não pode ser cancelada no status atual.');
    }
}
