//var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  createdAt: Date,
});


userSchema.pre('save', function(next) {
  bcrypt.hash(this.password, null, null, function(err, hash) {
    this.password = hash;
    next();
  }.bind(this)); 
});

userSchema.methods.comparePassword = function(testPassword, callback) {
  bcrypt.compare(testPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

var User = mongoose.model('User', userSchema);



module.exports = User;



// var User = db.Model.extend({
//   tableName: 'users',
//   hasTimestamps: true,
//   initialize: function() {
//     this.on('creating', this.hashPassword);
//   },
//   comparePassword: function(attemptedPassword, callback) {
//     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
//       callback(isMatch);
//     });
//   },
//   hashPassword: function() {
//     var cipher = Promise.promisify(bcrypt.hash);
//     return cipher(this.get('password'), null, null).bind(this)
//       .then(function(hash) {
//         this.set('password', hash);
//       });
//   }
// });


