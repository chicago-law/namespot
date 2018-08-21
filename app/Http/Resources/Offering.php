<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
// use App\Room;
// use App\Http\Resources\Room as RoomResource;
// use App\Http\Resources\Student as StudentResource;

class Offering extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        // create an array of student ids
        $student_ids = [];
        foreach($this->students as $student):
            $student_ids[] = $student->id;
        endforeach;

        // instructors
        $instructors = [];
        foreach ($this->instructors as $instructor):
            $instructors[] = [
                'first_name' => $instructor->first_name,
                'last_name' => $instructor->last_name,
            ];
        endforeach;

        // sort instructors alphabetically by last name
        uasort($instructors, function ($a, $b) {
            return $a['last_name'] < $b['last_name'] ? -1 : 1;
        });

        return [
            'id' => $this->id,
            'room_id' => $this->room_id,
            'long_title' => $this->long_title,
            'catalog_nbr' => $this->catalog_nbr,
            'section' => $this->section,
            'term_code' => $this->term_code,
            'instructors' => $instructors,
            'students' => $student_ids,
            'paper_size' => $this->paper_size,
            'font_size' => $this->font_size,
            'flipped' => $this->flipped,
            'names_to_show' => is_null($this->names_to_show) ? null : (int) $this->names_to_show,
            'use_nicknames' => is_null($this->use_nicknames) ? null : (int) $this->use_nicknames,
        ];
    }
}
