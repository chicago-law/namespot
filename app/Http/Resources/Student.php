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
                'canvas_role' => $offering->pivot->canvas_role,
                'canvas_enrollment_state' => $offering->pivot->canvas_enrollment_state,
                'ais_enrollment_state' => $offering->pivot->ais_enrollment_state,
                'ais_enrollment_reason' => $offering->pivot->ais_enrollment_reason,
                'is_in_ais' => (int) $offering->pivot->is_in_ais,
                'is_namespot_addition' => (int) $offering->pivot->is_namespot_addition
            ];
        endforeach;

        return [
            'id' => $this->id,
            'cnet_id' => $this->cnet_id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name !== null ? $this->middle_name : null,
            'last_name' => $this->last_name,
            'short_first_name' => $this->short_first_name,
            'short_full_name' => $this->short_full_name,
            'nickname' => $this->nickname,
            'picture' => $this->picture === null ? 'no-face.png' : $this->picture,
            'academic_prog_descr' => $this->academic_prog_descr,
            'academic_level' => $this->academic_level,
            'enrollment' => $enrollment
        ];

    }
}
