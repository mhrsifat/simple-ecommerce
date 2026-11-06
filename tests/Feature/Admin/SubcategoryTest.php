<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Subcategory;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    $this->actingAs($this->admin);
});

test('admin can view subcategories list', function () {
    $response = $this->get(route('admin.subcategories.index'));

    $response->assertOk();
});

test('admin can create subcategory', function () {
    $category = Category::create(['name' => 'Sports Equipment']);

    $response = $this->post(route('admin.subcategories.store'), [
        'category_id' => $category->id,
        'name' => 'Football & Soccer',
    ]);

    $response->assertRedirect(route('admin.subcategories.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('subcategories', [
        'category_id' => $category->id,
        'name' => 'Football & Soccer',
    ]);
});

test('subcategory creation fails on duplicate name under same category', function () {
    $category = Category::create(['name' => 'Books']);
    Subcategory::create(['category_id' => $category->id, 'name' => 'Science Fiction']);

    $response = $this->post(route('admin.subcategories.store'), [
        'category_id' => $category->id,
        'name' => 'Science Fiction',
    ]);

    $response->assertSessionHasErrors(['name']);
});

test('subcategory name can be duplicated across different categories', function () {
    $categoryA = Category::create(['name' => 'Summer Deals']);
    $categoryB = Category::create(['name' => 'Winter Deals']);
    Subcategory::create(['category_id' => $categoryA->id, 'name' => 'Clearance']);

    $response = $this->post(route('admin.subcategories.store'), [
        'category_id' => $categoryB->id,
        'name' => 'Clearance',
    ]);

    $response->assertRedirect(route('admin.subcategories.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('subcategories', [
        'category_id' => $categoryB->id,
        'name' => 'Clearance',
    ]);
});

test('cannot delete subcategory with associated products', function () {
    $category = Category::create(['name' => 'Computers']);
    $subcategory = Subcategory::create(['category_id' => $category->id, 'name' => 'Keyboards']);
    Product::create([
        'category_id' => $category->id,
        'subcategory_id' => $subcategory->id,
        'name' => 'Mechanical Keyboard RGB',
        'description' => 'Tactile switches.',
        'image' => 'products/keyboard.svg',
        'new_price' => '89.99',
    ]);

    $response = $this->delete(route('admin.subcategories.destroy', $subcategory));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('subcategories', ['id' => $subcategory->id]);
});
