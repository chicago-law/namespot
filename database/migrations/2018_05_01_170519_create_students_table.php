<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->increments('id');
            $table->string('canvas_id')->nullable();
            $table->string('nickname')->nullable();
            $table->string('picture')->nullable();
            $table->timestamps();
            $table->string('emplid')->nullable();
            $table->string('sortable_name')->nullable();
            $table->string('full_name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('short_full_name')->nullable();
            $table->string('short_first_name')->nullable();
            $table->string('short_last_name')->nullable();
            $table->string('cnet_id')->nullable();
            $table->tinyInteger('is_ferpa')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('academic_career')->nullable();
            $table->string('academic_prog')->nullable();
            $table->string('academic_prog_descr')->nullable();
            $table->string('academic_level')->nullable();
            $table->string('exp_grad_term')->nullable();
            $table->string('email')->nullable();
            $table->string('prefix', 25)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
}
