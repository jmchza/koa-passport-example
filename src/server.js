const Koa = require('koa');
// const session = require('koa-session');
const session = require("koa-generic-session")
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const mainRoutes = require('./routes');
const config = require('../config');

const app = new Koa();
const PORT = process.env.PORT || 3000;

var redis = require('redis');
var client = redis.createClient(config.redis_port,config.redis_host);

client.on('error', function (err) {
    console.log("Error " + err);
});
client.on("ready", function () {
  console.log("Cache is connected");
});

// sessions
app.keys = ['super-secret-key'];
app.use(session(app));

// body parser
app.use(bodyParser());

// authentication
const auth = require('./auth');
auth.setClient(client);

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(mainRoutes.routes());

// users setup
client.get("users", function (err, obj) {
  if(obj > 0){// this can be improved by checking whether is >= 0
    console.dir("Total clients in DB: " + obj);
  }else{
    console.dir("Initialising DB .....");
    client.set("users", "0");
    client.set("clients", "0");

    client.hset("client:"+0, [ 'id', '1', 'name', 'Samplr', 'clientId', 'abc123', 'clientSecret', 'ssh-secret', 'isTrusted', false ], function (err, res) {});
    client.incr("clients");
    client.hset("client:" +1, [ 'id', '2', 'name', 'Samplr2', 'clientId', 'xyz123', 'clientSecret', 'ssh-password', 'isTrusted', true ], function (err, res) {});
    client.incr("clients");

    client.get("clients", function (err, obj) {
      console.dir("Total clients loaded: " + obj);
    });

    client.hset("user:"+0, ['id', '1', 'username', 'bob', 'password', 'secret', 'name', 'Bob Smith' ] , function (err, res) {});
    client.incr("users");

    client.hset("user:"+1, [ 'id', '2', 'username', 'joe', 'password', 'password', 'name', 'Joe Davis' ],function (err, res) {});
    client.incr("users");

  }
});

// server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
