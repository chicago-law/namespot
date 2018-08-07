<p>{{$job_message}}</p>
<ul>
  @foreach($errors_array as $error)
    <li>{{$error['api_request']}}
      <ul>
        <li>{{$error['api_response']}}</li>
        <li>{{$error['time']}}</li>
      </ul>
    </li>
  @endforeach
</ul>

