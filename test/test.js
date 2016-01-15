var nmd = require('../index.js'),
    assert = require('core-assert');

var timer = function (ms, v) {
	return new Promise(function (resolve, reject) {
		var to = setTimeout(function () {
				resolve(v);
			}, ms);
		return { cancel: function () {
			clearTimeout(to);
		}};
	});
};

function ts(a, radix, deep) {
	switch (typeof a) {
	case 'object':
		if (a instanceof Array) {
			var o = [];
			for (var i = 0, n = a.length; i < n; ++i)
				o[i] = ts(a[i], radix, 1);
			return deep ? '['+o.join(',')+']' : o.join(',');
		} else {
			if (a === null)
				return 'null';
			var o = [];
			for (var id in a)
				o.push(id+':'+ts(a[id], radix, 1));
			return '{' + o.join(',') + '}';
		}
		break;
	case 'string':
		var qc = 0, dqc = 0;
		for (var i = 0, n = a.length; i < n; ++i)
			switch (a.charAt(i)) {
			case "'": ++qc; break;
			case '"': ++dqc; break;
			}
		if (qc <= dqc) {
			return '"' + a.replace(/["\t\n\r]/g, function (m) { //"
				switch (m) {
				case '"':	return '\\"';
				case '\t':  return '\\t';
				case '\n':  return '\\n';
				case '\r':  return '\\r';
				default:    return m;
				}
			}) + '"';
		} else {
			return "'" + a.replace(/['\t\n\r]/g, function (m) { //'
				switch (m) {
				case "'":	return "\\'";
				case '\t':  return '\\t';
				case '\n':  return '\\n';
				case '\r':  return '\\r';
				default:    return m;
				}
			}) + "'";
		}
	case 'number':
		switch (radix) {
		case 2:
		case undefined:
		default:
			return '0b'+a.toString(2);
		case 10:
			return a.toString(10);
		case 16:
			return '0x'+a.toString(16);
		case 8:
			return '0o'+a.toString(8);
		}
	case 'undefined':
		return 'undefined';
	case 'function':
	case 'boolean':
		return a.toString();
	}
}

function massive(name, fn, pairs, sradix, dradix) {
	suite(name, function () {
		for (var i = 0, n = pairs.length; i < n; i += 2)
			(function (args, ret) {
				test(fn.name+'('+ts(args, sradix)+') -> '+ts(ret, dradix)+'', function (done) {
					assert.strictEqual(args instanceof Array ? fn.apply(null, args) : fn.call(null, args), ret);
					done();
				});
			})(pairs[i], pairs[i+1]);
	});
}

function massive_reversed(name, fn, pairs, sradix, dradix) {
	suite(name, function () {
		for (var i = 0, n = pairs.length; i < n; i += 2)
			(function (args, ret) {
				test(fn.name+'('+ts(args, sradix)+') -> '+ts(ret, dradix)+'', function (done) {
					assert.strictEqual(args instanceof Array ? fn.apply(null, args) : fn.call(null, args), ret);
					done();
				});
			})(pairs[i+1], pairs[i]);
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
		'<p>tertet <a href="http://comment.com">comment</a> <img src="/i/icon.jpg" alt="image"/> <a href="/links.html" title="title of link">link with title</a> <a href="/new_window.html" target="_blank">link for new window</a> wrwerwe;wer</p>'
	]);
	massive('hr', nmd, [
		'---\n-- - - - - -\n------------------------------------',
		'<hr/><hr/><hr/>'
	]);

});
