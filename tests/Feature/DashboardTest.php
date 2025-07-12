<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page when accessing protected routes', function () {
    $this->get('/order')->assertRedirect('/login');
});

test('authenticated users can access protected customer routes', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/order')->assertOk();
});
