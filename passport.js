var passport = require('passport');

var Local = require('passport-local');

var query = require('./queries.js');

passport.use(new Local(function(username, password, done){
  query.authenticate(username, password)
  .then(function(verified){
    if(!verified){
      //Throw Error Page
      done(new Error('incorrect username/password'));
      return;
      // Do not show error and just redirect to main page
      // done(null,false);
      // To show incorrect/invalid login and/or password on the main page, create javascript file in the public directly that will call $post on the post of that form and then use jquery to show that it was an incorrect login/password
    }
    query.find(username)
    .then(function(user){
      done(null,user);
    });
  });
}));

passport.serializeUser(function(user,done){
  done(null,user.username);
});

passport.deserializeUser(function(username,done){
  query.find(username)
  .then(function(user){
    done(null,user);
  });
});

module.exports = passport;
