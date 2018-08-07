@extends('layouts/master')

@section('content')

  <div
    id='root'
    data-root-url='{{asset("")}}'
    data-academic-year=@if(isset($academic_year))"{{$academic_year}}" @else "2018" @endif
  ></div>

  <script src="{{asset('js/main.js')}}"></script>

@endsection