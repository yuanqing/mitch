!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mitch=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var jaunt = require('jaunt');
var stereotype = require('stereotype');

var escape = function(str) {

  return str.replace(/([.*+?^{}()|\[\]\/\\])/g, '\\$1');

};

var mitch = function(pattern) {

  var groups = [],
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
      groups.push(curr.trim());
      curr = '';
      break;
    default:
      curr += pattern[i];
    }
  }
  regex = new RegExp('^' + regex + curr + '$', 'm'); // RegExp is cached

  return function(str) {
    var matches, obj, c;
    if (!groups.length) {
      return str === pattern;
    }
    c = groups[0][0]; // first character of first group
    obj = c >= '0' && c <= '9' ? [] : {};
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

},{"jaunt":2,"stereotype":3}],2:[function(require,module,exports){
'use strict';

var isArray = function(obj) {

  return Object.prototype.toString.call(obj) === '[object Array]';

};

var isString = function(obj) {

  return typeof obj === 'string';

};

var isInteger = function(obj) {

  var num = parseFloat(obj);
  return isFinite(obj) && !isNaN(num) && num % 1 === 0;

};

var trimKey = function(key) {

  return isString(key) ? key.trim() : key; // only trim if `key` is a string

};

var jaunt = {};

jaunt.set = function(obj, path, val) {

  var o, key;
  var i, len;

  if (!isArray(path)) {
    path = isString(path) ? path.split('.') : [path];
  }

  o = obj;
  for (i = 0, len = path.length-1; i < len; ++i) {
    key = trimKey(path[i]);
    if (!(key in o)) {
      o[key] = isInteger(path[i+1]) ? [] : {};
    }
    o = o[key];
  }
  o[trimKey(path[path.length-1])] = val;
  return obj;

};

jaunt.get = function(obj, path) {

  var key;
  var i, len;

  if (!isArray(path)) {
    path = isString(path) ? path.split('.') : [path];
  }
  if (!path.length) {
    return undefined;
  }

  for (i = 0, len = path.length; i < len; ++i) {
    key = trimKey(path[i]);
    if (obj === null || (typeof obj !== 'object' && !isArray(obj)) || !(key in obj)) {
      return undefined;
    }
    obj = obj[key];
  }
  return obj;

};

module.exports = exports = jaunt;

},{}],3:[function(require,module,exports){
'use strict';

var stereotype = function(str) {

  if (Object.prototype.toString.call(str) !== '[object String]') {
    return str;
  }

  switch (str) {
  case 'undefined':
    return undefined;
  case 'null':
    return null;
  case 'NaN':
    return NaN;
  case 'Infinity':
    return Infinity;
  case 'true':
    return true;
  case 'false':
    return false;
  }

  var num = parseFloat(str);
  if (!isNaN(num) && isFinite(str)) {
    if (str.toLowerCase().indexOf('0x') === 0) {
      return parseInt(str, 16);
    }
    return num;
  }

  return str;

};

exports = module.exports = stereotype;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qYXVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdGVyZW90eXBlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBqYXVudCA9IHJlcXVpcmUoJ2phdW50Jyk7XG52YXIgc3RlcmVvdHlwZSA9IHJlcXVpcmUoJ3N0ZXJlb3R5cGUnKTtcblxudmFyIGVzY2FwZSA9IGZ1bmN0aW9uKHN0cikge1xuXG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFsuKis/Xnt9KCl8XFxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcblxufTtcblxudmFyIG1pdGNoID0gZnVuY3Rpb24ocGF0dGVybikge1xuXG4gIHZhciBncm91cHMgPSBbXSxcbiAgICAgIHJlZ2V4ID0gJycsXG4gICAgICBjdXJyID0gJycsXG4gICAgICBsZW4gPSBwYXR0ZXJuLmxlbmd0aCxcbiAgICAgIGMgPSAnJywgaTtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgc3dpdGNoIChwYXR0ZXJuW2ldKSB7XG4gICAgY2FzZSAneyc6XG4gICAgICBpZiAoaSAhPT0gMCkge1xuICAgICAgICBjID0gcGF0dGVybltpLTFdO1xuICAgICAgfVxuICAgICAgcmVnZXggKz0gJycgKyBlc2NhcGUoY3Vycik7XG4gICAgICBjdXJyID0gJyc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd9JzpcbiAgICAgIGlmIChpKzEgPCBsZW4pIHtcbiAgICAgICAgYyA9IHBhdHRlcm5baSsxXTtcbiAgICAgIH1cbiAgICAgIGlmIChjID09PSAnJykge1xuICAgICAgICByZWdleCArPSAnKC4rKSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdleCArPSAnKFteJyArIGVzY2FwZShjKSArICddKyknO1xuICAgICAgfVxuICAgICAgZ3JvdXBzLnB1c2goY3Vyci50cmltKCkpO1xuICAgICAgY3VyciA9ICcnO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGN1cnIgKz0gcGF0dGVybltpXTtcbiAgICB9XG4gIH1cbiAgcmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHJlZ2V4ICsgY3VyciArICckJywgJ20nKTsgLy8gUmVnRXhwIGlzIGNhY2hlZFxuXG4gIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgbWF0Y2hlcywgb2JqLCBjO1xuICAgIGlmICghZ3JvdXBzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHN0ciA9PT0gcGF0dGVybjtcbiAgICB9XG4gICAgYyA9IGdyb3Vwc1swXVswXTsgLy8gZmlyc3QgY2hhcmFjdGVyIG9mIGZpcnN0IGdyb3VwXG4gICAgb2JqID0gYyA+PSAnMCcgJiYgYyA8PSAnOScgPyBbXSA6IHt9O1xuICAgIG1hdGNoZXMgPSByZWdleC5leGVjKHN0cik7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG1hdGNoZXMuc2hpZnQoKTtcbiAgICBncm91cHMuZm9yRWFjaChmdW5jdGlvbihncm91cCwgaSkge1xuICAgICAgamF1bnQuc2V0KG9iaiwgZ3JvdXAsIHN0ZXJlb3R5cGUobWF0Y2hlc1tpXSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG1pdGNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNBcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuXG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcblxufTtcblxudmFyIGlzU3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG5cbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnO1xuXG59O1xuXG52YXIgaXNJbnRlZ2VyID0gZnVuY3Rpb24ob2JqKSB7XG5cbiAgdmFyIG51bSA9IHBhcnNlRmxvYXQob2JqKTtcbiAgcmV0dXJuIGlzRmluaXRlKG9iaikgJiYgIWlzTmFOKG51bSkgJiYgbnVtICUgMSA9PT0gMDtcblxufTtcblxudmFyIHRyaW1LZXkgPSBmdW5jdGlvbihrZXkpIHtcblxuICByZXR1cm4gaXNTdHJpbmcoa2V5KSA/IGtleS50cmltKCkgOiBrZXk7IC8vIG9ubHkgdHJpbSBpZiBga2V5YCBpcyBhIHN0cmluZ1xuXG59O1xuXG52YXIgamF1bnQgPSB7fTtcblxuamF1bnQuc2V0ID0gZnVuY3Rpb24ob2JqLCBwYXRoLCB2YWwpIHtcblxuICB2YXIgbywga2V5O1xuICB2YXIgaSwgbGVuO1xuXG4gIGlmICghaXNBcnJheShwYXRoKSkge1xuICAgIHBhdGggPSBpc1N0cmluZyhwYXRoKSA/IHBhdGguc3BsaXQoJy4nKSA6IFtwYXRoXTtcbiAgfVxuXG4gIG8gPSBvYmo7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHBhdGgubGVuZ3RoLTE7IGkgPCBsZW47ICsraSkge1xuICAgIGtleSA9IHRyaW1LZXkocGF0aFtpXSk7XG4gICAgaWYgKCEoa2V5IGluIG8pKSB7XG4gICAgICBvW2tleV0gPSBpc0ludGVnZXIocGF0aFtpKzFdKSA/IFtdIDoge307XG4gICAgfVxuICAgIG8gPSBvW2tleV07XG4gIH1cbiAgb1t0cmltS2V5KHBhdGhbcGF0aC5sZW5ndGgtMV0pXSA9IHZhbDtcbiAgcmV0dXJuIG9iajtcblxufTtcblxuamF1bnQuZ2V0ID0gZnVuY3Rpb24ob2JqLCBwYXRoKSB7XG5cbiAgdmFyIGtleTtcbiAgdmFyIGksIGxlbjtcblxuICBpZiAoIWlzQXJyYXkocGF0aCkpIHtcbiAgICBwYXRoID0gaXNTdHJpbmcocGF0aCkgPyBwYXRoLnNwbGl0KCcuJykgOiBbcGF0aF07XG4gIH1cbiAgaWYgKCFwYXRoLmxlbmd0aCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBmb3IgKGkgPSAwLCBsZW4gPSBwYXRoLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAga2V5ID0gdHJpbUtleShwYXRoW2ldKTtcbiAgICBpZiAob2JqID09PSBudWxsIHx8ICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyAmJiAhaXNBcnJheShvYmopKSB8fCAhKGtleSBpbiBvYmopKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBvYmogPSBvYmpba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqO1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBqYXVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0ZXJlb3R5cGUgPSBmdW5jdGlvbihzdHIpIHtcblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN0cikgIT09ICdbb2JqZWN0IFN0cmluZ10nKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIHN3aXRjaCAoc3RyKSB7XG4gIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY2FzZSAnbnVsbCc6XG4gICAgcmV0dXJuIG51bGw7XG4gIGNhc2UgJ05hTic6XG4gICAgcmV0dXJuIE5hTjtcbiAgY2FzZSAnSW5maW5pdHknOlxuICAgIHJldHVybiBJbmZpbml0eTtcbiAgY2FzZSAndHJ1ZSc6XG4gICAgcmV0dXJuIHRydWU7XG4gIGNhc2UgJ2ZhbHNlJzpcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbnVtID0gcGFyc2VGbG9hdChzdHIpO1xuICBpZiAoIWlzTmFOKG51bSkgJiYgaXNGaW5pdGUoc3RyKSkge1xuICAgIGlmIChzdHIudG9Mb3dlckNhc2UoKS5pbmRleE9mKCcweCcpID09PSAwKSB7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoc3RyLCAxNik7XG4gICAgfVxuICAgIHJldHVybiBudW07XG4gIH1cblxuICByZXR1cm4gc3RyO1xuXG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBzdGVyZW90eXBlO1xuIl19
