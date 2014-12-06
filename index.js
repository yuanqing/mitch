'use strict';

var jaunt = require('jaunt');
var stereotype = require('stereotype');

var escape = function(str) {

  return str.replace(/([.*+?^{}()|\[\]\/\\])/g, '\\$1');

};

var isDigit = function(c) {

  return c >= '0' && c <= '9';

};

var mitch = function(pattern) {

  var groups = [];
  var regex = '';

  var curr = '';
  var c = '';
  var i;
  var len;

  for (i = 0, len = pattern.length; i < len; ++i) {
    switch (pattern[i]) {
    case '{':
      if (i !== 0) {
        c = pattern[i-1];
      }
      regex += '' + escape(curr);
      curr = '';
      break;
    case '}':
      if (i + 1 < len) {
        c = pattern[i+1];
      }
      if (c === '') {
        regex += '(.+)';
      } else {
        regex += '([^' + escape(c) + ']+)';
      }
      groups.push(curr.trim());
      curr = '';
      break;
    default:
      curr += pattern[i];
    }
  }
  regex = new RegExp('^' + regex + escape(curr) + '$', 'm'); // RegExp is cached

  return function(str) {
    var matches, obj;
    if (!groups.length) {
      return str === pattern;
    }
    obj = isDigit(groups[0][0]) ? [] : {};
    matches = regex.exec(str);
    if (!matches) {
      return false;
    }
    matches.shift();
    groups.forEach(function(group, i) {
      jaunt.set(obj, group, stereotype(matches[i]));
    });
    return obj;
  };

};

exports = module.exports = mitch;
