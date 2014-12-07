/* globals describe, it, expect */
'use strict';

var mitch = require('..');

describe('mitch(pattern)(str)', function() {

  it('checks if `str` matches `pattern`', function() {
    // text
    expect(mitch('')('')).toBe(true);
    expect(mitch('')('foo')).toBe(false);
    expect(mitch('foo')('bar')).toBe(false);
    expect(mitch('foo')('foo')).toBe(true);
    // wildcard
    expect(mitch('*')('')).toBe(false);
    expect(mitch('*')('foo')).toBe(true);
    expect(mitch(' * ')('foo')).toBe(false);
    expect(mitch(' * ')(' foo ')).toBe(true);
    expect(mitch('*-*')('foobar')).toBe(false);
    expect(mitch('*-*')('foo-bar')).toBe(true);
    // options
    expect(mitch('(foo|bar)')('baz')).toBe(false);
    expect(mitch('(foo|bar)')('foo')).toBe(true);
    expect(mitch('(foo|bar|)')('')).toBe(false);
    expect(mitch('(foo|bar|)')('bar')).toBe(true);
    expect(mitch('( foo | bar )')('foo')).toBe(false);
    expect(mitch('( foo | bar )')(' foo ')).toBe(true);
    expect(mitch('(foo*|*bar|baz*qux)')('foo')).toBe(false);
    expect(mitch('(foo*|*bar|baz*qux)')('foo-')).toBe(true);
    expect(mitch('(foo*|*bar|baz*qux)')('-bar')).toBe(true);
    expect(mitch('(foo*|*bar|baz*qux)')('baz-qux')).toBe(true);
  });

  it('case sensitive matching', function() {
    expect(mitch('(foo|bar)', true)('foo')).toBe(true);
    expect(mitch('(foo|bar)', true)('FOO')).toBe(false);
  });

  it('captures a single value', function() {
    expect(mitch('{foo}')('')).toBe(false);
    expect(mitch('{foo}')('bar')).toEqual({ foo: 'bar' });
  });

  it('allows dot-delimited keys', function() {
    expect(mitch('{foo.bar}')('baz')).toEqual({ foo: { bar: 'baz' } });
    expect(mitch('{0.foo}')('baz')).toEqual([ { foo: 'baz' } ]);
    expect(mitch('{foo.1}')('baz')).toEqual({ foo: [ undefined, 'baz' ] });
  });

  it('allows whitespace in key of a capturing group', function() {
    expect(mitch('{ foo}')('bar')).toEqual({ foo: 'bar' });
    expect(mitch('{foo }')('bar')).toEqual({ foo: 'bar' });
    expect(mitch('{ foo }')('bar')).toEqual({ foo: 'bar' });
    expect(mitch('{  foo  }')('bar')).toEqual({ foo: 'bar' });
  });

  it('type casts captured values wherever possible', function() {
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
    expect(mitch('{foo}/*-{bar}.md')('qux/quux-corge-grault.md')).toEqual({
      foo: 'qux',
      bar: 'corge-grault'
    });
    expect(mitch('{foo}/{bar}-{baz}')('qux/quux-corge-grault')).toBe(false);
    expect(mitch('{foo}/{bar}')('baz/qux/corge')).toBe(false);
  });

});
