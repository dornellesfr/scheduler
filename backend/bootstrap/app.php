<?php

use App\Exceptions\AppointmentConflictException;
use App\Exceptions\AppointmentStateException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($exception instanceof ValidationException) {
                return response()->json([
                    'message' => 'Os dados informados são inválidos.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            if ($exception instanceof ModelNotFoundException) {
                return response()->json(['message' => 'Recurso não encontrado.'], 404);
            }

            if ($exception instanceof HttpExceptionInterface) {
                $status = $exception->getStatusCode();

                if ($status === 404) {
                    return response()->json(['message' => 'Recurso não encontrado.'], 404);
                }
            }

            if ($exception instanceof AppointmentConflictException) {
                return response()->json(['message' => $exception->getMessage()], 409);
            }

            if ($exception instanceof AppointmentStateException) {
                return response()->json(['message' => $exception->getMessage()], 422);
            }

            report($exception);

            return response()->json(['message' => 'Ocorreu um erro interno.'], 500);
        });
    })->create();
