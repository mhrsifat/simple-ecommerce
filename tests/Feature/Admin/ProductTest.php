<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Storage::fake('public');

    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    $this->actingAs($this->admin);

    $this->category = Category::create(['name' => 'Electronics Test']);
    $this->subcategory = Subcategory::create(['category_id' => $this->category->id, 'name' => 'Phones Test']);
});

test('admin can view products index', function () {
    $response = $this->get(route('admin.products.index'));

    $response->assertOk();
});

test('admin can create product with uploaded image and valid prices', function () {
    $image = UploadedFile::fake()->image('phone.jpg', 600, 600);

    $response = $this->post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'subcategory_id' => $this->subcategory->id,
        'name' => 'Test Flagship Phone',
        'description' => 'A powerful testing smartphone.',
        'new_price' => '899.99',
        'old_price' => '999.99',
        'image' => $image,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $product = Product::where('name', 'Test Flagship Phone')->firstOrFail();
    expect($product->old_price)->toBe('999.99')
        ->and($product->new_price)->toBe('899.99')
        ->and($product->discount_percentage)->toBe(10);

    Storage::disk('public')->assertExists($product->image);
});

test('product creation validates subcategory belongs to chosen category', function () {
    $otherCategory = Category::create(['name' => 'Other Category']);
    $otherSubcategory = Subcategory::create(['category_id' => $otherCategory->id, 'name' => 'Other Subcategory']);

    $image = UploadedFile::fake()->image('phone.jpg');

    $response = $this->post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'subcategory_id' => $otherSubcategory->id, // Mismatch!
        'name' => 'Mismatched Product',
        'description' => 'Test description.',
        'new_price' => '100.00',
        'image' => $image,
    ]);

    $response->assertSessionHasErrors(['subcategory_id']);
});

test('product creation validates that old price must be greater than new price', function () {
    $image = UploadedFile::fake()->image('phone.jpg');

    $response = $this->post(route('admin.products.store'), [
        'category_id' => $this->category->id,
        'subcategory_id' => $this->subcategory->id,
        'name' => 'Invalid Price Product',
        'description' => 'Test description.',
        'new_price' => '200.00',
        'old_price' => '150.00', // Lower than new price!
        'image' => $image,
    ]);

    $response->assertSessionHasErrors(['old_price']);
});

test('admin can update product and replace image', function () {
    $oldImage = UploadedFile::fake()->image('old.jpg');
    $oldPath = $oldImage->store('products', 'public');

    $product = Product::create([
        'category_id' => $this->category->id,
        'subcategory_id' => $this->subcategory->id,
        'name' => 'Initial Product',
        'description' => 'Initial description.',
        'image' => $oldPath,
        'new_price' => '120.00',
    ]);

    Storage::disk('public')->assertExists($oldPath);

    $newImage = UploadedFile::fake()->image('new.jpg');

    $response = $this->put(route('admin.products.update', $product), [
        'category_id' => $this->category->id,
        'subcategory_id' => $this->subcategory->id,
        'name' => 'Updated Product Name',
        'description' => 'Updated description.',
        'new_price' => '110.00',
        'old_price' => '130.00',
        'image' => $newImage,
    ]);

    $response->assertRedirect(route('admin.products.index'));
    $response->assertSessionHas('success');

    $product->refresh();
    expect($product->name)->toBe('Updated Product Name');
    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($product->image);
});

test('admin can delete product and its file is removed from storage', function () {
    $image = UploadedFile::fake()->image('to_delete.jpg');
    $imagePath = $image->store('products', 'public');

    $product = Product::create([
        'category_id' => $this->category->id,
        'subcategory_id' => $this->subcategory->id,
        'name' => 'Product To Delete',
        'description' => 'About to be deleted.',
        'image' => $imagePath,
        'new_price' => '50.00',
    ]);

    Storage::disk('public')->assertExists($imagePath);

    $response = $this->delete(route('admin.products.destroy', $product));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
    Storage::disk('public')->assertMissing($imagePath);
});
