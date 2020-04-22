<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OfferingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
         // instructors
        $instructors = [];
        foreach ($this->instructors as $instructor):
            $instructors[] = [
                'cnet_id' => $instructor->cnet_id,
                'first_name' => utf8_encode($instructor->first_name),
                'last_name' => utf8_encode($instructor->last_name),
            ];
        endforeach;

        // sort instructors alphabetically by last name
        uasort($instructors, function($a, $b) {
            return $a['last_name'] < $b['last_name'] ? -1 : 1;
        });

        return [
            // IDs are never null and stored as int, but we want them strings for front end.
            'id' => (string) $this->id,
            'room_id' => stringOrNull($this->room_id),
            // We never use AIS's title field, which is length limited so it looks bad.
            // Use our title() method to grab long_title when it's available.
            'title' => $this->title(),
            'class_nbr' => $this->class_nbr,
            'catalog_nbr' => $this->catalog_nbr,
            'section' => $this->section,
            'term_code' => intOrNull($this->term_code),
            // Temporarily, we'll fall back to "LAWS" if this is null.
            'subject' => !is_null($this->subject) ? $this->subject : 'LAWS',
            'instructors' => $instructors,
            'manually_created_by' => stringOrNull($this->manually_created_by),
            'paper_size' => $this->paper_size,
            'font_size' => $this->font_size,
            'names_to_show' => $this->names_to_show,
            'flipped' => intOrNull($this->flipped),
            'use_nicknames' => intOrNull($this->use_nicknames),
            'use_prefixes' => intOrNull($this->use_prefixes),
            'updated_at' => !is_null($this->updated_at) ? $this->updated_at : null
        ];
    }
}
