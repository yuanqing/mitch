# Mitch.js [![Experimental](http://img.shields.io/badge/stability-experimental-red.svg?style=flat)](https://github.com/yuanqing/mitch) [![npm Version](http://img.shields.io/npm/v/mitch.svg?style=flat)](https://www.npmjs.org/package/mitch) [![Build Status](https://img.shields.io/travis/yuanqing/mitch.svg?style=flat)](https://travis-ci.org/yuanqing/mitch) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/mitch.svg?style=flat)](https://coveralls.io/r/yuanqing/mitch)

> Sugar for getting data out of strings.

## Usage

```js
var pattern = '*/{date.year}-{date.month}-{slug}.(txt|md)';
var m = mitch(pattern);

m('foo/2014-01-bar.TXT');    //=> { date: {year: 2014, month: 1}, slug: 'bar' }
m('bar/2014-01-baz-qux.md'); //=> { date: {year: 2014, month: 1}, slug: 'baz-qux' }

m('invalid'); //=> false
```

1. Matching is *not* case-sensitive. Use `mitch(pattern, true)` for case-sensitive matching.

2. The compiled RegExp is cached after the initial call to `mitch`.

3. `*` is a wildcard that matches one or more characters.

4. `(txt|md)` is to match against one of `txt` or `md`. An option may contain wildcards, eg. `(foo*|*bar)`.

5. Enclose capturing groups in curly braces. Dot-delimited capturing groups (eg. `date.year` and `date.month`) will be &ldquo;expanded&rdquo; accordingly. Also note that the `2014` and `1` extracted are Numbers; where possible, values extracted will be cast to a primitive type. (See [Stereotype.js](https://github.com/yuanqing/stereotype).)

More usage examples are in [the tests](https://github.com/yuanqing/mitch/blob/master/test/mitch.spec.js).

## API

### mitch(pattern [, caseSensitive = false])(str)

Returns values extracted from `str` based on `pattern`. If `str` does not match the given `pattern`, returns `false`. If there are no capturing groups or wildcards in `pattern`, returns true if `pattern` is strictly equal (`===`) to `str`, else returns `false.`

- `pattern` is a String to match the `str` against.
- `caseSensitive` defaults to `false`.
- `str` is a String to extract values from.

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

- 0.4.0
  - Refactor RegExp compilation logic
  - Change string matching to be case-insensitive
  - Add support for &ldquo;options&rdquo;, eg. `(foo|bar)`, `(foo*|*bar)`
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
