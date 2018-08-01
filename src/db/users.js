'use strict';
var redis = require("redis");
var client;

module.exports.findById = (id, done) => {

  client.get("users", function (err, counter) {

    for (let i = 0, len = counter; i < len; i++) {
      client.hgetall('user:'+i, function (err, obj) {
        if (err) done(new Error('User Not Found'));
        // console.dir('resp:: ' + obj.username);
        if (obj.id === id) {
          done(null, obj);
        }
      });
    }
  });

};

module.exports.findByUsername = (username, done) => {
  client.get("users", function (err, counter) {

    for (let i = 0; i < counter; i++) {
      client.hgetall('user:'+i, function (err, obj) {
        if (err) done(new Error('User Not Found'));
        if (obj.username === username) {
          done(null, obj);
        }
      });
    }
  });

};

module.exports.setClient =  function(inClient) {
  client = inClient;
}
