var environment = process.env.NODE_ENV || 'development';
console.log('environment in knex.js',environment);
var config = require('../knexfile.js')[environment];
var knex = require('knex');

module.exports = require('knex')(config);
