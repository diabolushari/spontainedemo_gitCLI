<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserCreateRequest;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class ManageUserController extends Controller
{
    public function index()
    {
        $data = User::paginate(20);
        return Inertia::render('User/UserIndex', [
            'users' => $data
        ]);
    }

    public function store(UserCreateRequest $request)
    {
        $validated = $request->validated();
        try {
            $validated['password'] = Hash::make($validated['password']);
            User::create($validated);
        } catch (Exception $e) {
            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }

        return redirect()
            ->back()
            ->with(['message' => 'User created successfully.']);
    }
}
