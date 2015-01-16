# nanomarkdown

Supports only paragraphs, lists, bold/italic, links, images.

## Usage

```js
var nmd = require('nanomarkdown');

console.log(ndm('test'));
// <p>test</p>

// customizable links
ndm.href = function (ref) {
	switch (ref.charAt(0)) {
	case '#':
		return '/case/'+ref.substr(1);
	case '@':
		return '/commit/'+ref.substr(1);
	}
	return ref;
};

console.log(ndm('test\n* [case #44](#44)\n* [commit 750945c](@750945c)'));
// <p>test</p>\n<ul><li><a href='/case/44'>case #44</a></li><li><a href='/commit/750945c'>commit 750945c</a></li></ul>
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

## Lists

```
 \* unordered list
  \1\. ordered list
  \1\. ordered list
  \1\. ordered list
  \1\. ordered list
 \* unordered list
```
