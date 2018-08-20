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
            'label_position' => is_null($this->label_position) ? null : trim($this->label_position),
            'sX' => (int) $this->sX,
            'sY' => (int) $this->sY,
            'eX' => (int) $this->eX,
            'eY' => (int) $this->eY,
            'qX' => (int) $this->qX,
            'qY' => (int) $this->qY,
        ];
    }
}
