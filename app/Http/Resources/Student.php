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
        $manual_attachments = [];
        foreach($this->offerings as $offering):
            $seats['offering_' . $offering->id] = $offering->pivot->assigned_seat;
            if ($offering->pivot->manually_attached):
                $manual_attachments["offering_{$offering->id}"] = 1;
            endif;
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
            'seats' => $seats,
            'manual_attachments' => $manual_attachments
        ];
    }
}
