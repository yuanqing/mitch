# Mitch.js [![npm Version](http://img.shields.io/npm/v/mitch.svg?style=flat)](https://www.npmjs.org/package/mitch) [![Build Status](https://img.shields.io/travis/yuanqing/mitch.svg?style=flat)](https://travis-ci.org/yuanqing/mitch) [![Coverage Status](https://img.shields.io/coveralls/yuanqing/mitch.svg?style=flat)](https://coveralls.io/r/yuanqing/mitch)

> Sugar for getting data out of strings.

## Usage

```js
var m = mitch('blog/{date.year}-{date.month}-{slug}.md'); // RegExp is cached

m('blog/2014-01-foo.md');     //=> { date: {year: 2014, month: 1}, slug: 'foo' }
m('blog/2014-01-bar-baz.md'); //=> { date: {year: 2014, month: 1}, slug: 'bar-baz' }

m('invalid'); //=> false
```

Dot-delimited capturing groups (namely `date.year` and `date.month`) will be &ldquo;expanded&rdquo; accordingly. Also note that the `2014` and `1` extracted are [Numbers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number); where possible, values extracted will be cast to a primitive type. (See [Stereotype.js](https://github.com/yuanqing/stereotype).)

More usage examples are in [the tests](https://github.com/yuanqing/mitch/blob/master/spec/mitch.spec.js).

## API

### mitch(pattern)(str)

Returns values extracted from `str` based on `pattern`. Returns `false` if `str` does not match the `pattern`. (If there are no capturing groups in `pattern`, returns true if `pattern` is exactly equal to `str`, else returns `false.`)

- `pattern` is a `string` with capturing groups enclosed in `{` and `}`.
- `str` is the `string` to extract values from.

## Installation

Install via [npm](https://www.npmjs.org/package/mitch):

```bash
$ npm i --save mitch
```

## License

[MIT license](https://github.com/yuanqing/mitch/blob/master/LICENSE)
