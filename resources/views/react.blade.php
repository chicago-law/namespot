@extends('layouts/master')

@section('content')

  <div
    id='root'
    data-root-url='{{asset("")}}'
    data-academic-year=@if(isset($academic_year))"{{$academic_year}}" @else "2018" @endif
    data-authed-user=@if(Auth::check())"{{auth()->user()->id}}" @else "" @endif
  ></div>

  <?php if (config('app.env') === 'local') { ?>
    <script src="{{asset('/js/main.js')}}"></script>
  <?php } else { ?>
    <script src="{{mix('/js/main.js')}}"></script>
  <?php } ?>

@endsection