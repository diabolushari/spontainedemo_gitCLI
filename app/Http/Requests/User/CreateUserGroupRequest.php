<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class CreateUserGroupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'group_name' => ['required', 'string', 'max:255'],
            'roles' => ['required', 'array'],
            'description' => ['nullable', 'string', 'max:1000'],
            'meta_hierarchy_item_id' => [
                'nullable',
                'exists:meta_hierarchy_items,id',
            ],

            'hierarchy_connection' => [
                'nullable',
                'string',
            ],
        ];
    }
}
