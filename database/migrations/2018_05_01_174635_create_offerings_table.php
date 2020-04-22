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
            $table->increments('id');
            $table->string('catalog_nbr')->nullable();
            $table->string('crse_id')->nullable();
            $table->string('class_nbr')->nullable();
            $table->string('section')->nullable();
            $table->string('title')->nullable();
            $table->string('long_title')->nullable();
            $table->string('component')->nullable();
            $table->string('component_descr')->nullable();
            $table->string('room_id')->nullable();
            $table->string('ais_room')->nullable();
            $table->string('ais_location')->nullable();
            $table->string('building')->nullable();
            $table->string('building_desc')->nullable();
            $table->string('term_code')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->string('start_dt')->nullable();
            $table->string('end_dt')->nullable();
            $table->string('enrl_cap')->nullable();
            $table->string('enrl_tot')->nullable();
            $table->timestamps();
            $table->string('paper_size')->nullable();
            $table->string('names_to_show')->nullable();
            $table->string('ais_room_capacity')->nullable();
            $table->string('days')->nullable();
            $table->string('font_size')->nullable();
            $table->boolean('flipped')->nullable();
            $table->boolean('use_nicknames')->nullable()->default(1);
            $table->tinyInteger('is_preserve_room_id')->nullable();
            $table->string('subject', 50)->nullable();
            $table->tinyInteger('use_prefixes')->nullable();
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
