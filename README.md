# Mitch.js [![Experimental](http://img.shields.io/badge/stability-experimental-red.svg?style=flat)](https://github.com/yuanqing/mitch) [![npm Version](http://img.shields.io/npm/v/mitch.svg?style=flat)](https://www.npmjs.org/package/mitch) [![Build Status](https://img.shields.io/travis/yuanqing/mitch.svg?style=flat)](https://travis-ci.org/yuanqing/mitch) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/mitch.svg?style=flat)](https://coveralls.io/r/yuanqing/mitch)

> Sugar for getting data out of strings.

## Usage

```js
var m = mitch('*/{date.year}-{date.month}-{slug}.md'); // RegExp is cached

m('blog/2014-01-foo.md');     //=> { date: {year: 2014, month: 1}, slug: 'foo' }
m('blog/2014-01-bar-baz.md'); //=> { date: {year: 2014, month: 1}, slug: 'bar-baz' }

m('invalid'); //=> false
```

1. The compiled RegExp is cached after the initial call to `mitch(pattern)`.

2. The `*` is a wildcard that represents one or more characters.

3. Dot-delimited capturing groups (namely `date.year` and `date.month`) will be &ldquo;expanded&rdquo; accordingly. Also note that the `2014` and `1` extracted are Numbers; where possible, values extracted will be cast to a primitive type. (See [Stereotype.js](https://github.com/yuanqing/stereotype).)

More usage examples are in [the tests](https://github.com/yuanqing/mitch/blob/master/test/mitch.spec.js).

## API

### mitch(pattern)(str)

Returns values extracted from `str` based on `pattern`. If `str` does not match the given `pattern`, returns `false`. If there are no capturing groups or wildcards in `pattern`, returns true if `pattern` is strictly equal (`===`) to `str`, else returns `false.`

- `pattern` is a String with `*` representing a wildcard, and capturing groups enclosed in `{` and `}`.
- `str` is the String to extract values from.

## Installation

Install via [npm](https://www.npmjs.org/package/mitch):

```bash
$ npm i --save mitch
```

Install via [Bower](http://bower.io/):

```bash
$ bower i --save yuanqing/mitch
```

---

To use Segue in the browser, include [the minified script](https://github.com/yuanqing/mitch/blob/master/dist/mitch.min.js) in your HTML:

```html
<body>
  <!-- ... -->
  <script src="path/to/dist/mitch.min.js"></script>
  <script>
    // mitch available here
  </script>
</body>
```

## Changelog

- 0.3.0
  - Refactor RegExp compilation logic
  - Add wildcard (`*`) support
  - Add [Browserified](http://browserify.org/) bundle
  - Add `bower.json`

- 0.2.0
  - Allow dot-delimited keys

- 0.1.0
  - Initial release

## License

[MIT license](https://github.com/yuanqing/mitch/blob/master/LICENSE)
