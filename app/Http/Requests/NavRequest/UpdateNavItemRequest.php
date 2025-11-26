<?php

namespace App\Http\Requests\NavRequest;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateNavItemRequest extends FormRequest
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
            'item_label' => 'required|string|max:100',
            'item_url' => 'required|string|max:255',
            'item_pos' => 'required|integer',
            'item_icon' => 'required|string',
        ];
    }
}
