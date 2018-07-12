<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInstructorOfferingPivotTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('instructor_offering', function (Blueprint $table) {
            $table->integer('instructor_id')->unsigned()->index();
            $table->foreign('instructor_id')->references('id')->on('instructors')->onDelete('cascade');
            $table->integer('offering_id')->unsigned()->index();
            $table->foreign('offering_id')->references('id')->on('offerings')->onDelete('cascade');
            $table->primary(['instructor_id', 'offering_id']);
            $table->string('role')->nullable();
            $table->string('role_descr')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('instructor_offering');
    }
}
