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
            $table->integer('sX')->nullable();
            $table->integer('sY')->nullable();
            $table->integer('eX')->nullable();
            $table->integer('eY')->nullable();
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
