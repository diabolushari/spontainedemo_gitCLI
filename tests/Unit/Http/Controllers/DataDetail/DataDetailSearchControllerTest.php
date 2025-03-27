<?php

use App\Models\DataDetail\DataDetail;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('returns empty array when no search term provided', function () {
    // Act
    $response = $this->get(route('data-detail.search'));

    // Assert
    $response->assertOk()
        ->assertJson([]);
});

test('returns matching data details when search term provided', function () {
    // Arrange
    $matchingDetail1 = DataDetail::factory()->create(['name' => 'Test Data Detail 1']);
    $matchingDetail2 = DataDetail::factory()->create(['name' => 'Test Data Detail 2']);
    DataDetail::factory()->create(['name' => 'Different Name']);

    // Act
    $response = $this->get(route('data-detail.search', ['search' => 'Test']));

    // Assert
    $response->assertOk()
        ->assertJsonCount(2)
        ->assertJson([
            [
                'id' => $matchingDetail1->id,
                'name' => $matchingDetail1->name,
            ],
            [
                'id' => $matchingDetail2->id,
                'name' => $matchingDetail2->name,
            ],
        ]);
});

test('returns case insensitive matches', function () {
    // Arrange
    $matchingDetail = DataDetail::factory()->create(['name' => 'Test Data Detail']);
    DataDetail::factory()->create(['name' => 'Different Name']);

    // Act
    $response = $this->get(route('data-detail.search', ['search' => 'test']));

    // Assert
    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJson([
            [
                'id' => $matchingDetail->id,
                'name' => $matchingDetail->name,
            ],
        ]);
});

test('returns partial matches', function () {
    // Arrange
    $matchingDetail = DataDetail::factory()->create(['name' => 'Test Data Detail']);
    DataDetail::factory()->create(['name' => 'Different Name']);

    // Act
    $response = $this->get(route('data-detail.search', ['search' => 'Data']));

    // Assert
    $response->assertOk()
        ->assertJsonCount(1)
        ->assertJson([
            [
                'id' => $matchingDetail->id,
                'name' => $matchingDetail->name,
            ],
        ]);
});

test('limits results to 10 records', function () {
    // Arrange
    DataDetail::factory()->count(15)->create(['name' => 'Test Data Detail']);

    // Act
    $response = $this->get(route('data-detail.search', ['search' => 'Test']));

    // Assert
    $response->assertOk()
        ->assertJsonCount(10);
});

test('orders results by name', function () {
    // Arrange
    $detailC = DataDetail::factory()->create(['name' => 'C Test Data']);
    $detailA = DataDetail::factory()->create(['name' => 'A Test Data']);
    $detailB = DataDetail::factory()->create(['name' => 'B Test Data']);

    // Act
    $response = $this->get(route('data-detail.search', ['search' => 'Test']));

    // Assert
    $response->assertOk()
        ->assertJsonCount(3)
        ->assertJson([
            [
                'id' => $detailA->id,
                'name' => $detailA->name,
            ],
            [
                'id' => $detailB->id,
                'name' => $detailB->name,
            ],
            [
                'id' => $detailC->id,
                'name' => $detailC->name,
            ],
        ]);
});
