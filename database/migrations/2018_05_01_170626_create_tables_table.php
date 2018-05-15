<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tables', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('room_id');
            $table->integer('offering_id')->nullable();
            $table->integer('seatcount');
            $table->integer('sX');
            $table->integer('sY');
            $table->integer('eX');
            $table->integer('eY');
            $table->integer('qX');
            $table->integer('qY');
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
        Schema::dropIfExists('tables');
    }
}
