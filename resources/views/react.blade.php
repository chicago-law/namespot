@extends('master')

@section('content')

        <div id="root"></div>
        <canvas id="printable-canvas"></canvas>

        {{-- Load the React app --}}
        <script src="{{ mix('js/index.js') }}"></script>

@endsection
