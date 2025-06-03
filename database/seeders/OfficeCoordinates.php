<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class OfficeCoordinates extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = database_path('data/geo_coordinates.csv');

        if (! File::exists($file)) {
            $this->command->error('CSV file not found at: '.$file);

            return;
        }

        $csvData = array_map('str_getcsv', file($file));
        $header = array_map('trim', $csvData[0]);
        unset($csvData[0]);

        foreach ($csvData as $row) {
            $row = array_combine($header, $row);

            DB::table('office_coordinates')->insert([
                'level' => $row['Level'],
                'circle' => $row['Circle'],
                'office_id' => $row['Office Id'],
                'office_code' => $row['Office Code'],
                'office_name' => $row['Office Name'],
                'latitude' => $row['Latitude'],
                'longitude' => $row['Longitude'],
            ]);
        }

        $this->command->info('Seeded office_coordinates table from CSV.');

    }
}
