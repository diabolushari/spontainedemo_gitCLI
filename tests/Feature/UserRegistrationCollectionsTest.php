<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WidgetEditor\WidgetCollection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserRegistrationCollectionsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that creating a user automatically creates 'draft' and 'save' collections.
     */
    public function test_user_creation_creates_default_collections(): void
    {
        // 1. Create a user
        $user = User::factory()->create();

        // 2. Assert that two collections were created for this user
        $this->assertCount(2, $user->widgetCollections);

        // 3. Assert that the collections have the correct names
        $collectionNames = $user->widgetCollections->pluck('name')->toArray();
        $this->assertContains('draft', $collectionNames);
        $this->assertContains('save', $collectionNames);

        // 4. Verify they belong to the correct user
        foreach ($user->widgetCollections as $collection) {
            $this->assertEquals($user->id, $collection->user_id);
        }
    }
}
