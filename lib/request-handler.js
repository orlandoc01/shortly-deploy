var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');

var User = require('../app/models/user');
var Link = require('../app/models/link');
Promise.promisifyAll(Link);
Promise.promisifyAll(User);
util.getUrlTitleAsync = Promise.promisify(util.getUrlTitle);

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.findAsync()
  .then(function(links) {
    res.send(200, links);
  })
  .catch(function(err) {
    res.send(500, err);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOneAsync({ url: uri })
  .then(function(found) {
    if (found) {
      res.send(200, found);
    } else {
      util.getUrlTitleAsync(uri)
      .then( function(title) {
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save(function(err) {
          //  TODO: HANDLE ERROR
          if(err) {
            res.send(500, err);
          }
          res.send(200, newLink);
        });
      })
      .catch(function(err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      });
    }
  })
  .catch(function(err) {
    console.log('error: ' + err);
    res.send(500, err);
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOneAsync({ username: username })
  .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePasswordAsync(password)
        .then(function(match) {
          if (match) {
            console.log('password matched');
            util.createSession(req, res, user);
          } else {
            console.log('password didnt match');
            res.redirect('/login');
          }
        });
      }
  })
  .catch(function(err) {
    res.send(500, err);
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

    User.findOneAsync({ username: username })
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err) {
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    })
    .catch(function(err) {
      res.send(500, err);
    });
};

exports.navToLink = function(req, res) {
  Link.findOneAsync({ code: req.params[0] })
  .then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits = link.visits + 1;
      link.save(function(err) {
          return res.redirect(link.get('url'));
        });
    }
  })
  .catch(function(err) {
    res.send(500, err);
  });
};