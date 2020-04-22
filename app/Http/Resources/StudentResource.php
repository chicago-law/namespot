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
            'first_name' => $this->firstName(),
            'middle_name' => $this->middleName(),
            'last_name' => $this->lastName(),
            'short_first_name' => $this->shortFirstName(),
            'short_last_name' => $this->shortLastName(),
            'nickname' => $this->nickname,
            'prefix' => $this->prefix,
            'picture' => $this->picture === null ? 'no-face.png' : $this->picture,
            'academic_prog_descr' => $this->academic_prog_descr,
            'academic_level' => $this->academic_level,
        ];
    }
}
