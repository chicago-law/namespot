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
        // Create array of Offering IDs and corresponding assigned seat.
        // For some reason the seats key MUST contain some letters,
        // otherwise it gets lost when encoding to JSON.
        $seats = [];
        foreach($this->offerings as $offering):
            $seats['offeringid_' . $offering->id] = $offering->pivot->assigned_seat;
        endforeach;

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'nickname' => $this->nickname,
            'email' => $this->email,
            'seats' => $seats
        ];
    }
}
