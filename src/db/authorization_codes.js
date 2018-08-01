'use strict';

var redis = require("redis");
var client;

module.exports.find = (key, done) => {
  console.log('Code: ' + key);
  client.hgetall(key, function (err, obj) {
      if (err) done(new Error('Code Not Found'));
      done(null, obj);
  });

};

module.exports.findByUserIdAndClientId = (userId, clientId, done) => {
  console.log('userId: ' + userId+ ' clientId: ' + clientId);
  for (var token in tokens) {
    if (tokens[token].userId == userId && tokens[token].clientId == clientId) return done(null, token);
  }
  return done(new Error('Token Not Found'));
};

module.exports.save = (token, userId, clientId, done) => {
  console.log('Persisting new Code in DB: ' + token);
  client.hset(token, [ 'userId', userId, 'clientId', clientId], redis.print);
  done();
};

module.exports.setClient =  function(inClient) {
  client = inClient;
}
