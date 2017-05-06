var http = require('http');
var fs = require('fs');
var proto = require('./test');
var mixin = require('merge-descriptors');
var request = require("request");
var express = require('express');
var router = express.Router();
var flatten = require('array-flatten');
var slice = Array.prototype.slice;

var use = function(fn) {
	console.log(fn);
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate app.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var fns = flatten(slice.call(arguments, offset));
	console.log(fns);
  if (fns.length === 0) {
    throw new TypeError('app.use() requires middleware functions');
  }

  // setup router
  this.lazyrouter();
  var router = this._router;

  fns.forEach(function (fn) {
    // non-express app
    if (!fn || !fn.handle || !fn.set) {
      return router.use(path, fn);
    }

    debug('.use app under %s', path);
    fn.mountpath = path;
    fn.parent = this;

    // restore .app property on req and res
    router.use(path, function mounted_app(req, res, next) {
      var orig = req.app;
      fn.handle(req, res, function (err) {
        setPrototyeOf(req, orig.request)
        setPrototyeOf(res, orig.response)
        next(err);
      });
    });

    // mounted an app
    fn.emit('mount', this);
  }, this);

  return this;
};

use('/norm', router);