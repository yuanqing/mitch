'use strict';

var jaunt = require('jaunt');
var stereotype = require('stereotype');

var mitchRegex = /\*|\(.+?\)|{.+?}|([^*{(]+)/g;
// eg. 'foo{bar}*(baz)' => ['foo', '{bar}', '*', 'baz']

var parseOptionsRegex = /\*|[^*]+/g;
// eg. 'foo*bar' => ['foo', '*', 'bar']

var forEach = function(arr, fn) {
  var i, len = arr.length;
  for (i = 0; i < len; ++i) {
    if (fn(arr[i], i) === false) {
      return;
    }
  }
};

var escape = function(str) {
  return str.replace(/([.*+?^{}()|\[\]\/\\])/g, '\\$1');
};

var getLastChar = function(previous) {
  return previous && previous !== '*' ? previous.slice(-1) : false;
};

var getFirstChar = function(next) {
  return next && next !== '*' ? next[0] : false;
};

var isAllNumeric = function(arr) {
  var allNumeric = true;
  forEach(arr, function(key) {
    if (key[0] < '0' || key[0] > '9') {
      allNumeric = false;
      return false;
    }
  });
  return allNumeric;
};

var compileGroup = function(adjacentChar, capture) {
  var regex = '(';
  if (!capture) {
    regex += '?:';
  }
  return regex + (adjacentChar ? '[^' + escape(adjacentChar) + ']+)' : '.+)');
};

var parseOptions = function(options, prevChar, nextChar) {

  var regex = [];
  var optionRegex;
  var chunks;

  options = options.split('|');
  forEach(options, function(option) {
    optionRegex = [];
    chunks = option.match(parseOptionsRegex) || [];
    forEach(chunks, function(chunk, i) {
      if (chunk === '*') {
        prevChar = getLastChar(chunks[i-1]) || prevChar;
        nextChar = getFirstChar(chunks[i+1]) || nextChar;
        optionRegex.push(compileGroup(nextChar || prevChar));
      } else {
        optionRegex.push(escape(chunk));
      }
    });
    if (optionRegex.length) {
      regex.push(optionRegex.join(''));
    }
  });

  return '(?:' + regex.join('|') + ')';

};

var mitch = function(pattern, caseSensitive) {

  caseSensitive = caseSensitive === true || false;

  var regex = [];
  var groups = [];
  var firstChar, prevChar, nextChar;
  var chunks = pattern.match(mitchRegex) || [];

  forEach(chunks, function(chunk, i) {
    if (chunk === '*' || chunk[0] === '{' || chunk[0] === '(') {
      prevChar = getLastChar(chunks[i-1]);
      nextChar = getFirstChar(chunks[i+1]);
      if (chunk === '*') {
        regex.push(compileGroup(nextChar || prevChar));
      } else {
        firstChar = chunk[0];
        chunk = chunk.substring(1, chunk.length-1); // drop the first and last chars
        if (firstChar === '{') {
          chunk = chunk.trim();
          groups.push(chunk);
          regex.push(compileGroup(nextChar || prevChar, true));
        } else {
          regex.push(parseOptions(chunk, prevChar, nextChar));
        }
      }
    } else {
      regex.push(escape(chunk));
    }
  });

  regex = new RegExp('^' + regex.join('') + '$', caseSensitive ? 'm' : 'mi');

  return function(str) {
    var matches = regex.exec(str);
    var obj;
    if (!groups.length) {
      return matches ? true : false;
    }
    obj = isAllNumeric(groups) ? [] : {};
    if (!matches) {
      return false;
    }
    matches.shift();
    forEach(groups, function(str, i) {
      jaunt.set(obj, str, stereotype(matches[i]));
    });
    return obj;
  };

};

exports = module.exports = mitch;
