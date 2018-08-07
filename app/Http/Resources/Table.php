<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class Table extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'room_id' => $this->room_id,
            'seat_count' => $this->seat_count,
            'label_position' => $this->label_position,
            'sX' => $this->sX,
            'sY' => $this->sY,
            'eX' => $this->eX,
            'eY' => $this->eY,
            'qX' => $this->qX,
            'qY' => $this->qY,
        ];
    }
}
