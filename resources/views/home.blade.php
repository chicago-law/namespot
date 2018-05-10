<!doctype html>
<html lang="{{ app()->getLocale() }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Namespot</title>
    <link rel="stylesheet" href="{{asset('css/fontawesome-all.min.css')}}">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
    <link rel="stylesheet" href="{{asset('css/app.css')}}">
  </head>
  <body data-root='{{asset("")}}'>

    <div id='root'></div>

    <footer>
      <script src="{{asset('js/main.js')}}"></script>
    </footer>

  </body>
</html>
