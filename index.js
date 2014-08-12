'use strict';

var stereotype = require('stereotype');

var escape = function(str) {

  return str.replace(/([.*+?^{}()|\[\]\/\\])/g, '\\$1');

};

var mitch = function(pattern) {

  var keys = [],
      regex = '',
      curr = '',
      len = pattern.length,
      c = '', i;
  for (i = 0; i < len; ++i) {
    switch (pattern[i]) {
    case '{':
      if (i !== 0) {
        c = pattern[i-1];
      }
      regex += '' + escape(curr);
      curr = '';
      break;
    case '}':
      if (i+1 < len) {
        c = pattern[i+1];
      }
      if (c === '') {
        regex += '(.+)';
      } else {
        regex += '([^' + escape(c) + ']+)';
      }
      keys.push(curr.trim());
      curr = '';
      break;
    default:
      curr += pattern[i];
    }
  }
  regex = new RegExp('^' + regex + curr + '$', 'm'); // RegExp is cached

  return function(str) {
    var matches, obj = {};
    if (!keys.length) {
      return str === pattern;
    }
    matches = regex.exec(str);
    if (!matches) {
      return false;
    }
    matches.shift();
    keys.forEach(function(key, i) {
      obj[key] = stereotype(matches[i]);
    });
    return obj;
  };

};

exports = module.exports = mitch;
