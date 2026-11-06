<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use Inertia\Testing\AssertableInertia as Assert;

test('storefront index renders successfully with categories and subcategories', function () {
    $category = Category::create(['name' => 'Tech Gadgets']);
    $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Audio Gear']);
    Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcategory->id,
        'name' => 'Wireless Pods Pro',
        'description' => 'Crisp sound and deep bass.',
        'image' => 'products/test-pods.svg',
        'new_price' => '149.99',
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/index', false)
        ->has('categories')
        ->has('subcategories')
        ->has('filters')
    );
});

test('storefront filters products by search query and category slug', function () {
    $category1 = Category::create(['name' => 'Laptops & Computers']);
    $subcat1 = Subcategory::create(['category_id' => $category1->id, 'name' => 'Ultrabooks']);
    $product1 = Product::create([
        'category_id' => $category1->id,
        'subcategory_id' => $subcat1->id,
        'name' => 'ZenBook Pro Duo 14',
        'description' => 'Dual screen powerhouse.',
        'image' => 'products/laptop.svg',
        'new_price' => '1799.99',
    ]);

    $category2 = Category::create(['name' => 'Accessories']);
    $subcat2 = Subcategory::create(['category_id' => $category2->id, 'name' => 'Bags']);
    Product::create([
        'category_id' => $category2->id,
        'subcategory_id' => $subcat2->id,
        'name' => 'Canvas Backpack',
        'description' => 'Water-resistant travel backpack.',
        'image' => 'products/backpack.svg',
        'new_price' => '49.99',
    ]);

    $response = $this->get(route('home', ['search' => 'ZenBook', 'category' => $category1->slug]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/index', false)
        ->where('filters.search', 'ZenBook')
        ->where('filters.category', $category1->slug)
        ->has('subcategories', 1)
        ->where('subcategories.0.products.0.name', 'ZenBook Pro Duo 14')
    );
});

test('category displays total product count for department showcase', function () {
    $category1 = Category::create(['name' => 'Audio Division']);
    $subcat1 = Subcategory::create(['category_id' => $category1->id, 'name' => 'Over-Ear']);
    Product::create([
        'category_id' => $category1->id,
        'subcategory_id' => $subcat1->id,
        'name' => 'Noise Cancelling Wireless Headphones',
        'description' => 'Active noise cancellation headphones.',
        'image' => 'products/headphones.svg',
        'new_price' => '229.99',
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/index', false)
        ->where('categories', fn ($categories) => collect($categories)->firstWhere('slug', $category1->slug)['products_count'] === 1)
    );
});

test('product detail page renders with related products', function () {
    $category = Category::create(['name' => 'Smart Watches']);
    $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Wearables']);

    $mainProduct = Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcategory->id,
        'name' => 'Apex Smart Watch',
        'description' => 'Advanced heart rate and sleep tracking.',
        'image' => 'products/watch1.svg',
        'new_price' => '199.99',
    ]);

    $relatedProduct = Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcategory->id,
        'name' => 'Apex Sport Band Watch',
        'description' => 'Lightweight edition with silicone strap.',
        'image' => 'products/watch2.svg',
        'new_price' => '159.99',
    ]);

    $response = $this->get($mainProduct->path);

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/show', false)
        ->where('product.id', $mainProduct->id)
        ->has('relatedProducts', 1)
        ->where('relatedProducts.0.id', $relatedProduct->id)
    );
});

test('product detail page renders via slug', function () {
    $category = Category::create(['name' => 'Audio Division']);
    $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Headsets']);

    $product = Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcategory->id,
        'name' => 'Studio Wireless Headset',
        'description' => 'Crisp sound reproduction.',
        'image' => 'products/headset.svg',
        'new_price' => '179.99',
    ]);

    $response = $this->get("/products/{$product->slug}");

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/show', false)
        ->where('product.id', $product->id)
    );
});

test('storefront renders filtered category via clean slug', function () {
    $category = Category::create(['name' => 'Computers & PCs']);

    $response = $this->get(route('categories.show', ['category' => $category]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/index', false)
        ->where('filters.category', $category->slug)
    );
});

test('storefront renders filtered category and subcategory via clean slug', function () {
    $category = Category::create(['name' => 'Home Cinema']);
    $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Projectors']);

    $response = $this->get(route('categories.show', ['category' => $category, 'subcategory' => $subcategory]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/index', false)
        ->where('filters.category', $category->slug)
        ->where('filters.subcategory', $subcategory->slug)
    );
});

test('scoped binding returns 404 when subcategory does not belong to category', function () {
    $category1 = Category::create(['name' => 'Category One']);
    $category2 = Category::create(['name' => 'Category Two']);
    $subcategory2 = Subcategory::create(['category_id' => $category2->id, 'name' => 'Subcategory Two']);

    $response = $this->get("/categories/{$category1->slug}/{$subcategory2->slug}");

    $response->assertNotFound();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/not-found', false)
        ->where('type', 'subcategory')
        ->where('slug', $subcategory2->slug)
    );
});

test('invalid category path renders shop/not-found', function () {
    $response = $this->get('/categories/newaa44');

    $response->assertNotFound();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/not-found', false)
        ->where('type', 'category')
        ->where('slug', 'newaa44')
    );
});

test('storefront filters products by subcategory slug', function () {
    $category = Category::create(['name' => 'Audio & Sound']);
    $subcat1 = Subcategory::create(['category_id' => $category->id, 'name' => 'Headphones']);
    $subcat2 = Subcategory::create(['category_id' => $category->id, 'name' => 'Speakers']);

    Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcat1->id,
        'name' => 'Studio Over-Ear Headphones',
        'description' => 'Lossless dynamic sound.',
        'image' => 'products/headphones.svg',
        'new_price' => '249.99',
    ]);

    Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcat2->id,
        'name' => 'Bluetooth Party Speaker',
        'description' => 'Loud portable bass speaker.',
        'image' => 'products/speaker.svg',
        'new_price' => '99.99',
    ]);

    $response = $this->get(route('home', ['subcategory' => $subcat1->slug]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/index', false)
        ->where('filters.subcategory', $subcat1->slug)
        ->has('subcategories', 1)
        ->where('subcategories.0.slug', $subcat1->slug)
        ->where('subcategories.0.products.0.name', 'Studio Over-Ear Headphones')
    );
});

test('invalid category slug renders shop/not-found', function () {
    $response = $this->get(route('home', ['category' => 'non-existent-category']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/not-found', false)
        ->where('type', 'category')
        ->where('slug', 'non-existent-category')
    );
});

test('invalid subcategory slug renders shop/not-found', function () {
    $response = $this->get(route('home', ['subcategory' => 'non-existent-subcategory']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/not-found', false)
        ->where('type', 'subcategory')
        ->where('slug', 'non-existent-subcategory')
    );
});

test('invalid product slug renders shop/not-found instead of raw 404', function () {
    $response = $this->get('/products/ultra-slim-tablet-11-inchfa');

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('shop/not-found', false)
        ->where('type', 'product')
        ->where('slug', 'ultra-slim-tablet-11-inchfa')
    );
});

test('live search endpoint returns matching products json', function () {
    $category = Category::create(['name' => 'Audio Pro Division']);
    $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Pro Speakers']);
    $product = Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcategory->id,
        'name' => 'Flagship Pro Studio Monitor',
        'description' => 'Professional acoustics.',
        'image' => 'products/monitor.svg',
        'new_price' => '499.99',
    ]);

    $response = $this->getJson(route('search.live', ['q' => 'Pro Studio']));

    $response->assertOk();
    $response->assertJson([
        'total' => 1,
        'products' => [
            [
                'id' => $product->id,
                'name' => 'Flagship Pro Studio Monitor',
            ],
        ],
    ]);
});
