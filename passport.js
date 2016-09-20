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
