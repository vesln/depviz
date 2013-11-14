/**
 * External dependencies.
 */

var request = require('superagent');

/**
 * Dependency finder.
 *
 * @param {String} module name
 * @constructor
 */

function Deps(name, http) {
  this.name = name;
  this.http = http || request;
  this.url = 'http://registry.npmjs.org/';
}

/**
 * Find the dependencies of `name`.
 *
 * @param {Function} fn
 * @api public
 */

Deps.prototype.find = function(fn) {
  this.search(this.name, fn);
};

/**
 * Search for the dependencies of `name`.
 *
 * @param {String} name
 * @param {Function} end
 * @param {Object} [store]
 * @api private
 */

Deps.prototype.search = function(name, end, store) {
  var self = this;
  store = store || Object.create(null);

  if (store[name]) return end(null, store);
  store[name] = [];

  this.fetch(name, function(err, res) {
    if (!Object.keys(res.body).length) {
      return end(new Error('Module ' + name + ' cannot be found'));
    }
    if (err) return end(err);

    var ver = res.body['dist-tags'].latest;
    var dependencies = Object.keys(res.body.versions[ver].dependencies || {});
    if (dependencies.length === 0) return end();
    var i = 0;

    function done(err) {
      if (err) return end(err);
      if (++i >= dependencies.length) end(null, store);
    }

    dependencies.forEach(function(key) {
      store[name].push(key);
      self.search(key, done, store);
    }, this);
  });
};

/**
 * Fetch the module data for `name`.
 *
 * @param {String} name
 * @param {Function} fn
 * @api private
 */

Deps.prototype.fetch = function(name, fn) {
  this.http(this.url + name, fn);
};

/**
 * Primary export.
 */

module.exports = Deps;
