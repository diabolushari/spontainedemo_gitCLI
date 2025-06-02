<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dashboard\Dashboardtable;

class DashboardtableController extends Controller
{
   public function store(Request $request)
    {  
       
        // $validated = $request->validate([
        //     'title' => 'required|string|max:255',
        //     'url' => 'required',
        //     'description' => 'nullable|string',
        //     'published_at' => 'nullable',
        // ]);
        // dd($validated);
        $title = $request->input('title');
        $url = $request->input('url');
        $description = $request->input('description');
        $publishedAt = $request->input('published_at');

        // Example model save
        Dashboardtable::create([
            'title' => $title,
            'url' => $url,
            'description' => $description,
            'published_at' => $publishedAt,
        ]);

       

        return redirect()->back()->with('success', 'Dashboard detail added successfully!');
    }
}
