<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserCreateRequest extends FormRequest
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
            // 'active' => 'required|boolean',
            'name' => 'required|string|max:255',

            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->route('user')->id),
            ],
            'group_id' => 'required|exists:user_groups,id',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            // 'password' => 'required|string|min:10|confirmed'
            //     . '|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/',
            'password' => $this->isMethod('post')
                            ? 'required|string|min:10|confirmed|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/'
                            : 'nullable|string|min:10|confirmed|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/',
            'office_code' => 'required|exists:organizations,id',
        ];
    }

    public function messages(): array
    {
        return [
            'password.regex' => 'Password should have at least one lower case character, '
                .' one uppercase character, one number and one of these symbols @$!%*#?&  ',
        ];
    }
}
