//var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var mongoose = require('mongoose');

Promise.promisifyAll(bcrypt);

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
  bcrypt.hashAsync(this.password, null, null)
  .then(function(hash) {
    this.password = hash;
    next();
  }.bind(this))
  .catch(function(err) {
    throw err;
  }); 
});

userSchema.methods.comparePasswordAsync = function(testPassword) {
  return bcrypt.compareAsync(testPassword, this.password);
};

//userSchema.methods.comparePasswordAsync = Promise.promisify(userSchema.methods.comparePassword);

var User = mongoose.model('User', userSchema);



module.exports = User;



