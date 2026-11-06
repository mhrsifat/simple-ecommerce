<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected FileUploadService $fileUploadService,
    ) {}

    /**
     * Display a listing of products.
     */
    public function index(): Response
    {
        $products = Product::with([
            'category:id,name,slug',
            'subcategory:id,name,slug',
        ])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Category::with('subcategories:id,category_id,name')
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(ProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        /** @var UploadedFile $imageFile */
        $imageFile = $request->file('image');
        $validated['image'] = $this->fileUploadService->upload($imageFile);

        Product::create($validated);

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Update the specified product.
     */
    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            /** @var UploadedFile $imageFile */
            $imageFile = $request->file('image');
            $validated['image'] = $this->fileUploadService->replace($imageFile, $product->image);
        } else {
            unset($validated['image']);
        }

        $product->update($validated);

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->fileUploadService->delete($product->image);

        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }
}
