<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'cnet_id' => $this->cnet_id,
            'first_name' => $this->first_name,
            'middle_name' => $this->middle_name !== null ? $this->middle_name : null,
            'last_name' => $this->last_name,
            'short_first_name' => $this->short_first_name ? $this->short_first_name : $this->first_name,
            'short_last_name' => $this->short_last_name ? $this->short_last_name : $this->last_name,
            'nickname' => $this->nickname,
            'prefix' => $this->prefix,
            'picture' => $this->picture === null ? 'no-face.png' : $this->picture,
            'academic_prog_descr' => $this->academic_prog_descr,
            'academic_level' => $this->academic_level,
        ];
    }
}
