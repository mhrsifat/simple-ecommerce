<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard summary.
     */
    public function index(): Response
    {
        $stats = [
            'totalCategories' => Category::count(),
            'totalSubcategories' => Subcategory::count(),
            'totalProducts' => Product::count(),
        ];

        $recentProducts = Product::with([
            'category:id,name,slug',
            'subcategory:id,name,slug',
        ])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentProducts' => $recentProducts,
        ]);
    }
}
