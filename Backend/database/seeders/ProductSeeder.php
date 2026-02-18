<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Keripik Singkong Original',
                'description' => 'Keripik singkong renyah dengan rasa original yang gurih',
                'category' => 'Snack',
                'price' => 15000,
                'stock' => 100,
                'image' => 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Keripik Singkong Balado',
                'description' => 'Keripik singkong dengan bumbu balado pedas yang menggugah selera',
                'category' => 'Snack',
                'price' => 17000,
                'stock' => 80,
                'image' => 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Makaroni Pedas',
                'description' => 'Makaroni goreng dengan bumbu pedas level 5',
                'category' => 'Cemilan',
                'price' => 12000,
                'stock' => 120,
                'image' => 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Keripik Pisang Cokelat',
                'description' => 'Keripik pisang dilapisi cokelat premium',
                'category' => 'Dessert',
                'price' => 20000,
                'stock' => 60,
                'image' => 'https://images.unsplash.com/photo-1587132117655-c11f3862e922?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Kacang Mete Premium',
                'description' => 'Kacang mete pilihan dengan rasa asin gurih',
                'category' => 'Snack',
                'price' => 35000,
                'stock' => 50,
                'image' => 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Keripik Tempe',
                'description' => 'Keripik tempe renyah dengan bumbu rahasia',
                'category' => 'Cemilan',
                'price' => 10000,
                'stock' => 150,
                'image' => 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Kue Kering Nastar',
                'description' => 'Kue kering nastar lembut dengan selai nanas asli',
                'category' => 'Dessert',
                'price' => 45000,
                'stock' => 40,
                'image' => 'https://images.unsplash.com/photo-1558564827-563001d11cb7?w=400',
                'is_active' => true,
            ],
            [
                'name' => 'Kue Kering Kastengel',
                'description' => 'Kue kering kastengel dengan keju edam original',
                'category' => 'Dessert',
                'price' => 50000,
                'stock' => 35,
                'image' => 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
