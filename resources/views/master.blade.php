<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>{{ config('app.name', 'Namespot: Seating Chart Generator') }}</title>
        <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700&display=swap" rel="stylesheet">
        <link href="{{ asset('css/main.css') }}" rel="stylesheet">
        <link rel="shortcut icon" href="{{asset('images/favicon.ico')}}" type="image/x-icon">
        <link rel="icon" type="image/png" sizes="16x16" href="{{asset('images/favicon-16x16.png')}}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{asset('images/favicon-32x32.png')}}">
        <link rel="icon" type="image/png" sizes="96x96" href="{{asset('images/favicon-96x96.png')}}">
        <style>
          body:not(.user-is-tabbing) button:focus,
          body:not(.user-is-tabbing) input:focus,
          body:not(.user-is-tabbing) select:focus,
          body:not(.user-is-tabbing) option:focus,
          body:not(.user-is-tabbing) textarea:focus,
          body:not(.user-is-tabbing) [role="button"]:focus {
            outline: none;
          }
        </style>
    </head>
    <body>

      {{-- Main Content --}}
      @yield('content')

      {{-- If you hit tab, we'll add a class that'll undo our 'outline: none' above --}}
      <script>
        function handleFirstTab(e) {
          if (e.keyCode === 9) {
            document.body.classList.add('user-is-tabbing');
            window.removeEventListener('keydown', handleFirstTab);
          }
        }
        window.addEventListener('keydown', handleFirstTab);
      </script>
    </body>
</html>
