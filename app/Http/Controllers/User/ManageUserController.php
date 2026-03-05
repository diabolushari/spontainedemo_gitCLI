<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserCreateRequest;
use App\Libs\SaveFile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ManageUserController extends Controller
{
    public function index()
    {
        $data = User::paginate(20);

        return Inertia::render('User/UserIndex', [
            'users' => $data,
        ]);
    }

    public function store(UserCreateRequest $request): RedirectResponse
    {
        $saveFile = new SaveFile;

        DB::beginTransaction();

        try {
            $validated = $request->validated();

            $validated['password'] = Hash::make($validated['password']);

            $photo = $validated['photo'] ?? null;
            unset($validated['photo']);

            $user = User::create($validated);

            if ($photo) {
                $photoFileName = $saveFile->save(
                    $photo,
                    $user->id,
                    'user_photo',
                    true
                );

                if ($photoFileName == '') {
                    DB::rollBack();

                    return redirect()->back()
                        ->with(['error' => 'Failed To Upload Photo']);
                }

                $user->photo = $photoFileName;
                $user->save();
            }

            DB::commit();

            return redirect()
                ->back()
                ->with(['message' => 'User created successfully.']);

        } catch (\Exception $e) {

            DB::rollBack();

            return redirect()
                ->back()
                ->with(['error' => $e->getMessage()]);
        }
    }

    public function update(UserCreateRequest $request, User $user): RedirectResponse
{
    $saveFile = new SaveFile;

    DB::beginTransaction();

    try {
        $validated = $request->validated();

       
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        
        $photo = $validated['photo'] ?? null;
        unset($validated['photo']);
   
        $user->update($validated);

        if ($photo) {

            $photoFileName = $saveFile->save(
                $photo,
                $user->id,
                'user_photo',
                true
            );

            if ($photoFileName == '') {
                DB::rollBack();

                return redirect()->back()
                    ->with(['error' => 'Failed To Upload Photo']);
            }

            $user->photo = $photoFileName;
            $user->save();
        }

        DB::commit();

        return redirect()
            ->back()
            ->with(['message' => 'User updated successfully.']);

    } catch (\Exception $e) {

        DB::rollBack();

        return redirect()
            ->back()
            ->with(['error' => $e->getMessage()]);
    }
}
}
