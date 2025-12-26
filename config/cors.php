<?php

return [
    'paths' => ['*'],                  // REQUIRED: Apply to all routes
    'allowed_methods' => ['*'],        // REQUIRED: Allow all methods (GET, POST, etc.)
    'allowed_origins' => [             // YOUR SETTING
        'https://1stopkseb.xocortx.com',
        'http://localhost:8000',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],        // REQUIRED: Allow headers like Content-Type
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,    // REQUIRED: If you use login/cookies
];
