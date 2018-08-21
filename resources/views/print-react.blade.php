@extends('layouts/master')

@section('content')

  <div
    id='root'
    data-root-url='{{asset("")}}'
    data-academic-year=@if(isset($academic_year))"{{$academic_year}}" @else "2018" @endif
  ></div>

  {{-- Additional JS for creating canvas from DOM --}}
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/canvg/1.4/rgbcolor.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/stackblur-canvas/1.4.1/stackblur.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js"></script>

  {{-- <script src="{{asset('js/html2canvas.min.js')}}"></script> --}}

  <script src="{{asset('js/main.js')}}"></script>

@endsection