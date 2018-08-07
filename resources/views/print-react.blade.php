@extends('layouts/master')

@section('content')

  <div
    id='root'
    data-root-url='{{asset("")}}'
    data-academic-year=@if(isset($academic_year))"{{$academic_year}}" @else "2018" @endif
  ></div>

  {{-- Additional JS for creating canvas from DOM --}}
  <script type="text/javascript" src="http://canvg.github.io/canvg/rgbcolor.js"></script>
  <script type="text/javascript" src="http://canvg.github.io/canvg/StackBlur.js"></script>
  <script type="text/javascript" src="http://canvg.github.io/canvg/canvg.js"></script>

  <script src="{{asset('js/main.js')}}"></script>

@endsection