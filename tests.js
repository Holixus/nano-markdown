#!/usr/bin/env node
"use strict";

var assert = require('assert'),
    util = require('util'),
    md = require('./index.js'),
    pairs = {
		simple_paragraph: [
			'text',
			'<p>text</p>'
		],
		simple_bis: [
			'__bold__ blah ~~blah~~ *blah* __blah__ ~~*blah*~~ **_oooo_** blah *ital*',
			'<p><b>bold</b> blah <del>blah</del> <i>blah</i> <b>blah</b> <del><i>blah</i></del> <b><i>oooo</i></b> blah <i>ital</i></p>' ],
		identifiers: [
			'blah _blah_ bl_a_h',
			'<p>blah <i>blah</i> bl_a_h</p>'
		],
		paragraphs: [
			'long\nparagraph\n\nsecond',
			'<p>long\nparagraph</p>\n\n<p>second</p>'
		],
		heading: [
			'# foo\n\
## foo\n\
### foo\n\
#### foo\n\
##### foo\n\
###### foo\n\
####### foo\n\
\n\
#sdfsfs\n\n\
# ooop! #######################\n\
# \n',
			'<h1>foo</h1><h2>foo</h2><h3>foo</h3><h4>foo</h4><h5>foo</h5><h6>foo</h6><p>####### foo</p>\n\n<p>#sdfsfs</p>\n\n<h1>ooop!</h1><h1></h1>\n'
		],
		lists_s: [
			'\
* 1st level\n\
   * 2nd level\n\
   * 2nd\n\
 * 2nd level\n\
* 1st level',
			'<ul><li>1st level<ul><li>2nd level</li><li>2nd</li><li>2nd level</li></ul></li><li>1st level</li></ul>'
		],
		lists_m: [
			'\
* 1st level\n\
   - 2nd level\n\
   - 2nd\n\
   - 2nd level\n\
* 1st level',
			'<ul><li>1st level<ul><li>2nd level</li><li>2nd</li><li>2nd level</li></ul></li><li>1st level</li></ul>'
		],
		lists_o: [
			'\
* 1st level\n\
   1. 2nd level\n\
   2. 2nd\n\
   3. 2nd level\n\
* 1st level',
			'<ul><li>1st level<ol><li>2nd level</li><li>2nd</li><li>2nd level</li></ol></li><li>1st level</li></ul>'
		],
		links: [
			'tertet [comment](http://comment.com) ![image](/i/icon.jpg) [link with title](/links.html "title of link") [link for new window](+/new_window.html) wrwerwe;wer',
			'<p>tertet <a href="http://comment.com">comment</a> <img src="/i/icon.jpg" alt="image"/> <a href="/links.html" title="title of link">link with title</a> <a href="/new_window.html" target="_blank">link for new window</a> wrwerwe;wer</p>'
		],
		hr: [
			'---\n-- - - - - -\n------------------------------------',
			'<hr/><hr/><hr/>'
		]
};

try {
	for (var id in pairs) {
		var pair = pairs[id],
		    s = pair[0],
		    d = pair[1];
		assert.equal(md(s), d, { id: id, source: s });
		console.log('%s - ok', id);
	}
} catch (e) {
	var p = e.message;
	if (typeof e.message === 'object') {
		console.error(util.format('%s - FAILED', p.id));
		console.error('test    : %s', p.source );
		console.error('result  : %s', e.actual);
		console.error('expected: %s', e.expected);
	} else
		console.error(e);
	process.exit(1);
}
