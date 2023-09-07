<?php

namespace Jexactyl\Http\Requests\Admin\Jexactyl;

use Jexactyl\Http\Requests\Admin\AdminFormRequest;

class RegistrationFormRequest extends AdminFormRequest
{
    public function rules(): array
    {
        return [
            'registration:enabled' => 'required|in:true,false',
            'registration:verification' => ['declined_if:"registration:enabled",false', 'required', 'in:true,false'],
            'discord:enabled' => 'required|in:true,false',
            'discord:id' => 'required|int',
            'discord:secret' => 'required|string',

            'registration:cpu' => 'required|int',
            'registration:memory' => 'required|int',
            'registration:disk' => 'required|int',
            'registration:slot' => 'required|int',
            'registration:port' => 'required|int',
            'registration:backup' => 'required|int',
            'registration:database' => 'required|int',
        ];
    }

    public function messages()
    {
        return [
            'registration:verification.declined_if' => 'Email Verification can only be enabled if Email Registration is enabled.',
        ];
    }
}
