<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOfferingStudentPivotTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('offering_student', function (Blueprint $table) {
            $table->integer('offering_id')->unsigned()->index();
            $table->foreign('offering_id')->references('id')->on('offerings')->onDelete('cascade');
            $table->integer('student_id')->unsigned()->index();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->primary(['offering_id', 'student_id']);
            $table->string('assigned_seat')->nullable();
            $table->tinyInteger('is_namespot_addition')->nullable();
            $table->string('canvas_enrollment_state')->nullable();
            $table->string('canvas_role')->nullable();
            $table->tinyInteger('canvas_role_id')->nullable();
            $table->tinyInteger('is_in_ais')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('offering_student');
    }
}
