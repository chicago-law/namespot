@extends('master')

@section('content')

        <div id="root"></div>

        {{-- Load the React app --}}
        <script src="{{ mix('js/index.js') }}"></script>

@endsection
