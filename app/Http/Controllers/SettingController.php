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
        $setting = Setting::updateOrCreate(
            ['setting_name' => $request->input('setting_name')],
            ['setting_value' => $request->input('setting_value')]
        );

        return response()->json('success');
    }
}
