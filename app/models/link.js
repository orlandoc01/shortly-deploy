// var db = require('../config');
var crypto = require('crypto');

var path = require('path');

var mongoose = require('mongoose');


var urlSchema = new mongoose.Schema({
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

urlSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

var Link = mongoose.model('Link', urlSchema);


// var Link = function(params) {
//   mongoose.model('Link', urlSchema).call(this, params);
// }



 
      // var shasum = crypto.createHash('sha1');
      // shasum.update(url);
      // var code = shasum.digest('hex').slice(0, 5);


module.exports = Link;
