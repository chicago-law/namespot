@extends('layouts/master')

@section('content')

  <div
    id='root'
    data-root-url='{{asset("")}}'
    data-academic-year=@if(isset($academic_year))"{{$academic_year}}" @else "2018" @endif
    data-authed-user=@if(Auth::check())"{{auth()->user()->id}}" @else "" @endif
  ></div>

  {{-- Additional JS for creating canvas from DOM --}}
  <script type="text/javascript" src="{{asset('js/rgbcolor.min.js')}}"></script>
  <script type="text/javascript" src="{{asset('js/stackblur.min.js')}}"></script>
  <script type="text/javascript" src="{{asset('js/canvg.min.js')}}"></script>
  <script type="text/javascript" src="{{asset('js/jspdf.min.js')}}"></script>
  <script type="text/javascript" src="{{asset('js/html2canvas.min.js')}}"></script>

  <script type="text/javascript" src="{{asset('js/main.js')}}"></script>
@endsection