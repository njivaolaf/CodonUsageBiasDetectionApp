'use strict';

var async = require('async');

module.exports = function (app, cb) {
  app.dataSources.pgsqlDS.autoupdate(function (err) {
    if (err) return cb(err);
var adminAccount = {
      username: 'admin', email: 'admin@admin.com', password: 'password'
    }, roles = [
      { name: 'admin' },
      { name: 'user' }
    ]   ;

    async.parallel([
      function (callback) {
       async.parallel(tasks(roles, 'name', 'Role'), function (e, newRoles) {
          if (e && e.statusCode !== 422)
            return callback(e);
          if (e && e.statusCode === 422 && e.name === 'ValidationError')
            return callback();
          app.models.Account.create(adminAccount, function (er, account) {
            if (er && er.statusCode !== 422)
              return callback(er);
            if (er && er.statusCode === 422 && er.name === 'ValidationError')
              return callback();
            newRoles[0].principals.create({
              principalType: app.models.RoleMapping.USER,
              principalId: account.id
            }, function (err, principal) {
              if (err) return callback(err);
                callback();
            });
          });
        });
      }
       

    ], function (err) {
      cb(err);
    });
  });

  function tasks(data, prop, model) {
    var tasks = [];
    for (var i = 0; i < data.length; i++) {
      tasks.push((function (i) {
        return function (callback) {
          app.models[model].findOrCreate({ where: { [prop]: data[i][prop] } }, data[i], function (err, data, created) {
            callback(err, data);
          });
        };
      })(i));
    }
    return tasks;
  }
};
