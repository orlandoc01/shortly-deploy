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



