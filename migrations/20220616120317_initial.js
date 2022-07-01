/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('users').then(function (exists) {
        if (!exists) {
            return knex.schema.createTable('users', function(table) {
                table.increments('id').primary();
                table.string("username").unique();
                table.string("hashedPassword");
            })
        }
    }).then(function(){
        return knex.schema.hasTable("posts").then(function (exists) {
            if (!exists){
                return knex.schema.createTable('posts', function(table) {
                    table.increments('id').primary();
                    table.string("postText", 1000);
                    table.dateTime("created").defaultTo(knex.fn.now());
                    table.integer("author").unsigned();
                    table.foreign("author").references("users.id");
                });
            }
        })
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable('posts')
    .dropTable('users')
};
