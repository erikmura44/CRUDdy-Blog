
exports.up = function(knex, Promise) {
  return knex.schema.createTable('blog', function(table){
    table.increments();
    table.string('title');
    table.text('content');
    table.integer('user_id').references('id').inTable('user');
    table.string('user_fullName');
    table.text('snippet');
    table.string('imageURL');
    table.timestamps(null,true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('blog');
};
