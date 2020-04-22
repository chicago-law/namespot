<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TableResource extends JsonResource
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
            'id' => (string) $this->id,
            'room_id' => (string) $this->room_id,
            'seat_count' => (int) $this->seat_count,
            'label_position' => is_null($this->label_position) ? null : trim($this->label_position),
            'sX' => intOrNull($this->sX),
            'sY' => intOrNull($this->sY),
            'eX' => intOrNull($this->eX),
            'eY' => intOrNull($this->eY),
            'qX' => intOrNull($this->qX),
            'qY' => intOrNull($this->qY),
        ];
    }
}
