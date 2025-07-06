<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Hash;

class AdminDashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Only seed if there's minimal data
        if (User::where('role', 'customer')->count() > 5) {
            $this->command->info('Sample data already exists. Skipping seeder.');
            return;
        }

        // Create sample users (customers)
        $users = [];
        for ($i = 1; $i <= 20; $i++) {
            $email = "customer{$i}@example.com";
            
            // Skip if user already exists
            if (User::where('email', $email)->exists()) {
                $users[] = User::where('email', $email)->first();
                continue;
            }
            
            $users[] = User::create([
                'name' => "Customer {$i}",
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'customer',
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // Create sample menu items
        $menuItems = [
            ['name' => 'Ribeye Steak', 'category' => 'steaks', 'price' => 45.99],
            ['name' => 'Filet Mignon', 'category' => 'steaks', 'price' => 52.99],
            ['name' => 'T-Bone Steak', 'category' => 'steaks', 'price' => 48.99],
            ['name' => 'Grilled Salmon', 'category' => 'seafood', 'price' => 28.99],
            ['name' => 'Lobster Tail', 'category' => 'seafood', 'price' => 38.99],
            ['name' => 'Caesar Salad', 'category' => 'salads', 'price' => 12.99],
            ['name' => 'Mushroom Risotto', 'category' => 'appetizers', 'price' => 16.99],
            ['name' => 'Chocolate Lava Cake', 'category' => 'desserts', 'price' => 8.99],
            ['name' => 'Red Wine', 'category' => 'beverages', 'price' => 6.99],
            ['name' => 'Craft Beer', 'category' => 'beverages', 'price' => 4.99],
        ];

        $createdMenuItems = [];
        foreach ($menuItems as $item) {
            // Skip if menu item already exists
            $existingItem = MenuItem::where('name', $item['name'])->first();
            if ($existingItem) {
                $createdMenuItems[] = $existingItem;
            } else {
                $createdMenuItems[] = MenuItem::create($item);
            }
        }

        // Create sample reservations
        for ($i = 1; $i <= 50; $i++) {
            Reservation::create([
                'user_id' => $users[array_rand($users)]->id,
                'name' => "Reservation {$i}",
                'email' => "guest{$i}@example.com",
                'phone' => '+60123456789',
                'reservation_date' => now()->addDays(rand(-10, 10))->format('Y-m-d'),
                'reservation_time' => sprintf('%02d:%02d', rand(18, 22), rand(0, 1) * 30),
                'guests' => rand(2, 8),
                'special_requests' => rand(0, 1) ? 'No special requests' : 'Birthday celebration',
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // Create sample reviews
        $reviewComments = [
            'Amazing food and excellent service!',
            'The steak was cooked to perfection.',
            'Great atmosphere for a romantic dinner.',
            'Best steak house in town!',
            'Will definitely come back again.',
            'The staff was very friendly and attentive.',
            'Outstanding quality and presentation.',
            'A bit pricey but worth every penny.',
            'The wine selection is impressive.',
            'Perfect place for special occasions.',
        ];

        for ($i = 1; $i <= 30; $i++) {
            Review::create([
                'user_id' => $users[array_rand($users)]->id,
                'menu_item_id' => $createdMenuItems[array_rand($createdMenuItems)]->id,
                'name' => "Guest Review {$i}", // Keep name for legacy reviews
                'rating' => rand(4, 5), // Generally positive reviews
                'comment' => $reviewComments[array_rand($reviewComments)],
                'created_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        $this->command->info('Sample data for admin dashboard created successfully!');
    }
}
