<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class ShopController extends Controller
{
    /**
     * Display the storefront index with categories and products.
     */
    public function index(Request $request, ?Category $category = null, ?Subcategory $subcategory = null): Response
    {
        $search = $request->string('search')->trim()->value();
        $queryCategorySlug = $request->string('category')->trim()->value();
        $querySubcategorySlug = $request->string('subcategory')->trim()->value();

        // Support query parameter fallback if not route-bound
        if ($category === null && $queryCategorySlug !== '') {
            $category = Category::where('slug', $queryCategorySlug)->first();

            if (! $category) {
                return Inertia::render('shop/not-found', [
                    'type' => 'category',
                    'slug' => $queryCategorySlug,
                    'message' => "No category found matching \"{$queryCategorySlug}\".",
                ]);
            }
        }

        // Support query parameter fallback for subcategory if not route-bound
        if ($subcategory === null && $querySubcategorySlug !== '') {
            $subcatQuery = Subcategory::where('slug', $querySubcategorySlug);
            if ($category) {
                $subcatQuery->where('category_id', $category->id);
            }
            $subcategory = $subcatQuery->first();

            if (! $subcategory) {
                return Inertia::render('shop/not-found', [
                    'type' => 'subcategory',
                    'slug' => $querySubcategorySlug,
                    'message' => "No subcategory found matching \"{$querySubcategorySlug}\".",
                ]);
            }
        }

        $activeCategorySlug = $category?->slug;
        $activeSubcategorySlug = $subcategory?->slug;

        $categories = Category::query()
            ->withCount('products')
            ->with(['subcategories:id,category_id,name,slug'])
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        $subcategories = Subcategory::query()
            ->when($category !== null, function (Builder $query) use ($category): void {
                $query->where('category_id', $category->id);
            })
            ->when($subcategory !== null, function (Builder $query) use ($subcategory): void {
                $query->where('id', $subcategory->id);
            })
            ->whereHas('products', function (Builder $query) use ($search): void {
                if ($search !== '') {
                    $query->where(function (Builder $q) use ($search): void {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    });
                }
            })
            ->with([
                'category:id,name,slug',
                'products' => function (HasMany $query) use ($search): void {
                    if ($search !== '') {
                        $query->where(function (Builder $q) use ($search): void {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%");
                        });
                    }
                    $query->latest();
                },
            ])
            ->orderBy('name')
            ->get();

        $latestProducts = collect();
        $popularProducts = collect();
        $featuredCategories = collect();

        $isRootHome = ($category === null && $subcategory === null && $search === '');

        if ($isRootHome) {
            $latestProducts = Product::query()
                ->with(['category:id,name,slug', 'subcategory:id,name,slug'])
                ->latest()
                ->take(8)
                ->get();

            $popularProducts = Product::query()
                ->with(['category:id,name,slug', 'subcategory:id,name,slug'])
                ->whereNotNull('old_price')
                ->whereColumn('old_price', '>', 'new_price')
                ->latest()
                ->take(8)
                ->get();

            if ($popularProducts->count() < 4) {
                $popularProducts = $latestProducts->take(4);
            }

            $featuredCategories = Category::query()
                ->withCount('products')
                ->has('products')
                ->with([
                    'products' => function (HasMany $query): void {
                        $query->with(['category:id,name,slug', 'subcategory:id,name,slug'])->latest()->take(4);
                    },
                ])
                ->take(4)
                ->get();
        }

        return Inertia::render('shop/index', [
            'categories' => $categories,
            'subcategories' => $subcategories,
            'latestProducts' => $latestProducts,
            'popularProducts' => $popularProducts,
            'featuredCategories' => $featuredCategories,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'category' => $activeCategorySlug,
                'subcategory' => $activeSubcategorySlug,
            ],
        ]);
    }

    /**
     * Handle missing category or subcategory from route model binding.
     */
    public static function categoryNotFound(Request $request): SymfonyResponse
    {
        $categoryParam = $request->route('category');
        $category = $categoryParam instanceof Category
            ? $categoryParam
            : Category::where('slug', (string) $categoryParam)->first();

        $categorySlug = $category ? $category->slug : (string) $categoryParam;

        if (! $category) {
            return Inertia::render('shop/not-found', [
                'type' => 'category',
                'slug' => $categorySlug,
                'message' => "No category found matching \"{$categorySlug}\".",
            ])->toResponse($request)->setStatusCode(404);
        }

        $subcategoryParam = $request->route('subcategory');
        $subcategorySlug = $subcategoryParam instanceof Subcategory
            ? $subcategoryParam->slug
            : (string) $subcategoryParam;

        return Inertia::render('shop/not-found', [
            'type' => 'subcategory',
            'slug' => $subcategorySlug,
            'message' => "No subcategory found matching \"{$subcategorySlug}\" in category \"{$category->name}\".",
        ])->toResponse($request)->setStatusCode(404);
    }

    /**
     * Display a specific product with related items.
     */
    public function show(string $slug): Response
    {
        $product = Product::with([
            'category:id,name,slug',
            'subcategory:id,name,slug',
        ])
            ->where('slug', $slug)
            ->first();

        if (! $product) {
            return Inertia::render('shop/not-found', [
                'type' => 'product',
                'slug' => $slug,
                'message' => "No product found with the slug \"{$slug}\".",
            ]);
        }

        $relatedProducts = Product::query()
            ->where('subcategory_id', $product->subcategory_id)
            ->where('id', '!=', $product->id)
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Search products live for the storefront autocomplete popover.
     */
    public function liveSearch(Request $request): JsonResponse
    {
        $query = $request->string('q')->trim()->value();

        if ($query === '') {
            return response()->json([
                'products' => [],
                'total' => 0,
            ]);
        }

        $baseQuery = Product::query()
            ->where(function (Builder $builder) use ($query): void {
                $builder->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            });

        $total = (clone $baseQuery)->count();

        $products = $baseQuery
            ->with(['category:id,name,slug', 'subcategory:id,name,slug'])
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'products' => $products,
            'total' => $total,
        ]);
    }
}
