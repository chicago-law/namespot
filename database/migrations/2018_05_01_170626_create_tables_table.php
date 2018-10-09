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
            $table->integer('seat_count')->nullable();
            $table->integer('sX');
            $table->integer('sY');
            $table->integer('eX');
            $table->integer('eY');
            $table->integer('qX')->nullable();
            $table->integer('qY')->nullable();
            $table->string('label_position')->nullable();
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
