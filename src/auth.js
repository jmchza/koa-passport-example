const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');

passport.serializeUser((user, done) =>  done(null, user.id));

passport.deserializeUser((id, done) => {
  db.users.findById(id, (error, user) => done(error, user));
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('LocalStrategy...............................' + username + ' :: ' + password);
    db.users.findByUsername(username, (error, user) => {
      if (error) return done(error);
      if (!user) return done(null, false);
      if (user.password !== password) return done(null, false);
      return done(null, user);
    });
  }
));


module.exports.setClient =  function(inClient) {
  db.clients.setClient(inClient);
  db.users.setClient(inClient);
  db.authorizationCodes.setClient(inClient);
  db.accessTokens.setClient(inClient);
}
