[![Gitter][gitter-image]][gitter-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![bitHound Overall Score][bithound-image]][bithound-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

# nano-markdown

1894 bytes of minified code. Supports heading, paragraphs, code, lists, horizontal rules, bold/italic/del, links and images.

## Usage

```js
var nmd = require('nano-markdown');

console.log(nmd('test'));
// <p>test</p>

// customizable links
nmd.href = function (ref) {
	switch (ref.charAt(0)) {
	case '#':
		return '/case/'+ref.substr(1);
	case '@':
		return '/commit/'+ref.substr(1);
	}
	return ref;
};

console.log(nmd('test\n* [case #44](#44)\n* [commit 750945c](@750945c)'));
// <p>test</p>\n<ul><li><a href='/case/44'>case #44</a></li><li><a href='/commit/750945c'>commit 750945c</a></li></ul>

// customizable headers attributes
nmd.headAttrs = function (level, text) {
	return ' id=\''+text.replace(/[^a-z0-9]/ig, '_').replace(/_{2,}/g, '_').replace(/^_*(.*?)_*$/, '$1').toLowerCase()+'\'';
};

console.log(nmd('# Header text'));
// <h1 id='header_text'>Header text</h1>
```

## Heading

```
# foo
## foo
### foo
#### foo
##### foo
###### foo
# foo ############################
## foo ###########################
### foo ##########################
#### foo #########################
##### foo ########################
###### foo #######################
```

## Images
 * `![image alt text](/images/picture.jpg)`
 * `![image alt text](/images/picture.jpg "image title text")`

## Links
 * `[link text](http://github.com)`
 * `[open link in new window](+http://github.com)`
 * `[link with title](http://github.com "title text")`

## Bold/Italic/Del
 * `__bold__, **bold**`
 * `_italic_, *italic*`
 * `~~deleted text~~`

## Horizontal Rules

```
---
 - - - -
   -- -- -- -- --
------------------------
```

## Lists

```
 * unordered list
  1. ordered list
  1. ordered list
  1. ordered list
  1. ordered list
 * unordered list
```

## Code

```
    // Four spaces indented text
    var count = 1000;
    while (--count) {
        console.log('Wow %d!', count);
    }
```

[gitter-image]: https://badges.gitter.im/Holixus/nano-markdown.svg
[gitter-url]: https://gitter.im/Holixus/nano-markdown
[npm-image]: https://img.shields.io/npm/v/nano-markdown.svg
[npm-url]: https://npmjs.org/package/nano-markdown
[github-tag]: http://img.shields.io/github/tag/Holixus/nano-markdown.svg
[github-url]: https://github.com/Holixus/nano-markdown/tags
[travis-image]: https://travis-ci.org/Holixus/nano-markdown.svg?branch=master
[travis-url]: https://travis-ci.org/Holixus/nano-markdown
[coveralls-image]: https://img.shields.io/coveralls/Holixus/nano-markdown.svg
[coveralls-url]: https://coveralls.io/r/Holixus/nano-markdown
[bithound-image]: https://www.bithound.io/github/Holixus/nano-markdown/badges/score.svg
[bithound-url]: https://www.bithound.io/github/Holixus/nano-markdown
[david-image]: http://img.shields.io/david/Holixus/nano-markdown.svg
[david-url]: https://david-dm.org/Holixus/nano-markdown
[license-image]: http://img.shields.io/npm/l/nano-markdown.svg
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/nano-markdown.svg
[downloads-url]: https://npmjs.org/package/nano-markdown
