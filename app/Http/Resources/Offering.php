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

        return [
            'id' => $this->id,
            'room_id' => $this->room()->first()->id,
            'name' => $this->name,
            'course_num' => $this->course_num,
            'term_code' => $this->term_code,
            'instructors' => $this->instructors()->get(),
            'students' => $student_ids
        ];
    }
}
