/**
 * External dependencies.
 */

var graphviz = require('graphviz');

/**
 * Dot reporter.
 *
 * @param {Object} deps
 * @param {Function} debug
 * @constructor
 */

function Dot(deps, debug) {
  this.deps = deps;
  this.debug = debug;
}

/**
 * Render.
 *
 * @param {String} output name, without .png
 * @api public
 */

Dot.prototype.render = function(name) {
  var g = graphviz.digraph('G');

  Object.keys(this.deps).forEach(function(dep) {
    if (!g.getNode(dep)) g.addNode(dep);
    this.deps[dep].forEach(function(child) {
      g.addNode(child);
      g.addEdge(dep, child);
    });
  }, this);

  g.output('png', name + '.png');
  this.debug('Output %s.png', name);
};

/**
 * Primary export.
 */

module.exports = Dot;
