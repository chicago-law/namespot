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
            'sX' => is_null($this->sX) ? null : (int) $this->sX,
            'sY' => is_null($this->sY) ? null : (int) $this->sY,
            'eX' => is_null($this->eX) ? null : (int) $this->eX,
            'eY' => is_null($this->eY) ? null : (int) $this->eY,
            'qX' => is_null($this->qX) ? null : (int) $this->qX,
            'qY' => is_null($this->qY) ? null : (int) $this->qY,
        ];
    }
}
