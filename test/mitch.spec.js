/* globals describe, it, expect */
'use strict';

var mitch = require('..');

describe('mitch(pattern)(str)', function() {

  it('compares `pattern` with `str` if `pattern` has no capturing groups', function() {
    expect(mitch('')('')).toBe(true);
    expect(mitch('')('bar')).toBe(false);
    expect(mitch('foo')('foo')).toBe(true);
    expect(mitch('foo')('bar')).toBe(false);
  });

  it('captures a single value', function() {
    var m = mitch('{foo}');
    expect(m('')).toBe(false);
    expect(m('bar')).toEqual({ foo: 'bar' });
  });

  it('allows dot-delimited keys', function() {
    expect(mitch('{foo.bar}')('baz')).toEqual({ foo: { bar: 'baz' } });
    expect(mitch('{0.foo}')('baz')).toEqual([ { foo: 'baz' } ]);
    expect(mitch('{foo.1}')('baz')).toEqual({ foo: [ undefined, 'baz' ] });
  });

  it('allows whitespace in the key of a capturing group', function() {
    expect(mitch('{ foo}')('bar')).toEqual({ foo: 'bar' });
    expect(mitch('{foo }')('bar')).toEqual({ foo: 'bar' });
    expect(mitch('{ foo }')('bar')).toEqual({ foo: 'bar' });
    expect(mitch('{  foo  }')('bar')).toEqual({ foo: 'bar' });
  });

  it('type casts the captured values wherever possible', function() {
    expect(mitch('{foo}')('undefined')).toEqual({ foo: undefined });
    expect(mitch('{foo}')('null')).toEqual({ foo: null });
    expect(isNaN(mitch('{foo}')('NaN').foo)).toBe(true);
    expect(mitch('{foo}')('Infinity')).toEqual({ foo: Infinity });
    expect(mitch('{foo}')('true')).toEqual({ foo: true });
    expect(mitch('{foo}')('false')).toEqual({ foo: false });
    expect(mitch('{foo}')('42')).toEqual({ foo: 42 });
    expect(mitch('{foo}')('3.14')).toEqual({ foo: 3.14 });
  });

  it('captures multiple values', function() {
    expect(mitch('{foo} {bar}')('baz qux')).toEqual({
      foo: 'baz',
      bar: 'qux'
    });
    expect(mitch('{foo}/{bar}-{baz}.md')('qux/quux-corge-grault.md')).toEqual({
      foo: 'qux',
      bar: 'quux',
      baz: 'corge-grault'
    });
    expect(mitch('{foo}/{bar}-{baz}')('qux/quux-corge-grault')).toBe(false);
    expect(mitch('{foo}/{bar}')('baz/qux/corge')).toBe(false);
  });

});
