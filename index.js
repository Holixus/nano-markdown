/**
 * nanomarkdown - a minimal markdown to html converter
 * Copyright (c) 2015, Vladimir Antonov. (MIT Licensed)
 * https://github.com/Holixus/nanomarkdown
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define([ ], factory);
	} else if (typeof exports === 'object') {
		// Node, CommonJS-like
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.returnExports = factory();
	}
}(this, function () {
"use strict";

function bi(a) {
	return a.replace(/(\*\*|__|~~)(\S(?:[\s\S]*?\S)?)\1/g, function (m, delim, text) {
		if (delim === '~~')
			return '<del>'+text+'</del>';
		return '<b>'+text+'</b>';
	}).replace(/(\n|^|\W)([_\*])(\S(?:[\s\S]*?\S)?)\2(\W|$|\n)/g, function (m, l, di, ital, r) {
		return l+'<i>'+ital+'</i>'+r;
	});
}

function links(a) {
	return a.replace(/!?\[([^\]<>]+)\]\(([^ \)<>]+)(?: "([^\(\)\"]+)")?\)/g, function (match, text, ref, title) {
		var attrs = '';
		if (title)
			attrs += ' title="' + title + '"';
		if (match.charAt(0) === '!')
			return '<img src="' + nmd.href(ref) + '" alt="' + text + '"' + attrs + '/>';
		if (ref.charAt(0) === '+') {
			attrs += ' target="_blank"';
			ref = ref.substr(1);
		}
		return '<a href="' + nmd.href(ref) + '"' + attrs + '>' + text + '</a>';
	});
}

function lex(t) {
	return links(bi(t));
}

var nmd = function (md) {
	return md.replace(/.+(?:\n.+)*/g, function (m) {
		var ps = [],
		    rows = lex(m).split('\n');
		for (var cur, i = 0, l = rows.length; i < l; ++i) {
			var row = rows[i],
			    head = /^\s*(\#{1,6})(.+)$/.exec(row);
			if (head) { // heading
				ps.push(cur = [ head[2], 'h', head[1].length ]); // cur = [ text, type, level ]
				continue;
			}
			var list = /^(\s*)(?:(\*|\-)|\d(\.|\))) (.+)$/.exec(row);
			if (list) {
				var type = list[2] ? 'ul' : 'ol',
				    level = list[1].length;
				ps.push(cur = [ list[4], type, level ]);
				continue;
			}
			var hr = /^(?:([\*\-_] ?)+)\1\1$/.exec(row);
			if (hr) {
				ps.push(cur = [ '', 'hr' ]);
				continue;
			}
			if (cur && cur[1] !== 'hr')
				cur[0] += '\n' + row;
			else
				ps.push(cur = [ row, 'p' ]);
		}
		var out = '', lists = [];
		for (var i = 0, l = ps.length; i < l; ++i) {
			var cur = ps[i], text = cur[0];
			switch (cur[1]) {
			case 'ul':
			case 'ol':
				if (!lists.length || cur[2] > lists[0][1]) {
					lists.unshift([ cur[1], cur[2] ]);
					out += '<'+lists[0][0]+'><li>'+text;
				} else
					if (lists.length > 1 && cur[2] <= lists[1][1]) {
						out += '</li></'+lists.shift()[0]+'>';
						--i
					} else
						out += '</li><li>'+text;
				continue;
			}
			while (lists.length)
				out += '</li></'+lists.shift()[0]+'>';
			switch (cur[1]) {
			case 'p':
				out += '<p>'+text+'</p>';
				break;
			case 'hr':
				out += '<hr/>';
				break;
			case 'h':
				out += '<h'+cur[2]+'>'+text+'</h'+cur[2]+'>';
				break;
			}
		}
		while (lists.length)
			out += '</li></'+lists.shift()[0]+'>';
		return out;
	});
};

nmd.href = function (ref) {
	return ref;
};

return nmd;
}));
