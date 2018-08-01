const Router = require('koa-router');
const passport = require('koa-passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const fs = require('fs');
const config = require('../config');
const oauth2 = require('./oauth2');
const db = require('./db');
const router = new Router();

router.get('/', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('./src/pages/login.ejs');
})

router.post('/custom', async (ctx) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user === false) {
      ctx.body = { success: false };
      ctx.throw(401);
    } else {
      ctx.body = { success: true };
      return ctx.login(user)
    }
  })(ctx)
})

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/auth/oauth2-example',
    failureRedirect: '/'
  })
)

router.get('/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})

router.get('/app', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./src/views/app.html');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})
//----------------
passport.use('oauth2-example', new OAuth2Strategy({
    authorizationURL: config.oauth2ServerBaseUrl + config.authorizationUrl,
    tokenURL: config.oauth2ServerBaseUrl + config.tokenUrl,
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackUrl
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('accessToken: ========= ' + accessToken);
    console.log('refreshToken: ========== ' + refreshToken);
    console.log('profile: ========= ' + profile);
  }
));


router.get('/auth/oauth2-example', passport.authenticate('oauth2-example'))

router.get('/auth/oauth2/authorize',
  // oauth2.login.ensureLoggedIn(),
  // console.log('authenticated....' + ctx.state.user);
  // const clientId = ctx.state.user;
  oauth2.server.authorization( (clientId, redirectUri) => {
    db.clients.findByClientId(clientId, (error, resp) => {
      if (error) return done(error);

      return [resp, redirectUri];
    })
    }),
    (ctx) => {
      ctx.redirect('/');
      // res.render('dialog', { transactionID: ctx.state.oauth2.transactionID,
      //                      user: ctx.state.user, client: ctx.state.oauth2.client });

      // console.log(client);
      // // Check if grant request qualifies for immediate approval
      // console.log('client.isTrusted: ' + client.isTrusted);
      // // Auto-approve
      // if (client.isTrusted) return done(null, true);
      //
      // db.accessTokens.findByUserIdAndClientId(user.id, client.clientId, (error, token) => {
      //   // Auto-approve
      //   if (token) return done(null, true);
      //
      //   // Otherwise ask user
      //   return done(null, false);
      // });
    }

);
router.post('/auth/oauth2/authorize/decision', function (ctx, next){
  if (ctx.isAuthenticated()) {
    oauth2.server.decision()
    return next()
  } else {
    ctx.redirect('/')
  }
}

 );

router.post('/auth/oauth2/token',
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  oauth2.server.token(),
  oauth2.server.errorHandler()
);


module.exports = router;
