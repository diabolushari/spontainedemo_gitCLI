<?php

namespace App\Http\Requests\NavRequest;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreNavGroupRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nav_type' => 'required|string|max:50',
            'group_label' => 'required|string|max:100',
            'group_url' => 'nullable|string|max:255',
            'group_icon' => 'nullable|string|max:100',
            'group_pos' => 'required|string|max:10',
        ];
    }
}
