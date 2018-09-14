<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Student extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // For some reason the seats key MUST contain some letters,
        // otherwise it gets lost when encoding to JSON.
        $enrollment = [];
        foreach($this->offerings as $offering):
            $enrollment['offering_' . $offering->id] = [
                'seat' => is_null($offering->pivot->assigned_seat) ? null : trim($offering->pivot->assigned_seat),
                'is_namespot_addition' => $offering->pivot->is_namespot_addition ? 1 : 0,
                'canvas_enrollment_state' => $offering->pivot->canvas_enrollment_state,
                'canvas_role' => $offering->pivot->canvas_role,
                'canvas_role_id' => $offering->pivot->canvas_role_id,
                'is_in_AIS' => $offering->pivot->is_in_AIS
            ];
        endforeach;

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'short_first_name' => $this->short_first_name,
            'short_full_name' => $this->short_full_name,
            'cnet_id' => $this->cnet_id,
            'nickname' => $this->nickname,
            'picture' => $this->picture,
            'enrollment' => $enrollment
        ];

    }
}
