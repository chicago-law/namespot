@extends('master')

@section('content')

<style>
  body {
    padding: 1em;
    font-family: 'sans-serif';
  }
</style>

<div class='error-container'>
  <main>
    <img src={{asset('images/namespot-logo-bw.png')}} /><br/>
    <h3>Error 401: Not Authorized</h3>
    <p>It doesn't appear that you're authorized to visit this site. If you believe this is a mistake, you may e-mail the Law School's IT Helpdesk at <a href="mailto:helpdesk@law.uchicago.edu?subject=Requesting access to Namespot">helpdesk@law.uchicago.edu</a>. Thank you.</p>
  </main>

</div>

@endsection