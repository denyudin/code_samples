<?php

namespace App\Meals;

class EditableMealsResource
{
    protected $meals;

    public function __construct($meals)
    {
        $this->meals = $meals;
    }

    public function format()
    {
        return $this->meals
        ->sort(function ($a, $b) {
            // this sorts meals aphabetically within age group, i.e.
            // alphabetically for Stage 1 meals, then for Stage 2
            return $a->skuStartsWith() === $b->skuStartsWith()
                ? $a->name <=> $b->name
                : $a->skuStartsWith() <=> $b->skuStartsWith();
        })
        ->values()
        ->map(function ($meal) {
            return [
                'id' => $meal->id,
                'name' => $meal->name,
                'slug' => $meal->slug,
                'sku' => $meal->sku,
                'image_path' => $meal->images()->count() > 0 ? $meal->images->first()->s3_image_path : '',
                'quantity' => $meal->pivot->meal_quantity,
                'containers' => $meal->pivot->containers,
                'category_id' => $meal->pivot->category_id,
                'age_group' => $meal->getAgeGroup(),
                'indicators' => $meal->indicators,
                'fav_tag' => $meal->fav_tag,
                'is_inclusion' => $meal->pivot->is_inclusion ? true : false,
                'is_exclusion' => $meal->pivot->is_exclusion ? true : false,
            ];
        });
    }
}
