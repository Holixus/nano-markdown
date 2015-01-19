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
	return a.replace(/(!?)\[([^\]<>]+)\]\((\+?)([^ \)<>]+)(?: "([^\(\)\"]+)")?\)/g, function (match, is_img, text, new_tab, ref, title) {
		var attrs = title ? ' title="' + title + '"' : '';
		if (is_img)
			return '<img src="' + nmd.href(ref) + '" alt="' + text + '"' + attrs + '/>';
		if (new_tab)
			attrs += ' target="_blank"';
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
			var list = /^(\s*)(?:[-*]|(\d[.)])) (.+)$/.exec(row);
			if (list) {
				ps.push(cur = [ list[3], list[2] ? 'ol' : 'ul', list[1].length ]); // cur = [ text, type, level ]
				continue;
			}
			var hr = /^\s{0,3}([-])(\s*\1){2,}\s*$/.exec(row);
			if (hr)
				ps.push(cur = [ '', 'hr' ]);
			else
				if (cur && cur[1] !== 'hr')
					cur[0] += '\n' + row;
				else
					ps.push(cur = [ row, 'p', '' ]);
		}
		var out = '', lists = [];
		for (var i = 0, l = ps.length; i < l; ++i) {
			var cur = ps[i], text = cur[0], tag = cur[1];
			if (tag === 'ul' || tag === 'ol') {
				if (!lists.length || cur[2] > lists[0][1]) {
					lists.unshift([ tag, cur[2] ]);
					out += '<'+lists[0][0]+'><li>'+text;
				} else
					if (lists.length > 1 && cur[2] <= lists[1][1]) {
						out += '</li></'+lists.shift()[0]+'>';
						--i;
					} else
						out += '</li><li>'+text;
			} else {
				while (lists.length)
					out += '</li></'+lists.shift()[0]+'>';
				out += (tag === 'hr') ? '<hr/>' : '<'+tag+cur[2]+'>'+text+'</'+tag+cur[2]+'>';
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
