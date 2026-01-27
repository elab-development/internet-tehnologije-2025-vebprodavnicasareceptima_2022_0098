<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {

            $table->foreignId('recipe_id')
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_id')
                ->after('recipe_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->decimal('quantity', 12, 2)
                ->after('product_id');

            $table->dropColumn(['name', 'price']);
        });
    }

    public function down(): void
    {
        Schema::table('ingredients', function (Blueprint $table) {

            $table->string('name');
            $table->decimal('price', 12, 2);

            $table->dropForeign(['recipe_id']);
            $table->dropForeign(['product_id']);

            $table->dropColumn([
                'recipe_id',
                'product_id',
                'quantity'
            ]);
        });
    }
};