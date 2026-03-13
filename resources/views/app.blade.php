<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>Spontaine</title>

    <!-- Manifest -->
    <link rel="manifest" href="/site.webmanifest">

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/spontaine-favicon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/spontaine-favicon.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/spontaine-favicon.png">
    <link rel="apple-touch-icon" href="/spontaine-favicon.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <link rel="stylesheet" href="/line-awesome/1.3.0/css/line-awesome.min.css">

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>

<body
    class="font-sans antialiased bg-gradient-to-r from-1stop-gradient-left to-1stop-gradient-right snap-mandatory max-w-full">
@inertia
</body>

</html>
