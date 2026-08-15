<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Specialty extends Model
{
    use HasUuids;

    protected $fillable = ['id', 'name'];

    public function professionals(): HasMany
    {
        return $this->hasMany(Professional::class);
    }
}
