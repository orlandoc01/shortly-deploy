var path = require('path');

var db = require('mongoose');


var urlSchema = new db.Schema({
  url: {
    type: String,
    unique: true
  },
  baseUrl: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: Date
});
var Link = db.model('Link', urlSchema);

var userSchema = new db.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  createdAt: Date,
});

var User = db.model('User', userSchema);


module.exports = db;




// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });