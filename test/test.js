var nmd = require('../index.js'),
    assert = require('core-assert'),
    json = require('nano-json'),
    timer = require('nano-timer');

function uni_test(fn, sradix, dradix, args, ret) {
	test(fn.name+'('+json.js2str(args, sradix)+') -> '+json.js2str(ret, dradix)+'', function (done) {
		assert.strictEqual(args instanceof Array ? fn.apply(null, args) : fn.call(null, args), ret);
		done();
	});
}

function massive(name, fn, pairs, sradix, dradix) {
	suite(name, function () {
		for (var i = 0, n = pairs.length; i < n; i += 2)
			uni_test(fn, sradix, dradix, pairs[i], pairs[i+1]);
	});
}

function massive_reversed(name, fn, pairs, sradix, dradix) {
	suite(name, function () {
		for (var i = 0, n = pairs.length; i < n; i += 2)
			uni_test(fn, sradix, dradix, pairs[i+1], pairs[i]);
	});
}

suite('compiling', function () {

	massive('simple_paragraph', nmd, [
		'text',
		'<p>text</p>'
	]);
	massive('simple_bis', nmd, [
		'__bold__ blah ~~blah~~ *blah* __blah__ ~~*blah*~~ **_oooo_** blah *ital*',
		'<p><b>bold</b> blah <del>blah</del> <i>blah</i> <b>blah</b> <del><i>blah</i></del> <b><i>oooo</i></b> blah <i>ital</i></p>'
	]);
	massive('one_bis', nmd, [
		'__11__ 1 ~~1~~ *1* __1__ ~~*1*~~ **_1_** 1 *i*',
		'<p><b>11</b> 1 <del>1</del> <i>1</i> <b>1</b> <del><i>1</i></del> <b><i>1</i></b> 1 <i>i</i></p>'
	]);
	massive('identifiers', nmd, [
		'blah _blah_ bl_a_h',
		'<p>blah <i>blah</i> bl_a_h</p>'
	]);
	massive('paragraphs', nmd, [
		'long\nparagraph\n\nsecond',
		'<p>long\nparagraph</p>\n\n<p>second</p>'
	]);
	massive('codes', nmd, [
		"dfgdgd\ndfgdfgd\n\n    var q = 'a';\n    q += 'z';\n\nooooooo\n",
		"<p>dfgdgd\ndfgdfgd</p>\n\n<pre><code>var q = 'a';\nq += 'z';</code></pre>\n\n<p>ooooooo</p>\n"
	])
	massive('heading', nmd, [
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
	]);
	massive('lists_s', nmd, [
		'\
* 1st level\n\
   * 2nd level\n\
   * 2nd\n\
 * 2nd level\n\
* 1st level',
		'<ul><li>1st level<ul><li>2nd level</li><li>2nd</li><li>2nd level</li></ul></li><li>1st level</li></ul>'
	]);
	massive('lists_m', nmd, [
		'\
* 1st level\n\
   - 2nd level\n\
   - 2nd\n\
   - 2nd level\n\
* 1st level',
		'<ul><li>1st level<ul><li>2nd level</li><li>2nd</li><li>2nd level</li></ul></li><li>1st level</li></ul>'
	]);
	massive('lists_o', nmd, [
		'\
* 1st level\n\
   1. 2nd level\n\
   2. 2nd\n\
   3. 2nd level\n\
* 1st level',
		'<ul><li>1st level<ol><li>2nd level</li><li>2nd</li><li>2nd level</li></ol></li><li>1st level</li></ul>'
	]);
	massive('lists_p', nmd, [
		'\
* 1st level\n\
   1. 2nd level\n\
   2. 2nd\n\
   3. 2nd level\n\
----',
		'<ul><li>1st level<ol><li>2nd level</li><li>2nd</li><li>2nd level</li></ol></li></ul><hr/>'
	]);
	massive('links', nmd, [
		'tertet [comment](http://comment.com) ![image](/i/icon.jpg) [link with title](/links.html "title of link") [link for new window](+/new_window.html) wrwerwe;wer',
		'<p>tertet <a href="http://comment.com">comment</a> <img src="/i/icon.jpg" alt="image"/> <a href="/links.html" title="title of link">link with title</a> <a href="/new_window.html" target="_blank" rel="noopener">link for new window</a> wrwerwe;wer</p>'
	]);
	massive('hr', nmd, [
		'---\n-- - - - - -\n------------------------------------',
		'<hr/><hr/><hr/>'
	]);

	massive('backslash escapes', nmd, [
		'sdfkmsdf \\*fsdfsdf\\* esererwe* \\\\werwer',
		'<p>sdfkmsdf *fsdfsdf* esererwe* \\werwer</p>',
		'sdfkmsdf \\#fsdfsdf\\+ esererwe\\- werwer',
		'<p>sdfkmsdf #fsdfsdf+ esererwe- werwer</p>',
		'sdfkmsdf \\.fsdfsdf\\! esererwe- werwer',
		'<p>sdfkmsdf .fsdfsdf! esererwe- werwer</p>',
		'sdfkmsdf \\[erer\\]\\(http://github.com\\) esererwe werwer',
		'<p>sdfkmsdf [erer](http://github.com) esererwe werwer</p>',
		'sdfkmsdf \\{fsdfsdf\\} esererwe werwer',
		'<p>sdfkmsdf {fsdfsdf} esererwe werwer</p>'
	]);
});
