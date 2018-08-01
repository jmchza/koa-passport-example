'use strict';
var redis = require("redis");
var client;

module.exports.findById = (id, done) => {
  client.get("clients", function (err, counter) {
    for (let i = 0, len = counter; i < len; i++) {
      client.hgetall('client:'+i, function (err, obj) {
        if (err) done(new Error('Client Not Found'));
        if (obj.id === id) {
          done(null, obj);
        }
      });
    }
  });

};

module.exports.findByClientId = (clientId, done) => {
  console.log('accessed.......');
  client.get("clients", function (err, counter) {
    for (let i = 0, len = counter; i < len; i++) {
      client.hgetall('client:'+i, function (err, obj) {
        if (err) done(new Error('Client Not Found'));
        if (obj.clientId === clientId) {
          done(null, obj);
        }
      });
    }
  });
};

module.exports.setClient =  function(inClient) {
  client = inClient;
}
