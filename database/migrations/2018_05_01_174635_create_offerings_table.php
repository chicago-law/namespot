<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOfferingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offerings', function (Blueprint $table) {
            // ids
            $table->increments('id');
            $table->string('catalog_nbr')->nullable();
            $table->string('crse_id')->nullable();
            $table->string('class_nbr')->nullable();
            $table->string('section')->nullable();

            // names
            $table->string('title')->nullable();
            $table->string('long_title')->nullable();
            $table->string('component')->nullable();
            $table->string('component_descr')->nullable();

            // location
            $table->string('room_id')->nullable();
            $table->tinyInteger('is_preserve_room_id')->nullable();
            $table->string('ais_room')->nullable();
            $table->string('ais_room_capacity')->nullable();
            $table->string('ais_location')->nullable();
            $table->string('building')->nullable();
            $table->string('building_desc')->nullable();

            // when
            $table->string('term_code')->nullable();
            $table->string('days')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->string('start_dt')->nullable();
            $table->string('end_dt')->nullable();

            // enrollment
            $table->string('enrl_cap')->nullable();
            $table->string('enrl_tot')->nullable();

            // seating chart preferences
            $table->string('paper_size')->nullable();
            $table->string('font_size')->nullable();
            $table->string('names_to_show')->nullable();
            $table->boolean('use_nicknames')->nullable()->default(1);
            $table->boolean('flipped')->nullable();

            // timestamps
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('offerings');
    }
}
