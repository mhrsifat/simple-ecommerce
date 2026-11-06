<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * @mixin Model
 *
 * @property string $name
 * @property string $slug
 */
trait HasUniqueSlug
{
    /**
     * Boot the unique slug concern.
     */
    public static function bootHasUniqueSlug(): void
    {
        static::creating(function (self $model): void {
            if (empty($model->slug) && ! empty($model->name)) {
                $model->slug = $model->generateUniqueSlug((string) $model->name);
            }
        });

        static::updating(function (self $model): void {
            if ($model->isDirty('name') && ! empty($model->name)) {
                $model->slug = $model->generateUniqueSlug((string) $model->name, $model->getKey());
            }
        });
    }

    /**
     * Generate a unique slug for the model.
     */
    public function generateUniqueSlug(string $name, int|string|null $ignoreId = null): string
    {
        $baseSlug = Str::slug($name) ?: 'item';
        $slug = $baseSlug;
        $counter = 1;

        while ($this->slugExists($slug, $ignoreId)) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if the generated slug already exists.
     */
    protected function slugExists(string $slug, int|string|null $ignoreId = null): bool
    {
        $query = static::query()->where('slug', $slug);

        if ($ignoreId !== null) {
            $query->where($this->getKeyName(), '!=', $ignoreId);
        }

        return $query->exists();
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
