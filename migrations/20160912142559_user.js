
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table){
    table.increments();
    table.string('username');
    table.string('password');
    table.boolean('admin');
    table.string('fullName');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
