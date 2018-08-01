'use strict';
var redis = require("redis");
var client;

module.exports.find = (key, done) => {
  client.hgetall(key, function (err, obj) {
      if (err) done(new Error('Token Not Found'));
      done(null, obj);
  });
};

module.exports.findByUserIdAndClientId = (userId, clientId, done) => {
  console.log(userId + ' cID: ' + clientId);
  client.hgetall(userId +':'+clientId, function (err, obj) {
    if (err) done(new Error('Token Not Found'));
    if(!obj) done(new Error('Token Not Found'));
    done(null, obj);
  });


};

module.exports.save = (token, userId, clientId, done) => {
  console.log('Persisting new token: ' + token + ' for userId: ' + userId + ' clientId: ' + clientId);
  client.hset(userId +':'+clientId, [ 'token', token], redis.print);
  client.hset(token, [ 'userId', userId, 'clientId', clientId], redis.print);
  done();
};

module.exports.setClient =  function(inClient) {
  client = inClient;
}
