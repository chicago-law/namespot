@extends('layouts/master')

@section('content')

  <div
    id='root'
    data-root-url={{ asset("") }}
    data-academic-year=@if(isset($academic_year)) {{ $academic_year }} @else "2018" @endif
    data-authed-user={{ auth()->user()->id }}
  ></div>

  <script src="{{ mix('/js/main.js') }}"></script>

@endsection