!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mitch=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  var str = '';
  var cannotContain = '';
  var i;
  var len;

  for (i = 0, len = pattern.length; i < len; ++i) {
    switch (pattern[i]) {
    case '{': // ([^a].+[^a])
      if (i > 1) {
        cannotContain = escape(pattern[i-1]);
      }
      regex += escape(str);
      str = '';
      break;
    case '}':
      if (i + 1 < len) {
        cannotContain = escape(pattern[i+1]);
      }
      if (cannotContain === '') {
        regex += '(.+)';
      } else {
        regex += '([^' + cannotContain + ']+)';
      }
      cannotContain = '';
      groups.push(str.trim());
      str = '';
      break;
    // case '*':
    //   if () {

    //   }
    //   break;
    default:
      str += pattern[i];
    }
  }
  regex = new RegExp('^' + regex + escape(str) + '$', 'm');

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

console.log(mitch('{foo}/{bar}-{baz}.md')('qux/quux-corge-grault.md'));
// console.log(mitch('{foo.bar}')('baz'));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qYXVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdGVyZW90eXBlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgamF1bnQgPSByZXF1aXJlKCdqYXVudCcpO1xudmFyIHN0ZXJlb3R5cGUgPSByZXF1aXJlKCdzdGVyZW90eXBlJyk7XG5cbnZhciBlc2NhcGUgPSBmdW5jdGlvbihzdHIpIHtcblxuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbLiorP157fSgpfFxcW1xcXVxcL1xcXFxdKS9nLCAnXFxcXCQxJyk7XG5cbn07XG5cbnZhciBpc0RpZ2l0ID0gZnVuY3Rpb24oYykge1xuXG4gIHJldHVybiBjID49ICcwJyAmJiBjIDw9ICc5JztcblxufTtcblxudmFyIG1pdGNoID0gZnVuY3Rpb24ocGF0dGVybikge1xuXG4gIHZhciBncm91cHMgPSBbXTtcbiAgdmFyIHJlZ2V4ID0gJyc7XG5cbiAgdmFyIHN0ciA9ICcnO1xuICB2YXIgY2Fubm90Q29udGFpbiA9ICcnO1xuICB2YXIgaTtcbiAgdmFyIGxlbjtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBwYXR0ZXJuLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgc3dpdGNoIChwYXR0ZXJuW2ldKSB7XG4gICAgY2FzZSAneyc6IC8vIChbXmFdLitbXmFdKVxuICAgICAgaWYgKGkgPiAxKSB7XG4gICAgICAgIGNhbm5vdENvbnRhaW4gPSBlc2NhcGUocGF0dGVybltpLTFdKTtcbiAgICAgIH1cbiAgICAgIHJlZ2V4ICs9IGVzY2FwZShzdHIpO1xuICAgICAgc3RyID0gJyc7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd9JzpcbiAgICAgIGlmIChpICsgMSA8IGxlbikge1xuICAgICAgICBjYW5ub3RDb250YWluID0gZXNjYXBlKHBhdHRlcm5baSsxXSk7XG4gICAgICB9XG4gICAgICBpZiAoY2Fubm90Q29udGFpbiA9PT0gJycpIHtcbiAgICAgICAgcmVnZXggKz0gJyguKyknO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnZXggKz0gJyhbXicgKyBjYW5ub3RDb250YWluICsgJ10rKSc7XG4gICAgICB9XG4gICAgICBjYW5ub3RDb250YWluID0gJyc7XG4gICAgICBncm91cHMucHVzaChzdHIudHJpbSgpKTtcbiAgICAgIHN0ciA9ICcnO1xuICAgICAgYnJlYWs7XG4gICAgLy8gY2FzZSAnKic6XG4gICAgLy8gICBpZiAoKSB7XG5cbiAgICAvLyAgIH1cbiAgICAvLyAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gICAgICBzdHIgKz0gcGF0dGVybltpXTtcbiAgICB9XG4gIH1cbiAgcmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHJlZ2V4ICsgZXNjYXBlKHN0cikgKyAnJCcsICdtJyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBtYXRjaGVzLCBvYmo7XG4gICAgaWYgKCFncm91cHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gc3RyID09PSBwYXR0ZXJuO1xuICAgIH1cbiAgICBvYmogPSBpc0RpZ2l0KGdyb3Vwc1swXVswXSkgPyBbXSA6IHt9O1xuICAgIG1hdGNoZXMgPSByZWdleC5leGVjKHN0cik7XG4gICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG1hdGNoZXMuc2hpZnQoKTtcbiAgICBncm91cHMuZm9yRWFjaChmdW5jdGlvbihncm91cCwgaSkge1xuICAgICAgamF1bnQuc2V0KG9iaiwgZ3JvdXAsIHN0ZXJlb3R5cGUobWF0Y2hlc1tpXSkpO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbn07XG5cbmNvbnNvbGUubG9nKG1pdGNoKCd7Zm9vfS97YmFyfS17YmF6fS5tZCcpKCdxdXgvcXV1eC1jb3JnZS1ncmF1bHQubWQnKSk7XG4vLyBjb25zb2xlLmxvZyhtaXRjaCgne2Zvby5iYXJ9JykoJ2JheicpKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbWl0Y2g7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0FycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG5cbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuXG59O1xuXG52YXIgaXNTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcblxuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZyc7XG5cbn07XG5cbnZhciBpc0ludGVnZXIgPSBmdW5jdGlvbihvYmopIHtcblxuICB2YXIgbnVtID0gcGFyc2VGbG9hdChvYmopO1xuICByZXR1cm4gaXNGaW5pdGUob2JqKSAmJiAhaXNOYU4obnVtKSAmJiBudW0gJSAxID09PSAwO1xuXG59O1xuXG52YXIgdHJpbUtleSA9IGZ1bmN0aW9uKGtleSkge1xuXG4gIHJldHVybiBpc1N0cmluZyhrZXkpID8ga2V5LnRyaW0oKSA6IGtleTsgLy8gb25seSB0cmltIGlmIGBrZXlgIGlzIGEgc3RyaW5nXG5cbn07XG5cbnZhciBqYXVudCA9IHt9O1xuXG5qYXVudC5zZXQgPSBmdW5jdGlvbihvYmosIHBhdGgsIHZhbCkge1xuXG4gIHZhciBvLCBrZXk7XG4gIHZhciBpLCBsZW47XG5cbiAgaWYgKCFpc0FycmF5KHBhdGgpKSB7XG4gICAgcGF0aCA9IGlzU3RyaW5nKHBhdGgpID8gcGF0aC5zcGxpdCgnLicpIDogW3BhdGhdO1xuICB9XG5cbiAgbyA9IG9iajtcbiAgZm9yIChpID0gMCwgbGVuID0gcGF0aC5sZW5ndGgtMTsgaSA8IGxlbjsgKytpKSB7XG4gICAga2V5ID0gdHJpbUtleShwYXRoW2ldKTtcbiAgICBpZiAoIShrZXkgaW4gbykpIHtcbiAgICAgIG9ba2V5XSA9IGlzSW50ZWdlcihwYXRoW2krMV0pID8gW10gOiB7fTtcbiAgICB9XG4gICAgbyA9IG9ba2V5XTtcbiAgfVxuICBvW3RyaW1LZXkocGF0aFtwYXRoLmxlbmd0aC0xXSldID0gdmFsO1xuICByZXR1cm4gb2JqO1xuXG59O1xuXG5qYXVudC5nZXQgPSBmdW5jdGlvbihvYmosIHBhdGgpIHtcblxuICB2YXIga2V5O1xuICB2YXIgaSwgbGVuO1xuXG4gIGlmICghaXNBcnJheShwYXRoKSkge1xuICAgIHBhdGggPSBpc1N0cmluZyhwYXRoKSA/IHBhdGguc3BsaXQoJy4nKSA6IFtwYXRoXTtcbiAgfVxuICBpZiAoIXBhdGgubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHBhdGgubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBrZXkgPSB0cmltS2V5KHBhdGhbaV0pO1xuICAgIGlmIChvYmogPT09IG51bGwgfHwgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICFpc0FycmF5KG9iaikpIHx8ICEoa2V5IGluIG9iaikpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIG9iaiA9IG9ialtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IGphdW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RlcmVvdHlwZSA9IGZ1bmN0aW9uKHN0cikge1xuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3RyKSAhPT0gJ1tvYmplY3QgU3RyaW5nXScpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgc3dpdGNoIChzdHIpIHtcbiAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICBjYXNlICdudWxsJzpcbiAgICByZXR1cm4gbnVsbDtcbiAgY2FzZSAnTmFOJzpcbiAgICByZXR1cm4gTmFOO1xuICBjYXNlICdJbmZpbml0eSc6XG4gICAgcmV0dXJuIEluZmluaXR5O1xuICBjYXNlICd0cnVlJzpcbiAgICByZXR1cm4gdHJ1ZTtcbiAgY2FzZSAnZmFsc2UnOlxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBudW0gPSBwYXJzZUZsb2F0KHN0cik7XG4gIGlmICghaXNOYU4obnVtKSAmJiBpc0Zpbml0ZShzdHIpKSB7XG4gICAgaWYgKHN0ci50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJzB4JykgPT09IDApIHtcbiAgICAgIHJldHVybiBwYXJzZUludChzdHIsIDE2KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bTtcbiAgfVxuXG4gIHJldHVybiBzdHI7XG5cbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHN0ZXJlb3R5cGU7XG4iXX0=
