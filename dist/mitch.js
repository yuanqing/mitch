!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mitch=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qYXVudC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdGVyZW90eXBlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBqYXVudCA9IHJlcXVpcmUoJ2phdW50Jyk7XG52YXIgc3RlcmVvdHlwZSA9IHJlcXVpcmUoJ3N0ZXJlb3R5cGUnKTtcblxudmFyIG1pdGNoUmVnZXggPSAvXFwqfFxcKC4rP1xcKXx7Lis/fXwoW14qeyhdKykvZztcbi8vIGVnLiAnZm9ve2Jhcn0qKGJheiknID0+IFsnZm9vJywgJ3tiYXJ9JywgJyonLCAnYmF6J11cblxudmFyIHBhcnNlT3B0aW9uc1JlZ2V4ID0gL1xcKnxbXipdKy9nO1xuLy8gZWcuICdmb28qYmFyJyA9PiBbJ2ZvbycsICcqJywgJ2JhciddXG5cbnZhciBmb3JFYWNoID0gZnVuY3Rpb24oYXJyLCBmbikge1xuICB2YXIgaSwgbGVuID0gYXJyLmxlbmd0aDtcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGZuKGFycltpXSwgaSkgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59O1xuXG52YXIgZXNjYXBlID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFsuKis/Xnt9KCl8XFxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbn07XG5cbnZhciBnZXRMYXN0Q2hhciA9IGZ1bmN0aW9uKHByZXZpb3VzKSB7XG4gIHJldHVybiBwcmV2aW91cyAmJiBwcmV2aW91cyAhPT0gJyonID8gcHJldmlvdXMuc2xpY2UoLTEpIDogZmFsc2U7XG59O1xuXG52YXIgZ2V0Rmlyc3RDaGFyID0gZnVuY3Rpb24obmV4dCkge1xuICByZXR1cm4gbmV4dCAmJiBuZXh0ICE9PSAnKicgPyBuZXh0WzBdIDogZmFsc2U7XG59O1xuXG52YXIgaXNBbGxOdW1lcmljID0gZnVuY3Rpb24oYXJyKSB7XG4gIHZhciBhbGxOdW1lcmljID0gdHJ1ZTtcbiAgZm9yRWFjaChhcnIsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChrZXlbMF0gPCAnMCcgfHwga2V5WzBdID4gJzknKSB7XG4gICAgICBhbGxOdW1lcmljID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGFsbE51bWVyaWM7XG59O1xuXG52YXIgY29tcGlsZUdyb3VwID0gZnVuY3Rpb24oYWRqYWNlbnRDaGFyLCBjYXB0dXJlKSB7XG4gIHZhciByZWdleCA9ICcoJztcbiAgaWYgKCFjYXB0dXJlKSB7XG4gICAgcmVnZXggKz0gJz86JztcbiAgfVxuICByZXR1cm4gcmVnZXggKyAoYWRqYWNlbnRDaGFyID8gJ1teJyArIGVzY2FwZShhZGphY2VudENoYXIpICsgJ10rKScgOiAnLispJyk7XG59O1xuXG52YXIgcGFyc2VPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucywgcHJldkNoYXIsIG5leHRDaGFyKSB7XG5cbiAgdmFyIHJlZ2V4ID0gW107XG4gIHZhciBvcHRpb25SZWdleDtcbiAgdmFyIGNodW5rcztcblxuICBvcHRpb25zID0gb3B0aW9ucy5zcGxpdCgnfCcpO1xuICBmb3JFYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgIG9wdGlvblJlZ2V4ID0gW107XG4gICAgY2h1bmtzID0gb3B0aW9uLm1hdGNoKHBhcnNlT3B0aW9uc1JlZ2V4KSB8fCBbXTtcbiAgICBmb3JFYWNoKGNodW5rcywgZnVuY3Rpb24oY2h1bmssIGkpIHtcbiAgICAgIGlmIChjaHVuayA9PT0gJyonKSB7XG4gICAgICAgIHByZXZDaGFyID0gZ2V0TGFzdENoYXIoY2h1bmtzW2ktMV0pIHx8IHByZXZDaGFyO1xuICAgICAgICBuZXh0Q2hhciA9IGdldEZpcnN0Q2hhcihjaHVua3NbaSsxXSkgfHwgbmV4dENoYXI7XG4gICAgICAgIG9wdGlvblJlZ2V4LnB1c2goY29tcGlsZUdyb3VwKG5leHRDaGFyIHx8IHByZXZDaGFyKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25SZWdleC5wdXNoKGVzY2FwZShjaHVuaykpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChvcHRpb25SZWdleC5sZW5ndGgpIHtcbiAgICAgIHJlZ2V4LnB1c2gob3B0aW9uUmVnZXguam9pbignJykpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuICcoPzonICsgcmVnZXguam9pbignfCcpICsgJyknO1xuXG59O1xuXG52YXIgbWl0Y2ggPSBmdW5jdGlvbihwYXR0ZXJuLCBjYXNlU2Vuc2l0aXZlKSB7XG5cbiAgY2FzZVNlbnNpdGl2ZSA9IGNhc2VTZW5zaXRpdmUgPT09IHRydWUgfHwgZmFsc2U7XG5cbiAgdmFyIHJlZ2V4ID0gW107XG4gIHZhciBncm91cHMgPSBbXTtcbiAgdmFyIGZpcnN0Q2hhciwgcHJldkNoYXIsIG5leHRDaGFyO1xuICB2YXIgY2h1bmtzID0gcGF0dGVybi5tYXRjaChtaXRjaFJlZ2V4KSB8fCBbXTtcblxuICBmb3JFYWNoKGNodW5rcywgZnVuY3Rpb24oY2h1bmssIGkpIHtcbiAgICBpZiAoY2h1bmsgPT09ICcqJyB8fCBjaHVua1swXSA9PT0gJ3snIHx8IGNodW5rWzBdID09PSAnKCcpIHtcbiAgICAgIHByZXZDaGFyID0gZ2V0TGFzdENoYXIoY2h1bmtzW2ktMV0pO1xuICAgICAgbmV4dENoYXIgPSBnZXRGaXJzdENoYXIoY2h1bmtzW2krMV0pO1xuICAgICAgaWYgKGNodW5rID09PSAnKicpIHtcbiAgICAgICAgcmVnZXgucHVzaChjb21waWxlR3JvdXAobmV4dENoYXIgfHwgcHJldkNoYXIpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpcnN0Q2hhciA9IGNodW5rWzBdO1xuICAgICAgICBjaHVuayA9IGNodW5rLnN1YnN0cmluZygxLCBjaHVuay5sZW5ndGgtMSk7IC8vIGRyb3AgdGhlIGZpcnN0IGFuZCBsYXN0IGNoYXJzXG4gICAgICAgIGlmIChmaXJzdENoYXIgPT09ICd7Jykge1xuICAgICAgICAgIGNodW5rID0gY2h1bmsudHJpbSgpO1xuICAgICAgICAgIGdyb3Vwcy5wdXNoKGNodW5rKTtcbiAgICAgICAgICByZWdleC5wdXNoKGNvbXBpbGVHcm91cChuZXh0Q2hhciB8fCBwcmV2Q2hhciwgdHJ1ZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlZ2V4LnB1c2gocGFyc2VPcHRpb25zKGNodW5rLCBwcmV2Q2hhciwgbmV4dENoYXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZWdleC5wdXNoKGVzY2FwZShjaHVuaykpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHJlZ2V4LmpvaW4oJycpICsgJyQnLCBjYXNlU2Vuc2l0aXZlID8gJ20nIDogJ21pJyk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBtYXRjaGVzID0gcmVnZXguZXhlYyhzdHIpO1xuICAgIHZhciBvYmo7XG4gICAgaWYgKCFncm91cHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hlcyA/IHRydWUgOiBmYWxzZTtcbiAgICB9XG4gICAgb2JqID0gaXNBbGxOdW1lcmljKGdyb3VwcykgPyBbXSA6IHt9O1xuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBtYXRjaGVzLnNoaWZ0KCk7XG4gICAgZm9yRWFjaChncm91cHMsIGZ1bmN0aW9uKHN0ciwgaSkge1xuICAgICAgamF1bnQuc2V0KG9iaiwgc3RyLCBzdGVyZW90eXBlKG1hdGNoZXNbaV0pKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBtaXRjaDtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzQXJyYXkgPSBmdW5jdGlvbihvYmopIHtcblxuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cbn07XG5cbnZhciBpc1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuXG4gIHJldHVybiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcblxufTtcblxudmFyIGlzSW50ZWdlciA9IGZ1bmN0aW9uKG9iaikge1xuXG4gIHZhciBudW0gPSBwYXJzZUZsb2F0KG9iaik7XG4gIHJldHVybiBpc0Zpbml0ZShvYmopICYmICFpc05hTihudW0pICYmIG51bSAlIDEgPT09IDA7XG5cbn07XG5cbnZhciB0cmltS2V5ID0gZnVuY3Rpb24oa2V5KSB7XG5cbiAgcmV0dXJuIGlzU3RyaW5nKGtleSkgPyBrZXkudHJpbSgpIDoga2V5OyAvLyBvbmx5IHRyaW0gaWYgYGtleWAgaXMgYSBzdHJpbmdcblxufTtcblxudmFyIGphdW50ID0ge307XG5cbmphdW50LnNldCA9IGZ1bmN0aW9uKG9iaiwgcGF0aCwgdmFsKSB7XG5cbiAgdmFyIG8sIGtleTtcbiAgdmFyIGksIGxlbjtcblxuICBpZiAoIWlzQXJyYXkocGF0aCkpIHtcbiAgICBwYXRoID0gaXNTdHJpbmcocGF0aCkgPyBwYXRoLnNwbGl0KCcuJykgOiBbcGF0aF07XG4gIH1cblxuICBvID0gb2JqO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBwYXRoLmxlbmd0aC0xOyBpIDwgbGVuOyArK2kpIHtcbiAgICBrZXkgPSB0cmltS2V5KHBhdGhbaV0pO1xuICAgIGlmICghKGtleSBpbiBvKSkge1xuICAgICAgb1trZXldID0gaXNJbnRlZ2VyKHBhdGhbaSsxXSkgPyBbXSA6IHt9O1xuICAgIH1cbiAgICBvID0gb1trZXldO1xuICB9XG4gIG9bdHJpbUtleShwYXRoW3BhdGgubGVuZ3RoLTFdKV0gPSB2YWw7XG4gIHJldHVybiBvYmo7XG5cbn07XG5cbmphdW50LmdldCA9IGZ1bmN0aW9uKG9iaiwgcGF0aCkge1xuXG4gIHZhciBrZXk7XG4gIHZhciBpLCBsZW47XG5cbiAgaWYgKCFpc0FycmF5KHBhdGgpKSB7XG4gICAgcGF0aCA9IGlzU3RyaW5nKHBhdGgpID8gcGF0aC5zcGxpdCgnLicpIDogW3BhdGhdO1xuICB9XG4gIGlmICghcGF0aC5sZW5ndGgpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcGF0aC5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGtleSA9IHRyaW1LZXkocGF0aFtpXSk7XG4gICAgaWYgKG9iaiA9PT0gbnVsbCB8fCAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgJiYgIWlzQXJyYXkob2JqKSkgfHwgIShrZXkgaW4gb2JqKSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgb2JqID0gb2JqW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iajtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gamF1bnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdGVyZW90eXBlID0gZnVuY3Rpb24oc3RyKSB7XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdHIpICE9PSAnW29iamVjdCBTdHJpbmddJykge1xuICAgIHJldHVybiBzdHI7XG4gIH1cblxuICBzd2l0Y2ggKHN0cikge1xuICBjYXNlICd1bmRlZmluZWQnOlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIGNhc2UgJ251bGwnOlxuICAgIHJldHVybiBudWxsO1xuICBjYXNlICdOYU4nOlxuICAgIHJldHVybiBOYU47XG4gIGNhc2UgJ0luZmluaXR5JzpcbiAgICByZXR1cm4gSW5maW5pdHk7XG4gIGNhc2UgJ3RydWUnOlxuICAgIHJldHVybiB0cnVlO1xuICBjYXNlICdmYWxzZSc6XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIG51bSA9IHBhcnNlRmxvYXQoc3RyKTtcbiAgaWYgKCFpc05hTihudW0pICYmIGlzRmluaXRlKHN0cikpIHtcbiAgICBpZiAoc3RyLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignMHgnKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHBhcnNlSW50KHN0ciwgMTYpO1xuICAgIH1cbiAgICByZXR1cm4gbnVtO1xuICB9XG5cbiAgcmV0dXJuIHN0cjtcblxufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gc3RlcmVvdHlwZTtcbiJdfQ==
