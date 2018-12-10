<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;

class SettingController extends Controller
{
  public function get()
  {
   $settings = Setting::all();

   $settings_array = [];

   foreach ($settings as $setting):
    $settings_array[$setting->setting_name] = $setting->setting_value;
   endforeach;

   return response()->json($settings_array);
  }

  public function update(Request $request)
  {
	 $settings = $request->all();

   foreach($settings as $key => $value) {
		 $setting = Setting::updateOrCreate(
			 ['setting_name' => $key],
			 ['setting_value' => $value]
			);
   }

   return response()->json('success');
  }
}
