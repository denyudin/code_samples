<?php

namespace App\Meals;

use App\AgeGroup;
use App\Category;
use App\Meal;
use App\Plan;

class MealRepository
{
    private $response = [];

    public function getGroupedByAge($ageGroup, $week)
    {
        return $ageGroup->plans()->with(['meals' => function ($query) use ($week, $ageGroup) {
            $query->whereOrderWeekId($week->id);
            $query->orderBy('sku');
        }])->active()->get()
            ->flatMap(function ($plan) {
                return $plan->meals;
            })
            ->unique('sku')
            ->map(function ($meal) use ($ageGroup){
                return [
                    'id' => $meal['id'],
                    'name' => $meal['name'],
                    'slug' => $meal['slug'],
                    'sku' => $meal['sku'],
                    'images' => $meal['images'],
                    'indicators' => $meal['indicators'],
                    'pivot' => $meal['pivot'],
                    'fav_tag' => $meal['fav_tag'],
                    'current_price' => $meal['current_price'],
                    'ageGroup' => $ageGroup->label,
                ];
            })
            ->each(function ($meal) {
                $meal['pivot']['meal_quantity'] = 0;
            })
            ->values();
    }

    public function getGroupedByAgeForInclusion($ageGroup)
    {
        return $ageGroup->plans()->active()->subscribeable()->get()
            ->flatMap(function ($plan) {
                return $plan->relevantMeals()
                    ->whereIn('menu_label', ['Favorite', 'Seasonal'])
                    ->active()
                    ->get();
            })
            ->unique('sku')
            ->map(function ($meal) use ($ageGroup){
                return [
                    'id' => $meal['id'],
                    'name' => $meal['name'],
                    'slug' => $meal['slug'],
                    'sku' => $meal['sku'],
                    'image_url' => count($meal['images']) ? $meal['images']->first()->s3_image_path : null,
                    'indicators' => $meal['indicators'],
                    'fav_tag' => $meal['fav_tag'],
                    'ageGroup' => $ageGroup->label,
                    'quantity' => 0,
                    'menu_label' => $meal['menu_label'],
                ];
            })->values();
    }

    public function menu($week)
    {
        $menu = [];

        $plans = Plan::whereIsActive(true)->get();

        foreach ($plans as $plan) {
            $menu[$plan->slug] = $plan->meals()
                ->whereOrderWeekId($week->id)
                ->filteredByPlan($plan)
                ->orderBy('name')
                ->get()
                ->groupBy('sku')
                ->map(function ($groupedMeals, $sku) use ($plan) {
                    $meal = $groupedMeals->first();

                    return [
                        'name' => $meal->name,
                        'slug' => $meal->slug,
                        'image' => $meal->images->count() ? $meal->images->first()->s3_image_path : 'http://placehold.it/350x150',
                        'category' => $meal->menu_label,
                        'indicators' => array_diff($meal->indicators, ['Pork', 'Fish']),
                        'fav_tag' => $meal->fav_tag,
                        'current_price' => $meal->current_price,
                    ];
                })
                ->values();
        }

        return $menu;
    }

    public function all()
    {
        Meal::chunk(100, function($meals) {
            foreach ($meals as $meal) {
                // In order to avoid issues with the returned format,
                // if keys in array are not in the regular order
                $indicators = $meal->indicators;
                $allergens  = $meal->allergens;
                sort($indicators);
                sort($allergens);

                $this->response[] = [
                    'meal_id'       => $meal->id,
                    'title'         => $meal->name,
                    'images'        => $meal->images()->orderBy('is_marketing_site', 'desc')->get()->toArray(),
                    'plu'           => $meal->sku,
                    'indicators'    => $indicators,
                    'allergens'     => $allergens,
                    'description'   => $meal->description,
                    'label_image'   => $meal->nutrification_label_image_path,
                    'ingredients'   => $meal->ingredients
                ];
            }
        });

        return $this->response;
    }
}
