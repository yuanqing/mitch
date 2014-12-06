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

  var split = pattern.match(new RegExp('\\*|{(.+?)}|([^*{}]+)', 'g')) || [];

  var groups = [];
  var regex = '';

  var i, len, str, adjacentChar;

  for (i = 0, len = split.length; i < len; ++i) {
    str = split[i];
    if (str === '*' || str[0] === '{') {
      str = str.substring(1, str.length-1).trim();
      if (i < len - 1) {
        adjacentChar = split[i+1][0];
      } else {
        if (i > 0) {
          adjacentChar = split[i-1].slice(-1);
        } else {
          adjacentChar = false;
        }
      }
      if (adjacentChar === '*') {
        adjacentChar = false;
      }
      if (str === '*') {
        regex += '(?:';
      } else {
        regex += '(';
        groups.push(str);
      }
      if (adjacentChar) {
        regex += '[^' + escape(adjacentChar) + ']+)';
      } else {
        regex += '.+)';
      }
    } else {
      regex += escape(str);
    }
  }
  regex = new RegExp('^' + regex + '$', 'm');

  return function(str) {
    var matches = regex.exec(str);
    var obj;
    if (!groups.length) {
      return matches ? true : false;
    }
    obj = isDigit(groups[0][0]) ? [] : {};
    if (!matches) {
      return false;
    }
    matches.shift();
    for (i = 0, len = groups.length; i < len; ++i) {
      jaunt.set(obj, groups[i], stereotype(matches[i]));
    }
    return obj;
  };

};

exports = module.exports = mitch;
