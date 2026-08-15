<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends Model
{
    use HasUuids;

    protected $fillable = ['id', 'name'];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}
