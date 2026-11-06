<?php

use App\Models\Category;
use App\Models\Subcategory;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    $this->actingAs($this->admin);
});

test('admin can view category list', function () {
    Category::create(['name' => 'Automotive']);

    $response = $this->get(route('admin.categories.index'));

    $response->assertOk();
});

test('admin can create a category with unique name', function () {
    $response = $this->post(route('admin.categories.store'), [
        'name' => 'Musical Instruments',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('categories', ['name' => 'Musical Instruments', 'slug' => 'musical-instruments']);
});

test('category creation fails on duplicate name', function () {
    Category::create(['name' => 'Kitchenware']);

    $response = $this->from(route('admin.categories.index'))->post(route('admin.categories.store'), [
        'name' => 'Kitchenware',
    ]);

    $response->assertSessionHasErrors(['name']);
});

test('admin can update a category', function () {
    $category = Category::create(['name' => 'Old Category Name']);

    $response = $this->put(route('admin.categories.update', $category), [
        'name' => 'New Category Name',
    ]);

    $response->assertRedirect(route('admin.categories.index'));
    $response->assertSessionHas('success');
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'New Category Name', 'slug' => 'new-category-name']);
});

test('cannot delete category with associated subcategories', function () {
    $category = Category::create(['name' => 'Parent Category']);
    Subcategory::create(['category_id' => $category->id, 'name' => 'Child Subcategory']);

    $response = $this->delete(route('admin.categories.destroy', $category));

    $response->assertRedirect();
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('categories', ['id' => $category->id]);
});

test('can delete empty category', function () {
    $category = Category::create(['name' => 'Empty Category']);

    $response = $this->delete(route('admin.categories.destroy', $category));

    $response->assertRedirect();
    $response->assertSessionHas('success');
    $this->assertDatabaseMissing('categories', ['id' => $category->id]);
});
