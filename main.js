
(function() {
'use strict';

function F2(fun)
{
  function wrapper(a) { return function(b) { return fun(a,b); }; }
  wrapper.arity = 2;
  wrapper.func = fun;
  return wrapper;
}

function F3(fun)
{
  function wrapper(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  }
  wrapper.arity = 3;
  wrapper.func = fun;
  return wrapper;
}

function F4(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  }
  wrapper.arity = 4;
  wrapper.func = fun;
  return wrapper;
}

function F5(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  }
  wrapper.arity = 5;
  wrapper.func = fun;
  return wrapper;
}

function F6(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  }
  wrapper.arity = 6;
  wrapper.func = fun;
  return wrapper;
}

function F7(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  }
  wrapper.arity = 7;
  wrapper.func = fun;
  return wrapper;
}

function F8(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  }
  wrapper.arity = 8;
  wrapper.func = fun;
  return wrapper;
}

function F9(fun)
{
  function wrapper(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  }
  wrapper.arity = 9;
  wrapper.func = fun;
  return wrapper;
}

function A2(fun, a, b)
{
  return fun.arity === 2
    ? fun.func(a, b)
    : fun(a)(b);
}
function A3(fun, a, b, c)
{
  return fun.arity === 3
    ? fun.func(a, b, c)
    : fun(a)(b)(c);
}
function A4(fun, a, b, c, d)
{
  return fun.arity === 4
    ? fun.func(a, b, c, d)
    : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e)
{
  return fun.arity === 5
    ? fun.func(a, b, c, d, e)
    : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f)
{
  return fun.arity === 6
    ? fun.func(a, b, c, d, e, f)
    : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g)
{
  return fun.arity === 7
    ? fun.func(a, b, c, d, e, f, g)
    : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h)
{
  return fun.arity === 8
    ? fun.func(a, b, c, d, e, f, g, h)
    : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i)
{
  return fun.arity === 9
    ? fun.func(a, b, c, d, e, f, g, h, i)
    : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

//import Native.Utils //

var _elm_lang$core$Native_Basics = function() {

function div(a, b)
{
	return (a / b) | 0;
}
function rem(a, b)
{
	return a % b;
}
function mod(a, b)
{
	if (b === 0)
	{
		throw new Error('Cannot perform mod 0. Division by zero error.');
	}
	var r = a % b;
	var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r + b) : -mod(-a, -b));

	return m === b ? 0 : m;
}
function logBase(base, n)
{
	return Math.log(n) / Math.log(base);
}
function negate(n)
{
	return -n;
}
function abs(n)
{
	return n < 0 ? -n : n;
}

function min(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
}
function max(a, b)
{
	return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
}
function clamp(lo, hi, n)
{
	return _elm_lang$core$Native_Utils.cmp(n, lo) < 0
		? lo
		: _elm_lang$core$Native_Utils.cmp(n, hi) > 0
			? hi
			: n;
}

var ord = ['LT', 'EQ', 'GT'];

function compare(x, y)
{
	return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
}

function xor(a, b)
{
	return a !== b;
}
function not(b)
{
	return !b;
}
function isInfinite(n)
{
	return n === Infinity || n === -Infinity;
}

function truncate(n)
{
	return n | 0;
}

function degrees(d)
{
	return d * Math.PI / 180;
}
function turns(t)
{
	return 2 * Math.PI * t;
}
function fromPolar(point)
{
	var r = point._0;
	var t = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
}
function toPolar(point)
{
	var x = point._0;
	var y = point._1;
	return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
}

return {
	div: F2(div),
	rem: F2(rem),
	mod: F2(mod),

	pi: Math.PI,
	e: Math.E,
	cos: Math.cos,
	sin: Math.sin,
	tan: Math.tan,
	acos: Math.acos,
	asin: Math.asin,
	atan: Math.atan,
	atan2: F2(Math.atan2),

	degrees: degrees,
	turns: turns,
	fromPolar: fromPolar,
	toPolar: toPolar,

	sqrt: Math.sqrt,
	logBase: F2(logBase),
	negate: negate,
	abs: abs,
	min: F2(min),
	max: F2(max),
	clamp: F3(clamp),
	compare: F2(compare),

	xor: F2(xor),
	not: not,

	truncate: truncate,
	ceiling: Math.ceil,
	floor: Math.floor,
	round: Math.round,
	toFloat: function(x) { return x; },
	isNaN: isNaN,
	isInfinite: isInfinite
};

}();
//import //

var _elm_lang$core$Native_Utils = function() {

// COMPARISONS

function eq(rootX, rootY)
{
	var stack = [{ x: rootX, y: rootY }];
	while (stack.length > 0)
	{
		var front = stack.pop();
		var x = front.x;
		var y = front.y;
		if (x === y)
		{
			continue;
		}
		if (typeof x === 'object')
		{
			var c = 0;
			for (var key in x)
			{
				++c;
				if (!(key in y))
				{
					return false;
				}
				if (key === 'ctor')
				{
					continue;
				}
				stack.push({ x: x[key], y: y[key] });
			}
			if ('ctor' in x)
			{
				stack.push({ x: x.ctor, y: y.ctor});
			}
			if (c !== Object.keys(y).length)
			{
				return false;
			}
		}
		else if (typeof x === 'function')
		{
			throw new Error('Equality error: general function equality is ' +
							'undecidable, and therefore, unsupported');
		}
		else
		{
			return false;
		}
	}
	return true;
}

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

var LT = -1, EQ = 0, GT = 1;

function cmp(x, y)
{
	var ord;
	if (typeof x !== 'object')
	{
		return x === y ? EQ : x < y ? LT : GT;
	}
	else if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b
			? EQ
			: a < b
				? LT
				: GT;
	}
	else if (x.ctor === '::' || x.ctor === '[]')
	{
		while (true)
		{
			if (x.ctor === '[]' && y.ctor === '[]')
			{
				return EQ;
			}
			if (x.ctor !== y.ctor)
			{
				return x.ctor === '[]' ? LT : GT;
			}
			ord = cmp(x._0, y._0);
			if (ord !== EQ)
			{
				return ord;
			}
			x = x._1;
			y = y._1;
		}
	}
	else if (x.ctor.slice(0, 6) === '_Tuple')
	{
		var n = x.ctor.slice(6) - 0;
		var err = 'cannot compare tuples with more than 6 elements.';
		if (n === 0) return EQ;
		if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
		if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
		if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
		if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
		if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
		if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
		if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
		return EQ;
	}
	else
	{
		throw new Error('Comparison error: comparison is only defined on ints, ' +
						'floats, times, chars, strings, lists of comparable values, ' +
						'and tuples of comparable values.');
	}
}


// COMMON VALUES

var Tuple0 = {
	ctor: '_Tuple0'
};

function Tuple2(x, y)
{
	return {
		ctor: '_Tuple2',
		_0: x,
		_1: y
	};
}

function chr(c)
{
	return new String(c);
}


// GUID

var count = 0;
function guid(_)
{
	return count++;
}


// RECORDS

function update(oldRecord, updatedFields)
{
	var newRecord = {};
	for (var key in oldRecord)
	{
		var value = (key in updatedFields) ? updatedFields[key] : oldRecord[key];
		newRecord[key] = value;
	}
	return newRecord;
}


//// LIST STUFF ////

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return {
		ctor: '::',
		_0: hd,
		_1: tl
	};
}

function append(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (xs.ctor === '[]')
	{
		return ys;
	}
	var root = Cons(xs._0, Nil);
	var curr = root;
	xs = xs._1;
	while (xs.ctor !== '[]')
	{
		curr._1 = Cons(xs._0, Nil);
		xs = xs._1;
		curr = curr._1;
	}
	curr._1 = ys;
	return root;
}


// CRASHES

function crash(moduleName, region)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function crashCase(moduleName, region, value)
{
	return function(message) {
		throw new Error(
			'Ran into a `Debug.crash` in module `' + moduleName + '`\n\n'
			+ 'This was caused by the `case` expression ' + regionToString(region) + '.\n'
			+ 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n'
			+ 'The message provided by the code author is:\n\n    '
			+ message
		);
	};
}

function regionToString(region)
{
	if (region.start.line == region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'between lines ' + region.start.line + ' and ' + region.end.line;
}


// TO STRING

function toString(v)
{
	var type = typeof v;
	if (type === 'function')
	{
		var name = v.func ? v.func.name : v.name;
		return '<function' + (name === '' ? '' : ':') + name + '>';
	}

	if (type === 'boolean')
	{
		return v ? 'True' : 'False';
	}

	if (type === 'number')
	{
		return v + '';
	}

	if (v instanceof String)
	{
		return '\'' + addSlashes(v, true) + '\'';
	}

	if (type === 'string')
	{
		return '"' + addSlashes(v, false) + '"';
	}

	if (v === null)
	{
		return 'null';
	}

	if (type === 'object' && 'ctor' in v)
	{
		var ctorStarter = v.ctor.substring(0, 5);

		if (ctorStarter === '_Tupl')
		{
			var output = [];
			for (var k in v)
			{
				if (k === 'ctor') continue;
				output.push(toString(v[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (ctorStarter === '_Task')
		{
			return '<task>'
		}

		if (v.ctor === '_Array')
		{
			var list = _elm_lang$core$Array$toList(v);
			return 'Array.fromList ' + toString(list);
		}

		if (v.ctor === '<decoder>')
		{
			return '<decoder>';
		}

		if (v.ctor === '_Process')
		{
			return '<process:' + v.id + '>';
		}

		if (v.ctor === '::')
		{
			var output = '[' + toString(v._0);
			v = v._1;
			while (v.ctor === '::')
			{
				output += ',' + toString(v._0);
				v = v._1;
			}
			return output + ']';
		}

		if (v.ctor === '[]')
		{
			return '[]';
		}

		if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin' || v.ctor === 'Set_elm_builtin')
		{
			var name, list;
			if (v.ctor === 'Set_elm_builtin')
			{
				name = 'Set';
				list = A2(
					_elm_lang$core$List$map,
					function(x) {return x._0; },
					_elm_lang$core$Dict$toList(v._0)
				);
			}
			else
			{
				name = 'Dict';
				list = _elm_lang$core$Dict$toList(v);
			}
			return name + '.fromList ' + toString(list);
		}

		var output = '';
		for (var i in v)
		{
			if (i === 'ctor') continue;
			var str = toString(v[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return v.ctor + output;
	}

	if (type === 'object')
	{
		var output = [];
		for (var k in v)
		{
			output.push(k + ' = ' + toString(v[k]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return '<internal structure>';
}

function addSlashes(str, isChar)
{
	var s = str.replace(/\\/g, '\\\\')
			  .replace(/\n/g, '\\n')
			  .replace(/\t/g, '\\t')
			  .replace(/\r/g, '\\r')
			  .replace(/\v/g, '\\v')
			  .replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}


return {
	eq: eq,
	cmp: cmp,
	Tuple0: Tuple0,
	Tuple2: Tuple2,
	chr: chr,
	update: update,
	guid: guid,

	append: F2(append),

	crash: crash,
	crashCase: crashCase,

	toString: toString
};

}();
var _elm_lang$core$Basics$uncurry = F2(
	function (f, _p0) {
		var _p1 = _p0;
		return A2(f, _p1._0, _p1._1);
	});
var _elm_lang$core$Basics$curry = F3(
	function (f, a, b) {
		return f(
			{ctor: '_Tuple2', _0: a, _1: b});
	});
var _elm_lang$core$Basics$flip = F3(
	function (f, b, a) {
		return A2(f, a, b);
	});
var _elm_lang$core$Basics$snd = function (_p2) {
	var _p3 = _p2;
	return _p3._1;
};
var _elm_lang$core$Basics$fst = function (_p4) {
	var _p5 = _p4;
	return _p5._0;
};
var _elm_lang$core$Basics$always = F2(
	function (a, _p6) {
		return a;
	});
var _elm_lang$core$Basics$identity = function (x) {
	return x;
};
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<|'] = F2(
	function (f, x) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['|>'] = F2(
	function (x, f) {
		return f(x);
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>>'] = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<<'] = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
var _elm_lang$core$Basics$radians = function (t) {
	return t;
};
var _elm_lang$core$Basics$GT = {ctor: 'GT'};
var _elm_lang$core$Basics$EQ = {ctor: 'EQ'};
var _elm_lang$core$Basics$LT = {ctor: 'LT'};
var _elm_lang$core$Basics$Never = function (a) {
	return {ctor: 'Never', _0: a};
};

//import Native.Utils //

var _elm_lang$core$Native_Debug = function() {

function log(tag, value)
{
	var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
	var process = process || {};
	if (process.stdout)
	{
		process.stdout.write(msg);
	}
	else
	{
		console.log(msg);
	}
	return value;
}

function crash(message)
{
	throw new Error(message);
}

return {
	crash: crash,
	log: F2(log)
};

}();
var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

var _elm_lang$core$Maybe$withDefault = F2(
	function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
var _elm_lang$core$Maybe$Nothing = {ctor: 'Nothing'};
var _elm_lang$core$Maybe$oneOf = function (maybes) {
	oneOf:
	while (true) {
		var _p1 = maybes;
		if (_p1.ctor === '[]') {
			return _elm_lang$core$Maybe$Nothing;
		} else {
			var _p3 = _p1._0;
			var _p2 = _p3;
			if (_p2.ctor === 'Nothing') {
				var _v3 = _p1._1;
				maybes = _v3;
				continue oneOf;
			} else {
				return _p3;
			}
		}
	}
};
var _elm_lang$core$Maybe$andThen = F2(
	function (maybeValue, callback) {
		var _p4 = maybeValue;
		if (_p4.ctor === 'Just') {
			return callback(_p4._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$Just = function (a) {
	return {ctor: 'Just', _0: a};
};
var _elm_lang$core$Maybe$map = F2(
	function (f, maybe) {
		var _p5 = maybe;
		if (_p5.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(
				f(_p5._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		var _p6 = {ctor: '_Tuple2', _0: ma, _1: mb};
		if (((_p6.ctor === '_Tuple2') && (_p6._0.ctor === 'Just')) && (_p6._1.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A2(func, _p6._0._0, _p6._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		var _p7 = {ctor: '_Tuple3', _0: ma, _1: mb, _2: mc};
		if ((((_p7.ctor === '_Tuple3') && (_p7._0.ctor === 'Just')) && (_p7._1.ctor === 'Just')) && (_p7._2.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A3(func, _p7._0._0, _p7._1._0, _p7._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		var _p8 = {ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md};
		if (((((_p8.ctor === '_Tuple4') && (_p8._0.ctor === 'Just')) && (_p8._1.ctor === 'Just')) && (_p8._2.ctor === 'Just')) && (_p8._3.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A4(func, _p8._0._0, _p8._1._0, _p8._2._0, _p8._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _elm_lang$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		var _p9 = {ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me};
		if ((((((_p9.ctor === '_Tuple5') && (_p9._0.ctor === 'Just')) && (_p9._1.ctor === 'Just')) && (_p9._2.ctor === 'Just')) && (_p9._3.ctor === 'Just')) && (_p9._4.ctor === 'Just')) {
			return _elm_lang$core$Maybe$Just(
				A5(func, _p9._0._0, _p9._1._0, _p9._2._0, _p9._3._0, _p9._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

//import Native.Utils //

var _elm_lang$core$Native_List = function() {

var Nil = { ctor: '[]' };

function Cons(hd, tl)
{
	return { ctor: '::', _0: hd, _1: tl };
}

function fromArray(arr)
{
	var out = Nil;
	for (var i = arr.length; i--; )
	{
		out = Cons(arr[i], out);
	}
	return out;
}

function toArray(xs)
{
	var out = [];
	while (xs.ctor !== '[]')
	{
		out.push(xs._0);
		xs = xs._1;
	}
	return out;
}


function range(lo, hi)
{
	var list = Nil;
	if (lo <= hi)
	{
		do
		{
			list = Cons(hi, list);
		}
		while (hi-- > lo);
	}
	return list;
}

function foldr(f, b, xs)
{
	var arr = toArray(xs);
	var acc = b;
	for (var i = arr.length; i--; )
	{
		acc = A2(f, arr[i], acc);
	}
	return acc;
}

function map2(f, xs, ys)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]')
	{
		arr.push(A2(f, xs._0, ys._0));
		xs = xs._1;
		ys = ys._1;
	}
	return fromArray(arr);
}

function map3(f, xs, ys, zs)
{
	var arr = [];
	while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
	{
		arr.push(A3(f, xs._0, ys._0, zs._0));
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map4(f, ws, xs, ys, zs)
{
	var arr = [];
	while (   ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function map5(f, vs, ws, xs, ys, zs)
{
	var arr = [];
	while (   vs.ctor !== '[]'
		   && ws.ctor !== '[]'
		   && xs.ctor !== '[]'
		   && ys.ctor !== '[]'
		   && zs.ctor !== '[]')
	{
		arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
		vs = vs._1;
		ws = ws._1;
		xs = xs._1;
		ys = ys._1;
		zs = zs._1;
	}
	return fromArray(arr);
}

function sortBy(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
	}));
}

function sortWith(f, xs)
{
	return fromArray(toArray(xs).sort(function(a, b) {
		var ord = f(a)(b).ctor;
		return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
	}));
}

return {
	Nil: Nil,
	Cons: Cons,
	cons: F2(Cons),
	toArray: toArray,
	fromArray: fromArray,
	range: range,

	foldr: F3(foldr),

	map2: F3(map2),
	map3: F4(map3),
	map4: F5(map4),
	map5: F6(map5),
	sortBy: F2(sortBy),
	sortWith: F2(sortWith)
};

}();
var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
var _elm_lang$core$List$sort = function (xs) {
	return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
};
var _elm_lang$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
						_v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
var _elm_lang$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
						_v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
var _elm_lang$core$List$all = F2(
	function (isOkay, list) {
		return _elm_lang$core$Basics$not(
			A2(
				_elm_lang$core$List$any,
				function (_p2) {
					return _elm_lang$core$Basics$not(
						isOkay(_p2));
				},
				list));
	});
var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
var _elm_lang$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
					_v8 = A2(func, _p3._0, acc),
					_v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
var _elm_lang$core$List$length = function (xs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p4, i) {
				return i + 1;
			}),
		0,
		xs);
};
var _elm_lang$core$List$sum = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x + y;
			}),
		0,
		numbers);
};
var _elm_lang$core$List$product = function (numbers) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return x * y;
			}),
		1,
		numbers);
};
var _elm_lang$core$List$maximum = function (list) {
	var _p5 = list;
	if (_p5.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$minimum = function (list) {
	var _p6 = list;
	if (_p6.ctor === '::') {
		return _elm_lang$core$Maybe$Just(
			A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$map2,
			f,
			_elm_lang$core$Native_List.range(
				0,
				_elm_lang$core$List$length(xs) - 1),
			xs);
	});
var _elm_lang$core$List$member = F2(
	function (x, xs) {
		return A2(
			_elm_lang$core$List$any,
			function (a) {
				return _elm_lang$core$Native_Utils.eq(a, x);
			},
			xs);
	});
var _elm_lang$core$List$isEmpty = function (xs) {
	var _p7 = xs;
	if (_p7.ctor === '[]') {
		return true;
	} else {
		return false;
	}
};
var _elm_lang$core$List$tail = function (list) {
	var _p8 = list;
	if (_p8.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p8._1);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List$head = function (list) {
	var _p9 = list;
	if (_p9.ctor === '::') {
		return _elm_lang$core$Maybe$Just(_p9._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
var _elm_lang$core$List$map = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						_elm_lang$core$List_ops['::'],
						f(x),
						acc);
				}),
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$filter = F2(
	function (pred, xs) {
		var conditionalCons = F2(
			function (x, xs$) {
				return pred(x) ? A2(_elm_lang$core$List_ops['::'], x, xs$) : xs$;
			});
		return A3(
			_elm_lang$core$List$foldr,
			conditionalCons,
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return A2(_elm_lang$core$List_ops['::'], _p10._0, xs);
		} else {
			return xs;
		}
	});
var _elm_lang$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			_elm_lang$core$List$foldr,
			_elm_lang$core$List$maybeCons(f),
			_elm_lang$core$Native_List.fromArray(
				[]),
			xs);
	});
var _elm_lang$core$List$reverse = function (list) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (x, y) {
				return A2(_elm_lang$core$List_ops['::'], x, y);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		list);
};
var _elm_lang$core$List$scanl = F3(
	function (f, b, xs) {
		var scan1 = F2(
			function (x, accAcc) {
				var _p11 = accAcc;
				if (_p11.ctor === '::') {
					return A2(
						_elm_lang$core$List_ops['::'],
						A2(f, x, _p11._0),
						accAcc);
				} else {
					return _elm_lang$core$Native_List.fromArray(
						[]);
				}
			});
		return _elm_lang$core$List$reverse(
			A3(
				_elm_lang$core$List$foldl,
				scan1,
				_elm_lang$core$Native_List.fromArray(
					[b]),
				xs));
	});
var _elm_lang$core$List$append = F2(
	function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(
				_elm_lang$core$List$foldr,
				F2(
					function (x, y) {
						return A2(_elm_lang$core$List_ops['::'], x, y);
					}),
				ys,
				xs);
		}
	});
var _elm_lang$core$List$concat = function (lists) {
	return A3(
		_elm_lang$core$List$foldr,
		_elm_lang$core$List$append,
		_elm_lang$core$Native_List.fromArray(
			[]),
		lists);
};
var _elm_lang$core$List$concatMap = F2(
	function (f, list) {
		return _elm_lang$core$List$concat(
			A2(_elm_lang$core$List$map, f, list));
	});
var _elm_lang$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _p13) {
				var _p14 = _p13;
				var _p16 = _p14._0;
				var _p15 = _p14._1;
				return pred(x) ? {
					ctor: '_Tuple2',
					_0: A2(_elm_lang$core$List_ops['::'], x, _p16),
					_1: _p15
				} : {
					ctor: '_Tuple2',
					_0: _p16,
					_1: A2(_elm_lang$core$List_ops['::'], x, _p15)
				};
			});
		return A3(
			_elm_lang$core$List$foldr,
			step,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_List.fromArray(
					[]),
				_1: _elm_lang$core$Native_List.fromArray(
					[])
			},
			list);
	});
var _elm_lang$core$List$unzip = function (pairs) {
	var step = F2(
		function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: A2(_elm_lang$core$List_ops['::'], _p19._0, _p20._0),
				_1: A2(_elm_lang$core$List_ops['::'], _p19._1, _p20._1)
			};
		});
	return A3(
		_elm_lang$core$List$foldr,
		step,
		{
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_List.fromArray(
				[]),
			_1: _elm_lang$core$Native_List.fromArray(
				[])
		},
		pairs);
};
var _elm_lang$core$List$intersperse = F2(
	function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		} else {
			var step = F2(
				function (x, rest) {
					return A2(
						_elm_lang$core$List_ops['::'],
						sep,
						A2(_elm_lang$core$List_ops['::'], x, rest));
				});
			var spersed = A3(
				_elm_lang$core$List$foldr,
				step,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_p21._1);
			return A2(_elm_lang$core$List_ops['::'], _p21._0, spersed);
		}
	});
var _elm_lang$core$List$take = F2(
	function (n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		} else {
			var _p22 = list;
			if (_p22.ctor === '[]') {
				return list;
			} else {
				return A2(
					_elm_lang$core$List_ops['::'],
					_p22._0,
					A2(_elm_lang$core$List$take, n - 1, _p22._1));
			}
		}
	});
var _elm_lang$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v23 = A2(_elm_lang$core$List_ops['::'], value, result),
					_v24 = n - 1,
					_v25 = value;
				result = _v23;
				n = _v24;
				value = _v25;
				continue repeatHelp;
			}
		}
	});
var _elm_lang$core$List$repeat = F2(
	function (n, value) {
		return A3(
			_elm_lang$core$List$repeatHelp,
			_elm_lang$core$Native_List.fromArray(
				[]),
			n,
			value);
	});

var _elm_lang$core$Result$toMaybe = function (result) {
	var _p0 = result;
	if (_p0.ctor === 'Ok') {
		return _elm_lang$core$Maybe$Just(_p0._0);
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _elm_lang$core$Result$withDefault = F2(
	function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
var _elm_lang$core$Result$Err = function (a) {
	return {ctor: 'Err', _0: a};
};
var _elm_lang$core$Result$andThen = F2(
	function (result, callback) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
var _elm_lang$core$Result$Ok = function (a) {
	return {ctor: 'Ok', _0: a};
};
var _elm_lang$core$Result$map = F2(
	function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(
				func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
var _elm_lang$core$Result$map2 = F3(
	function (func, ra, rb) {
		var _p4 = {ctor: '_Tuple2', _0: ra, _1: rb};
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(
					A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
var _elm_lang$core$Result$map3 = F4(
	function (func, ra, rb, rc) {
		var _p5 = {ctor: '_Tuple3', _0: ra, _1: rb, _2: rc};
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(
						A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
var _elm_lang$core$Result$map4 = F5(
	function (func, ra, rb, rc, rd) {
		var _p6 = {ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd};
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(
							A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
var _elm_lang$core$Result$map5 = F6(
	function (func, ra, rb, rc, rd, re) {
		var _p7 = {ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re};
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(
								A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
var _elm_lang$core$Result$formatError = F2(
	function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(
				f(_p8._0));
		}
	});
var _elm_lang$core$Result$fromMaybe = F2(
	function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

//import //

var _elm_lang$core$Native_Platform = function() {


// PROGRAMS

function addPublicModule(object, name, main)
{
	var init = main ? makeEmbed(name, main) : mainIsUndefined(name);

	object['worker'] = function worker(flags)
	{
		return init(undefined, flags, false);
	}

	object['embed'] = function embed(domNode, flags)
	{
		return init(domNode, flags, true);
	}

	object['fullscreen'] = function fullscreen(flags)
	{
		return init(document.body, flags, true);
	};
}


// PROGRAM FAIL

function mainIsUndefined(name)
{
	return function(domNode)
	{
		var message = 'Cannot initialize module `' + name +
			'` because it has no `main` value!\nWhat should I show on screen?';
		domNode.innerHTML = errorHtml(message);
		throw new Error(message);
	};
}

function errorHtml(message)
{
	return '<div style="padding-left:1em;">'
		+ '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>'
		+ '<pre style="padding-left:1em;">' + message + '</pre>'
		+ '</div>';
}


// PROGRAM SUCCESS

function makeEmbed(moduleName, main)
{
	return function embed(rootDomNode, flags, withRenderer)
	{
		try
		{
			var program = mainToProgram(moduleName, main);
			if (!withRenderer)
			{
				program.renderer = dummyRenderer;
			}
			return makeEmbedHelp(moduleName, program, rootDomNode, flags);
		}
		catch (e)
		{
			rootDomNode.innerHTML = errorHtml(e.message);
			throw e;
		}
	};
}

function dummyRenderer()
{
	return { update: function() {} };
}


// MAIN TO PROGRAM

function mainToProgram(moduleName, wrappedMain)
{
	var main = wrappedMain.main;

	if (typeof main.init === 'undefined')
	{
		var emptyBag = batch(_elm_lang$core$Native_List.Nil);
		var noChange = _elm_lang$core$Native_Utils.Tuple2(
			_elm_lang$core$Native_Utils.Tuple0,
			emptyBag
		);

		return _elm_lang$virtual_dom$VirtualDom$programWithFlags({
			init: function() { return noChange; },
			view: function() { return main; },
			update: F2(function() { return noChange; }),
			subscriptions: function () { return emptyBag; }
		});
	}

	var flags = wrappedMain.flags;
	var init = flags
		? initWithFlags(moduleName, main.init, flags)
		: initWithoutFlags(moduleName, main.init);

	return _elm_lang$virtual_dom$VirtualDom$programWithFlags({
		init: init,
		view: main.view,
		update: main.update,
		subscriptions: main.subscriptions,
	});
}

function initWithoutFlags(moduleName, realInit)
{
	return function init(flags)
	{
		if (typeof flags !== 'undefined')
		{
			throw new Error(
				'You are giving module `' + moduleName + '` an argument in JavaScript.\n'
				+ 'This module does not take arguments though! You probably need to change the\n'
				+ 'initialization code to something like `Elm.' + moduleName + '.fullscreen()`'
			);
		}
		return realInit();
	};
}

function initWithFlags(moduleName, realInit, flagDecoder)
{
	return function init(flags)
	{
		var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
		if (result.ctor === 'Err')
		{
			throw new Error(
				'You are trying to initialize module `' + moduleName + '` with an unexpected argument.\n'
				+ 'When trying to convert it to a usable Elm value, I run into this problem:\n\n'
				+ result._0
			);
		}
		return realInit(result._0);
	};
}


// SETUP RUNTIME SYSTEM

function makeEmbedHelp(moduleName, program, rootDomNode, flags)
{
	var init = program.init;
	var update = program.update;
	var subscriptions = program.subscriptions;
	var view = program.view;
	var makeRenderer = program.renderer;

	// ambient state
	var managers = {};
	var renderer;

	// init and update state in main process
	var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var results = init(flags);
		var model = results._0;
		renderer = makeRenderer(rootDomNode, enqueue, view(model));
		var cmds = results._1;
		var subs = subscriptions(model);
		dispatchEffects(managers, cmds, subs);
		callback(_elm_lang$core$Native_Scheduler.succeed(model));
	});

	function onMessage(msg, model)
	{
		return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
			var results = A2(update, msg, model);
			model = results._0;
			renderer.update(view(model));
			var cmds = results._1;
			var subs = subscriptions(model);
			dispatchEffects(managers, cmds, subs);
			callback(_elm_lang$core$Native_Scheduler.succeed(model));
		});
	}

	var mainProcess = spawnLoop(initApp, onMessage);

	function enqueue(msg)
	{
		_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
	}

	var ports = setupEffects(managers, enqueue);

	return ports ? { ports: ports } : {};
}


// EFFECT MANAGERS

var effectManagers = {};

function setupEffects(managers, callback)
{
	var ports;

	// setup all necessary effect managers
	for (var key in effectManagers)
	{
		var manager = effectManagers[key];

		if (manager.isForeign)
		{
			ports = ports || {};
			ports[key] = manager.tag === 'cmd'
				? setupOutgoingPort(key)
				: setupIncomingPort(key, callback);
		}

		managers[key] = makeManager(manager, callback);
	}

	return ports;
}

function makeManager(info, callback)
{
	var router = {
		main: callback,
		self: undefined
	};

	var tag = info.tag;
	var onEffects = info.onEffects;
	var onSelfMsg = info.onSelfMsg;

	function onMessage(msg, state)
	{
		if (msg.ctor === 'self')
		{
			return A3(onSelfMsg, router, msg._0, state);
		}

		var fx = msg._0;
		switch (tag)
		{
			case 'cmd':
				return A3(onEffects, router, fx.cmds, state);

			case 'sub':
				return A3(onEffects, router, fx.subs, state);

			case 'fx':
				return A4(onEffects, router, fx.cmds, fx.subs, state);
		}
	}

	var process = spawnLoop(info.init, onMessage);
	router.self = process;
	return process;
}

function sendToApp(router, msg)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		router.main(msg);
		callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sendToSelf(router, msg)
{
	return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
		ctor: 'self',
		_0: msg
	});
}


// HELPER for STATEFUL LOOPS

function spawnLoop(init, onMessage)
{
	var andThen = _elm_lang$core$Native_Scheduler.andThen;

	function loop(state)
	{
		var handleMsg = _elm_lang$core$Native_Scheduler.receive(function(msg) {
			return onMessage(msg, state);
		});
		return A2(andThen, handleMsg, loop);
	}

	var task = A2(andThen, init, loop);

	return _elm_lang$core$Native_Scheduler.rawSpawn(task);
}


// BAGS

function leaf(home)
{
	return function(value)
	{
		return {
			type: 'leaf',
			home: home,
			value: value
		};
	};
}

function batch(list)
{
	return {
		type: 'node',
		branches: list
	};
}

function map(tagger, bag)
{
	return {
		type: 'map',
		tagger: tagger,
		tree: bag
	}
}


// PIPE BAGS INTO EFFECT MANAGERS

function dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	gatherEffects(true, cmdBag, effectsDict, null);
	gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		var fx = home in effectsDict
			? effectsDict[home]
			: {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};

		_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
	}
}

function gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.type)
	{
		case 'leaf':
			var home = bag.home;
			var effect = toEffect(isCmd, home, taggers, bag.value);
			effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
			return;

		case 'node':
			var list = bag.branches;
			while (list.ctor !== '[]')
			{
				gatherEffects(isCmd, list._0, effectsDict, taggers);
				list = list._1;
			}
			return;

		case 'map':
			gatherEffects(isCmd, bag.tree, effectsDict, {
				tagger: bag.tagger,
				rest: taggers
			});
			return;
	}
}

function toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		var temp = taggers;
		while (temp)
		{
			x = temp.tagger(x);
			temp = temp.rest;
		}
		return x;
	}

	var map = isCmd
		? effectManagers[home].cmdMap
		: effectManagers[home].subMap;

	return A2(map, applyTaggers, value)
}

function insert(isCmd, newEffect, effects)
{
	effects = effects || {
		cmds: _elm_lang$core$Native_List.Nil,
		subs: _elm_lang$core$Native_List.Nil
	};
	if (isCmd)
	{
		effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
		return effects;
	}
	effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
	return effects;
}


// PORTS

function checkPortName(name)
{
	if (name in effectManagers)
	{
		throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
	}
}


// OUTGOING PORTS

function outgoingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'cmd',
		cmdMap: outgoingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var outgoingPortMap = F2(function cmdMap(tagger, value) {
	return value;
});

function setupOutgoingPort(name)
{
	var subs = [];
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, cmdList, state)
	{
		while (cmdList.ctor !== '[]')
		{
			var value = converter(cmdList._0);
			for (var i = 0; i < subs.length; i++)
			{
				subs[i](value);
			}
			cmdList = cmdList._1;
		}
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}


// INCOMING PORTS

function incomingPort(name, converter)
{
	checkPortName(name);
	effectManagers[name] = {
		tag: 'sub',
		subMap: incomingPortMap,
		converter: converter,
		isForeign: true
	};
	return leaf(name);
}

var incomingPortMap = F2(function subMap(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});

function setupIncomingPort(name, callback)
{
	var subs = _elm_lang$core$Native_List.Nil;
	var converter = effectManagers[name].converter;

	// CREATE MANAGER

	var init = _elm_lang$core$Native_Scheduler.succeed(null);

	function onEffects(router, subList, state)
	{
		subs = subList;
		return init;
	}

	effectManagers[name].init = init;
	effectManagers[name].onEffects = F3(onEffects);

	// PUBLIC API

	function send(value)
	{
		var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, value);
		if (result.ctor === 'Err')
		{
			throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
		}

		var value = result._0;
		var temp = subs;
		while (temp.ctor !== '[]')
		{
			callback(temp._0(value));
			temp = temp._1;
		}
	}

	return { send: send };
}

return {
	// routers
	sendToApp: F2(sendToApp),
	sendToSelf: F2(sendToSelf),

	// global setup
	mainToProgram: mainToProgram,
	effectManagers: effectManagers,
	outgoingPort: outgoingPort,
	incomingPort: incomingPort,
	addPublicModule: addPublicModule,

	// effect bags
	leaf: leaf,
	batch: batch,
	map: F2(map)
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Scheduler = function() {

var MAX_STEPS = 10000;


// TASKS

function succeed(value)
{
	return {
		ctor: '_Task_succeed',
		value: value
	};
}

function fail(error)
{
	return {
		ctor: '_Task_fail',
		value: error
	};
}

function nativeBinding(callback)
{
	return {
		ctor: '_Task_nativeBinding',
		callback: callback,
		cancel: null
	};
}

function andThen(task, callback)
{
	return {
		ctor: '_Task_andThen',
		task: task,
		callback: callback
	};
}

function onError(task, callback)
{
	return {
		ctor: '_Task_onError',
		task: task,
		callback: callback
	};
}

function receive(callback)
{
	return {
		ctor: '_Task_receive',
		callback: callback
	};
}


// PROCESSES

function rawSpawn(task)
{
	var process = {
		ctor: '_Process',
		id: _elm_lang$core$Native_Utils.guid(),
		root: task,
		stack: null,
		mailbox: []
	};

	enqueue(process);

	return process;
}

function spawn(task)
{
	return nativeBinding(function(callback) {
		var process = rawSpawn(task);
		callback(succeed(process));
	});
}

function rawSend(process, msg)
{
	process.mailbox.push(msg);
	enqueue(process);
}

function send(process, msg)
{
	return nativeBinding(function(callback) {
		rawSend(process, msg);
		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function kill(process)
{
	return nativeBinding(function(callback) {
		var root = process.root;
		if (root.ctor === '_Task_nativeBinding' && root.cancel)
		{
			root.cancel();
		}

		process.root = null;

		callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
	});
}

function sleep(time)
{
	return nativeBinding(function(callback) {
		var id = setTimeout(function() {
			callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}


// STEP PROCESSES

function step(numSteps, process)
{
	while (numSteps < MAX_STEPS)
	{
		var ctor = process.root.ctor;

		if (ctor === '_Task_succeed')
		{
			while (process.stack && process.stack.ctor === '_Task_onError')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_fail')
		{
			while (process.stack && process.stack.ctor === '_Task_andThen')
			{
				process.stack = process.stack.rest;
			}
			if (process.stack === null)
			{
				break;
			}
			process.root = process.stack.callback(process.root.value);
			process.stack = process.stack.rest;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_andThen')
		{
			process.stack = {
				ctor: '_Task_andThen',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_onError')
		{
			process.stack = {
				ctor: '_Task_onError',
				callback: process.root.callback,
				rest: process.stack
			};
			process.root = process.root.task;
			++numSteps;
			continue;
		}

		if (ctor === '_Task_nativeBinding')
		{
			process.root.cancel = process.root.callback(function(newRoot) {
				process.root = newRoot;
				enqueue(process);
			});

			break;
		}

		if (ctor === '_Task_receive')
		{
			var mailbox = process.mailbox;
			if (mailbox.length === 0)
			{
				break;
			}

			process.root = process.root.callback(mailbox.shift());
			++numSteps;
			continue;
		}

		throw new Error(ctor);
	}

	if (numSteps < MAX_STEPS)
	{
		return numSteps + 1;
	}
	enqueue(process);

	return numSteps;
}


// WORK QUEUE

var working = false;
var workQueue = [];

function enqueue(process)
{
	workQueue.push(process);

	if (!working)
	{
		setTimeout(work, 0);
		working = true;
	}
}

function work()
{
	var numSteps = 0;
	var process;
	while (numSteps < MAX_STEPS && (process = workQueue.shift()))
	{
		numSteps = step(numSteps, process);
	}
	if (!process)
	{
		working = false;
		return;
	}
	setTimeout(work, 0);
}


return {
	succeed: succeed,
	fail: fail,
	nativeBinding: nativeBinding,
	andThen: F2(andThen),
	onError: F2(onError),
	receive: receive,

	spawn: spawn,
	kill: kill,
	sleep: sleep,
	send: F2(send),

	rawSpawn: rawSpawn,
	rawSend: rawSend
};

}();
var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
var _elm_lang$core$Platform$Program = {ctor: 'Program'};
var _elm_lang$core$Platform$Task = {ctor: 'Task'};
var _elm_lang$core$Platform$ProcessId = {ctor: 'ProcessId'};
var _elm_lang$core$Platform$Router = {ctor: 'Router'};

var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch(
	_elm_lang$core$Native_List.fromArray(
		[]));
var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
_elm_lang$core$Platform_Cmd_ops['!'] = F2(
	function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Cmd$Cmd = {ctor: 'Cmd'};

var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch(
	_elm_lang$core$Native_List.fromArray(
		[]));
var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
var _elm_lang$core$Platform_Sub$Sub = {ctor: 'Sub'};

//import Native.List //

var _elm_lang$core$Native_Array = function() {

// A RRB-Tree has two distinct data types.
// Leaf -> "height"  is always 0
//         "table"   is an array of elements
// Node -> "height"  is always greater than 0
//         "table"   is an array of child nodes
//         "lengths" is an array of accumulated lengths of the child nodes

// M is the maximal table size. 32 seems fast. E is the allowed increase
// of search steps when concatting to find an index. Lower values will
// decrease balancing, but will increase search steps.
var M = 32;
var E = 2;

// An empty array.
var empty = {
	ctor: '_Array',
	height: 0,
	table: []
};


function get(i, array)
{
	if (i < 0 || i >= length(array))
	{
		throw new Error(
			'Index ' + i + ' is out of range. Check the length of ' +
			'your array first or use getMaybe or getWithDefault.');
	}
	return unsafeGet(i, array);
}


function unsafeGet(i, array)
{
	for (var x = array.height; x > 0; x--)
	{
		var slot = i >> (x * 5);
		while (array.lengths[slot] <= i)
		{
			slot++;
		}
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array = array.table[slot];
	}
	return array.table[i];
}


// Sets the value at the index i. Only the nodes leading to i will get
// copied and updated.
function set(i, item, array)
{
	if (i < 0 || length(array) <= i)
	{
		return array;
	}
	return unsafeSet(i, item, array);
}


function unsafeSet(i, item, array)
{
	array = nodeCopy(array);

	if (array.height === 0)
	{
		array.table[i] = item;
	}
	else
	{
		var slot = getSlot(i, array);
		if (slot > 0)
		{
			i -= array.lengths[slot - 1];
		}
		array.table[slot] = unsafeSet(i, item, array.table[slot]);
	}
	return array;
}


function initialize(len, f)
{
	if (len <= 0)
	{
		return empty;
	}
	var h = Math.floor( Math.log(len) / Math.log(M) );
	return initialize_(f, h, 0, len);
}

function initialize_(f, h, from, to)
{
	if (h === 0)
	{
		var table = new Array((to - from) % (M + 1));
		for (var i = 0; i < table.length; i++)
		{
		  table[i] = f(from + i);
		}
		return {
			ctor: '_Array',
			height: 0,
			table: table
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

function fromList(list)
{
	if (list.ctor === '[]')
	{
		return empty;
	}

	// Allocate M sized blocks (table) and write list elements to it.
	var table = new Array(M);
	var nodes = [];
	var i = 0;

	while (list.ctor !== '[]')
	{
		table[i] = list._0;
		list = list._1;
		i++;

		// table is full, so we can push a leaf containing it into the
		// next node.
		if (i === M)
		{
			var leaf = {
				ctor: '_Array',
				height: 0,
				table: table
			};
			fromListPush(leaf, nodes);
			table = new Array(M);
			i = 0;
		}
	}

	// Maybe there is something left on the table.
	if (i > 0)
	{
		var leaf = {
			ctor: '_Array',
			height: 0,
			table: table.splice(0, i)
		};
		fromListPush(leaf, nodes);
	}

	// Go through all of the nodes and eventually push them into higher nodes.
	for (var h = 0; h < nodes.length - 1; h++)
	{
		if (nodes[h].table.length > 0)
		{
			fromListPush(nodes[h], nodes);
		}
	}

	var head = nodes[nodes.length - 1];
	if (head.height > 0 && head.table.length === 1)
	{
		return head.table[0];
	}
	else
	{
		return head;
	}
}

// Push a node into a higher node as a child.
function fromListPush(toPush, nodes)
{
	var h = toPush.height;

	// Maybe the node on this height does not exist.
	if (nodes.length === h)
	{
		var node = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
		nodes.push(node);
	}

	nodes[h].table.push(toPush);
	var len = length(toPush);
	if (nodes[h].lengths.length > 0)
	{
		len += nodes[h].lengths[nodes[h].lengths.length - 1];
	}
	nodes[h].lengths.push(len);

	if (nodes[h].table.length === M)
	{
		fromListPush(nodes[h], nodes);
		nodes[h] = {
			ctor: '_Array',
			height: h + 1,
			table: [],
			lengths: []
		};
	}
}

// Pushes an item via push_ to the bottom right of a tree.
function push(item, a)
{
	var pushed = push_(item, a);
	if (pushed !== null)
	{
		return pushed;
	}

	var newTree = create(item, a.height);
	return siblise(a, newTree);
}

// Recursively tries to push an item to the bottom-right most
// tree possible. If there is no space left for the item,
// null will be returned.
function push_(item, a)
{
	// Handle resursion stop at leaf level.
	if (a.height === 0)
	{
		if (a.table.length < M)
		{
			var newA = {
				ctor: '_Array',
				height: 0,
				table: a.table.slice()
			};
			newA.table.push(item);
			return newA;
		}
		else
		{
		  return null;
		}
	}

	// Recursively push
	var pushed = push_(item, botRight(a));

	// There was space in the bottom right tree, so the slot will
	// be updated.
	if (pushed !== null)
	{
		var newA = nodeCopy(a);
		newA.table[newA.table.length - 1] = pushed;
		newA.lengths[newA.lengths.length - 1]++;
		return newA;
	}

	// When there was no space left, check if there is space left
	// for a new slot with a tree which contains only the item
	// at the bottom.
	if (a.table.length < M)
	{
		var newSlot = create(item, a.height - 1);
		var newA = nodeCopy(a);
		newA.table.push(newSlot);
		newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
		return newA;
	}
	else
	{
		return null;
	}
}

// Converts an array into a list of elements.
function toList(a)
{
	return toList_(_elm_lang$core$Native_List.Nil, a);
}

function toList_(list, a)
{
	for (var i = a.table.length - 1; i >= 0; i--)
	{
		list =
			a.height === 0
				? _elm_lang$core$Native_List.Cons(a.table[i], list)
				: toList_(list, a.table[i]);
	}
	return list;
}

// Maps a function over the elements of an array.
function map(f, a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? f(a.table[i])
				: map(f, a.table[i]);
	}
	return newA;
}

// Maps a function over the elements with their index as first argument.
function indexedMap(f, a)
{
	return indexedMap_(f, a, 0);
}

function indexedMap_(f, a, from)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: new Array(a.table.length)
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths;
	}
	for (var i = 0; i < a.table.length; i++)
	{
		newA.table[i] =
			a.height === 0
				? A2(f, from + i, a.table[i])
				: indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
	}
	return newA;
}

function foldl(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = 0; i < a.table.length; i++)
		{
			b = foldl(f, b, a.table[i]);
		}
	}
	return b;
}

function foldr(f, b, a)
{
	if (a.height === 0)
	{
		for (var i = a.table.length; i--; )
		{
			b = A2(f, a.table[i], b);
		}
	}
	else
	{
		for (var i = a.table.length; i--; )
		{
			b = foldr(f, b, a.table[i]);
		}
	}
	return b;
}

// TODO: currently, it slices the right, then the left. This can be
// optimized.
function slice(from, to, a)
{
	if (from < 0)
	{
		from += length(a);
	}
	if (to < 0)
	{
		to += length(a);
	}
	return sliceLeft(from, sliceRight(to, a));
}

function sliceRight(to, a)
{
	if (to === length(a))
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(0, to);
		return newA;
	}

	// Slice the right recursively.
	var right = getSlot(to, a);
	var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (right === 0)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(0, right),
		lengths: a.lengths.slice(0, right)
	};
	if (sliced.table.length > 0)
	{
		newA.table[right] = sliced;
		newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
	}
	return newA;
}

function sliceLeft(from, a)
{
	if (from === 0)
	{
		return a;
	}

	// Handle leaf level.
	if (a.height === 0)
	{
		var newA = { ctor:'_Array', height:0 };
		newA.table = a.table.slice(from, a.table.length + 1);
		return newA;
	}

	// Slice the left recursively.
	var left = getSlot(from, a);
	var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

	// Maybe the a node is not even needed, as sliced contains the whole slice.
	if (left === a.table.length - 1)
	{
		return sliced;
	}

	// Create new node.
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice(left, a.table.length + 1),
		lengths: new Array(a.table.length - left)
	};
	newA.table[0] = sliced;
	var len = 0;
	for (var i = 0; i < newA.table.length; i++)
	{
		len += length(newA.table[i]);
		newA.lengths[i] = len;
	}

	return newA;
}

// Appends two trees.
function append(a,b)
{
	if (a.table.length === 0)
	{
		return b;
	}
	if (b.table.length === 0)
	{
		return a;
	}

	var c = append_(a, b);

	// Check if both nodes can be crunshed together.
	if (c[0].table.length + c[1].table.length <= M)
	{
		if (c[0].table.length === 0)
		{
			return c[1];
		}
		if (c[1].table.length === 0)
		{
			return c[0];
		}

		// Adjust .table and .lengths
		c[0].table = c[0].table.concat(c[1].table);
		if (c[0].height > 0)
		{
			var len = length(c[0]);
			for (var i = 0; i < c[1].lengths.length; i++)
			{
				c[1].lengths[i] += len;
			}
			c[0].lengths = c[0].lengths.concat(c[1].lengths);
		}

		return c[0];
	}

	if (c[0].height > 0)
	{
		var toRemove = calcToRemove(a, b);
		if (toRemove > E)
		{
			c = shuffle(c[0], c[1], toRemove);
		}
	}

	return siblise(c[0], c[1]);
}

// Returns an array of two nodes; right and left. One node _may_ be empty.
function append_(a, b)
{
	if (a.height === 0 && b.height === 0)
	{
		return [a, b];
	}

	if (a.height !== 1 || b.height !== 1)
	{
		if (a.height === b.height)
		{
			a = nodeCopy(a);
			b = nodeCopy(b);
			var appended = append_(botRight(a), botLeft(b));

			insertRight(a, appended[1]);
			insertLeft(b, appended[0]);
		}
		else if (a.height > b.height)
		{
			a = nodeCopy(a);
			var appended = append_(botRight(a), b);

			insertRight(a, appended[0]);
			b = parentise(appended[1], appended[1].height + 1);
		}
		else
		{
			b = nodeCopy(b);
			var appended = append_(a, botLeft(b));

			var left = appended[0].table.length === 0 ? 0 : 1;
			var right = left === 0 ? 1 : 0;
			insertLeft(b, appended[left]);
			a = parentise(appended[right], appended[right].height + 1);
		}
	}

	// Check if balancing is needed and return based on that.
	if (a.table.length === 0 || b.table.length === 0)
	{
		return [a, b];
	}

	var toRemove = calcToRemove(a, b);
	if (toRemove <= E)
	{
		return [a, b];
	}
	return shuffle(a, b, toRemove);
}

// Helperfunctions for append_. Replaces a child node at the side of the parent.
function insertRight(parent, node)
{
	var index = parent.table.length - 1;
	parent.table[index] = node;
	parent.lengths[index] = length(node);
	parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
}

function insertLeft(parent, node)
{
	if (node.table.length > 0)
	{
		parent.table[0] = node;
		parent.lengths[0] = length(node);

		var len = length(parent.table[0]);
		for (var i = 1; i < parent.lengths.length; i++)
		{
			len += length(parent.table[i]);
			parent.lengths[i] = len;
		}
	}
	else
	{
		parent.table.shift();
		for (var i = 1; i < parent.lengths.length; i++)
		{
			parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
		}
		parent.lengths.shift();
	}
}

// Returns the extra search steps for E. Refer to the paper.
function calcToRemove(a, b)
{
	var subLengths = 0;
	for (var i = 0; i < a.table.length; i++)
	{
		subLengths += a.table[i].table.length;
	}
	for (var i = 0; i < b.table.length; i++)
	{
		subLengths += b.table[i].table.length;
	}

	var toRemove = a.table.length + b.table.length;
	return toRemove - (Math.floor((subLengths - 1) / M) + 1);
}

// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
function get2(a, b, index)
{
	return index < a.length
		? a[index]
		: b[index - a.length];
}

function set2(a, b, index, value)
{
	if (index < a.length)
	{
		a[index] = value;
	}
	else
	{
		b[index - a.length] = value;
	}
}

function saveSlot(a, b, index, slot)
{
	set2(a.table, b.table, index, slot);

	var l = (index === 0 || index === a.lengths.length)
		? 0
		: get2(a.lengths, a.lengths, index - 1);

	set2(a.lengths, b.lengths, index, l + length(slot));
}

// Creates a node or leaf with a given length at their arrays for perfomance.
// Is only used by shuffle.
function createNode(h, length)
{
	if (length < 0)
	{
		length = 0;
	}
	var a = {
		ctor: '_Array',
		height: h,
		table: new Array(length)
	};
	if (h > 0)
	{
		a.lengths = new Array(length);
	}
	return a;
}

// Returns an array of two balanced nodes.
function shuffle(a, b, toRemove)
{
	var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
	var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

	// Skip the slots with size M. More precise: copy the slot references
	// to the new node
	var read = 0;
	while (get2(a.table, b.table, read).table.length % M === 0)
	{
		set2(newA.table, newB.table, read, get2(a.table, b.table, read));
		set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
		read++;
	}

	// Pulling items from left to right, caching in a slot before writing
	// it into the new nodes.
	var write = read;
	var slot = new createNode(a.height - 1, 0);
	var from = 0;

	// If the current slot is still containing data, then there will be at
	// least one more write, so we do not break this loop yet.
	while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
	{
		// Find out the max possible items for copying.
		var source = get2(a.table, b.table, read);
		var to = Math.min(M - slot.table.length, source.table.length);

		// Copy and adjust size table.
		slot.table = slot.table.concat(source.table.slice(from, to));
		if (slot.height > 0)
		{
			var len = slot.lengths.length;
			for (var i = len; i < len + to - from; i++)
			{
				slot.lengths[i] = length(slot.table[i]);
				slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
			}
		}

		from += to;

		// Only proceed to next slots[i] if the current one was
		// fully copied.
		if (source.table.length <= to)
		{
			read++; from = 0;
		}

		// Only create a new slot if the current one is filled up.
		if (slot.table.length === M)
		{
			saveSlot(newA, newB, write, slot);
			slot = createNode(a.height - 1, 0);
			write++;
		}
	}

	// Cleanup after the loop. Copy the last slot into the new nodes.
	if (slot.table.length > 0)
	{
		saveSlot(newA, newB, write, slot);
		write++;
	}

	// Shift the untouched slots to the left
	while (read < a.table.length + b.table.length )
	{
		saveSlot(newA, newB, write, get2(a.table, b.table, read));
		read++;
		write++;
	}

	return [newA, newB];
}

// Navigation functions
function botRight(a)
{
	return a.table[a.table.length - 1];
}
function botLeft(a)
{
	return a.table[0];
}

// Copies a node for updating. Note that you should not use this if
// only updating only one of "table" or "lengths" for performance reasons.
function nodeCopy(a)
{
	var newA = {
		ctor: '_Array',
		height: a.height,
		table: a.table.slice()
	};
	if (a.height > 0)
	{
		newA.lengths = a.lengths.slice();
	}
	return newA;
}

// Returns how many items are in the tree.
function length(array)
{
	if (array.height === 0)
	{
		return array.table.length;
	}
	else
	{
		return array.lengths[array.lengths.length - 1];
	}
}

// Calculates in which slot of "table" the item probably is, then
// find the exact slot via forward searching in  "lengths". Returns the index.
function getSlot(i, a)
{
	var slot = i >> (5 * a.height);
	while (a.lengths[slot] <= i)
	{
		slot++;
	}
	return slot;
}

// Recursively creates a tree with a given height containing
// only the given item.
function create(item, h)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: [item]
		};
	}
	return {
		ctor: '_Array',
		height: h,
		table: [create(item, h - 1)],
		lengths: [1]
	};
}

// Recursively creates a tree that contains the given tree.
function parentise(tree, h)
{
	if (h === tree.height)
	{
		return tree;
	}

	return {
		ctor: '_Array',
		height: h,
		table: [parentise(tree, h - 1)],
		lengths: [length(tree)]
	};
}

// Emphasizes blood brotherhood beneath two trees.
function siblise(a, b)
{
	return {
		ctor: '_Array',
		height: a.height + 1,
		table: [a, b],
		lengths: [length(a), length(a) + length(b)]
	};
}

function toJSArray(a)
{
	var jsArray = new Array(length(a));
	toJSArray_(jsArray, 0, a);
	return jsArray;
}

function toJSArray_(jsArray, i, a)
{
	for (var t = 0; t < a.table.length; t++)
	{
		if (a.height === 0)
		{
			jsArray[i + t] = a.table[t];
		}
		else
		{
			var inc = t === 0 ? 0 : a.lengths[t - 1];
			toJSArray_(jsArray, i + inc, a.table[t]);
		}
	}
}

function fromJSArray(jsArray)
{
	if (jsArray.length === 0)
	{
		return empty;
	}
	var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
	return fromJSArray_(jsArray, h, 0, jsArray.length);
}

function fromJSArray_(jsArray, h, from, to)
{
	if (h === 0)
	{
		return {
			ctor: '_Array',
			height: 0,
			table: jsArray.slice(from, to)
		};
	}

	var step = Math.pow(M, h);
	var table = new Array(Math.ceil((to - from) / step));
	var lengths = new Array(table.length);
	for (var i = 0; i < table.length; i++)
	{
		table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
		lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
	}
	return {
		ctor: '_Array',
		height: h,
		table: table,
		lengths: lengths
	};
}

return {
	empty: empty,
	fromList: fromList,
	toList: toList,
	initialize: F2(initialize),
	append: F2(append),
	push: F2(push),
	slice: F3(slice),
	get: F2(get),
	set: F3(set),
	map: F2(map),
	indexedMap: F2(indexedMap),
	foldl: F3(foldl),
	foldr: F3(foldr),
	length: length,

	toJSArray: toJSArray,
	fromJSArray: fromJSArray
};

}();
var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
var _elm_lang$core$Array$isEmpty = function (array) {
	return _elm_lang$core$Native_Utils.eq(
		_elm_lang$core$Array$length(array),
		0);
};
var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
var _elm_lang$core$Array$get = F2(
	function (i, array) {
		return ((_elm_lang$core$Native_Utils.cmp(0, i) < 1) && (_elm_lang$core$Native_Utils.cmp(
			i,
			_elm_lang$core$Native_Array.length(array)) < 0)) ? _elm_lang$core$Maybe$Just(
			A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
var _elm_lang$core$Array$filter = F2(
	function (isOkay, arr) {
		var update = F2(
			function (x, xs) {
				return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
			});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
var _elm_lang$core$Array$toIndexedList = function (array) {
	return A3(
		_elm_lang$core$List$map2,
		F2(
			function (v0, v1) {
				return {ctor: '_Tuple2', _0: v0, _1: v1};
			}),
		_elm_lang$core$Native_List.range(
			0,
			_elm_lang$core$Native_Array.length(array) - 1),
		_elm_lang$core$Native_Array.toList(array));
};
var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
var _elm_lang$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			_elm_lang$core$Array$initialize,
			n,
			_elm_lang$core$Basics$always(e));
	});
var _elm_lang$core$Array$Array = {ctor: 'Array'};

//import Maybe, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_String = function() {

function isEmpty(str)
{
	return str.length === 0;
}
function cons(chr, str)
{
	return chr + str;
}
function uncons(str)
{
	var hd = str[0];
	if (hd)
	{
		return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
	}
	return _elm_lang$core$Maybe$Nothing;
}
function append(a, b)
{
	return a + b;
}
function concat(strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join('');
}
function length(str)
{
	return str.length;
}
function map(f, str)
{
	var out = str.split('');
	for (var i = out.length; i--; )
	{
		out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
	}
	return out.join('');
}
function filter(pred, str)
{
	return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
}
function reverse(str)
{
	return str.split('').reverse().join('');
}
function foldl(f, b, str)
{
	var len = str.length;
	for (var i = 0; i < len; ++i)
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function foldr(f, b, str)
{
	for (var i = str.length; i--; )
	{
		b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
	}
	return b;
}
function split(sep, str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(sep));
}
function join(sep, strs)
{
	return _elm_lang$core$Native_List.toArray(strs).join(sep);
}
function repeat(n, str)
{
	var result = '';
	while (n > 0)
	{
		if (n & 1)
		{
			result += str;
		}
		n >>= 1, str += str;
	}
	return result;
}
function slice(start, end, str)
{
	return str.slice(start, end);
}
function left(n, str)
{
	return n < 1 ? '' : str.slice(0, n);
}
function right(n, str)
{
	return n < 1 ? '' : str.slice(-n);
}
function dropLeft(n, str)
{
	return n < 1 ? str : str.slice(n);
}
function dropRight(n, str)
{
	return n < 1 ? str : str.slice(0, -n);
}
function pad(n, chr, str)
{
	var half = (n - str.length) / 2;
	return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
}
function padRight(n, chr, str)
{
	return str + repeat(n - str.length, chr);
}
function padLeft(n, chr, str)
{
	return repeat(n - str.length, chr) + str;
}

function trim(str)
{
	return str.trim();
}
function trimLeft(str)
{
	return str.replace(/^\s+/, '');
}
function trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function words(str)
{
	return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
}
function lines(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
}

function toUpper(str)
{
	return str.toUpperCase();
}
function toLower(str)
{
	return str.toLowerCase();
}

function any(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return true;
		}
	}
	return false;
}
function all(pred, str)
{
	for (var i = str.length; i--; )
	{
		if (!pred(_elm_lang$core$Native_Utils.chr(str[i])))
		{
			return false;
		}
	}
	return true;
}

function contains(sub, str)
{
	return str.indexOf(sub) > -1;
}
function startsWith(sub, str)
{
	return str.indexOf(sub) === 0;
}
function endsWith(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
}
function indexes(sub, str)
{
	var subLen = sub.length;
	var i = 0;
	var is = [];
	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}
	return _elm_lang$core$Native_List.fromArray(is);
}

function toInt(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
		start = 1;
	}
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if (c < '0' || '9' < c)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int" );
		}
	}
	return _elm_lang$core$Result$Ok(parseInt(s, 10));
}

function toFloat(s)
{
	var len = s.length;
	if (len === 0)
	{
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	var start = 0;
	if (s[0] === '-')
	{
		if (len === 1)
		{
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
		}
		start = 1;
	}
	var dotCount = 0;
	for (var i = start; i < len; ++i)
	{
		var c = s[i];
		if ('0' <= c && c <= '9')
		{
			continue;
		}
		if (c === '.')
		{
			dotCount += 1;
			if (dotCount <= 1)
			{
				continue;
			}
		}
		return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float" );
	}
	return _elm_lang$core$Result$Ok(parseFloat(s));
}

function toList(str)
{
	return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
}
function fromList(chars)
{
	return _elm_lang$core$Native_List.toArray(chars).join('');
}

return {
	isEmpty: isEmpty,
	cons: F2(cons),
	uncons: uncons,
	append: F2(append),
	concat: concat,
	length: length,
	map: F2(map),
	filter: F2(filter),
	reverse: reverse,
	foldl: F3(foldl),
	foldr: F3(foldr),

	split: F2(split),
	join: F2(join),
	repeat: F2(repeat),

	slice: F3(slice),
	left: F2(left),
	right: F2(right),
	dropLeft: F2(dropLeft),
	dropRight: F2(dropRight),

	pad: F3(pad),
	padLeft: F3(padLeft),
	padRight: F3(padRight),

	trim: trim,
	trimLeft: trimLeft,
	trimRight: trimRight,

	words: words,
	lines: lines,

	toUpper: toUpper,
	toLower: toLower,

	any: F2(any),
	all: F2(all),

	contains: F2(contains),
	startsWith: F2(startsWith),
	endsWith: F2(endsWith),
	indexes: F2(indexes),

	toInt: toInt,
	toFloat: toFloat,
	toList: toList,
	fromList: fromList
};

}();
//import Native.Utils //

var _elm_lang$core$Native_Char = function() {

return {
	fromCode: function(c) { return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c)); },
	toCode: function(c) { return c.charCodeAt(0); },
	toUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toUpperCase()); },
	toLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLowerCase()); },
	toLocaleUpper: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase()); },
	toLocaleLower: function(c) { return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase()); }
};

}();
var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
var _elm_lang$core$Char$isBetween = F3(
	function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(low)) > -1) && (_elm_lang$core$Native_Utils.cmp(
			code,
			_elm_lang$core$Char$toCode(high)) < 1);
	});
var _elm_lang$core$Char$isUpper = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('A'),
	_elm_lang$core$Native_Utils.chr('Z'));
var _elm_lang$core$Char$isLower = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('a'),
	_elm_lang$core$Native_Utils.chr('z'));
var _elm_lang$core$Char$isDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('9'));
var _elm_lang$core$Char$isOctDigit = A2(
	_elm_lang$core$Char$isBetween,
	_elm_lang$core$Native_Utils.chr('0'),
	_elm_lang$core$Native_Utils.chr('7'));
var _elm_lang$core$Char$isHexDigit = function ($char) {
	return _elm_lang$core$Char$isDigit($char) || (A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('a'),
		_elm_lang$core$Native_Utils.chr('f'),
		$char) || A3(
		_elm_lang$core$Char$isBetween,
		_elm_lang$core$Native_Utils.chr('A'),
		_elm_lang$core$Native_Utils.chr('F'),
		$char));
};

var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
var _elm_lang$core$String$fromChar = function ($char) {
	return A2(_elm_lang$core$String$cons, $char, '');
};
var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

var _elm_lang$core$Dict$foldr = F3(
	function (f, acc, t) {
		foldr:
		while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
					_v2 = A3(
					f,
					_p0._1,
					_p0._2,
					A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
					_v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
var _elm_lang$core$Dict$keys = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(_elm_lang$core$List_ops['::'], key, keyList);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$values = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2(_elm_lang$core$List_ops['::'], value, valueList);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$toList = function (dict) {
	return A3(
		_elm_lang$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					_elm_lang$core$List_ops['::'],
					{ctor: '_Tuple2', _0: key, _1: value},
					list);
			}),
		_elm_lang$core$Native_List.fromArray(
			[]),
		dict);
};
var _elm_lang$core$Dict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
					_v6 = A3(
					f,
					_p1._1,
					_p1._2,
					A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
					_v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
var _elm_lang$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _p2) {
				var _p3 = _p2;
				var _p9 = _p3._1;
				var _p8 = _p3._0;
				var _p4 = _p8;
				if (_p4.ctor === '[]') {
					return {
						ctor: '_Tuple2',
						_0: _p8,
						_1: A3(rightStep, rKey, rValue, _p9)
					};
				} else {
					var _p7 = _p4._1;
					var _p6 = _p4._0._1;
					var _p5 = _p4._0._0;
					return (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) ? {
						ctor: '_Tuple2',
						_0: _p7,
						_1: A3(leftStep, _p5, _p6, _p9)
					} : ((_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) ? {
						ctor: '_Tuple2',
						_0: _p8,
						_1: A3(rightStep, rKey, rValue, _p9)
					} : {
						ctor: '_Tuple2',
						_0: _p7,
						_1: A4(bothStep, _p5, _p6, rValue, _p9)
					});
				}
			});
		var _p10 = A3(
			_elm_lang$core$Dict$foldl,
			stepState,
			{
				ctor: '_Tuple2',
				_0: _elm_lang$core$Dict$toList(leftDict),
				_1: initialResult
			},
			rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(
			_elm_lang$core$List$foldl,
			F2(
				function (_p11, result) {
					var _p12 = _p11;
					return A3(leftStep, _p12._0, _p12._1, result);
				}),
			intermediateResult,
			leftovers);
	});
var _elm_lang$core$Dict$reportRemBug = F4(
	function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(
			_elm_lang$core$String$concat(
				_elm_lang$core$Native_List.fromArray(
					[
						'Internal red-black tree invariant violated, expected ',
						msg,
						' and got ',
						_elm_lang$core$Basics$toString(c),
						'/',
						lgot,
						'/',
						rgot,
						'\nPlease report this bug to <https://github.com/elm-lang/core/issues>'
					])));
	});
var _elm_lang$core$Dict$isBBlack = function (dict) {
	var _p13 = dict;
	_v11_2:
	do {
		if (_p13.ctor === 'RBNode_elm_builtin') {
			if (_p13._0.ctor === 'BBlack') {
				return true;
			} else {
				break _v11_2;
			}
		} else {
			if (_p13._0.ctor === 'LBBlack') {
				return true;
			} else {
				break _v11_2;
			}
		}
	} while(false);
	return false;
};
var _elm_lang$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v13 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
					_v14 = _p14._3;
				n = _v13;
				dict = _v14;
				continue sizeHelp;
			}
		}
	});
var _elm_lang$core$Dict$size = function (dict) {
	return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
};
var _elm_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v17 = targetKey,
							_v18 = _p15._3;
						targetKey = _v17;
						dict = _v18;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v19 = targetKey,
							_v20 = _p15._4;
						targetKey = _v19;
						dict = _v20;
						continue get;
				}
			}
		}
	});
var _elm_lang$core$Dict$member = F2(
	function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var _elm_lang$core$Dict$maxWithDefault = F3(
	function (k, v, r) {
		maxWithDefault:
		while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return {ctor: '_Tuple2', _0: k, _1: v};
			} else {
				var _v23 = _p18._1,
					_v24 = _p18._2,
					_v25 = _p18._4;
				k = _v23;
				v = _v24;
				r = _v25;
				continue maxWithDefault;
			}
		}
	});
var _elm_lang$core$Dict$NBlack = {ctor: 'NBlack'};
var _elm_lang$core$Dict$BBlack = {ctor: 'BBlack'};
var _elm_lang$core$Dict$Black = {ctor: 'Black'};
var _elm_lang$core$Dict$blackish = function (t) {
	var _p19 = t;
	if (_p19.ctor === 'RBNode_elm_builtin') {
		var _p20 = _p19._0;
		return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
	} else {
		return true;
	}
};
var _elm_lang$core$Dict$Red = {ctor: 'Red'};
var _elm_lang$core$Dict$moreBlack = function (color) {
	var _p21 = color;
	switch (_p21.ctor) {
		case 'Black':
			return _elm_lang$core$Dict$BBlack;
		case 'Red':
			return _elm_lang$core$Dict$Black;
		case 'NBlack':
			return _elm_lang$core$Dict$Red;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
	}
};
var _elm_lang$core$Dict$lessBlack = function (color) {
	var _p22 = color;
	switch (_p22.ctor) {
		case 'BBlack':
			return _elm_lang$core$Dict$Black;
		case 'Black':
			return _elm_lang$core$Dict$Red;
		case 'Red':
			return _elm_lang$core$Dict$NBlack;
		default:
			return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
	}
};
var _elm_lang$core$Dict$LBBlack = {ctor: 'LBBlack'};
var _elm_lang$core$Dict$LBlack = {ctor: 'LBlack'};
var _elm_lang$core$Dict$RBEmpty_elm_builtin = function (a) {
	return {ctor: 'RBEmpty_elm_builtin', _0: a};
};
var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
var _elm_lang$core$Dict$isEmpty = function (dict) {
	return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
};
var _elm_lang$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e};
	});
var _elm_lang$core$Dict$ensureBlackRoot = function (dict) {
	var _p23 = dict;
	if ((_p23.ctor === 'RBNode_elm_builtin') && (_p23._0.ctor === 'Red')) {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
	} else {
		return dict;
	}
};
var _elm_lang$core$Dict$lessBlackTree = function (dict) {
	var _p24 = dict;
	if (_p24.ctor === 'RBNode_elm_builtin') {
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$lessBlack(_p24._0),
			_p24._1,
			_p24._2,
			_p24._3,
			_p24._4);
	} else {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	}
};
var _elm_lang$core$Dict$balancedTree = function (col) {
	return function (xk) {
		return function (xv) {
			return function (yk) {
				return function (yv) {
					return function (zk) {
						return function (zv) {
							return function (a) {
								return function (b) {
									return function (c) {
										return function (d) {
											return A5(
												_elm_lang$core$Dict$RBNode_elm_builtin,
												_elm_lang$core$Dict$lessBlack(col),
												yk,
												yv,
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b),
												A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _elm_lang$core$Dict$blacken = function (t) {
	var _p25 = t;
	if (_p25.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
	}
};
var _elm_lang$core$Dict$redden = function (t) {
	var _p26 = t;
	if (_p26.ctor === 'RBEmpty_elm_builtin') {
		return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
	} else {
		return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
	}
};
var _elm_lang$core$Dict$balanceHelp = function (tree) {
	var _p27 = tree;
	_v33_6:
	do {
		_v33_5:
		do {
			_v33_4:
			do {
				_v33_3:
				do {
					_v33_2:
					do {
						_v33_1:
						do {
							_v33_0:
							do {
								if (_p27.ctor === 'RBNode_elm_builtin') {
									if (_p27._3.ctor === 'RBNode_elm_builtin') {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._3._0.ctor) {
												case 'Red':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v33_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v33_1;
																} else {
																	if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																		break _v33_2;
																	} else {
																		if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																			break _v33_3;
																		} else {
																			break _v33_6;
																		}
																	}
																}
															}
														case 'NBlack':
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v33_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v33_1;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																		break _v33_4;
																	} else {
																		break _v33_6;
																	}
																}
															}
														default:
															if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
																break _v33_0;
															} else {
																if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
																	break _v33_1;
																} else {
																	break _v33_6;
																}
															}
													}
												case 'NBlack':
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v33_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v33_3;
																} else {
																	if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v33_5;
																	} else {
																		break _v33_6;
																	}
																}
															}
														case 'NBlack':
															if (_p27._0.ctor === 'BBlack') {
																if ((((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																	break _v33_4;
																} else {
																	if ((((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																		break _v33_5;
																	} else {
																		break _v33_6;
																	}
																}
															} else {
																break _v33_6;
															}
														default:
															if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
																break _v33_5;
															} else {
																break _v33_6;
															}
													}
												default:
													switch (_p27._4._0.ctor) {
														case 'Red':
															if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
																break _v33_2;
															} else {
																if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
																	break _v33_3;
																} else {
																	break _v33_6;
																}
															}
														case 'NBlack':
															if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
																break _v33_4;
															} else {
																break _v33_6;
															}
														default:
															break _v33_6;
													}
											}
										} else {
											switch (_p27._3._0.ctor) {
												case 'Red':
													if ((_p27._3._3.ctor === 'RBNode_elm_builtin') && (_p27._3._3._0.ctor === 'Red')) {
														break _v33_0;
													} else {
														if ((_p27._3._4.ctor === 'RBNode_elm_builtin') && (_p27._3._4._0.ctor === 'Red')) {
															break _v33_1;
														} else {
															break _v33_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._3._3.ctor === 'RBNode_elm_builtin')) && (_p27._3._3._0.ctor === 'Black')) && (_p27._3._4.ctor === 'RBNode_elm_builtin')) && (_p27._3._4._0.ctor === 'Black')) {
														break _v33_5;
													} else {
														break _v33_6;
													}
												default:
													break _v33_6;
											}
										}
									} else {
										if (_p27._4.ctor === 'RBNode_elm_builtin') {
											switch (_p27._4._0.ctor) {
												case 'Red':
													if ((_p27._4._3.ctor === 'RBNode_elm_builtin') && (_p27._4._3._0.ctor === 'Red')) {
														break _v33_2;
													} else {
														if ((_p27._4._4.ctor === 'RBNode_elm_builtin') && (_p27._4._4._0.ctor === 'Red')) {
															break _v33_3;
														} else {
															break _v33_6;
														}
													}
												case 'NBlack':
													if (((((_p27._0.ctor === 'BBlack') && (_p27._4._3.ctor === 'RBNode_elm_builtin')) && (_p27._4._3._0.ctor === 'Black')) && (_p27._4._4.ctor === 'RBNode_elm_builtin')) && (_p27._4._4._0.ctor === 'Black')) {
														break _v33_4;
													} else {
														break _v33_6;
													}
												default:
													break _v33_6;
											}
										} else {
											break _v33_6;
										}
									}
								} else {
									break _v33_6;
								}
							} while(false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
						} while(false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
					} while(false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
				} while(false);
				return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
			} while(false);
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_elm_lang$core$Dict$Black,
				_p27._4._3._1,
				_p27._4._3._2,
				A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3),
				A5(
					_elm_lang$core$Dict$balance,
					_elm_lang$core$Dict$Black,
					_p27._4._1,
					_p27._4._2,
					_p27._4._3._4,
					_elm_lang$core$Dict$redden(_p27._4._4)));
		} while(false);
		return A5(
			_elm_lang$core$Dict$RBNode_elm_builtin,
			_elm_lang$core$Dict$Black,
			_p27._3._4._1,
			_p27._3._4._2,
			A5(
				_elm_lang$core$Dict$balance,
				_elm_lang$core$Dict$Black,
				_p27._3._1,
				_p27._3._2,
				_elm_lang$core$Dict$redden(_p27._3._3),
				_p27._3._4._3),
			A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
	} while(false);
	return tree;
};
var _elm_lang$core$Dict$balance = F5(
	function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
var _elm_lang$core$Dict$bubble = F5(
	function (c, k, v, l, r) {
		return (_elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r)) ? A5(
			_elm_lang$core$Dict$balance,
			_elm_lang$core$Dict$moreBlack(c),
			k,
			v,
			_elm_lang$core$Dict$lessBlackTree(l),
			_elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
var _elm_lang$core$Dict$removeMax = F5(
	function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(
				_elm_lang$core$Dict$bubble,
				c,
				k,
				v,
				l,
				A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
var _elm_lang$core$Dict$rem = F3(
	function (c, l, r) {
		var _p29 = {ctor: '_Tuple2', _0: l, _1: r};
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = c;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = {ctor: '_Tuple3', _0: c, _1: _p32, _2: _p33};
				if ((((_p31.ctor === '_Tuple3') && (_p31._0.ctor === 'Black')) && (_p31._1.ctor === 'LBlack')) && (_p31._2.ctor === 'Red')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/LBlack/Red',
						c,
						_elm_lang$core$Basics$toString(_p32),
						_elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = {ctor: '_Tuple3', _0: c, _1: _p35, _2: _p36};
				if ((((_p34.ctor === '_Tuple3') && (_p34._0.ctor === 'Black')) && (_p34._1.ctor === 'Red')) && (_p34._2.ctor === 'LBlack')) {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(
						_elm_lang$core$Dict$reportRemBug,
						'Black/Red/LBlack',
						c,
						_elm_lang$core$Basics$toString(_p35),
						_elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var l$ = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, c, k, v, l$, r);
			}
		}
	});
var _elm_lang$core$Dict$map = F2(
	function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(
				_elm_lang$core$Dict$RBNode_elm_builtin,
				_p41._0,
				_p42,
				A2(f, _p42, _p41._2),
				A2(_elm_lang$core$Dict$map, f, _p41._3),
				A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
var _elm_lang$core$Dict$Same = {ctor: 'Same'};
var _elm_lang$core$Dict$Remove = {ctor: 'Remove'};
var _elm_lang$core$Dict$Insert = {ctor: 'Insert'};
var _elm_lang$core$Dict$update = F3(
	function (k, alter, dict) {
		var up = function (dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return {ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(
							_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
var _elm_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(
				_elm_lang$core$Maybe$Just(value)),
			dict);
	});
var _elm_lang$core$Dict$singleton = F2(
	function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
var _elm_lang$core$Dict$union = F2(
	function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
var _elm_lang$core$Dict$filter = F2(
	function (predicate, dictionary) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
			});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
var _elm_lang$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			_elm_lang$core$Dict$filter,
			F2(
				function (k, _p58) {
					return A2(_elm_lang$core$Dict$member, k, t2);
				}),
			t1);
	});
var _elm_lang$core$Dict$partition = F2(
	function (predicate, dict) {
		var add = F3(
			function (key, value, _p59) {
				var _p60 = _p59;
				var _p62 = _p60._1;
				var _p61 = _p60._0;
				return A2(predicate, key, value) ? {
					ctor: '_Tuple2',
					_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
					_1: _p62
				} : {
					ctor: '_Tuple2',
					_0: _p61,
					_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
				};
			});
		return A3(
			_elm_lang$core$Dict$foldl,
			add,
			{ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty},
			dict);
	});
var _elm_lang$core$Dict$fromList = function (assocs) {
	return A3(
		_elm_lang$core$List$foldl,
		F2(
			function (_p63, dict) {
				var _p64 = _p63;
				return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
			}),
		_elm_lang$core$Dict$empty,
		assocs);
};
var _elm_lang$core$Dict$remove = F2(
	function (key, dict) {
		return A3(
			_elm_lang$core$Dict$update,
			key,
			_elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing),
			dict);
	});
var _elm_lang$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2(_elm_lang$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});

//import Maybe, Native.Array, Native.List, Native.Utils, Result //

var _elm_lang$core$Native_Json = function() {


// CORE DECODERS

function succeed(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'succeed',
		msg: msg
	};
}

function fail(msg)
{
	return {
		ctor: '<decoder>',
		tag: 'fail',
		msg: msg
	};
}

function decodePrimitive(tag)
{
	return {
		ctor: '<decoder>',
		tag: tag
	};
}

function decodeContainer(tag, decoder)
{
	return {
		ctor: '<decoder>',
		tag: tag,
		decoder: decoder
	};
}

function decodeNull(value)
{
	return {
		ctor: '<decoder>',
		tag: 'null',
		value: value
	};
}

function decodeField(field, decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'field',
		field: field,
		decoder: decoder
	};
}

function decodeKeyValuePairs(decoder)
{
	return {
		ctor: '<decoder>',
		tag: 'key-value',
		decoder: decoder
	};
}

function decodeObject(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'map-many',
		func: f,
		decoders: decoders
	};
}

function decodeTuple(f, decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'tuple',
		func: f,
		decoders: decoders
	};
}

function andThen(decoder, callback)
{
	return {
		ctor: '<decoder>',
		tag: 'andThen',
		decoder: decoder,
		callback: callback
	};
}

function customAndThen(decoder, callback)
{
	return {
		ctor: '<decoder>',
		tag: 'customAndThen',
		decoder: decoder,
		callback: callback
	};
}

function oneOf(decoders)
{
	return {
		ctor: '<decoder>',
		tag: 'oneOf',
		decoders: decoders
	};
}


// DECODING OBJECTS

function decodeObject1(f, d1)
{
	return decodeObject(f, [d1]);
}

function decodeObject2(f, d1, d2)
{
	return decodeObject(f, [d1, d2]);
}

function decodeObject3(f, d1, d2, d3)
{
	return decodeObject(f, [d1, d2, d3]);
}

function decodeObject4(f, d1, d2, d3, d4)
{
	return decodeObject(f, [d1, d2, d3, d4]);
}

function decodeObject5(f, d1, d2, d3, d4, d5)
{
	return decodeObject(f, [d1, d2, d3, d4, d5]);
}

function decodeObject6(f, d1, d2, d3, d4, d5, d6)
{
	return decodeObject(f, [d1, d2, d3, d4, d5, d6]);
}

function decodeObject7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return decodeObject(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function decodeObject8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return decodeObject(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODING TUPLES

function decodeTuple1(f, d1)
{
	return decodeTuple(f, [d1]);
}

function decodeTuple2(f, d1, d2)
{
	return decodeTuple(f, [d1, d2]);
}

function decodeTuple3(f, d1, d2, d3)
{
	return decodeTuple(f, [d1, d2, d3]);
}

function decodeTuple4(f, d1, d2, d3, d4)
{
	return decodeTuple(f, [d1, d2, d3, d4]);
}

function decodeTuple5(f, d1, d2, d3, d4, d5)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5]);
}

function decodeTuple6(f, d1, d2, d3, d4, d5, d6)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5, d6]);
}

function decodeTuple7(f, d1, d2, d3, d4, d5, d6, d7)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5, d6, d7]);
}

function decodeTuple8(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return decodeTuple(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
}


// DECODE HELPERS

function ok(value)
{
	return { tag: 'ok', value: value };
}

function badPrimitive(type, value)
{
	return { tag: 'primitive', type: type, value: value };
}

function badIndex(index, nestedProblems)
{
	return { tag: 'index', index: index, rest: nestedProblems };
}

function badField(field, nestedProblems)
{
	return { tag: 'field', field: field, rest: nestedProblems };
}

function badOneOf(problems)
{
	return { tag: 'oneOf', problems: problems };
}

function bad(msg)
{
	return { tag: 'fail', msg: msg };
}

function badToString(problem)
{
	var context = '_';
	while (problem)
	{
		switch (problem.tag)
		{
			case 'primitive':
				return 'Expecting ' + problem.type
					+ (context === '_' ? '' : ' at ' + context)
					+ ' but instead got: ' + jsToString(problem.value);

			case 'index':
				context += '[' + problem.index + ']';
				problem = problem.rest;
				break;

			case 'field':
				context += '.' + problem.field;
				problem = problem.rest;
				break;

			case 'oneOf':
				var problems = problem.problems;
				for (var i = 0; i < problems.length; i++)
				{
					problems[i] = badToString(problems[i]);
				}
				return 'I ran into the following problems'
					+ (context === '_' ? '' : ' at ' + context)
					+ ':\n\n' + problems.join('\n');

			case 'fail':
				return 'I ran into a `fail` decoder'
					+ (context === '_' ? '' : ' at ' + context)
					+ ': ' + problem.msg;
		}
	}
}

function jsToString(value)
{
	return value === undefined
		? 'undefined'
		: JSON.stringify(value);
}


// DECODE

function runOnString(decoder, string)
{
	var json;
	try
	{
		json = JSON.parse(string);
	}
	catch (e)
	{
		return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
	}
	return run(decoder, json);
}

function run(decoder, value)
{
	var result = runHelp(decoder, value);
	return (result.tag === 'ok')
		? _elm_lang$core$Result$Ok(result.value)
		: _elm_lang$core$Result$Err(badToString(result));
}

function runHelp(decoder, value)
{
	switch (decoder.tag)
	{
		case 'bool':
			return (typeof value === 'boolean')
				? ok(value)
				: badPrimitive('a Bool', value);

		case 'int':
			if (typeof value !== 'number') {
				return badPrimitive('an Int', value);
			}

			if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
				return ok(value);
			}

			if (isFinite(value) && !(value % 1)) {
				return ok(value);
			}

			return badPrimitive('an Int', value);

		case 'float':
			return (typeof value === 'number')
				? ok(value)
				: badPrimitive('a Float', value);

		case 'string':
			return (typeof value === 'string')
				? ok(value)
				: (value instanceof String)
					? ok(value + '')
					: badPrimitive('a String', value);

		case 'null':
			return (value === null)
				? ok(decoder.value)
				: badPrimitive('null', value);

		case 'value':
			return ok(value);

		case 'list':
			if (!(value instanceof Array))
			{
				return badPrimitive('a List', value);
			}

			var list = _elm_lang$core$Native_List.Nil;
			for (var i = value.length; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result)
				}
				list = _elm_lang$core$Native_List.Cons(result.value, list);
			}
			return ok(list);

		case 'array':
			if (!(value instanceof Array))
			{
				return badPrimitive('an Array', value);
			}

			var len = value.length;
			var array = new Array(len);
			for (var i = len; i--; )
			{
				var result = runHelp(decoder.decoder, value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				array[i] = result.value;
			}
			return ok(_elm_lang$core$Native_Array.fromJSArray(array));

		case 'maybe':
			var result = runHelp(decoder.decoder, value);
			return (result.tag === 'ok')
				? ok(_elm_lang$core$Maybe$Just(result.value))
				: ok(_elm_lang$core$Maybe$Nothing);

		case 'field':
			var field = decoder.field;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return badPrimitive('an object with a field named `' + field + '`', value);
			}

			var result = runHelp(decoder.decoder, value[field]);
			return (result.tag === 'ok')
				? result
				: badField(field, result);

		case 'key-value':
			if (typeof value !== 'object' || value === null || value instanceof Array)
			{
				return badPrimitive('an object', value);
			}

			var keyValuePairs = _elm_lang$core$Native_List.Nil;
			for (var key in value)
			{
				var result = runHelp(decoder.decoder, value[key]);
				if (result.tag !== 'ok')
				{
					return badField(key, result);
				}
				var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
				keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
			}
			return ok(keyValuePairs);

		case 'map-many':
			var answer = decoder.func;
			var decoders = decoder.decoders;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = runHelp(decoders[i], value);
				if (result.tag !== 'ok')
				{
					return result;
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'tuple':
			var decoders = decoder.decoders;
			var len = decoders.length;

			if ( !(value instanceof Array) || value.length !== len )
			{
				return badPrimitive('a Tuple with ' + len + ' entries', value);
			}

			var answer = decoder.func;
			for (var i = 0; i < len; i++)
			{
				var result = runHelp(decoders[i], value[i]);
				if (result.tag !== 'ok')
				{
					return badIndex(i, result);
				}
				answer = answer(result.value);
			}
			return ok(answer);

		case 'customAndThen':
			var result = runHelp(decoder.decoder, value);
			if (result.tag !== 'ok')
			{
				return result;
			}
			var realResult = decoder.callback(result.value);
			if (realResult.ctor === 'Err')
			{
				return badPrimitive('something custom', value);
			}
			return ok(realResult._0);

		case 'andThen':
			var result = runHelp(decoder.decoder, value);
			return (result.tag !== 'ok')
				? result
				: runHelp(decoder.callback(result.value), value);

		case 'oneOf':
			var errors = [];
			var temp = decoder.decoders;
			while (temp.ctor !== '[]')
			{
				var result = runHelp(temp._0, value);

				if (result.tag === 'ok')
				{
					return result;
				}

				errors.push(result);

				temp = temp._1;
			}
			return badOneOf(errors);

		case 'fail':
			return bad(decoder.msg);

		case 'succeed':
			return ok(decoder.msg);
	}
}


// EQUALITY

function equality(a, b)
{
	if (a === b)
	{
		return true;
	}

	if (a.tag !== b.tag)
	{
		return false;
	}

	switch (a.tag)
	{
		case 'succeed':
		case 'fail':
			return a.msg === b.msg;

		case 'bool':
		case 'int':
		case 'float':
		case 'string':
		case 'value':
			return true;

		case 'null':
			return a.value === b.value;

		case 'list':
		case 'array':
		case 'maybe':
		case 'key-value':
			return equality(a.decoder, b.decoder);

		case 'field':
			return a.field === b.field && equality(a.decoder, b.decoder);

		case 'map-many':
		case 'tuple':
			if (a.func !== b.func)
			{
				return false;
			}
			return listEquality(a.decoders, b.decoders);

		case 'andThen':
		case 'customAndThen':
			return a.callback === b.callback && equality(a.decoder, b.decoder);

		case 'oneOf':
			return listEquality(a.decoders, b.decoders);
	}
}

function listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

function encode(indentLevel, value)
{
	return JSON.stringify(value, null, indentLevel);
}

function identity(value)
{
	return value;
}

function encodeObject(keyValuePairs)
{
	var obj = {};
	while (keyValuePairs.ctor !== '[]')
	{
		var pair = keyValuePairs._0;
		obj[pair._0] = pair._1;
		keyValuePairs = keyValuePairs._1;
	}
	return obj;
}

return {
	encode: F2(encode),
	runOnString: F2(runOnString),
	run: F2(run),

	decodeNull: decodeNull,
	decodePrimitive: decodePrimitive,
	decodeContainer: F2(decodeContainer),

	decodeField: F2(decodeField),

	decodeObject1: F2(decodeObject1),
	decodeObject2: F3(decodeObject2),
	decodeObject3: F4(decodeObject3),
	decodeObject4: F5(decodeObject4),
	decodeObject5: F6(decodeObject5),
	decodeObject6: F7(decodeObject6),
	decodeObject7: F8(decodeObject7),
	decodeObject8: F9(decodeObject8),
	decodeKeyValuePairs: decodeKeyValuePairs,

	decodeTuple1: F2(decodeTuple1),
	decodeTuple2: F3(decodeTuple2),
	decodeTuple3: F4(decodeTuple3),
	decodeTuple4: F5(decodeTuple4),
	decodeTuple5: F6(decodeTuple5),
	decodeTuple6: F7(decodeTuple6),
	decodeTuple7: F8(decodeTuple7),
	decodeTuple8: F9(decodeTuple8),

	andThen: F2(andThen),
	customAndThen: F2(customAndThen),
	fail: fail,
	succeed: succeed,
	oneOf: oneOf,

	identity: identity,
	encodeNull: null,
	encodeArray: _elm_lang$core$Native_Array.toJSArray,
	encodeList: _elm_lang$core$Native_List.toArray,
	encodeObject: encodeObject,

	equality: equality
};

}();

var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
var _elm_lang$core$Json_Encode$Value = {ctor: 'Value'};

var _elm_lang$core$Json_Decode$tuple8 = _elm_lang$core$Native_Json.decodeTuple8;
var _elm_lang$core$Json_Decode$tuple7 = _elm_lang$core$Native_Json.decodeTuple7;
var _elm_lang$core$Json_Decode$tuple6 = _elm_lang$core$Native_Json.decodeTuple6;
var _elm_lang$core$Json_Decode$tuple5 = _elm_lang$core$Native_Json.decodeTuple5;
var _elm_lang$core$Json_Decode$tuple4 = _elm_lang$core$Native_Json.decodeTuple4;
var _elm_lang$core$Json_Decode$tuple3 = _elm_lang$core$Native_Json.decodeTuple3;
var _elm_lang$core$Json_Decode$tuple2 = _elm_lang$core$Native_Json.decodeTuple2;
var _elm_lang$core$Json_Decode$tuple1 = _elm_lang$core$Native_Json.decodeTuple1;
var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
var _elm_lang$core$Json_Decode$customDecoder = _elm_lang$core$Native_Json.customAndThen;
var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
var _elm_lang$core$Json_Decode$maybe = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
};
var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
var _elm_lang$core$Json_Decode$array = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
};
var _elm_lang$core$Json_Decode$list = function (decoder) {
	return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
};
var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
var _elm_lang$core$Json_Decode$object8 = _elm_lang$core$Native_Json.decodeObject8;
var _elm_lang$core$Json_Decode$object7 = _elm_lang$core$Native_Json.decodeObject7;
var _elm_lang$core$Json_Decode$object6 = _elm_lang$core$Native_Json.decodeObject6;
var _elm_lang$core$Json_Decode$object5 = _elm_lang$core$Native_Json.decodeObject5;
var _elm_lang$core$Json_Decode$object4 = _elm_lang$core$Native_Json.decodeObject4;
var _elm_lang$core$Json_Decode$object3 = _elm_lang$core$Native_Json.decodeObject3;
var _elm_lang$core$Json_Decode$object2 = _elm_lang$core$Native_Json.decodeObject2;
var _elm_lang$core$Json_Decode$object1 = _elm_lang$core$Native_Json.decodeObject1;
var _elm_lang$core$Json_Decode_ops = _elm_lang$core$Json_Decode_ops || {};
_elm_lang$core$Json_Decode_ops[':='] = _elm_lang$core$Native_Json.decodeField;
var _elm_lang$core$Json_Decode$at = F2(
	function (fields, decoder) {
		return A3(
			_elm_lang$core$List$foldr,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$Json_Decode_ops[':='], x, y);
				}),
			decoder,
			fields);
	});
var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.decodeObject1;
var _elm_lang$core$Json_Decode$dict = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$map,
		_elm_lang$core$Dict$fromList,
		_elm_lang$core$Json_Decode$keyValuePairs(decoder));
};
var _elm_lang$core$Json_Decode$Decoder = {ctor: 'Decoder'};

//import Result //

var _elm_lang$core$Native_Date = function() {

function fromString(str)
{
	var date = new Date(str);
	return isNaN(date.getTime())
		? _elm_lang$core$Result$Err('unable to parse \'' + str + '\' as a date')
		: _elm_lang$core$Result$Ok(date);
}

var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthTable =
	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


return {
	fromString: fromString,
	year: function(d) { return d.getFullYear(); },
	month: function(d) { return { ctor: monthTable[d.getMonth()] }; },
	day: function(d) { return d.getDate(); },
	hour: function(d) { return d.getHours(); },
	minute: function(d) { return d.getMinutes(); },
	second: function(d) { return d.getSeconds(); },
	millisecond: function(d) { return d.getMilliseconds(); },
	toTime: function(d) { return d.getTime(); },
	fromTime: function(t) { return new Date(t); },
	dayOfWeek: function(d) { return { ctor: dayTable[d.getDay()] }; }
};

}();
var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
var _elm_lang$core$Task$spawnCmd = F2(
	function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(
			A2(
				_elm_lang$core$Task$andThen,
				_p1._0,
				_elm_lang$core$Platform$sendToApp(router)));
	});
var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
var _elm_lang$core$Task$mapError = F2(
	function (f, task) {
		return A2(
			_elm_lang$core$Task$onError,
			task,
			function (err) {
				return _elm_lang$core$Task$fail(
					f(err));
			});
	});
var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
var _elm_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			_elm_lang$core$Task$andThen,
			taskA,
			function (a) {
				return _elm_lang$core$Task$succeed(
					func(a));
			});
	});
var _elm_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			_elm_lang$core$Task$andThen,
			taskA,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					taskB,
					function (b) {
						return _elm_lang$core$Task$succeed(
							A2(func, a, b));
					});
			});
	});
var _elm_lang$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			_elm_lang$core$Task$andThen,
			taskA,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					taskB,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							taskC,
							function (c) {
								return _elm_lang$core$Task$succeed(
									A3(func, a, b, c));
							});
					});
			});
	});
var _elm_lang$core$Task$map4 = F5(
	function (func, taskA, taskB, taskC, taskD) {
		return A2(
			_elm_lang$core$Task$andThen,
			taskA,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					taskB,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							taskC,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									taskD,
									function (d) {
										return _elm_lang$core$Task$succeed(
											A4(func, a, b, c, d));
									});
							});
					});
			});
	});
var _elm_lang$core$Task$map5 = F6(
	function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(
			_elm_lang$core$Task$andThen,
			taskA,
			function (a) {
				return A2(
					_elm_lang$core$Task$andThen,
					taskB,
					function (b) {
						return A2(
							_elm_lang$core$Task$andThen,
							taskC,
							function (c) {
								return A2(
									_elm_lang$core$Task$andThen,
									taskD,
									function (d) {
										return A2(
											_elm_lang$core$Task$andThen,
											taskE,
											function (e) {
												return _elm_lang$core$Task$succeed(
													A5(func, a, b, c, d, e));
											});
									});
							});
					});
			});
	});
var _elm_lang$core$Task$andMap = F2(
	function (taskFunc, taskValue) {
		return A2(
			_elm_lang$core$Task$andThen,
			taskFunc,
			function (func) {
				return A2(
					_elm_lang$core$Task$andThen,
					taskValue,
					function (value) {
						return _elm_lang$core$Task$succeed(
							func(value));
					});
			});
	});
var _elm_lang$core$Task$sequence = function (tasks) {
	var _p2 = tasks;
	if (_p2.ctor === '[]') {
		return _elm_lang$core$Task$succeed(
			_elm_lang$core$Native_List.fromArray(
				[]));
	} else {
		return A3(
			_elm_lang$core$Task$map2,
			F2(
				function (x, y) {
					return A2(_elm_lang$core$List_ops['::'], x, y);
				}),
			_p2._0,
			_elm_lang$core$Task$sequence(_p2._1));
	}
};
var _elm_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			_elm_lang$core$Task$map,
			function (_p3) {
				return {ctor: '_Tuple0'};
			},
			_elm_lang$core$Task$sequence(
				A2(
					_elm_lang$core$List$map,
					_elm_lang$core$Task$spawnCmd(router),
					commands)));
	});
var _elm_lang$core$Task$toMaybe = function (task) {
	return A2(
		_elm_lang$core$Task$onError,
		A2(_elm_lang$core$Task$map, _elm_lang$core$Maybe$Just, task),
		function (_p4) {
			return _elm_lang$core$Task$succeed(_elm_lang$core$Maybe$Nothing);
		});
};
var _elm_lang$core$Task$fromMaybe = F2(
	function ($default, maybe) {
		var _p5 = maybe;
		if (_p5.ctor === 'Just') {
			return _elm_lang$core$Task$succeed(_p5._0);
		} else {
			return _elm_lang$core$Task$fail($default);
		}
	});
var _elm_lang$core$Task$toResult = function (task) {
	return A2(
		_elm_lang$core$Task$onError,
		A2(_elm_lang$core$Task$map, _elm_lang$core$Result$Ok, task),
		function (msg) {
			return _elm_lang$core$Task$succeed(
				_elm_lang$core$Result$Err(msg));
		});
};
var _elm_lang$core$Task$fromResult = function (result) {
	var _p6 = result;
	if (_p6.ctor === 'Ok') {
		return _elm_lang$core$Task$succeed(_p6._0);
	} else {
		return _elm_lang$core$Task$fail(_p6._0);
	}
};
var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed(
	{ctor: '_Tuple0'});
var _elm_lang$core$Task$onSelfMsg = F3(
	function (_p9, _p8, _p7) {
		return _elm_lang$core$Task$succeed(
			{ctor: '_Tuple0'});
	});
var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
var _elm_lang$core$Task$T = function (a) {
	return {ctor: 'T', _0: a};
};
var _elm_lang$core$Task$perform = F3(
	function (onFail, onSuccess, task) {
		return _elm_lang$core$Task$command(
			_elm_lang$core$Task$T(
				A2(
					_elm_lang$core$Task$onError,
					A2(_elm_lang$core$Task$map, onSuccess, task),
					function (x) {
						return _elm_lang$core$Task$succeed(
							onFail(x));
					})));
	});
var _elm_lang$core$Task$cmdMap = F2(
	function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$T(
			A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Task'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap};

//import Native.Scheduler //

var _elm_lang$core$Native_Time = function() {

var now = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
{
	callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
});

function setInterval_(interval, task)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
	{
		var id = setInterval(function() {
			_elm_lang$core$Native_Scheduler.rawSpawn(task);
		}, interval);

		return function() { clearInterval(id); };
	});
}

return {
	now: now,
	setInterval_: F2(setInterval_)
};

}();
var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
var _elm_lang$core$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			return A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Native_Scheduler.spawn(
					A2(
						_elm_lang$core$Time$setInterval,
						_p1,
						A2(_elm_lang$core$Platform$sendToSelf, router, _p1))),
				function (id) {
					return A3(
						_elm_lang$core$Time$spawnHelp,
						router,
						_p0._1,
						A3(_elm_lang$core$Dict$insert, _p1, id, processes));
				});
		}
	});
var _elm_lang$core$Time$addMySub = F2(
	function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				_elm_lang$core$Native_List.fromArray(
					[_p6]),
				state);
		} else {
			return A3(
				_elm_lang$core$Dict$insert,
				_p5,
				A2(_elm_lang$core$List_ops['::'], _p6, _p4._0),
				state);
		}
	});
var _elm_lang$core$Time$inMilliseconds = function (t) {
	return t;
};
var _elm_lang$core$Time$millisecond = 1;
var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
var _elm_lang$core$Time$inHours = function (t) {
	return t / _elm_lang$core$Time$hour;
};
var _elm_lang$core$Time$inMinutes = function (t) {
	return t / _elm_lang$core$Time$minute;
};
var _elm_lang$core$Time$inSeconds = function (t) {
	return t / _elm_lang$core$Time$second;
};
var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
var _elm_lang$core$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			return A2(
				_elm_lang$core$Task$andThen,
				_elm_lang$core$Time$now,
				function (time) {
					return A2(
						_elm_lang$core$Task$andThen,
						_elm_lang$core$Task$sequence(
							A2(
								_elm_lang$core$List$map,
								function (tagger) {
									return A2(
										_elm_lang$core$Platform$sendToApp,
										router,
										tagger(time));
								},
								_p7._0)),
						function (_p8) {
							return _elm_lang$core$Task$succeed(state);
						});
				});
		}
	});
var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
var _elm_lang$core$Time$State = F2(
	function (a, b) {
		return {taggers: a, processes: b};
	});
var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(
	A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
var _elm_lang$core$Time$onEffects = F3(
	function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(
			function (_p12, id, _p11) {
				var _p13 = _p11;
				return {
					ctor: '_Tuple3',
					_0: _p13._0,
					_1: _p13._1,
					_2: A2(
						_elm_lang$core$Task$andThen,
						_elm_lang$core$Native_Scheduler.kill(id),
						function (_p14) {
							return _p13._2;
						})
				};
			});
		var bothStep = F4(
			function (interval, taggers, id, _p15) {
				var _p16 = _p15;
				return {
					ctor: '_Tuple3',
					_0: _p16._0,
					_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
					_2: _p16._2
				};
			});
		var leftStep = F3(
			function (interval, taggers, _p17) {
				var _p18 = _p17;
				return {
					ctor: '_Tuple3',
					_0: A2(_elm_lang$core$List_ops['::'], interval, _p18._0),
					_1: _p18._1,
					_2: _p18._2
				};
			});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(
			_elm_lang$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			_p10.processes,
			{
				ctor: '_Tuple3',
				_0: _elm_lang$core$Native_List.fromArray(
					[]),
				_1: _elm_lang$core$Dict$empty,
				_2: _elm_lang$core$Task$succeed(
					{ctor: '_Tuple0'})
			});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(
			_elm_lang$core$Task$andThen,
			killTask,
			function (_p20) {
				return A2(
					_elm_lang$core$Task$andThen,
					A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict),
					function (newProcesses) {
						return _elm_lang$core$Task$succeed(
							A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
					});
			});
	});
var _elm_lang$core$Time$Every = F2(
	function (a, b) {
		return {ctor: 'Every', _0: a, _1: b};
	});
var _elm_lang$core$Time$every = F2(
	function (interval, tagger) {
		return _elm_lang$core$Time$subscription(
			A2(_elm_lang$core$Time$Every, interval, tagger));
	});
var _elm_lang$core$Time$subMap = F2(
	function (f, _p21) {
		var _p22 = _p21;
		return A2(
			_elm_lang$core$Time$Every,
			_p22._0,
			function (_p23) {
				return f(
					_p22._1(_p23));
			});
	});
_elm_lang$core$Native_Platform.effectManagers['Time'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap};

var _elm_lang$core$Date$millisecond = _elm_lang$core$Native_Date.millisecond;
var _elm_lang$core$Date$second = _elm_lang$core$Native_Date.second;
var _elm_lang$core$Date$minute = _elm_lang$core$Native_Date.minute;
var _elm_lang$core$Date$hour = _elm_lang$core$Native_Date.hour;
var _elm_lang$core$Date$dayOfWeek = _elm_lang$core$Native_Date.dayOfWeek;
var _elm_lang$core$Date$day = _elm_lang$core$Native_Date.day;
var _elm_lang$core$Date$month = _elm_lang$core$Native_Date.month;
var _elm_lang$core$Date$year = _elm_lang$core$Native_Date.year;
var _elm_lang$core$Date$fromTime = _elm_lang$core$Native_Date.fromTime;
var _elm_lang$core$Date$toTime = _elm_lang$core$Native_Date.toTime;
var _elm_lang$core$Date$fromString = _elm_lang$core$Native_Date.fromString;
var _elm_lang$core$Date$now = A2(_elm_lang$core$Task$map, _elm_lang$core$Date$fromTime, _elm_lang$core$Time$now);
var _elm_lang$core$Date$Date = {ctor: 'Date'};
var _elm_lang$core$Date$Sun = {ctor: 'Sun'};
var _elm_lang$core$Date$Sat = {ctor: 'Sat'};
var _elm_lang$core$Date$Fri = {ctor: 'Fri'};
var _elm_lang$core$Date$Thu = {ctor: 'Thu'};
var _elm_lang$core$Date$Wed = {ctor: 'Wed'};
var _elm_lang$core$Date$Tue = {ctor: 'Tue'};
var _elm_lang$core$Date$Mon = {ctor: 'Mon'};
var _elm_lang$core$Date$Dec = {ctor: 'Dec'};
var _elm_lang$core$Date$Nov = {ctor: 'Nov'};
var _elm_lang$core$Date$Oct = {ctor: 'Oct'};
var _elm_lang$core$Date$Sep = {ctor: 'Sep'};
var _elm_lang$core$Date$Aug = {ctor: 'Aug'};
var _elm_lang$core$Date$Jul = {ctor: 'Jul'};
var _elm_lang$core$Date$Jun = {ctor: 'Jun'};
var _elm_lang$core$Date$May = {ctor: 'May'};
var _elm_lang$core$Date$Apr = {ctor: 'Apr'};
var _elm_lang$core$Date$Mar = {ctor: 'Mar'};
var _elm_lang$core$Date$Feb = {ctor: 'Feb'};
var _elm_lang$core$Date$Jan = {ctor: 'Jan'};

var _elm_lang$core$Set$foldr = F3(
	function (f, b, _p0) {
		var _p1 = _p0;
		return A3(
			_elm_lang$core$Dict$foldr,
			F3(
				function (k, _p2, b) {
					return A2(f, k, b);
				}),
			b,
			_p1._0);
	});
var _elm_lang$core$Set$foldl = F3(
	function (f, b, _p3) {
		var _p4 = _p3;
		return A3(
			_elm_lang$core$Dict$foldl,
			F3(
				function (k, _p5, b) {
					return A2(f, k, b);
				}),
			b,
			_p4._0);
	});
var _elm_lang$core$Set$toList = function (_p6) {
	var _p7 = _p6;
	return _elm_lang$core$Dict$keys(_p7._0);
};
var _elm_lang$core$Set$size = function (_p8) {
	var _p9 = _p8;
	return _elm_lang$core$Dict$size(_p9._0);
};
var _elm_lang$core$Set$member = F2(
	function (k, _p10) {
		var _p11 = _p10;
		return A2(_elm_lang$core$Dict$member, k, _p11._0);
	});
var _elm_lang$core$Set$isEmpty = function (_p12) {
	var _p13 = _p12;
	return _elm_lang$core$Dict$isEmpty(_p13._0);
};
var _elm_lang$core$Set$Set_elm_builtin = function (a) {
	return {ctor: 'Set_elm_builtin', _0: a};
};
var _elm_lang$core$Set$empty = _elm_lang$core$Set$Set_elm_builtin(_elm_lang$core$Dict$empty);
var _elm_lang$core$Set$singleton = function (k) {
	return _elm_lang$core$Set$Set_elm_builtin(
		A2(
			_elm_lang$core$Dict$singleton,
			k,
			{ctor: '_Tuple0'}));
};
var _elm_lang$core$Set$insert = F2(
	function (k, _p14) {
		var _p15 = _p14;
		return _elm_lang$core$Set$Set_elm_builtin(
			A3(
				_elm_lang$core$Dict$insert,
				k,
				{ctor: '_Tuple0'},
				_p15._0));
	});
var _elm_lang$core$Set$fromList = function (xs) {
	return A3(_elm_lang$core$List$foldl, _elm_lang$core$Set$insert, _elm_lang$core$Set$empty, xs);
};
var _elm_lang$core$Set$map = F2(
	function (f, s) {
		return _elm_lang$core$Set$fromList(
			A2(
				_elm_lang$core$List$map,
				f,
				_elm_lang$core$Set$toList(s)));
	});
var _elm_lang$core$Set$remove = F2(
	function (k, _p16) {
		var _p17 = _p16;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$remove, k, _p17._0));
	});
var _elm_lang$core$Set$union = F2(
	function (_p19, _p18) {
		var _p20 = _p19;
		var _p21 = _p18;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$union, _p20._0, _p21._0));
	});
var _elm_lang$core$Set$intersect = F2(
	function (_p23, _p22) {
		var _p24 = _p23;
		var _p25 = _p22;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$intersect, _p24._0, _p25._0));
	});
var _elm_lang$core$Set$diff = F2(
	function (_p27, _p26) {
		var _p28 = _p27;
		var _p29 = _p26;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(_elm_lang$core$Dict$diff, _p28._0, _p29._0));
	});
var _elm_lang$core$Set$filter = F2(
	function (p, _p30) {
		var _p31 = _p30;
		return _elm_lang$core$Set$Set_elm_builtin(
			A2(
				_elm_lang$core$Dict$filter,
				F2(
					function (k, _p32) {
						return p(k);
					}),
				_p31._0));
	});
var _elm_lang$core$Set$partition = F2(
	function (p, _p33) {
		var _p34 = _p33;
		var _p35 = A2(
			_elm_lang$core$Dict$partition,
			F2(
				function (k, _p36) {
					return p(k);
				}),
			_p34._0);
		var p1 = _p35._0;
		var p2 = _p35._1;
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Set$Set_elm_builtin(p1),
			_1: _elm_lang$core$Set$Set_elm_builtin(p2)
		};
	});

var _elm_community$elm_json_extra$Json_Decode_Extra$lazy = function (getDecoder) {
	return A2(
		_elm_lang$core$Json_Decode$customDecoder,
		_elm_lang$core$Json_Decode$value,
		function (rawValue) {
			return A2(
				_elm_lang$core$Json_Decode$decodeValue,
				getDecoder(
					{ctor: '_Tuple0'}),
				rawValue);
		});
};
var _elm_community$elm_json_extra$Json_Decode_Extra$maybeNull = function (decoder) {
	return _elm_lang$core$Json_Decode$oneOf(
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
				A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder)
			]));
};
var _elm_community$elm_json_extra$Json_Decode_Extra$withDefault = F2(
	function (fallback, decoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			_elm_lang$core$Json_Decode$maybe(decoder),
			function (_p0) {
				return _elm_lang$core$Json_Decode$succeed(
					A2(_elm_lang$core$Maybe$withDefault, fallback, _p0));
			});
	});
var _elm_community$elm_json_extra$Json_Decode_Extra$decodeDictFromTuples = F2(
	function (keyDecoder, tuples) {
		var _p1 = tuples;
		if (_p1.ctor === '[]') {
			return _elm_lang$core$Json_Decode$succeed(_elm_lang$core$Dict$empty);
		} else {
			var _p2 = A2(_elm_lang$core$Json_Decode$decodeString, keyDecoder, _p1._0._0);
			if (_p2.ctor === 'Ok') {
				return A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(_elm_community$elm_json_extra$Json_Decode_Extra$decodeDictFromTuples, keyDecoder, _p1._1),
					function (_p3) {
						return _elm_lang$core$Json_Decode$succeed(
							A3(_elm_lang$core$Dict$insert, _p2._0, _p1._0._1, _p3));
					});
			} else {
				return _elm_lang$core$Json_Decode$fail(_p2._0);
			}
		}
	});
var _elm_community$elm_json_extra$Json_Decode_Extra$dict2 = F2(
	function (keyDecoder, valueDecoder) {
		return A2(
			_elm_lang$core$Json_Decode$andThen,
			_elm_lang$core$Json_Decode$dict(valueDecoder),
			function (_p4) {
				return A2(
					_elm_community$elm_json_extra$Json_Decode_Extra$decodeDictFromTuples,
					keyDecoder,
					_elm_lang$core$Dict$toList(_p4));
			});
	});
var _elm_community$elm_json_extra$Json_Decode_Extra$set = function (decoder) {
	return A2(
		_elm_lang$core$Json_Decode$andThen,
		_elm_lang$core$Json_Decode$list(decoder),
		function (_p5) {
			return _elm_lang$core$Json_Decode$succeed(
				_elm_lang$core$Set$fromList(_p5));
		});
};
var _elm_community$elm_json_extra$Json_Decode_Extra$date = A2(_elm_lang$core$Json_Decode$customDecoder, _elm_lang$core$Json_Decode$string, _elm_lang$core$Date$fromString);
var _elm_community$elm_json_extra$Json_Decode_Extra$apply = _elm_lang$core$Json_Decode$object2(
	F2(
		function (x, y) {
			return x(y);
		}));
var _elm_community$elm_json_extra$Json_Decode_Extra_ops = _elm_community$elm_json_extra$Json_Decode_Extra_ops || {};
_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'] = _elm_community$elm_json_extra$Json_Decode_Extra$apply;

//import Maybe, Native.List //

var _elm_lang$core$Native_Regex = function() {

function escape(str)
{
	return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
function caseInsensitive(re)
{
	return new RegExp(re.source, 'gi');
}
function regex(raw)
{
	return new RegExp(raw, 'g');
}

function contains(re, string)
{
	return string.match(re) !== null;
}

function find(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex === re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		out.push({
			match: result[0],
			submatches: _elm_lang$core$Native_List.fromArray(subs),
			index: result.index,
			number: number
		});
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _elm_lang$core$Native_List.fromArray(out);
}

function replace(n, re, replacer, string)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch === undefined
				? _elm_lang$core$Maybe$Nothing
				: _elm_lang$core$Maybe$Just(submatch);
		}
		return replacer({
			match: match,
			submatches: _elm_lang$core$Native_List.fromArray(submatches),
			index: arguments[i - 1],
			number: count
		});
	}
	return string.replace(re, jsReplacer);
}

function split(n, re, str)
{
	n = n.ctor === 'All' ? Infinity : n._0;
	if (n === Infinity)
	{
		return _elm_lang$core$Native_List.fromArray(str.split(re));
	}
	var string = str;
	var result;
	var out = [];
	var start = re.lastIndex;
	while (n--)
	{
		if (!(result = re.exec(string))) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	return _elm_lang$core$Native_List.fromArray(out);
}

return {
	regex: regex,
	caseInsensitive: caseInsensitive,
	escape: escape,

	contains: F2(contains),
	find: F3(find),
	replace: F4(replace),
	split: F3(split)
};

}();

var _elm_lang$core$Random$onSelfMsg = F3(
	function (_p1, _p0, seed) {
		return _elm_lang$core$Task$succeed(seed);
	});
var _elm_lang$core$Random$magicNum8 = 2147483562;
var _elm_lang$core$Random$range = function (_p2) {
	return {ctor: '_Tuple2', _0: 0, _1: _elm_lang$core$Random$magicNum8};
};
var _elm_lang$core$Random$magicNum7 = 2137383399;
var _elm_lang$core$Random$magicNum6 = 2147483563;
var _elm_lang$core$Random$magicNum5 = 3791;
var _elm_lang$core$Random$magicNum4 = 40692;
var _elm_lang$core$Random$magicNum3 = 52774;
var _elm_lang$core$Random$magicNum2 = 12211;
var _elm_lang$core$Random$magicNum1 = 53668;
var _elm_lang$core$Random$magicNum0 = 40014;
var _elm_lang$core$Random$step = F2(
	function (_p3, seed) {
		var _p4 = _p3;
		return _p4._0(seed);
	});
var _elm_lang$core$Random$onEffects = F3(
	function (router, commands, seed) {
		var _p5 = commands;
		if (_p5.ctor === '[]') {
			return _elm_lang$core$Task$succeed(seed);
		} else {
			var _p6 = A2(_elm_lang$core$Random$step, _p5._0._0, seed);
			var value = _p6._0;
			var newSeed = _p6._1;
			return A2(
				_elm_lang$core$Task$andThen,
				A2(_elm_lang$core$Platform$sendToApp, router, value),
				function (_p7) {
					return A3(_elm_lang$core$Random$onEffects, router, _p5._1, newSeed);
				});
		}
	});
var _elm_lang$core$Random$listHelp = F4(
	function (list, n, generate, seed) {
		listHelp:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 1) < 0) {
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$List$reverse(list),
					_1: seed
				};
			} else {
				var _p8 = generate(seed);
				var value = _p8._0;
				var newSeed = _p8._1;
				var _v2 = A2(_elm_lang$core$List_ops['::'], value, list),
					_v3 = n - 1,
					_v4 = generate,
					_v5 = newSeed;
				list = _v2;
				n = _v3;
				generate = _v4;
				seed = _v5;
				continue listHelp;
			}
		}
	});
var _elm_lang$core$Random$minInt = -2147483648;
var _elm_lang$core$Random$maxInt = 2147483647;
var _elm_lang$core$Random$iLogBase = F2(
	function (b, i) {
		return (_elm_lang$core$Native_Utils.cmp(i, b) < 0) ? 1 : (1 + A2(_elm_lang$core$Random$iLogBase, b, (i / b) | 0));
	});
var _elm_lang$core$Random$command = _elm_lang$core$Native_Platform.leaf('Random');
var _elm_lang$core$Random$Generator = function (a) {
	return {ctor: 'Generator', _0: a};
};
var _elm_lang$core$Random$list = F2(
	function (n, _p9) {
		var _p10 = _p9;
		return _elm_lang$core$Random$Generator(
			function (seed) {
				return A4(
					_elm_lang$core$Random$listHelp,
					_elm_lang$core$Native_List.fromArray(
						[]),
					n,
					_p10._0,
					seed);
			});
	});
var _elm_lang$core$Random$map = F2(
	function (func, _p11) {
		var _p12 = _p11;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p13 = _p12._0(seed0);
				var a = _p13._0;
				var seed1 = _p13._1;
				return {
					ctor: '_Tuple2',
					_0: func(a),
					_1: seed1
				};
			});
	});
var _elm_lang$core$Random$map2 = F3(
	function (func, _p15, _p14) {
		var _p16 = _p15;
		var _p17 = _p14;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p18 = _p16._0(seed0);
				var a = _p18._0;
				var seed1 = _p18._1;
				var _p19 = _p17._0(seed1);
				var b = _p19._0;
				var seed2 = _p19._1;
				return {
					ctor: '_Tuple2',
					_0: A2(func, a, b),
					_1: seed2
				};
			});
	});
var _elm_lang$core$Random$pair = F2(
	function (genA, genB) {
		return A3(
			_elm_lang$core$Random$map2,
			F2(
				function (v0, v1) {
					return {ctor: '_Tuple2', _0: v0, _1: v1};
				}),
			genA,
			genB);
	});
var _elm_lang$core$Random$map3 = F4(
	function (func, _p22, _p21, _p20) {
		var _p23 = _p22;
		var _p24 = _p21;
		var _p25 = _p20;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p26 = _p23._0(seed0);
				var a = _p26._0;
				var seed1 = _p26._1;
				var _p27 = _p24._0(seed1);
				var b = _p27._0;
				var seed2 = _p27._1;
				var _p28 = _p25._0(seed2);
				var c = _p28._0;
				var seed3 = _p28._1;
				return {
					ctor: '_Tuple2',
					_0: A3(func, a, b, c),
					_1: seed3
				};
			});
	});
var _elm_lang$core$Random$map4 = F5(
	function (func, _p32, _p31, _p30, _p29) {
		var _p33 = _p32;
		var _p34 = _p31;
		var _p35 = _p30;
		var _p36 = _p29;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p37 = _p33._0(seed0);
				var a = _p37._0;
				var seed1 = _p37._1;
				var _p38 = _p34._0(seed1);
				var b = _p38._0;
				var seed2 = _p38._1;
				var _p39 = _p35._0(seed2);
				var c = _p39._0;
				var seed3 = _p39._1;
				var _p40 = _p36._0(seed3);
				var d = _p40._0;
				var seed4 = _p40._1;
				return {
					ctor: '_Tuple2',
					_0: A4(func, a, b, c, d),
					_1: seed4
				};
			});
	});
var _elm_lang$core$Random$map5 = F6(
	function (func, _p45, _p44, _p43, _p42, _p41) {
		var _p46 = _p45;
		var _p47 = _p44;
		var _p48 = _p43;
		var _p49 = _p42;
		var _p50 = _p41;
		return _elm_lang$core$Random$Generator(
			function (seed0) {
				var _p51 = _p46._0(seed0);
				var a = _p51._0;
				var seed1 = _p51._1;
				var _p52 = _p47._0(seed1);
				var b = _p52._0;
				var seed2 = _p52._1;
				var _p53 = _p48._0(seed2);
				var c = _p53._0;
				var seed3 = _p53._1;
				var _p54 = _p49._0(seed3);
				var d = _p54._0;
				var seed4 = _p54._1;
				var _p55 = _p50._0(seed4);
				var e = _p55._0;
				var seed5 = _p55._1;
				return {
					ctor: '_Tuple2',
					_0: A5(func, a, b, c, d, e),
					_1: seed5
				};
			});
	});
var _elm_lang$core$Random$andThen = F2(
	function (_p56, callback) {
		var _p57 = _p56;
		return _elm_lang$core$Random$Generator(
			function (seed) {
				var _p58 = _p57._0(seed);
				var result = _p58._0;
				var newSeed = _p58._1;
				var _p59 = callback(result);
				var genB = _p59._0;
				return genB(newSeed);
			});
	});
var _elm_lang$core$Random$State = F2(
	function (a, b) {
		return {ctor: 'State', _0: a, _1: b};
	});
var _elm_lang$core$Random$initState = function (s$) {
	var s = A2(_elm_lang$core$Basics$max, s$, 0 - s$);
	var q = (s / (_elm_lang$core$Random$magicNum6 - 1)) | 0;
	var s2 = A2(_elm_lang$core$Basics_ops['%'], q, _elm_lang$core$Random$magicNum7 - 1);
	var s1 = A2(_elm_lang$core$Basics_ops['%'], s, _elm_lang$core$Random$magicNum6 - 1);
	return A2(_elm_lang$core$Random$State, s1 + 1, s2 + 1);
};
var _elm_lang$core$Random$next = function (_p60) {
	var _p61 = _p60;
	var _p63 = _p61._1;
	var _p62 = _p61._0;
	var k$ = (_p63 / _elm_lang$core$Random$magicNum3) | 0;
	var s2$ = (_elm_lang$core$Random$magicNum4 * (_p63 - (k$ * _elm_lang$core$Random$magicNum3))) - (k$ * _elm_lang$core$Random$magicNum5);
	var s2$$ = (_elm_lang$core$Native_Utils.cmp(s2$, 0) < 0) ? (s2$ + _elm_lang$core$Random$magicNum7) : s2$;
	var k = (_p62 / _elm_lang$core$Random$magicNum1) | 0;
	var s1$ = (_elm_lang$core$Random$magicNum0 * (_p62 - (k * _elm_lang$core$Random$magicNum1))) - (k * _elm_lang$core$Random$magicNum2);
	var s1$$ = (_elm_lang$core$Native_Utils.cmp(s1$, 0) < 0) ? (s1$ + _elm_lang$core$Random$magicNum6) : s1$;
	var z = s1$$ - s2$$;
	var z$ = (_elm_lang$core$Native_Utils.cmp(z, 1) < 0) ? (z + _elm_lang$core$Random$magicNum8) : z;
	return {
		ctor: '_Tuple2',
		_0: z$,
		_1: A2(_elm_lang$core$Random$State, s1$$, s2$$)
	};
};
var _elm_lang$core$Random$split = function (_p64) {
	var _p65 = _p64;
	var _p68 = _p65._1;
	var _p67 = _p65._0;
	var _p66 = _elm_lang$core$Basics$snd(
		_elm_lang$core$Random$next(_p65));
	var t1 = _p66._0;
	var t2 = _p66._1;
	var new_s2 = _elm_lang$core$Native_Utils.eq(_p68, 1) ? (_elm_lang$core$Random$magicNum7 - 1) : (_p68 - 1);
	var new_s1 = _elm_lang$core$Native_Utils.eq(_p67, _elm_lang$core$Random$magicNum6 - 1) ? 1 : (_p67 + 1);
	return {
		ctor: '_Tuple2',
		_0: A2(_elm_lang$core$Random$State, new_s1, t2),
		_1: A2(_elm_lang$core$Random$State, t1, new_s2)
	};
};
var _elm_lang$core$Random$Seed = function (a) {
	return {ctor: 'Seed', _0: a};
};
var _elm_lang$core$Random$int = F2(
	function (a, b) {
		return _elm_lang$core$Random$Generator(
			function (_p69) {
				var _p70 = _p69;
				var _p75 = _p70._0;
				var base = 2147483561;
				var f = F3(
					function (n, acc, state) {
						f:
						while (true) {
							var _p71 = n;
							if (_p71 === 0) {
								return {ctor: '_Tuple2', _0: acc, _1: state};
							} else {
								var _p72 = _p75.next(state);
								var x = _p72._0;
								var state$ = _p72._1;
								var _v27 = n - 1,
									_v28 = x + (acc * base),
									_v29 = state$;
								n = _v27;
								acc = _v28;
								state = _v29;
								continue f;
							}
						}
					});
				var _p73 = (_elm_lang$core$Native_Utils.cmp(a, b) < 0) ? {ctor: '_Tuple2', _0: a, _1: b} : {ctor: '_Tuple2', _0: b, _1: a};
				var lo = _p73._0;
				var hi = _p73._1;
				var k = (hi - lo) + 1;
				var n = A2(_elm_lang$core$Random$iLogBase, base, k);
				var _p74 = A3(f, n, 1, _p75.state);
				var v = _p74._0;
				var state$ = _p74._1;
				return {
					ctor: '_Tuple2',
					_0: lo + A2(_elm_lang$core$Basics_ops['%'], v, k),
					_1: _elm_lang$core$Random$Seed(
						_elm_lang$core$Native_Utils.update(
							_p75,
							{state: state$}))
				};
			});
	});
var _elm_lang$core$Random$bool = A2(
	_elm_lang$core$Random$map,
	F2(
		function (x, y) {
			return _elm_lang$core$Native_Utils.eq(x, y);
		})(1),
	A2(_elm_lang$core$Random$int, 0, 1));
var _elm_lang$core$Random$float = F2(
	function (a, b) {
		return _elm_lang$core$Random$Generator(
			function (seed) {
				var _p76 = A2(
					_elm_lang$core$Random$step,
					A2(_elm_lang$core$Random$int, _elm_lang$core$Random$minInt, _elm_lang$core$Random$maxInt),
					seed);
				var number = _p76._0;
				var newSeed = _p76._1;
				var negativeOneToOne = _elm_lang$core$Basics$toFloat(number) / _elm_lang$core$Basics$toFloat(_elm_lang$core$Random$maxInt - _elm_lang$core$Random$minInt);
				var _p77 = (_elm_lang$core$Native_Utils.cmp(a, b) < 0) ? {ctor: '_Tuple2', _0: a, _1: b} : {ctor: '_Tuple2', _0: b, _1: a};
				var lo = _p77._0;
				var hi = _p77._1;
				var scaled = ((lo + hi) / 2) + ((hi - lo) * negativeOneToOne);
				return {ctor: '_Tuple2', _0: scaled, _1: newSeed};
			});
	});
var _elm_lang$core$Random$initialSeed = function (n) {
	return _elm_lang$core$Random$Seed(
		{
			state: _elm_lang$core$Random$initState(n),
			next: _elm_lang$core$Random$next,
			split: _elm_lang$core$Random$split,
			range: _elm_lang$core$Random$range
		});
};
var _elm_lang$core$Random$init = A2(
	_elm_lang$core$Task$andThen,
	_elm_lang$core$Time$now,
	function (t) {
		return _elm_lang$core$Task$succeed(
			_elm_lang$core$Random$initialSeed(
				_elm_lang$core$Basics$round(t)));
	});
var _elm_lang$core$Random$Generate = function (a) {
	return {ctor: 'Generate', _0: a};
};
var _elm_lang$core$Random$generate = F2(
	function (tagger, generator) {
		return _elm_lang$core$Random$command(
			_elm_lang$core$Random$Generate(
				A2(_elm_lang$core$Random$map, tagger, generator)));
	});
var _elm_lang$core$Random$cmdMap = F2(
	function (func, _p78) {
		var _p79 = _p78;
		return _elm_lang$core$Random$Generate(
			A2(_elm_lang$core$Random$map, func, _p79._0));
	});
_elm_lang$core$Native_Platform.effectManagers['Random'] = {pkg: 'elm-lang/core', init: _elm_lang$core$Random$init, onEffects: _elm_lang$core$Random$onEffects, onSelfMsg: _elm_lang$core$Random$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Random$cmdMap};

var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
var _elm_lang$core$Regex$Match = F4(
	function (a, b, c, d) {
		return {match: a, submatches: b, index: c, number: d};
	});
var _elm_lang$core$Regex$Regex = {ctor: 'Regex'};
var _elm_lang$core$Regex$AtMost = function (a) {
	return {ctor: 'AtMost', _0: a};
};
var _elm_lang$core$Regex$All = {ctor: 'All'};

//import Native.Json //

var _elm_lang$virtual_dom$Native_VirtualDom = function() {

var STYLE_KEY = 'STYLE';
var EVENT_KEY = 'EVENT';
var ATTR_KEY = 'ATTR';
var ATTR_NS_KEY = 'ATTR_NS';



////////////  VIRTUAL DOM NODES  ////////////


function text(string)
{
	return {
		type: 'text',
		text: string
	};
}


function node(tag)
{
	return F2(function(factList, kidList) {
		return nodeHelp(tag, factList, kidList);
	});
}


function nodeHelp(tag, factList, kidList)
{
	var organized = organizeFacts(factList);
	var namespace = organized.namespace;
	var facts = organized.facts;

	var children = [];
	var descendantsCount = 0;
	while (kidList.ctor !== '[]')
	{
		var kid = kidList._0;
		descendantsCount += (kid.descendantsCount || 0);
		children.push(kid);
		kidList = kidList._1;
	}
	descendantsCount += children.length;

	return {
		type: 'node',
		tag: tag,
		facts: facts,
		children: children,
		namespace: namespace,
		descendantsCount: descendantsCount
	};
}


function custom(factList, model, impl)
{
	var facts = organizeFacts(factList).facts;

	return {
		type: 'custom',
		facts: facts,
		model: model,
		impl: impl
	};
}


function map(tagger, node)
{
	return {
		type: 'tagger',
		tagger: tagger,
		node: node,
		descendantsCount: 1 + (node.descendantsCount || 0)
	};
}


function thunk(func, args, thunk)
{
	return {
		type: 'thunk',
		func: func,
		args: args,
		thunk: thunk,
		node: null
	};
}

function lazy(fn, a)
{
	return thunk(fn, [a], function() {
		return fn(a);
	});
}

function lazy2(fn, a, b)
{
	return thunk(fn, [a,b], function() {
		return A2(fn, a, b);
	});
}

function lazy3(fn, a, b, c)
{
	return thunk(fn, [a,b,c], function() {
		return A3(fn, a, b, c);
	});
}



// FACTS


function organizeFacts(factList)
{
	var namespace, facts = {};

	while (factList.ctor !== '[]')
	{
		var entry = factList._0;
		var key = entry.key;

		if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY)
		{
			var subFacts = facts[key] || {};
			subFacts[entry.realKey] = entry.value;
			facts[key] = subFacts;
		}
		else if (key === STYLE_KEY)
		{
			var styles = facts[key] || {};
			var styleList = entry.value;
			while (styleList.ctor !== '[]')
			{
				var style = styleList._0;
				styles[style._0] = style._1;
				styleList = styleList._1;
			}
			facts[key] = styles;
		}
		else if (key === 'namespace')
		{
			namespace = entry.value;
		}
		else
		{
			facts[key] = entry.value;
		}
		factList = factList._1;
	}

	return {
		facts: facts,
		namespace: namespace
	};
}



////////////  PROPERTIES AND ATTRIBUTES  ////////////


function style(value)
{
	return {
		key: STYLE_KEY,
		value: value
	};
}


function property(key, value)
{
	return {
		key: key,
		value: value
	};
}


function attribute(key, value)
{
	return {
		key: ATTR_KEY,
		realKey: key,
		value: value
	};
}


function attributeNS(namespace, key, value)
{
	return {
		key: ATTR_NS_KEY,
		realKey: key,
		value: {
			value: value,
			namespace: namespace
		}
	};
}


function on(name, options, decoder)
{
	return {
		key: EVENT_KEY,
		realKey: name,
		value: {
			options: options,
			decoder: decoder
		}
	};
}


function equalEvents(a, b)
{
	if (!a.options === b.options)
	{
		if (a.stopPropagation !== b.stopPropagation || a.preventDefault !== b.preventDefault)
		{
			return false;
		}
	}
	return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
}



////////////  RENDERER  ////////////


function renderer(parent, tagger, initialVirtualNode)
{
	var eventNode = { tagger: tagger, parent: null };

	var domNode = render(initialVirtualNode, eventNode);
	parent.appendChild(domNode);

	var state = 'NO_REQUEST';
	var currentVirtualNode = initialVirtualNode;
	var nextVirtualNode = initialVirtualNode;

	function registerVirtualNode(vNode)
	{
		if (state === 'NO_REQUEST')
		{
			rAF(updateIfNeeded);
		}
		state = 'PENDING_REQUEST';
		nextVirtualNode = vNode;
	}

	function updateIfNeeded()
	{
		switch (state)
		{
			case 'NO_REQUEST':
				throw new Error(
					'Unexpected draw callback.\n' +
					'Please report this to <https://github.com/elm-lang/core/issues>.'
				);

			case 'PENDING_REQUEST':
				rAF(updateIfNeeded);
				state = 'EXTRA_REQUEST';

				var patches = diff(currentVirtualNode, nextVirtualNode);
				domNode = applyPatches(domNode, currentVirtualNode, patches, eventNode);
				currentVirtualNode = nextVirtualNode;

				return;

			case 'EXTRA_REQUEST':
				state = 'NO_REQUEST';
				return;
		}
	}

	return { update: registerVirtualNode };
}


var rAF =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(cb) { setTimeout(cb, 1000 / 60); };



////////////  RENDER  ////////////


function render(vNode, eventNode)
{
	switch (vNode.type)
	{
		case 'thunk':
			if (!vNode.node)
			{
				vNode.node = vNode.thunk();
			}
			return render(vNode.node, eventNode);

		case 'tagger':
			var subNode = vNode.node;
			var tagger = vNode.tagger;
		
			while (subNode.type === 'tagger')
			{
				typeof tagger !== 'object'
					? tagger = [tagger, subNode.tagger]
					: tagger.push(subNode.tagger);

				subNode = subNode.node;
			}
            
			var subEventRoot = {
				tagger: tagger,
				parent: eventNode
			};
			
			var domNode = render(subNode, subEventRoot);
			domNode.elm_event_node_ref = subEventRoot;
			return domNode;

		case 'text':
			return document.createTextNode(vNode.text);

		case 'node':
			var domNode = vNode.namespace
				? document.createElementNS(vNode.namespace, vNode.tag)
				: document.createElement(vNode.tag);

			applyFacts(domNode, eventNode, vNode.facts);

			var children = vNode.children;

			for (var i = 0; i < children.length; i++)
			{
				domNode.appendChild(render(children[i], eventNode));
			}

			return domNode;

		case 'custom':
			var domNode = vNode.impl.render(vNode.model);
			applyFacts(domNode, eventNode, vNode.facts);
			return domNode;
	}
}



////////////  APPLY FACTS  ////////////


function applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		switch (key)
		{
			case STYLE_KEY:
				applyStyles(domNode, value);
				break;

			case EVENT_KEY:
				applyEvents(domNode, eventNode, value);
				break;

			case ATTR_KEY:
				applyAttrs(domNode, value);
				break;

			case ATTR_NS_KEY:
				applyAttrsNS(domNode, value);
				break;

			case 'value':
				if (domNode[key] !== value)
				{
					domNode[key] = value;
				}
				break;

			default:
				domNode[key] = value;
				break;
		}
	}
}

function applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}

function applyEvents(domNode, eventNode, events)
{
	var allHandlers = domNode.elm_handlers || {};

	for (var key in events)
	{
		var handler = allHandlers[key];
		var value = events[key];

		if (typeof value === 'undefined')
		{
			domNode.removeEventListener(key, handler);
			allHandlers[key] = undefined;
		}
		else if (typeof handler === 'undefined')
		{
			var handler = makeEventHandler(eventNode, value);
			domNode.addEventListener(key, handler);
			allHandlers[key] = handler;
		}
		else
		{
			handler.info = value;
		}
	}

	domNode.elm_handlers = allHandlers;
}

function makeEventHandler(eventNode, info)
{
	function eventHandler(event)
	{
		var info = eventHandler.info;

		var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

		if (value.ctor === 'Ok')
		{
			var options = info.options;
			if (options.stopPropagation)
			{
				event.stopPropagation();
			}
			if (options.preventDefault)
			{
				event.preventDefault();
			}

			var message = value._0;

			var currentEventNode = eventNode;
			while (currentEventNode)
			{
				var tagger = currentEventNode.tagger;
				if (typeof tagger === 'function')
				{
					message = tagger(message);
				}
				else
				{
					for (var i = tagger.length; i--; )
					{
						message = tagger[i](message);
					}
				}
				currentEventNode = currentEventNode.parent;
			}
		}
	};

	eventHandler.info = info;

	return eventHandler;
}

function applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		if (typeof value === 'undefined')
		{
			domNode.removeAttribute(key);
		}
		else
		{
			domNode.setAttribute(key, value);
		}
	}
}

function applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.namespace;
		var value = pair.value;

		if (typeof value === 'undefined')
		{
			domNode.removeAttributeNS(namespace, key);
		}
		else
		{
			domNode.setAttributeNS(namespace, key, value);
		}
	}
}



////////////  DIFF  ////////////


function diff(a, b)
{
	var patches = [];
	diffHelp(a, b, patches, 0);
	return patches;
}


function makePatch(type, index, data)
{
	return {
		index: index,
		type: type,
		data: data,
		domNode: null,
		eventNode: null
	};
}


function diffHelp(a, b, patches, index)
{
	if (a === b)
	{
		return;
	}

	var aType = a.type;
	var bType = b.type;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (aType !== bType)
	{
		patches.push(makePatch('p-redraw', index, b));
		return;
	}

	// Now we know that both nodes are the same type.
	switch (bType)
	{
		case 'thunk':
			var aArgs = a.args;
			var bArgs = b.args;
			var i = aArgs.length;
			var same = a.func === b.func && i === bArgs.length;
			while (same && i--)
			{
				same = aArgs[i] === bArgs[i];
			}
			if (same)
			{
				b.node = a.node;
				return;
			}
			b.node = b.thunk();
			var subPatches = [];
			diffHelp(a.node, b.node, subPatches, 0);
			if (subPatches.length > 0)
			{
				patches.push(makePatch('p-thunk', index, subPatches));
			}
			return;

		case 'tagger':
			// gather nested taggers
			var aTaggers = a.tagger;
			var bTaggers = b.tagger;
			var nesting = false;

			var aSubNode = a.node;
			while (aSubNode.type === 'tagger')
			{
				nesting = true;

				typeof aTaggers !== 'object'
					? aTaggers = [aTaggers, aSubNode.tagger]
					: aTaggers.push(aSubNode.tagger);

				aSubNode = aSubNode.node;
			}

			var bSubNode = b.node;
			while (bSubNode.type === 'tagger')
			{
				nesting = true;

				typeof bTaggers !== 'object'
					? bTaggers = [bTaggers, bSubNode.tagger]
					: bTaggers.push(bSubNode.tagger);

				bSubNode = bSubNode.node;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && aTaggers.length !== bTaggers.length)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers)
			{
				patches.push(makePatch('p-tagger', index, bTaggers));
			}

			// diff everything below the taggers
			diffHelp(aSubNode, bSubNode, patches, index + 1);
			return;

		case 'text':
			if (a.text !== b.text)
			{
				patches.push(makePatch('p-text', index, b.text));
				return;
			}

			return;

		case 'node':
			// Bail if obvious indicators have changed. Implies more serious
			// structural changes such that it's not worth it to diff.
			if (a.tag !== b.tag || a.namespace !== b.namespace)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);

			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			diffChildren(a, b, patches, index);
			return;

		case 'custom':
			if (a.impl !== b.impl)
			{
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			var factsDiff = diffFacts(a.facts, b.facts);
			if (typeof factsDiff !== 'undefined')
			{
				patches.push(makePatch('p-facts', index, factsDiff));
			}

			var patch = b.impl.diff(a,b);
			if (patch)
			{
				patches.push(makePatch('p-custom', index, patch));
				return;
			}

			return;
	}
}


// assumes the incoming arrays are the same length
function pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function diffFacts(a, b, category)
{
	var diff;

	// look for changes and removals
	for (var aKey in a)
	{
		if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY)
		{
			var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[aKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(aKey in b))
		{
			diff = diff || {};
			diff[aKey] =
				(typeof category === 'undefined')
					? (typeof a[aKey] === 'string' ? '' : null)
					:
				(category === STYLE_KEY)
					? ''
					:
				(category === EVENT_KEY || category === ATTR_KEY)
					? undefined
					:
				{ namespace: a[aKey].namespace, value: undefined };

			continue;
		}

		var aValue = a[aKey];
		var bValue = b[aKey];

		// reference equal, so don't worry about it
		if (aValue === bValue && aKey !== 'value'
			|| category === EVENT_KEY && equalEvents(aValue, bValue))
		{
			continue;
		}

		diff = diff || {};
		diff[aKey] = bValue;
	}

	// add new stuff
	for (var bKey in b)
	{
		if (!(bKey in a))
		{
			diff = diff || {};
			diff[bKey] = b[bKey];
		}
	}

	return diff;
}


function diffChildren(aParent, bParent, patches, rootIndex)
{
	var aChildren = aParent.children;
	var bChildren = bParent.children;

	var aLen = aChildren.length;
	var bLen = bChildren.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (aLen > bLen)
	{
		patches.push(makePatch('p-remove', rootIndex, aLen - bLen));
	}
	else if (aLen < bLen)
	{
		patches.push(makePatch('p-insert', rootIndex, bChildren.slice(aLen)));
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	var index = rootIndex;
	var minLen = aLen < bLen ? aLen : bLen;
	for (var i = 0; i < minLen; i++)
	{
		index++;
		var aChild = aChildren[i];
		diffHelp(aChild, bChildren[i], patches, index);
		index += aChild.descendantsCount || 0;
	}
}



////////////  ADD DOM NODES  ////////////
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function addDomNodes(domNode, vNode, patches, eventNode)
{
	addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.index;

	while (index === low)
	{
		var patchType = patch.type;

		if (patchType === 'p-thunk')
		{
			addDomNodes(domNode, vNode.node, patch.data, eventNode);
		}
		else
		{
			patch.domNode = domNode;
			patch.eventNode = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.index) > high)
		{
			return i;
		}
	}

	switch (vNode.type)
	{
		case 'tagger':
			var subNode = vNode.node;
            
			while (subNode.type === "tagger")
			{
				subNode = subNode.node;
			}
            
			return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

		case 'node':
			var vChildren = vNode.children;
			var childNodes = domNode.childNodes;
			for (var j = 0; j < vChildren.length; j++)
			{
				low++;
				var vChild = vChildren[j];
				var nextLow = low + (vChild.descendantsCount || 0);
				if (low <= index && index <= nextLow)
				{
					i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
					if (!(patch = patches[i]) || (index = patch.index) > high)
					{
						return i;
					}
				}
				low = nextLow;
			}
			return i;

		case 'text':
		case 'thunk':
			throw new Error('should never traverse `text` or `thunk` nodes like this');
	}
}



////////////  APPLY PATCHES  ////////////


function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return applyPatchesHelp(rootDomNode, patches);
}

function applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.domNode
		var newNode = applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function applyPatch(domNode, patch)
{
	switch (patch.type)
	{
		case 'p-redraw':
			return redraw(domNode, patch.data, patch.eventNode);

		case 'p-facts':
			applyFacts(domNode, patch.eventNode, patch.data);
			return domNode;

		case 'p-text':
			domNode.replaceData(0, domNode.length, patch.data);
			return domNode;

		case 'p-thunk':
			return applyPatchesHelp(domNode, patch.data);

		case 'p-tagger':
			domNode.elm_event_node_ref.tagger = patch.data;
			return domNode;

		case 'p-remove':
			var i = patch.data;
			while (i--)
			{
				domNode.removeChild(domNode.lastChild);
			}
			return domNode;

		case 'p-insert':
			var newNodes = patch.data;
			for (var i = 0; i < newNodes.length; i++)
			{
				domNode.appendChild(render(newNodes[i], patch.eventNode));
			}
			return domNode;

		case 'p-custom':
			var impl = patch.data;
			return impl.applyPatch(domNode, impl.data);

		default:
			throw new Error('Ran into an unknown patch!');
	}
}


function redraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = render(vNode, eventNode);

	if (typeof newNode.elm_event_node_ref === 'undefined')
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}



////////////  PROGRAMS  ////////////


function programWithFlags(details)
{
	return {
		init: details.init,
		update: details.update,
		subscriptions: details.subscriptions,
		view: details.view,
		renderer: renderer
	};
}


return {
	node: node,
	text: text,

	custom: custom,

	map: F2(map),

	on: F3(on),
	style: style,
	property: F2(property),
	attribute: F2(attribute),
	attributeNS: F3(attributeNS),

	lazy: F2(lazy),
	lazy2: F3(lazy2),
	lazy3: F4(lazy3),

	programWithFlags: programWithFlags
};

}();
var _elm_lang$virtual_dom$VirtualDom$programWithFlags = _elm_lang$virtual_dom$Native_VirtualDom.programWithFlags;
var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
var _elm_lang$virtual_dom$VirtualDom$defaultOptions = {stopPropagation: false, preventDefault: false};
var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
var _elm_lang$virtual_dom$VirtualDom$on = F2(
	function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
var _elm_lang$virtual_dom$VirtualDom$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});
var _elm_lang$virtual_dom$VirtualDom$Node = {ctor: 'Node'};
var _elm_lang$virtual_dom$VirtualDom$Property = {ctor: 'Property'};

var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
var _elm_lang$html$Html$main$ = _elm_lang$html$Html$node('main');
var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
var _elm_lang$html$Html$svg = _elm_lang$html$Html$node('svg');
var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

var _elm_lang$html$Html_App$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
var _elm_lang$html$Html_App$program = function (app) {
	return _elm_lang$html$Html_App$programWithFlags(
		_elm_lang$core$Native_Utils.update(
			app,
			{
				init: function (_p0) {
					return app.init;
				}
			}));
};
var _elm_lang$html$Html_App$beginnerProgram = function (_p1) {
	var _p2 = _p1;
	return _elm_lang$html$Html_App$programWithFlags(
		{
			init: function (_p3) {
				return A2(
					_elm_lang$core$Platform_Cmd_ops['!'],
					_p2.model,
					_elm_lang$core$Native_List.fromArray(
						[]));
			},
			update: F2(
				function (msg, model) {
					return A2(
						_elm_lang$core$Platform_Cmd_ops['!'],
						A2(_p2.update, msg, model),
						_elm_lang$core$Native_List.fromArray(
							[]));
				}),
			view: _p2.view,
			subscriptions: function (_p4) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
};
var _elm_lang$html$Html_App$map = _elm_lang$virtual_dom$VirtualDom$map;

var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
var _elm_lang$html$Html_Attributes$contextmenu = function (value) {
	return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
};
var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
var _elm_lang$html$Html_Attributes$stringProperty = F2(
	function (name, string) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$string(string));
	});
var _elm_lang$html$Html_Attributes$class = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
};
var _elm_lang$html$Html_Attributes$id = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
};
var _elm_lang$html$Html_Attributes$title = function (name) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
};
var _elm_lang$html$Html_Attributes$accesskey = function ($char) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'accessKey',
		_elm_lang$core$String$fromChar($char));
};
var _elm_lang$html$Html_Attributes$dir = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
};
var _elm_lang$html$Html_Attributes$draggable = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'draggable', value);
};
var _elm_lang$html$Html_Attributes$dropzone = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
};
var _elm_lang$html$Html_Attributes$itemprop = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'itemprop', value);
};
var _elm_lang$html$Html_Attributes$lang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
};
var _elm_lang$html$Html_Attributes$tabindex = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'tabIndex',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$charset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'charset', value);
};
var _elm_lang$html$Html_Attributes$content = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
};
var _elm_lang$html$Html_Attributes$httpEquiv = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
};
var _elm_lang$html$Html_Attributes$language = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
};
var _elm_lang$html$Html_Attributes$src = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
};
var _elm_lang$html$Html_Attributes$height = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'height',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$width = function (value) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'width',
		_elm_lang$core$Basics$toString(value));
};
var _elm_lang$html$Html_Attributes$alt = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
};
var _elm_lang$html$Html_Attributes$preload = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
};
var _elm_lang$html$Html_Attributes$poster = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
};
var _elm_lang$html$Html_Attributes$kind = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
};
var _elm_lang$html$Html_Attributes$srclang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
};
var _elm_lang$html$Html_Attributes$sandbox = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
};
var _elm_lang$html$Html_Attributes$srcdoc = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
};
var _elm_lang$html$Html_Attributes$type$ = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
};
var _elm_lang$html$Html_Attributes$value = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
};
var _elm_lang$html$Html_Attributes$defaultValue = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
};
var _elm_lang$html$Html_Attributes$placeholder = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
};
var _elm_lang$html$Html_Attributes$accept = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
};
var _elm_lang$html$Html_Attributes$acceptCharset = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
};
var _elm_lang$html$Html_Attributes$action = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
};
var _elm_lang$html$Html_Attributes$autocomplete = function (bool) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var _elm_lang$html$Html_Attributes$autosave = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'autosave', value);
};
var _elm_lang$html$Html_Attributes$enctype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
};
var _elm_lang$html$Html_Attributes$formaction = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'formAction', value);
};
var _elm_lang$html$Html_Attributes$list = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'list', value);
};
var _elm_lang$html$Html_Attributes$minlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'minLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$maxlength = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'maxLength',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$method = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
};
var _elm_lang$html$Html_Attributes$name = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
};
var _elm_lang$html$Html_Attributes$pattern = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
};
var _elm_lang$html$Html_Attributes$size = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'size',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$for = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
};
var _elm_lang$html$Html_Attributes$form = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'form', value);
};
var _elm_lang$html$Html_Attributes$max = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
};
var _elm_lang$html$Html_Attributes$min = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
};
var _elm_lang$html$Html_Attributes$step = function (n) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
};
var _elm_lang$html$Html_Attributes$cols = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'cols',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$rows = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'rows',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$wrap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
};
var _elm_lang$html$Html_Attributes$usemap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
};
var _elm_lang$html$Html_Attributes$shape = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
};
var _elm_lang$html$Html_Attributes$coords = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
};
var _elm_lang$html$Html_Attributes$challenge = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'challenge', value);
};
var _elm_lang$html$Html_Attributes$keytype = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
};
var _elm_lang$html$Html_Attributes$align = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
};
var _elm_lang$html$Html_Attributes$cite = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
};
var _elm_lang$html$Html_Attributes$href = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
};
var _elm_lang$html$Html_Attributes$target = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
};
var _elm_lang$html$Html_Attributes$downloadAs = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
};
var _elm_lang$html$Html_Attributes$hreflang = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
};
var _elm_lang$html$Html_Attributes$media = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'media', value);
};
var _elm_lang$html$Html_Attributes$ping = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
};
var _elm_lang$html$Html_Attributes$rel = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'rel', value);
};
var _elm_lang$html$Html_Attributes$datetime = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'datetime', value);
};
var _elm_lang$html$Html_Attributes$pubdate = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pubdate', value);
};
var _elm_lang$html$Html_Attributes$start = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'start',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$colspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'colSpan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$headers = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
};
var _elm_lang$html$Html_Attributes$rowspan = function (n) {
	return A2(
		_elm_lang$html$Html_Attributes$stringProperty,
		'rowSpan',
		_elm_lang$core$Basics$toString(n));
};
var _elm_lang$html$Html_Attributes$scope = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
};
var _elm_lang$html$Html_Attributes$manifest = function (value) {
	return A2(_elm_lang$html$Html_Attributes$stringProperty, 'manifest', value);
};
var _elm_lang$html$Html_Attributes$boolProperty = F2(
	function (name, bool) {
		return A2(
			_elm_lang$html$Html_Attributes$property,
			name,
			_elm_lang$core$Json_Encode$bool(bool));
	});
var _elm_lang$html$Html_Attributes$hidden = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
};
var _elm_lang$html$Html_Attributes$contenteditable = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
};
var _elm_lang$html$Html_Attributes$spellcheck = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
};
var _elm_lang$html$Html_Attributes$async = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
};
var _elm_lang$html$Html_Attributes$defer = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
};
var _elm_lang$html$Html_Attributes$scoped = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
};
var _elm_lang$html$Html_Attributes$autoplay = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
};
var _elm_lang$html$Html_Attributes$controls = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
};
var _elm_lang$html$Html_Attributes$loop = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
};
var _elm_lang$html$Html_Attributes$default = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
};
var _elm_lang$html$Html_Attributes$seamless = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
};
var _elm_lang$html$Html_Attributes$checked = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
};
var _elm_lang$html$Html_Attributes$selected = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
};
var _elm_lang$html$Html_Attributes$autofocus = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
};
var _elm_lang$html$Html_Attributes$disabled = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
};
var _elm_lang$html$Html_Attributes$multiple = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
};
var _elm_lang$html$Html_Attributes$novalidate = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
};
var _elm_lang$html$Html_Attributes$readonly = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
};
var _elm_lang$html$Html_Attributes$required = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
};
var _elm_lang$html$Html_Attributes$ismap = function (value) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
};
var _elm_lang$html$Html_Attributes$download = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
};
var _elm_lang$html$Html_Attributes$reversed = function (bool) {
	return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
};
var _elm_lang$html$Html_Attributes$classList = function (list) {
	return _elm_lang$html$Html_Attributes$class(
		A2(
			_elm_lang$core$String$join,
			' ',
			A2(
				_elm_lang$core$List$map,
				_elm_lang$core$Basics$fst,
				A2(_elm_lang$core$List$filter, _elm_lang$core$Basics$snd, list))));
};
var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode_ops[':='], 'keyCode', _elm_lang$core$Json_Decode$int);
var _elm_lang$html$Html_Events$targetChecked = A2(
	_elm_lang$core$Json_Decode$at,
	_elm_lang$core$Native_List.fromArray(
		['target', 'checked']),
	_elm_lang$core$Json_Decode$bool);
var _elm_lang$html$Html_Events$targetValue = A2(
	_elm_lang$core$Json_Decode$at,
	_elm_lang$core$Native_List.fromArray(
		['target', 'value']),
	_elm_lang$core$Json_Decode$string);
var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
var _elm_lang$html$Html_Events$onFocus = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'focus',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onBlur = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'blur',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(
	_elm_lang$html$Html_Events$defaultOptions,
	{preventDefault: true});
var _elm_lang$html$Html_Events$onSubmit = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'submit',
		_elm_lang$html$Html_Events$onSubmitOptions,
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onCheck = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
};
var _elm_lang$html$Html_Events$onInput = function (tagger) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'input',
		A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
};
var _elm_lang$html$Html_Events$onMouseOut = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseout',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseOver = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseover',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseLeave = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseleave',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseEnter = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseenter',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseUp = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mouseup',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onMouseDown = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'mousedown',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onDoubleClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'dblclick',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$onClick = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'click',
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _elm_lang$html$Html_Events$Options = F2(
	function (a, b) {
		return {stopPropagation: a, preventDefault: b};
	});

//import Dict, List, Maybe, Native.Scheduler //

var _evancz$elm_http$Native_Http = function() {

function send(settings, request)
{
	return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
		var req = new XMLHttpRequest();

		// start
		if (settings.onStart.ctor === 'Just')
		{
			req.addEventListener('loadStart', function() {
				var task = settings.onStart._0;
				_elm_lang$core$Native_Scheduler.rawSpawn(task);
			});
		}

		// progress
		if (settings.onProgress.ctor === 'Just')
		{
			req.addEventListener('progress', function(event) {
				var progress = !event.lengthComputable
					? _elm_lang$core$Maybe$Nothing
					: _elm_lang$core$Maybe$Just({
						loaded: event.loaded,
						total: event.total
					});
				var task = settings.onProgress._0(progress);
				_elm_lang$core$Native_Scheduler.rawSpawn(task);
			});
		}

		// end
		req.addEventListener('error', function() {
			return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'RawNetworkError' }));
		});

		req.addEventListener('timeout', function() {
			return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'RawTimeout' }));
		});

		req.addEventListener('load', function() {
			return callback(_elm_lang$core$Native_Scheduler.succeed(toResponse(req)));
		});

		req.open(request.verb, request.url, true);

		// set all the headers
		function setHeader(pair) {
			req.setRequestHeader(pair._0, pair._1);
		}
		A2(_elm_lang$core$List$map, setHeader, request.headers);

		// set the timeout
		req.timeout = settings.timeout;

		// enable this withCredentials thing
		req.withCredentials = settings.withCredentials;

		// ask for a specific MIME type for the response
		if (settings.desiredResponseType.ctor === 'Just')
		{
			req.overrideMimeType(settings.desiredResponseType._0);
		}

		// actuall send the request
		if(request.body.ctor === "BodyFormData")
		{
			req.send(request.body.formData)
		}
		else
		{
			req.send(request.body._0);
		}

		return function() {
			req.abort();
		};
	});
}


// deal with responses

function toResponse(req)
{
	var tag = req.responseType === 'blob' ? 'Blob' : 'Text'
	var response = tag === 'Blob' ? req.response : req.responseText;
	return {
		status: req.status,
		statusText: req.statusText,
		headers: parseHeaders(req.getAllResponseHeaders()),
		url: req.responseURL,
		value: { ctor: tag, _0: response }
	};
}


function parseHeaders(rawHeaders)
{
	var headers = _elm_lang$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(_elm_lang$core$Dict$update, key, function(oldValue) {
				if (oldValue.ctor === 'Just')
				{
					return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
				}
				return _elm_lang$core$Maybe$Just(value);
			}, headers);
		}
	}

	return headers;
}


function multipart(dataList)
{
	var formData = new FormData();

	while (dataList.ctor !== '[]')
	{
		var data = dataList._0;
		if (data.ctor === 'StringData')
		{
			formData.append(data._0, data._1);
		}
		else
		{
			var fileName = data._1.ctor === 'Nothing'
				? undefined
				: data._1._0;
			formData.append(data._0, data._2, fileName);
		}
		dataList = dataList._1;
	}

	return { ctor: 'BodyFormData', formData: formData };
}


function uriEncode(string)
{
	return encodeURIComponent(string);
}

function uriDecode(string)
{
	return decodeURIComponent(string);
}

return {
	send: F2(send),
	multipart: multipart,
	uriEncode: uriEncode,
	uriDecode: uriDecode
};

}();

var _evancz$elm_http$Http$send = _evancz$elm_http$Native_Http.send;
var _evancz$elm_http$Http$defaultSettings = {timeout: 0, onStart: _elm_lang$core$Maybe$Nothing, onProgress: _elm_lang$core$Maybe$Nothing, desiredResponseType: _elm_lang$core$Maybe$Nothing, withCredentials: false};
var _evancz$elm_http$Http$multipart = _evancz$elm_http$Native_Http.multipart;
var _evancz$elm_http$Http$uriDecode = _evancz$elm_http$Native_Http.uriDecode;
var _evancz$elm_http$Http$uriEncode = _evancz$elm_http$Native_Http.uriEncode;
var _evancz$elm_http$Http$queryEscape = function (string) {
	return A2(
		_elm_lang$core$String$join,
		'+',
		A2(
			_elm_lang$core$String$split,
			'%20',
			_evancz$elm_http$Http$uriEncode(string)));
};
var _evancz$elm_http$Http$queryPair = function (_p0) {
	var _p1 = _p0;
	return A2(
		_elm_lang$core$Basics_ops['++'],
		_evancz$elm_http$Http$queryEscape(_p1._0),
		A2(
			_elm_lang$core$Basics_ops['++'],
			'=',
			_evancz$elm_http$Http$queryEscape(_p1._1)));
};
var _evancz$elm_http$Http$url = F2(
	function (baseUrl, args) {
		var _p2 = args;
		if (_p2.ctor === '[]') {
			return baseUrl;
		} else {
			return A2(
				_elm_lang$core$Basics_ops['++'],
				baseUrl,
				A2(
					_elm_lang$core$Basics_ops['++'],
					'?',
					A2(
						_elm_lang$core$String$join,
						'&',
						A2(_elm_lang$core$List$map, _evancz$elm_http$Http$queryPair, args))));
		}
	});
var _evancz$elm_http$Http$Request = F4(
	function (a, b, c, d) {
		return {verb: a, headers: b, url: c, body: d};
	});
var _evancz$elm_http$Http$Settings = F5(
	function (a, b, c, d, e) {
		return {timeout: a, onStart: b, onProgress: c, desiredResponseType: d, withCredentials: e};
	});
var _evancz$elm_http$Http$Response = F5(
	function (a, b, c, d, e) {
		return {status: a, statusText: b, headers: c, url: d, value: e};
	});
var _evancz$elm_http$Http$TODO_implement_blob_in_another_library = {ctor: 'TODO_implement_blob_in_another_library'};
var _evancz$elm_http$Http$TODO_implement_file_in_another_library = {ctor: 'TODO_implement_file_in_another_library'};
var _evancz$elm_http$Http$BodyBlob = function (a) {
	return {ctor: 'BodyBlob', _0: a};
};
var _evancz$elm_http$Http$BodyFormData = {ctor: 'BodyFormData'};
var _evancz$elm_http$Http$ArrayBuffer = {ctor: 'ArrayBuffer'};
var _evancz$elm_http$Http$BodyString = function (a) {
	return {ctor: 'BodyString', _0: a};
};
var _evancz$elm_http$Http$string = _evancz$elm_http$Http$BodyString;
var _evancz$elm_http$Http$Empty = {ctor: 'Empty'};
var _evancz$elm_http$Http$empty = _evancz$elm_http$Http$Empty;
var _evancz$elm_http$Http$FileData = F3(
	function (a, b, c) {
		return {ctor: 'FileData', _0: a, _1: b, _2: c};
	});
var _evancz$elm_http$Http$BlobData = F3(
	function (a, b, c) {
		return {ctor: 'BlobData', _0: a, _1: b, _2: c};
	});
var _evancz$elm_http$Http$blobData = _evancz$elm_http$Http$BlobData;
var _evancz$elm_http$Http$StringData = F2(
	function (a, b) {
		return {ctor: 'StringData', _0: a, _1: b};
	});
var _evancz$elm_http$Http$stringData = _evancz$elm_http$Http$StringData;
var _evancz$elm_http$Http$Blob = function (a) {
	return {ctor: 'Blob', _0: a};
};
var _evancz$elm_http$Http$Text = function (a) {
	return {ctor: 'Text', _0: a};
};
var _evancz$elm_http$Http$RawNetworkError = {ctor: 'RawNetworkError'};
var _evancz$elm_http$Http$RawTimeout = {ctor: 'RawTimeout'};
var _evancz$elm_http$Http$BadResponse = F2(
	function (a, b) {
		return {ctor: 'BadResponse', _0: a, _1: b};
	});
var _evancz$elm_http$Http$UnexpectedPayload = function (a) {
	return {ctor: 'UnexpectedPayload', _0: a};
};
var _evancz$elm_http$Http$handleResponse = F2(
	function (handle, response) {
		if ((_elm_lang$core$Native_Utils.cmp(200, response.status) < 1) && (_elm_lang$core$Native_Utils.cmp(response.status, 300) < 0)) {
			var _p3 = response.value;
			if (_p3.ctor === 'Text') {
				return handle(_p3._0);
			} else {
				return _elm_lang$core$Task$fail(
					_evancz$elm_http$Http$UnexpectedPayload('Response body is a blob, expecting a string.'));
			}
		} else {
			return _elm_lang$core$Task$fail(
				A2(_evancz$elm_http$Http$BadResponse, response.status, response.statusText));
		}
	});
var _evancz$elm_http$Http$NetworkError = {ctor: 'NetworkError'};
var _evancz$elm_http$Http$Timeout = {ctor: 'Timeout'};
var _evancz$elm_http$Http$promoteError = function (rawError) {
	var _p4 = rawError;
	if (_p4.ctor === 'RawTimeout') {
		return _evancz$elm_http$Http$Timeout;
	} else {
		return _evancz$elm_http$Http$NetworkError;
	}
};
var _evancz$elm_http$Http$getString = function (url) {
	var request = {
		verb: 'GET',
		headers: _elm_lang$core$Native_List.fromArray(
			[]),
		url: url,
		body: _evancz$elm_http$Http$empty
	};
	return A2(
		_elm_lang$core$Task$andThen,
		A2(
			_elm_lang$core$Task$mapError,
			_evancz$elm_http$Http$promoteError,
			A2(_evancz$elm_http$Http$send, _evancz$elm_http$Http$defaultSettings, request)),
		_evancz$elm_http$Http$handleResponse(_elm_lang$core$Task$succeed));
};
var _evancz$elm_http$Http$fromJson = F2(
	function (decoder, response) {
		var decode = function (str) {
			var _p5 = A2(_elm_lang$core$Json_Decode$decodeString, decoder, str);
			if (_p5.ctor === 'Ok') {
				return _elm_lang$core$Task$succeed(_p5._0);
			} else {
				return _elm_lang$core$Task$fail(
					_evancz$elm_http$Http$UnexpectedPayload(_p5._0));
			}
		};
		return A2(
			_elm_lang$core$Task$andThen,
			A2(_elm_lang$core$Task$mapError, _evancz$elm_http$Http$promoteError, response),
			_evancz$elm_http$Http$handleResponse(decode));
	});
var _evancz$elm_http$Http$get = F2(
	function (decoder, url) {
		var request = {
			verb: 'GET',
			headers: _elm_lang$core$Native_List.fromArray(
				[]),
			url: url,
			body: _evancz$elm_http$Http$empty
		};
		return A2(
			_evancz$elm_http$Http$fromJson,
			decoder,
			A2(_evancz$elm_http$Http$send, _evancz$elm_http$Http$defaultSettings, request));
	});
var _evancz$elm_http$Http$post = F3(
	function (decoder, url, body) {
		var request = {
			verb: 'POST',
			headers: _elm_lang$core$Native_List.fromArray(
				[]),
			url: url,
			body: body
		};
		return A2(
			_evancz$elm_http$Http$fromJson,
			decoder,
			A2(_evancz$elm_http$Http$send, _evancz$elm_http$Http$defaultSettings, request));
	});

var _jweir$elm_iso8601$ISO8601_Helpers$calendar = _elm_lang$core$Array$fromList(
	_elm_lang$core$Native_List.fromArray(
		[
			{ctor: '_Tuple3', _0: 'January', _1: 31, _2: 31},
			{ctor: '_Tuple3', _0: 'February', _1: 28, _2: 29},
			{ctor: '_Tuple3', _0: 'March', _1: 31, _2: 31},
			{ctor: '_Tuple3', _0: 'April', _1: 30, _2: 30},
			{ctor: '_Tuple3', _0: 'May', _1: 31, _2: 31},
			{ctor: '_Tuple3', _0: 'June', _1: 30, _2: 30},
			{ctor: '_Tuple3', _0: 'July', _1: 31, _2: 31},
			{ctor: '_Tuple3', _0: 'August', _1: 31, _2: 31},
			{ctor: '_Tuple3', _0: 'September', _1: 30, _2: 30},
			{ctor: '_Tuple3', _0: 'October', _1: 31, _2: 31},
			{ctor: '_Tuple3', _0: 'November', _1: 30, _2: 30},
			{ctor: '_Tuple3', _0: 'December', _1: 31, _2: 31}
		]));
var _jweir$elm_iso8601$ISO8601_Helpers$isLeapYear = function (year) {
	var c = _elm_lang$core$Native_Utils.eq(
		0,
		A2(_elm_lang$core$Basics_ops['%'], year, 400));
	var b = _elm_lang$core$Native_Utils.eq(
		0,
		A2(_elm_lang$core$Basics_ops['%'], year, 100));
	var a = _elm_lang$core$Native_Utils.eq(
		0,
		A2(_elm_lang$core$Basics_ops['%'], year, 4));
	var _p0 = _elm_lang$core$Native_List.fromArray(
		[a, b, c]);
	_v0_3:
	do {
		if (((_p0.ctor === '::') && (_p0._0 === true)) && (_p0._1.ctor === '::')) {
			if (_p0._1._0 === false) {
				if ((_p0._1._1.ctor === '::') && (_p0._1._1._1.ctor === '[]')) {
					return true;
				} else {
					break _v0_3;
				}
			} else {
				if (_p0._1._1.ctor === '::') {
					if (_p0._1._1._0 === true) {
						if (_p0._1._1._1.ctor === '[]') {
							return true;
						} else {
							break _v0_3;
						}
					} else {
						if (_p0._1._1._1.ctor === '[]') {
							return false;
						} else {
							break _v0_3;
						}
					}
				} else {
					break _v0_3;
				}
			}
		} else {
			break _v0_3;
		}
	} while(false);
	return false;
};
var _jweir$elm_iso8601$ISO8601_Helpers$daysInMonth = F2(
	function (year, monthInt) {
		var calMonth = A2(_elm_lang$core$Array$get, monthInt - 1, _jweir$elm_iso8601$ISO8601_Helpers$calendar);
		var _p1 = calMonth;
		if (_p1.ctor === 'Just') {
			return _jweir$elm_iso8601$ISO8601_Helpers$isLeapYear(year) ? _p1._0._2 : _p1._0._1;
		} else {
			return 0;
		}
	});
var _jweir$elm_iso8601$ISO8601_Helpers$daysToMonths = F3(
	function (year, startMonth, remainingDays) {
		daysToMonths:
		while (true) {
			var remainingDays$ = remainingDays - A2(_jweir$elm_iso8601$ISO8601_Helpers$daysInMonth, year, startMonth);
			if (_elm_lang$core$Native_Utils.cmp(remainingDays$, 0) > 0) {
				var _v2 = year,
					_v3 = startMonth + 1,
					_v4 = remainingDays$;
				year = _v2;
				startMonth = _v3;
				remainingDays = _v4;
				continue daysToMonths;
			} else {
				return {ctor: '_Tuple2', _0: startMonth, _1: remainingDays};
			}
		}
	});
var _jweir$elm_iso8601$ISO8601_Helpers$daysInYear = function (year) {
	return _jweir$elm_iso8601$ISO8601_Helpers$isLeapYear(year) ? 366 : 365;
};
var _jweir$elm_iso8601$ISO8601_Helpers$yearsToDays = F3(
	function (ending, current, days) {
		yearsToDays:
		while (true) {
			if (_elm_lang$core$Native_Utils.cmp(ending, current) > 0) {
				var _v5 = ending,
					_v6 = current + 1,
					_v7 = _jweir$elm_iso8601$ISO8601_Helpers$daysInYear(current);
				ending = _v5;
				current = _v6;
				days = _v7;
				continue yearsToDays;
			} else {
				return days;
			}
		}
	});
var _jweir$elm_iso8601$ISO8601_Helpers$toInt = function (str) {
	return A2(
		_elm_lang$core$Maybe$withDefault,
		0,
		_elm_lang$core$Result$toMaybe(
			_elm_lang$core$String$toInt(str)));
};
var _jweir$elm_iso8601$ISO8601_Helpers$After = {ctor: 'After'};
var _jweir$elm_iso8601$ISO8601_Helpers$Before = {ctor: 'Before'};
var _jweir$elm_iso8601$ISO8601_Helpers$daysToYears = F3(
	function (rel, startYear, remainingDays) {
		daysToYears:
		while (true) {
			var _p2 = rel;
			if (_p2.ctor === 'After') {
				var remainingDays$ = remainingDays - _jweir$elm_iso8601$ISO8601_Helpers$daysInYear(startYear);
				if (_elm_lang$core$Native_Utils.cmp(remainingDays$, 0) > 0) {
					var _v9 = _jweir$elm_iso8601$ISO8601_Helpers$After,
						_v10 = startYear + 1,
						_v11 = remainingDays$;
					rel = _v9;
					startYear = _v10;
					remainingDays = _v11;
					continue daysToYears;
				} else {
					return {ctor: '_Tuple2', _0: startYear, _1: remainingDays};
				}
			} else {
				var remainingDays$ = remainingDays + _jweir$elm_iso8601$ISO8601_Helpers$daysInYear(startYear);
				if (_elm_lang$core$Native_Utils.cmp(remainingDays$, 0) < 0) {
					var _v12 = _jweir$elm_iso8601$ISO8601_Helpers$Before,
						_v13 = startYear - 1,
						_v14 = remainingDays$;
					rel = _v12;
					startYear = _v13;
					remainingDays = _v14;
					continue daysToYears;
				} else {
					return {
						ctor: '_Tuple2',
						_0: startYear,
						_1: _jweir$elm_iso8601$ISO8601_Helpers$daysInYear(startYear) + remainingDays
					};
				}
			}
		}
	});

var _jweir$elm_iso8601$ISO8601$validateHour = function (time) {
	var s = time.second;
	var m = time.minute;
	var h = time.hour;
	return (_elm_lang$core$Native_Utils.eq(h, 24) && (_elm_lang$core$Native_Utils.cmp(m + s, 0) > 0)) ? _elm_lang$core$Result$Err('hour is out of range') : (((_elm_lang$core$Native_Utils.cmp(h, 0) < 0) || (_elm_lang$core$Native_Utils.cmp(h, 24) > 0)) ? _elm_lang$core$Result$Err('hour is out of range') : (((_elm_lang$core$Native_Utils.cmp(m, 0) < 0) || (_elm_lang$core$Native_Utils.cmp(m, 59) > 0)) ? _elm_lang$core$Result$Err('minute is out of range') : (((_elm_lang$core$Native_Utils.cmp(s, 0) < 0) || (_elm_lang$core$Native_Utils.cmp(s, 59) > 0)) ? _elm_lang$core$Result$Err('second is out of range') : _elm_lang$core$Result$Ok(time))));
};
var _jweir$elm_iso8601$ISO8601$validateTime = function (time) {
	var maxDays = _jweir$elm_iso8601$ISO8601_Helpers$daysInMonth;
	return ((_elm_lang$core$Native_Utils.cmp(time.month, 1) < 0) || (_elm_lang$core$Native_Utils.cmp(time.month, 12) > 0)) ? _elm_lang$core$Result$Err('month is out of range') : (((_elm_lang$core$Native_Utils.cmp(time.day, 1) < 0) || (_elm_lang$core$Native_Utils.cmp(
		time.day,
		A2(_jweir$elm_iso8601$ISO8601_Helpers$daysInMonth, time.year, time.month)) > 0)) ? _elm_lang$core$Result$Err('day is out of range') : _jweir$elm_iso8601$ISO8601$validateHour(time));
};
var _jweir$elm_iso8601$ISO8601$parseOffset = function (timeString) {
	var setHour = F2(
		function (modifier, hour) {
			var _p0 = modifier;
			switch (_p0) {
				case '+':
					return hour;
				case '-':
					return A2(_elm_lang$core$Basics_ops['++'], modifier, hour);
				default:
					return hour;
			}
		});
	var match = A3(
		_elm_lang$core$Regex$find,
		_elm_lang$core$Regex$AtMost(1),
		_elm_lang$core$Regex$regex('([-+])(\\d\\d):?(\\d\\d)'),
		A2(_elm_lang$core$Maybe$withDefault, '', timeString));
	var parts = A2(
		_elm_lang$core$List$map,
		function (_) {
			return _.submatches;
		},
		match);
	var re = _elm_lang$core$Regex$regex('(Z|([+-]\\d{2}:?\\d{2}))?');
	var _p1 = parts;
	_v1_2:
	do {
		if (((((_p1.ctor === '::') && (_p1._0.ctor === '::')) && (_p1._0._0.ctor === 'Just')) && (_p1._0._1.ctor === '::')) && (_p1._0._1._0.ctor === 'Just')) {
			if (_p1._0._1._1.ctor === '::') {
				if (((_p1._0._1._1._0.ctor === 'Just') && (_p1._0._1._1._1.ctor === '[]')) && (_p1._1.ctor === '[]')) {
					return {
						ctor: '_Tuple2',
						_0: _jweir$elm_iso8601$ISO8601_Helpers$toInt(
							A2(setHour, _p1._0._0._0, _p1._0._1._0._0)),
						_1: _jweir$elm_iso8601$ISO8601_Helpers$toInt(_p1._0._1._1._0._0)
					};
				} else {
					break _v1_2;
				}
			} else {
				if (_p1._1.ctor === '[]') {
					return {
						ctor: '_Tuple2',
						_0: _jweir$elm_iso8601$ISO8601_Helpers$toInt(
							A2(setHour, _p1._0._0._0, _p1._0._1._0._0)),
						_1: 0
					};
				} else {
					break _v1_2;
				}
			}
		} else {
			break _v1_2;
		}
	} while(false);
	return {ctor: '_Tuple2', _0: 0, _1: 0};
};
var _jweir$elm_iso8601$ISO8601$parseMilliseconds = function (msString) {
	var _p2 = msString;
	if (_p2.ctor === 'Nothing') {
		return 0;
	} else {
		var decimalStr = A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$AtMost(1),
			_elm_lang$core$Regex$regex('[,.]'),
			function (_p3) {
				return '0.';
			},
			_p2._0);
		var decimal = A2(
			_elm_lang$core$Maybe$withDefault,
			0.0,
			_elm_lang$core$Result$toMaybe(
				_elm_lang$core$String$toFloat(decimalStr)));
		return _elm_lang$core$Basics$round(1000 * decimal);
	}
};
var _jweir$elm_iso8601$ISO8601$iso8601Regex = A2(
	_elm_lang$core$Regex$find,
	_elm_lang$core$Regex$AtMost(1),
	_elm_lang$core$Regex$regex(
		A2(
			_elm_lang$core$Basics_ops['++'],
			'(\\d{4})?-?',
			A2(
				_elm_lang$core$Basics_ops['++'],
				'(\\d{2})?-?',
				A2(
					_elm_lang$core$Basics_ops['++'],
					'(\\d{2})?',
					A2(
						_elm_lang$core$Basics_ops['++'],
						'T?',
						A2(
							_elm_lang$core$Basics_ops['++'],
							'(\\d{2})?:?',
							A2(
								_elm_lang$core$Basics_ops['++'],
								'(\\d{2})?:?',
								A2(
									_elm_lang$core$Basics_ops['++'],
									'(\\d{2})?',
									A2(
										_elm_lang$core$Basics_ops['++'],
										'([.,]\\d{1,})?',
										A2(_elm_lang$core$Basics_ops['++'], '(Z|[+-]\\d{2}:?\\d{2})?', '(.*)?')))))))))));
var _jweir$elm_iso8601$ISO8601$fromString = function (s) {
	var unwrap = F2(
		function (x, d) {
			return _jweir$elm_iso8601$ISO8601_Helpers$toInt(
				A2(_elm_lang$core$Maybe$withDefault, d, x));
		});
	var parts = A2(
		_elm_lang$core$List$map,
		function (_) {
			return _.submatches;
		},
		_jweir$elm_iso8601$ISO8601$iso8601Regex(s));
	var _p4 = parts;
	if ((((((((((((_p4.ctor === '::') && (_p4._0.ctor === '::')) && (_p4._0._1.ctor === '::')) && (_p4._0._1._1.ctor === '::')) && (_p4._0._1._1._1.ctor === '::')) && (_p4._0._1._1._1._1.ctor === '::')) && (_p4._0._1._1._1._1._1.ctor === '::')) && (_p4._0._1._1._1._1._1._1.ctor === '::')) && (_p4._0._1._1._1._1._1._1._1.ctor === '::')) && (_p4._0._1._1._1._1._1._1._1._1.ctor === '::')) && (_p4._0._1._1._1._1._1._1._1._1._1.ctor === '[]')) && (_p4._1.ctor === '[]')) {
		var _p5 = _p4._0._1._1._1._1._1._1._1._1._0;
		if (_p5.ctor === 'Just') {
			return _elm_lang$core$Result$Err('unexpected text');
		} else {
			return _jweir$elm_iso8601$ISO8601$validateTime(
				{
					year: A2(unwrap, _p4._0._0, '0'),
					month: A2(unwrap, _p4._0._1._0, '1'),
					day: A2(unwrap, _p4._0._1._1._0, '1'),
					hour: A2(unwrap, _p4._0._1._1._1._0, '0'),
					minute: A2(unwrap, _p4._0._1._1._1._1._0, '0'),
					second: A2(unwrap, _p4._0._1._1._1._1._1._0, '0'),
					millisecond: _jweir$elm_iso8601$ISO8601$parseMilliseconds(_p4._0._1._1._1._1._1._1._0),
					offset: _jweir$elm_iso8601$ISO8601$parseOffset(_p4._0._1._1._1._1._1._1._1._0)
				});
		}
	} else {
		var _p6 = A2(_elm_lang$core$Debug$log, s, parts);
		return _elm_lang$core$Result$Err('unknown error');
	}
};
var _jweir$elm_iso8601$ISO8601$fmtMs = function (n) {
	return _elm_lang$core$Native_Utils.eq(n, 0) ? '' : ((_elm_lang$core$Native_Utils.cmp(n, 10) < 0) ? A2(
		_elm_lang$core$Basics_ops['++'],
		'.00',
		_elm_lang$core$Basics$toString(n)) : ((_elm_lang$core$Native_Utils.cmp(n, 100) < 0) ? A2(
		_elm_lang$core$Basics_ops['++'],
		'.0',
		_elm_lang$core$Basics$toString(n)) : A2(
		_elm_lang$core$Basics_ops['++'],
		'.',
		_elm_lang$core$Basics$toString(n))));
};
var _jweir$elm_iso8601$ISO8601$fmt = function (n) {
	return (_elm_lang$core$Native_Utils.cmp(n, 10) < 0) ? A2(
		_elm_lang$core$Basics_ops['++'],
		'0',
		_elm_lang$core$Basics$toString(n)) : _elm_lang$core$Basics$toString(n);
};
var _jweir$elm_iso8601$ISO8601$fmtOffset = function (offset) {
	var _p7 = offset;
	if ((_p7._0 === 0) && (_p7._1 === 0)) {
		return 'Z';
	} else {
		var _p8 = _p7._0;
		var symbol = (_elm_lang$core$Native_Utils.cmp(_p8, 0) > -1) ? '+' : '-';
		return A2(
			_elm_lang$core$Basics_ops['++'],
			symbol,
			A2(
				_elm_lang$core$Basics_ops['++'],
				_jweir$elm_iso8601$ISO8601$fmt(
					_elm_lang$core$Basics$abs(_p8)),
				_jweir$elm_iso8601$ISO8601$fmt(_p7._1)));
	}
};
var _jweir$elm_iso8601$ISO8601$toString = function (time) {
	return A2(
		_elm_lang$core$String$join,
		'',
		_elm_lang$core$Native_List.fromArray(
			[
				_jweir$elm_iso8601$ISO8601$fmt(time.year),
				'-',
				_jweir$elm_iso8601$ISO8601$fmt(time.month),
				'-',
				_jweir$elm_iso8601$ISO8601$fmt(time.day),
				'T',
				_jweir$elm_iso8601$ISO8601$fmt(time.hour),
				':',
				_jweir$elm_iso8601$ISO8601$fmt(time.minute),
				':',
				_jweir$elm_iso8601$ISO8601$fmt(time.second),
				_jweir$elm_iso8601$ISO8601$fmtMs(time.millisecond),
				_jweir$elm_iso8601$ISO8601$fmtOffset(time.offset)
			]));
};
var _jweir$elm_iso8601$ISO8601$defaultTime = {
	year: 0,
	month: 1,
	day: 1,
	hour: 0,
	minute: 0,
	second: 0,
	millisecond: 0,
	offset: {ctor: '_Tuple2', _0: 0, _1: 0}
};
var _jweir$elm_iso8601$ISO8601$ims = 1;
var _jweir$elm_iso8601$ISO8601$isec = _jweir$elm_iso8601$ISO8601$ims * 1000;
var _jweir$elm_iso8601$ISO8601$imin = _jweir$elm_iso8601$ISO8601$isec * 60;
var _jweir$elm_iso8601$ISO8601$ihour = _jweir$elm_iso8601$ISO8601$imin * 60;
var _jweir$elm_iso8601$ISO8601$iday = _jweir$elm_iso8601$ISO8601$ihour * 24;
var _jweir$elm_iso8601$ISO8601$offsetToTime = function (time) {
	var _p9 = time.offset;
	var m = _p9._0;
	var s = _p9._1;
	return (_jweir$elm_iso8601$ISO8601$ihour * m) + (_jweir$elm_iso8601$ISO8601$imin * s);
};
var _jweir$elm_iso8601$ISO8601$toTime = function (time) {
	var _p10 = _elm_lang$core$Native_Utils.cmp(time.year, 1970) > -1;
	if (_p10 === false) {
		var totalDays = _elm_lang$core$List$sum(
			A2(
				_elm_lang$core$List$map,
				_jweir$elm_iso8601$ISO8601_Helpers$daysInMonth(time.year),
				_elm_lang$core$Native_List.range(1, time.month)));
		var years = A2(
			_elm_lang$core$List$map,
			_jweir$elm_iso8601$ISO8601_Helpers$daysInYear,
			_elm_lang$core$Native_List.range(time.year + 1, 1970 - 1));
		var tots = _elm_lang$core$Native_List.fromArray(
			[
				_jweir$elm_iso8601$ISO8601$iday * _elm_lang$core$List$sum(years),
				_jweir$elm_iso8601$ISO8601$iday * (_jweir$elm_iso8601$ISO8601_Helpers$daysInYear(time.year) - totalDays),
				_jweir$elm_iso8601$ISO8601$iday * (A2(_jweir$elm_iso8601$ISO8601_Helpers$daysInMonth, time.year, time.month) - time.day),
				(_jweir$elm_iso8601$ISO8601$iday - _jweir$elm_iso8601$ISO8601$ihour) - (_jweir$elm_iso8601$ISO8601$ihour * time.hour),
				(_jweir$elm_iso8601$ISO8601$ihour - _jweir$elm_iso8601$ISO8601$imin) - (_jweir$elm_iso8601$ISO8601$imin * time.minute),
				_jweir$elm_iso8601$ISO8601$imin - (_jweir$elm_iso8601$ISO8601$isec * time.second),
				_jweir$elm_iso8601$ISO8601$offsetToTime(time)
			]);
		return 0 - (_elm_lang$core$List$sum(tots) - time.millisecond);
	} else {
		var months = A2(
			_elm_lang$core$List$map,
			_jweir$elm_iso8601$ISO8601_Helpers$daysInMonth(time.year),
			_elm_lang$core$Native_List.range(1, time.month - 1));
		var years = A2(
			_elm_lang$core$List$map,
			_jweir$elm_iso8601$ISO8601_Helpers$daysInYear,
			_elm_lang$core$Native_List.range(1970, time.year - 1));
		var tots = _elm_lang$core$Native_List.fromArray(
			[
				_jweir$elm_iso8601$ISO8601$iday * _elm_lang$core$List$sum(years),
				_jweir$elm_iso8601$ISO8601$iday * _elm_lang$core$List$sum(months),
				_jweir$elm_iso8601$ISO8601$iday * (time.day - 1),
				_jweir$elm_iso8601$ISO8601$ihour * time.hour,
				_jweir$elm_iso8601$ISO8601$imin * time.minute,
				_jweir$elm_iso8601$ISO8601$isec * time.second,
				-1 * _jweir$elm_iso8601$ISO8601$offsetToTime(time)
			]);
		return _elm_lang$core$List$sum(tots) + time.millisecond;
	}
};
var _jweir$elm_iso8601$ISO8601$fromTime = function (ms) {
	var v = (_elm_lang$core$Native_Utils.cmp(ms, 0) > -1) ? _jweir$elm_iso8601$ISO8601_Helpers$After : _jweir$elm_iso8601$ISO8601_Helpers$Before;
	var milliseconds = A2(_elm_lang$core$Basics_ops['%'], ms, _jweir$elm_iso8601$ISO8601$isec);
	var _p11 = v;
	if (_p11.ctor === 'After') {
		var hours = A2(_elm_lang$core$Basics_ops['%'], (ms / _jweir$elm_iso8601$ISO8601$ihour) | 0, 24);
		var minutes = A2(_elm_lang$core$Basics_ops['%'], (ms / _jweir$elm_iso8601$ISO8601$imin) | 0, 60);
		var seconds = A2(_elm_lang$core$Basics_ops['%'], (ms / _jweir$elm_iso8601$ISO8601$isec) | 0, 60);
		var days = (ms / _jweir$elm_iso8601$ISO8601$iday) | 0;
		var _p12 = A3(_jweir$elm_iso8601$ISO8601_Helpers$daysToYears, _jweir$elm_iso8601$ISO8601_Helpers$After, 1970, days);
		var years = _p12._0;
		var remainingDays = _p12._1;
		var _p13 = A3(_jweir$elm_iso8601$ISO8601_Helpers$daysToMonths, years, 1, remainingDays + 1);
		var month = _p13._0;
		var daysInMonth = _p13._1;
		return _elm_lang$core$Native_Utils.update(
			_jweir$elm_iso8601$ISO8601$defaultTime,
			{second: seconds, minute: minutes, hour: hours, day: daysInMonth, month: month, year: years, millisecond: milliseconds});
	} else {
		var totalDays = (ms / _jweir$elm_iso8601$ISO8601$iday) | 0;
		var rem = A2(_elm_lang$core$Basics_ops['%'], ms, _jweir$elm_iso8601$ISO8601$iday);
		var _p14 = _elm_lang$core$Native_Utils.eq(rem, 0) ? A3(_jweir$elm_iso8601$ISO8601_Helpers$daysToYears, _jweir$elm_iso8601$ISO8601_Helpers$Before, 1969, totalDays + 1) : A3(_jweir$elm_iso8601$ISO8601_Helpers$daysToYears, _jweir$elm_iso8601$ISO8601_Helpers$Before, 1969, totalDays);
		var years = _p14._0;
		var remainingDays = _p14._1;
		var _p15 = A3(_jweir$elm_iso8601$ISO8601_Helpers$daysToMonths, years, 1, remainingDays);
		var month = _p15._0;
		var daysInMonth = _p15._1;
		var days = (rem / _jweir$elm_iso8601$ISO8601$iday) | 0;
		var seconds = A2(_elm_lang$core$Basics_ops['%'], (rem / _jweir$elm_iso8601$ISO8601$isec) | 0, 60);
		var minutes = A2(_elm_lang$core$Basics_ops['%'], (rem / _jweir$elm_iso8601$ISO8601$imin) | 0, 60);
		var hours = A2(_elm_lang$core$Basics_ops['%'], (rem / _jweir$elm_iso8601$ISO8601$ihour) | 0, 24);
		var _p16 = A2(
			_elm_lang$core$Debug$log,
			'',
			{ctor: '_Tuple8', _0: totalDays, _1: years, _2: rem, _3: remainingDays, _4: days, _5: hours, _6: minutes, _7: seconds});
		return _elm_lang$core$Native_Utils.update(
			_jweir$elm_iso8601$ISO8601$defaultTime,
			{second: seconds, minute: minutes, hour: hours, day: daysInMonth, month: month, year: years, millisecond: milliseconds});
	}
};
var _jweir$elm_iso8601$ISO8601$Time = F8(
	function (a, b, c, d, e, f, g, h) {
		return {year: a, month: b, day: c, hour: d, minute: e, second: f, millisecond: g, offset: h};
	});
var _jweir$elm_iso8601$ISO8601$Sun = {ctor: 'Sun'};
var _jweir$elm_iso8601$ISO8601$Sat = {ctor: 'Sat'};
var _jweir$elm_iso8601$ISO8601$Fri = {ctor: 'Fri'};
var _jweir$elm_iso8601$ISO8601$Thu = {ctor: 'Thu'};
var _jweir$elm_iso8601$ISO8601$Wed = {ctor: 'Wed'};
var _jweir$elm_iso8601$ISO8601$Tue = {ctor: 'Tue'};
var _jweir$elm_iso8601$ISO8601$Mon = {ctor: 'Mon'};
var _jweir$elm_iso8601$ISO8601$daysFromEpoch = _elm_lang$core$Array$fromList(
	_elm_lang$core$Native_List.fromArray(
		[_jweir$elm_iso8601$ISO8601$Thu, _jweir$elm_iso8601$ISO8601$Fri, _jweir$elm_iso8601$ISO8601$Sat, _jweir$elm_iso8601$ISO8601$Sun, _jweir$elm_iso8601$ISO8601$Mon, _jweir$elm_iso8601$ISO8601$Tue, _jweir$elm_iso8601$ISO8601$Wed]));
var _jweir$elm_iso8601$ISO8601$dayOfWeek = function (time) {
	var t = _elm_lang$core$Native_Utils.update(
		_jweir$elm_iso8601$ISO8601$defaultTime,
		{year: time.year, month: time.month, day: time.day});
	var t$ = _jweir$elm_iso8601$ISO8601$toTime(t);
	var days = (t$ / _jweir$elm_iso8601$ISO8601$iday) | 0;
	var day = A2(
		_elm_lang$core$Array$get,
		A2(_elm_lang$core$Basics_ops['%'], days, 7),
		_jweir$elm_iso8601$ISO8601$daysFromEpoch);
	var _p17 = A2(
		_elm_lang$core$Debug$log,
		'wd',
		{
			ctor: '_Tuple4',
			_0: _jweir$elm_iso8601$ISO8601$toString(t),
			_1: t$,
			_2: days,
			_3: A2(_elm_lang$core$Basics_ops['%'], days, 7)
		});
	var _p18 = day;
	if (_p18.ctor === 'Just') {
		return _p18._0;
	} else {
		return _jweir$elm_iso8601$ISO8601$Sun;
	}
};

var _mgold$elm_date_format$Date_Format$padWith = function (c) {
	return function (_p0) {
		return A3(
			_elm_lang$core$String$padLeft,
			2,
			c,
			_elm_lang$core$Basics$toString(_p0));
	};
};
var _mgold$elm_date_format$Date_Format$zero2twelve = function (n) {
	return _elm_lang$core$Native_Utils.eq(n, 0) ? 12 : n;
};
var _mgold$elm_date_format$Date_Format$mod12 = function (h) {
	return A2(_elm_lang$core$Basics_ops['%'], h, 12);
};
var _mgold$elm_date_format$Date_Format$fullDayOfWeek = function (dow) {
	var _p1 = dow;
	switch (_p1.ctor) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var _mgold$elm_date_format$Date_Format$monthToFullName = function (m) {
	var _p2 = m;
	switch (_p2.ctor) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var _mgold$elm_date_format$Date_Format$monthToInt = function (m) {
	var _p3 = m;
	switch (_p3.ctor) {
		case 'Jan':
			return 1;
		case 'Feb':
			return 2;
		case 'Mar':
			return 3;
		case 'Apr':
			return 4;
		case 'May':
			return 5;
		case 'Jun':
			return 6;
		case 'Jul':
			return 7;
		case 'Aug':
			return 8;
		case 'Sep':
			return 9;
		case 'Oct':
			return 10;
		case 'Nov':
			return 11;
		default:
			return 12;
	}
};
var _mgold$elm_date_format$Date_Format$formatToken = F2(
	function (d, m) {
		var symbol = function () {
			var _p4 = m.submatches;
			if (((_p4.ctor === '::') && (_p4._0.ctor === 'Just')) && (_p4._1.ctor === '[]')) {
				return _p4._0._0;
			} else {
				return ' ';
			}
		}();
		var _p5 = symbol;
		switch (_p5) {
			case '%':
				return '%';
			case 'Y':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$year(d));
			case 'm':
				return A3(
					_elm_lang$core$String$padLeft,
					2,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Basics$toString(
						_mgold$elm_date_format$Date_Format$monthToInt(
							_elm_lang$core$Date$month(d))));
			case 'B':
				return _mgold$elm_date_format$Date_Format$monthToFullName(
					_elm_lang$core$Date$month(d));
			case 'b':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$month(d));
			case 'd':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$day(d));
			case 'e':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_elm_lang$core$Date$day(d));
			case 'a':
				return _elm_lang$core$Basics$toString(
					_elm_lang$core$Date$dayOfWeek(d));
			case 'A':
				return _mgold$elm_date_format$Date_Format$fullDayOfWeek(
					_elm_lang$core$Date$dayOfWeek(d));
			case 'H':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$hour(d));
			case 'k':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_elm_lang$core$Date$hour(d));
			case 'I':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_mgold$elm_date_format$Date_Format$zero2twelve(
						_mgold$elm_date_format$Date_Format$mod12(
							_elm_lang$core$Date$hour(d))));
			case 'l':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr(' '),
					_mgold$elm_date_format$Date_Format$zero2twelve(
						_mgold$elm_date_format$Date_Format$mod12(
							_elm_lang$core$Date$hour(d))));
			case 'p':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					13) < 0) ? 'AM' : 'PM';
			case 'P':
				return (_elm_lang$core$Native_Utils.cmp(
					_elm_lang$core$Date$hour(d),
					13) < 0) ? 'am' : 'pm';
			case 'M':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$minute(d));
			case 'S':
				return A2(
					_mgold$elm_date_format$Date_Format$padWith,
					_elm_lang$core$Native_Utils.chr('0'),
					_elm_lang$core$Date$second(d));
			default:
				return '';
		}
	});
var _mgold$elm_date_format$Date_Format$re = _elm_lang$core$Regex$regex('%(%|Y|m|B|b|d|e|a|A|H|k|I|l|p|P|M|S)');
var _mgold$elm_date_format$Date_Format$format = F2(
	function (s, d) {
		return A4(
			_elm_lang$core$Regex$replace,
			_elm_lang$core$Regex$All,
			_mgold$elm_date_format$Date_Format$re,
			_mgold$elm_date_format$Date_Format$formatToken(d),
			s);
	});
var _mgold$elm_date_format$Date_Format$formatISO8601 = _mgold$elm_date_format$Date_Format$format('%Y-%m-%dT%H:%M:%SZ');

var _user$project$Field$significantFields = function (fields) {
	return A2(
		_elm_lang$core$List$filter,
		function (f) {
			return f.isSignificant;
		},
		fields);
};
var _user$project$Field$mostSignificantField = function (fields) {
	var significants = _user$project$Field$significantFields(fields);
	var sorted = A2(
		_elm_lang$core$List$sortWith,
		F2(
			function (a, b) {
				var _p0 = a.significancePriority;
				if (_p0.ctor === 'Just') {
					var _p1 = b.significancePriority;
					if (_p1.ctor === 'Just') {
						return A2(_elm_lang$core$Basics$compare, _p0._0, _p1._0);
					} else {
						return _elm_lang$core$Basics$EQ;
					}
				} else {
					return _elm_lang$core$Basics$EQ;
				}
			}),
		significants);
	return _elm_lang$core$List$head(sorted);
};
var _user$project$Field$significantModels = function (fieldModels) {
	return A2(
		_elm_lang$core$List$filter,
		function (f) {
			return f.field.isSignificant;
		},
		fieldModels);
};
var _user$project$Field$mostSignificantModel = function (fieldModels) {
	var significants = _user$project$Field$significantModels(fieldModels);
	var sorted = A2(
		_elm_lang$core$List$sortWith,
		F2(
			function (a, b) {
				var _p2 = a.field.significancePriority;
				if (_p2.ctor === 'Just') {
					var _p3 = b.field.significancePriority;
					if (_p3.ctor === 'Just') {
						return A2(_elm_lang$core$Basics$compare, _p2._0, _p3._0);
					} else {
						return _elm_lang$core$Basics$EQ;
					}
				} else {
					return _elm_lang$core$Basics$EQ;
				}
			}),
		significants);
	return _elm_lang$core$List$head(sorted);
};
var _user$project$Field$tableLookupTabFields = F2(
	function (lookupTabList, table) {
		var lookupTab = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (l) {
					return _elm_lang$core$Native_Utils.eq(l.table, table);
				},
				lookupTabList));
		var _p4 = lookupTab;
		if (_p4.ctor === 'Just') {
			return _p4._0.fields;
		} else {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		}
	});
var _user$project$Field$tableLookupData = F2(
	function (lookupDataList, table) {
		var lookupData = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (l) {
					return _elm_lang$core$Native_Utils.eq(l.table, table);
				},
				lookupDataList));
		var _p5 = lookupData;
		if (_p5.ctor === 'Just') {
			return _p5._0.daoList;
		} else {
			return _elm_lang$core$Native_List.fromArray(
				[]);
		}
	});
var _user$project$Field$getValue = F2(
	function (field, dao) {
		return A2(_elm_lang$core$Dict$get, field.column, dao);
	});
var _user$project$Field$onSelectionChange = function (msg) {
	return A2(
		_elm_lang$html$Html_Events$on,
		'change',
		A2(_elm_lang$core$Json_Decode$map, msg, _elm_lang$html$Html_Events$targetValue));
};
var _user$project$Field$getKeyField = function (fieldList) {
	return _elm_lang$core$List$head(
		A2(
			_elm_lang$core$List$filter,
			function (f) {
				return f.isKeyfield;
			},
			fieldList));
};
var _user$project$Field$toList = function (arg) {
	var _p6 = arg;
	if (_p6.ctor === 'Just') {
		return _elm_lang$core$Native_List.fromArray(
			[_p6._0]);
	} else {
		return _elm_lang$core$Native_List.fromArray(
			[]);
	}
};
var _user$project$Field$rightAlign = _elm_lang$html$Html_Attributes$style(
	_elm_lang$core$Native_List.fromArray(
		[
			{ctor: '_Tuple2', _0: 'text-align', _1: 'right'}
		]));
var _user$project$Field$leftAlign = _elm_lang$html$Html_Attributes$style(
	_elm_lang$core$Native_List.fromArray(
		[
			{ctor: '_Tuple2', _0: 'text-align', _1: 'left'}
		]));
var _user$project$Field$alignment = function (field) {
	var _p7 = field.dataType;
	switch (_p7) {
		case 'Bool':
			return _user$project$Field$leftAlign;
		case 'String':
			return _user$project$Field$leftAlign;
		case 'F32':
			return _user$project$Field$rightAlign;
		case 'F64':
			return _user$project$Field$rightAlign;
		case 'I32':
			return _user$project$Field$rightAlign;
		case 'I64':
			return _user$project$Field$rightAlign;
		case 'Date':
			return _user$project$Field$rightAlign;
		case 'DateTime':
			return _user$project$Field$rightAlign;
		default:
			return _user$project$Field$leftAlign;
	}
};
var _user$project$Field$fieldReadList = function (model) {
	var _p8 = model.value;
	switch (_p8.ctor) {
		case 'String':
			return _elm_lang$html$Html$text(
				A2(_elm_lang$core$Basics_ops['++'], ' ', _p8._0));
		case 'Bool':
			var _p9 = _p8._0;
			if (_p9 === true) {
				return _elm_lang$html$Html$text(' true');
			} else {
				return _elm_lang$html$Html$text(' false');
			}
		case 'I32':
			return _elm_lang$html$Html$text(
				A2(
					_elm_lang$core$Basics_ops['++'],
					' ',
					_elm_lang$core$Basics$toString(_p8._0)));
		case 'I64':
			return _elm_lang$html$Html$text(
				A2(
					_elm_lang$core$Basics_ops['++'],
					' ',
					_elm_lang$core$Basics$toString(_p8._0)));
		case 'F64':
			return _elm_lang$html$Html$text(
				A2(
					_elm_lang$core$Basics_ops['++'],
					' ',
					_elm_lang$core$Basics$toString(_p8._0)));
		case 'Date':
			return _elm_lang$html$Html$text(
				A2(
					_elm_lang$core$Basics_ops['++'],
					' ',
					_elm_lang$core$Basics$toString(_p8._0)));
		default:
			return _elm_lang$html$Html$text(
				A2(
					_elm_lang$core$Basics_ops['++'],
					' ',
					_elm_lang$core$Basics$toString(model.value)));
	}
};
var _user$project$Field$stringValue = function (value) {
	var _p10 = value;
	switch (_p10.ctor) {
		case 'String':
			return _p10._0;
		case 'Bool':
			return _elm_lang$core$Basics$toString(_p10._0);
		case 'I32':
			return _elm_lang$core$Basics$toString(_p10._0);
		case 'I64':
			return _elm_lang$core$Basics$toString(_p10._0);
		case 'F64':
			return _elm_lang$core$Basics$toString(_p10._0);
		case 'Date':
			return _elm_lang$core$Basics$toString(_p10._0);
		case 'DateTime':
			return _elm_lang$core$Basics$toString(_p10._0);
		default:
			return _elm_lang$core$Basics$toString(value);
	}
};
var _user$project$Field$simpleDate = function (str) {
	var time = _jweir$elm_iso8601$ISO8601$toTime(
		A2(
			_elm_lang$core$Result$withDefault,
			_jweir$elm_iso8601$ISO8601$fromTime(0),
			_jweir$elm_iso8601$ISO8601$fromString(str)));
	var date = _elm_lang$core$Date$fromTime(
		_elm_lang$core$Basics$toFloat(time));
	var iso = _mgold$elm_date_format$Date_Format$formatISO8601(date);
	var simple = A2(_mgold$elm_date_format$Date_Format$format, '%Y-%m-%d %H:%M', date);
	return simple;
};
var _user$project$Field$isEmptyValue = function (value) {
	var _p11 = value;
	switch (_p11.ctor) {
		case 'String':
			return _elm_lang$core$String$isEmpty(_p11._0);
		case 'Bool':
			return false;
		default:
			return false;
	}
};
var _user$project$Field$isMandatoryOk = function (model) {
	return (_user$project$Field$isEmptyValue(model.value) && model.field.isMandatory) ? false : true;
};
var _user$project$Field$firstValue = F2(
	function ($default, args) {
		return _elm_lang$core$Json_Decode$succeed(
			A2(
				_elm_lang$core$Maybe$withDefault,
				$default,
				_elm_lang$core$List$head(args)));
	});
var _user$project$Field$newLookupTab = F2(
	function (table, fields) {
		return {table: table, fields: fields};
	});
var _user$project$Field$Model = F8(
	function (a, b, c, d, e, f, g, h) {
		return {field: a, value: b, mode: c, presentation: d, focused: e, density: f, lookupTabs: g, lookupData: h};
	});
var _user$project$Field$LookupTab = F2(
	function (a, b) {
		return {table: a, fields: b};
	});
var _user$project$Field$LookupData = F2(
	function (a, b) {
		return {table: a, daoList: b};
	});
var _user$project$Field$Field = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return function (o) {
															return function (p) {
																return function (q) {
																	return function (r) {
																		return function (s) {
																			return function (t) {
																				return function (u) {
																					return {name: a, column: b, completeName: c, isKeyfield: d, dataType: e, reference: f, referenceValue: g, description: h, info: i, isSignificant: j, significancePriority: k, includeInSearch: l, isMandatory: m, seqNo: n, isSameLine: o, isDisplayed: p, isReadonly: q, isAutocomplete: r, displayLogic: s, displayLength: t, displayValue: u};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Field$fieldDecoder = A2(
	_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
					A2(
						_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
						A2(
							_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
							A2(
								_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
								A2(
									_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
									A2(
										_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
										A2(
											_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
											A2(
												_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
												A2(
													_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
													A2(
														_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
														A2(
															_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
															A2(
																_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
																A2(
																	_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
																	A2(
																		_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
																		A2(
																			_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
																			A2(
																				_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
																				A2(
																					_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
																					_elm_lang$core$Json_Decode$succeed(_user$project$Field$Field),
																					A2(_elm_lang$core$Json_Decode_ops[':='], 'name', _elm_lang$core$Json_Decode$string)),
																				A2(_elm_lang$core$Json_Decode_ops[':='], 'column', _elm_lang$core$Json_Decode$string)),
																			A2(_elm_lang$core$Json_Decode_ops[':='], 'complete_name', _elm_lang$core$Json_Decode$string)),
																		A2(_elm_lang$core$Json_Decode_ops[':='], 'is_keyfield', _elm_lang$core$Json_Decode$bool)),
																	A2(_elm_lang$core$Json_Decode_ops[':='], 'data_type', _elm_lang$core$Json_Decode$string)),
																A2(_elm_lang$core$Json_Decode_ops[':='], 'reference', _elm_lang$core$Json_Decode$string)),
															_elm_lang$core$Json_Decode$maybe(
																A2(_elm_lang$core$Json_Decode_ops[':='], 'reference_value', _elm_lang$core$Json_Decode$string))),
														_elm_lang$core$Json_Decode$maybe(
															A2(_elm_lang$core$Json_Decode_ops[':='], 'description', _elm_lang$core$Json_Decode$string))),
													_elm_lang$core$Json_Decode$maybe(
														A2(_elm_lang$core$Json_Decode_ops[':='], 'info', _elm_lang$core$Json_Decode$string))),
												A2(_elm_lang$core$Json_Decode_ops[':='], 'is_significant', _elm_lang$core$Json_Decode$bool)),
											_elm_lang$core$Json_Decode$maybe(
												A2(_elm_lang$core$Json_Decode_ops[':='], 'significance_priority', _elm_lang$core$Json_Decode$int))),
										A2(_elm_lang$core$Json_Decode_ops[':='], 'include_in_search', _elm_lang$core$Json_Decode$bool)),
									A2(_elm_lang$core$Json_Decode_ops[':='], 'is_mandatory', _elm_lang$core$Json_Decode$bool)),
								A2(_elm_lang$core$Json_Decode_ops[':='], 'seq_no', _elm_lang$core$Json_Decode$int)),
							A2(_elm_lang$core$Json_Decode_ops[':='], 'is_same_line', _elm_lang$core$Json_Decode$bool)),
						A2(_elm_lang$core$Json_Decode_ops[':='], 'is_displayed', _elm_lang$core$Json_Decode$bool)),
					A2(_elm_lang$core$Json_Decode_ops[':='], 'is_readonly', _elm_lang$core$Json_Decode$bool)),
				A2(_elm_lang$core$Json_Decode_ops[':='], 'is_autocomplete', _elm_lang$core$Json_Decode$bool)),
			_elm_lang$core$Json_Decode$maybe(
				A2(_elm_lang$core$Json_Decode_ops[':='], 'display_logic', _elm_lang$core$Json_Decode$string))),
		_elm_lang$core$Json_Decode$maybe(
			A2(_elm_lang$core$Json_Decode_ops[':='], 'display_length', _elm_lang$core$Json_Decode$int))),
	_elm_lang$core$Json_Decode$maybe(
		A2(_elm_lang$core$Json_Decode_ops[':='], 'default_value', _elm_lang$core$Json_Decode$string)));
var _user$project$Field$Read = {ctor: 'Read'};
var _user$project$Field$Edit = {ctor: 'Edit'};
var _user$project$Field$List = {ctor: 'List'};
var _user$project$Field$Grid = {ctor: 'Grid'};
var _user$project$Field$Form = {ctor: 'Form'};
var _user$project$Field$Table = {ctor: 'Table'};
var _user$project$Field$Expanded = {ctor: 'Expanded'};
var _user$project$Field$Medium = {ctor: 'Medium'};
var _user$project$Field$Compact = {ctor: 'Compact'};
var _user$project$Field$DateTime = function (a) {
	return {ctor: 'DateTime', _0: a};
};
var _user$project$Field$Date = function (a) {
	return {ctor: 'Date', _0: a};
};
var _user$project$Field$String = function (a) {
	return {ctor: 'String', _0: a};
};
var _user$project$Field$defaultValue = _user$project$Field$String('');
var _user$project$Field$create = function (field) {
	return {
		field: field,
		value: _user$project$Field$defaultValue,
		mode: _user$project$Field$Read,
		presentation: _user$project$Field$Table,
		focused: false,
		density: _user$project$Field$Expanded,
		lookupTabs: _elm_lang$core$Native_List.fromArray(
			[]),
		lookupData: _elm_lang$core$Native_List.fromArray(
			[])
	};
};
var _user$project$Field$createFieldWithValue = F2(
	function (field, value) {
		var model = _user$project$Field$create(field);
		return _elm_lang$core$Native_Utils.update(
			model,
			{value: value});
	});
var _user$project$Field$F64 = function (a) {
	return {ctor: 'F64', _0: a};
};
var _user$project$Field$F32 = function (a) {
	return {ctor: 'F32', _0: a};
};
var _user$project$Field$U64 = function (a) {
	return {ctor: 'U64', _0: a};
};
var _user$project$Field$U32 = function (a) {
	return {ctor: 'U32', _0: a};
};
var _user$project$Field$U16 = function (a) {
	return {ctor: 'U16', _0: a};
};
var _user$project$Field$U8 = function (a) {
	return {ctor: 'U8', _0: a};
};
var _user$project$Field$I64 = function (a) {
	return {ctor: 'I64', _0: a};
};
var _user$project$Field$I32 = function (a) {
	return {ctor: 'I32', _0: a};
};
var _user$project$Field$I16 = function (a) {
	return {ctor: 'I16', _0: a};
};
var _user$project$Field$I8 = function (a) {
	return {ctor: 'I8', _0: a};
};
var _user$project$Field$Bool = function (a) {
	return {ctor: 'Bool', _0: a};
};
var _user$project$Field$valueVariant = function (tag) {
	var _p12 = tag;
	switch (_p12) {
		case 'String':
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$String,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)),
					_user$project$Field$firstValue('')));
		case 'Bool':
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$Bool,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$bool)),
					_user$project$Field$firstValue(false)));
		case 'F64':
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$F64,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$float)),
					_user$project$Field$firstValue(0)));
		case 'I32':
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$I32,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$int)),
					_user$project$Field$firstValue(0)));
		case 'Date':
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$Date,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)),
					_user$project$Field$firstValue('')));
		case 'DateTime':
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$DateTime,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)),
					_user$project$Field$firstValue('')));
		default:
			return A2(
				_elm_lang$core$Json_Decode$map,
				_user$project$Field$String,
				A2(
					_elm_lang$core$Json_Decode$andThen,
					A2(
						_elm_lang$core$Json_Decode_ops[':='],
						'fields',
						_elm_lang$core$Json_Decode$list(_elm_lang$core$Json_Decode$string)),
					_user$project$Field$firstValue('')));
	}
};
var _user$project$Field$valueDecoder = A2(
	_elm_lang$core$Json_Decode$andThen,
	A2(_elm_lang$core$Json_Decode_ops[':='], 'variant', _elm_lang$core$Json_Decode$string),
	_user$project$Field$valueVariant);
var _user$project$Field$daoDecoder = _elm_lang$core$Json_Decode$dict(_user$project$Field$valueDecoder);
var _user$project$Field$update = F2(
	function (msg, model) {
		var _p13 = msg;
		switch (_p13.ctor) {
			case 'ChangeValue':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							value: _user$project$Field$String(_p13._0)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangeValueBool':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							value: _user$project$Field$Bool(_p13._0)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangeMode':
				var _p15 = _p13._0;
				var _p14 = _p15;
				if (_p14.ctor === 'Edit') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{mode: _p15, focused: true}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(
							model,
							{mode: _p15}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				}
			case 'ChangePresentation':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{presentation: _p13._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangeDensity':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{density: _p13._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'SetValue':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{value: _p13._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'LookupTabsReceived':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{lookupTabs: _p13._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{lookupData: _p13._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Field$LookupDataReceived = function (a) {
	return {ctor: 'LookupDataReceived', _0: a};
};
var _user$project$Field$LookupTabsReceived = function (a) {
	return {ctor: 'LookupTabsReceived', _0: a};
};
var _user$project$Field$SetValue = function (a) {
	return {ctor: 'SetValue', _0: a};
};
var _user$project$Field$ChangeDensity = function (a) {
	return {ctor: 'ChangeDensity', _0: a};
};
var _user$project$Field$ChangePresentation = function (a) {
	return {ctor: 'ChangePresentation', _0: a};
};
var _user$project$Field$ChangeMode = function (a) {
	return {ctor: 'ChangeMode', _0: a};
};
var _user$project$Field$ChangeValueBool = function (a) {
	return {ctor: 'ChangeValueBool', _0: a};
};
var _user$project$Field$ChangeValue = function (a) {
	return {ctor: 'ChangeValue', _0: a};
};
var _user$project$Field$fieldEntry = function (model) {
	var textWidth = _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[
				{ctor: '_Tuple2', _0: 'width', _1: '300px'},
				{ctor: '_Tuple2', _0: 'border', _1: '0'},
				{ctor: '_Tuple2', _0: 'outline', _1: '0'},
				{ctor: '_Tuple2', _0: 'border-bottom', _1: '1px solid #ccc'},
				{ctor: '_Tuple2', _0: 'background-color', _1: '#fff'}
			]));
	var fieldCheck = _user$project$Field$isMandatoryOk(model) ? _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[])) : _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[
				{ctor: '_Tuple2', _0: 'border', _1: '1px solid red'}
			]));
	var focusedField = function () {
		var _p16 = model.focused;
		if (_p16 === true) {
			return _elm_lang$html$Html_Attributes$class('focused_field');
		} else {
			return _elm_lang$html$Html_Attributes$class('');
		}
	}();
	var _p17 = model.field.reference;
	if (_p17 === 'Table') {
		return _user$project$Field$lookupView(model);
	} else {
		var _p18 = model.value;
		switch (_p18.ctor) {
			case 'String':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('text'),
							fieldCheck,
							_user$project$Field$leftAlign,
							textWidth,
							focusedField,
							_elm_lang$html$Html_Attributes$value(_p18._0),
							_elm_lang$html$Html_Events$onInput(_user$project$Field$ChangeValue)
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'Bool':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('checkbox'),
							fieldCheck,
							_user$project$Field$leftAlign,
							_elm_lang$html$Html_Attributes$checked(_p18._0),
							_elm_lang$html$Html_Events$onCheck(_user$project$Field$ChangeValueBool)
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'I64':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('number'),
							fieldCheck,
							_user$project$Field$rightAlign,
							textWidth,
							_elm_lang$html$Html_Attributes$value(
							_elm_lang$core$Basics$toString(_p18._0))
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'I32':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('number'),
							fieldCheck,
							_user$project$Field$rightAlign,
							textWidth,
							_elm_lang$html$Html_Attributes$value(
							_elm_lang$core$Basics$toString(_p18._0))
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'F64':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('number'),
							fieldCheck,
							_user$project$Field$rightAlign,
							textWidth,
							_elm_lang$html$Html_Attributes$value(
							_elm_lang$core$Basics$toString(_p18._0))
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'Date':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('date'),
							_elm_lang$html$Html_Attributes$value(_p18._0),
							textWidth,
							_user$project$Field$rightAlign,
							_elm_lang$html$Html_Events$onInput(_user$project$Field$ChangeValue)
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			case 'DateTime':
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('datetime'),
							_elm_lang$html$Html_Attributes$value(
							_user$project$Field$simpleDate(_p18._0)),
							textWidth,
							_user$project$Field$rightAlign,
							_elm_lang$html$Html_Events$onInput(_user$project$Field$ChangeValue)
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
			default:
				return A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('text'),
							textWidth,
							_user$project$Field$leftAlign,
							_elm_lang$html$Html_Attributes$value(
							_elm_lang$core$Basics$toString(model.value))
						]),
					_elm_lang$core$Native_List.fromArray(
						[]));
		}
	}
};
var _user$project$Field$lookupView = function (model) {
	var table = model.field.referenceValue;
	var _p19 = table;
	if (_p19.ctor === 'Just') {
		var _p21 = _p19._0;
		var fieldList = A2(_user$project$Field$tableLookupTabFields, model.lookupTabs, _p21);
		var daoList = A2(_user$project$Field$tableLookupData, model.lookupData, _p21);
		var _p20 = model.mode;
		if (_p20.ctor === 'Edit') {
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						A3(_user$project$Field$createCompactListField, fieldList, daoList, model)
					]));
		} else {
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						A3(_user$project$Field$createSelectedLookupValue, fieldList, daoList, model)
					]));
		}
	} else {
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[]),
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html$text('no matching table')
				]));
	}
};
var _user$project$Field$createCompactListField = F3(
	function (fieldList, daoList, model) {
		var blankOption = A2(
			_elm_lang$html$Html$option,
			_elm_lang$core$Native_List.fromArray(
				[]),
			_elm_lang$core$Native_List.fromArray(
				[]));
		var keyField = _user$project$Field$getKeyField(fieldList);
		var fields = _user$project$Field$toList(
			_user$project$Field$mostSignificantField(fieldList));
		var rows = A2(
			_elm_lang$core$List$map,
			function (dao) {
				return A4(_user$project$Field$createRow, fields, keyField, dao, model);
			},
			daoList);
		return A2(
			_elm_lang$html$Html$select,
			_elm_lang$core$Native_List.fromArray(
				[]),
			A2(_elm_lang$core$List_ops['::'], blankOption, rows));
	});
var _user$project$Field$createRow = F4(
	function (fields, keyField, dao, model) {
		var rowView = A2(
			_elm_lang$core$List$map,
			function (f) {
				var fieldModel = _user$project$Field$create(f);
				var updatedModel = function () {
					var _p22 = A2(_user$project$Field$getValue, f, dao);
					if (_p22.ctor === 'Just') {
						return _elm_lang$core$Native_Utils.update(
							fieldModel,
							{value: _p22._0, presentation: _user$project$Field$List, mode: _user$project$Field$Edit});
					} else {
						return fieldModel;
					}
				}();
				return _user$project$Field$view(updatedModel);
			},
			fields);
		var attributes = function () {
			var _p23 = keyField;
			if (_p23.ctor === 'Just') {
				var _p24 = A2(_user$project$Field$getValue, _p23._0, dao);
				if (_p24.ctor === 'Just') {
					var _p25 = _p24._0;
					return _elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$value(
							_user$project$Field$stringValue(_p25)),
							_elm_lang$html$Html_Attributes$selected(
							_elm_lang$core$Native_Utils.eq(model.value, _p25))
						]);
				} else {
					return _elm_lang$core$Native_List.fromArray(
						[]);
				}
			} else {
				return _elm_lang$core$Native_List.fromArray(
					[]);
			}
		}();
		return A2(_elm_lang$html$Html$option, attributes, rowView);
	});
var _user$project$Field$view = function (model) {
	var labelCheck = _user$project$Field$isMandatoryOk(model) ? _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[])) : _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[
				{ctor: '_Tuple2', _0: 'color', _1: 'red'}
			]));
	var editField = _user$project$Field$fieldEntry(model);
	var labelStyle = _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[
				{ctor: '_Tuple2', _0: 'width', _1: '200px'},
				{ctor: '_Tuple2', _0: 'text-align', _1: 'left'},
				{ctor: '_Tuple2', _0: 'padding-top', _1: '5px'},
				{ctor: '_Tuple2', _0: 'display', _1: 'block'},
				{ctor: '_Tuple2', _0: 'margin-bottom', _1: '0px'},
				{ctor: '_Tuple2', _0: 'font-size', _1: '0.8em'}
			]));
	var labelHtml = A2(
		_elm_lang$html$Html$label,
		_elm_lang$core$Native_List.fromArray(
			[labelCheck, labelStyle]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text(model.field.name)
			]));
	var _p26 = model.presentation;
	switch (_p26.ctor) {
		case 'Form':
			var labelBool = A2(
				_elm_lang$html$Html$label,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$style(
						_elm_lang$core$Native_List.fromArray(
							[
								{ctor: '_Tuple2', _0: 'margin-left', _1: '10px'},
								{ctor: '_Tuple2', _0: 'margin-bottom', _1: '0px'}
							]))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text(model.field.name)
					]));
			var formContainerStyle = _elm_lang$html$Html_Attributes$style(
				_elm_lang$core$Native_List.fromArray(
					[
						{ctor: '_Tuple2', _0: 'width', _1: '350px'},
						{ctor: '_Tuple2', _0: 'padding', _1: '2px'}
					]));
			var _p27 = model.mode;
			if (_p27.ctor === 'Edit') {
				var _p28 = model.field.dataType;
				if (_p28 === 'Bool') {
					return A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[formContainerStyle]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$style(
										_elm_lang$core$Native_List.fromArray(
											[
												{ctor: '_Tuple2', _0: 'margin-top', _1: '2em'}
											]))
									]),
								_elm_lang$core$Native_List.fromArray(
									[editField, labelBool]))
							]));
				} else {
					return A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[formContainerStyle]),
						_elm_lang$core$Native_List.fromArray(
							[labelHtml, editField]));
				}
			} else {
				var _p29 = model.field.dataType;
				if (_p29 === 'Bool') {
					return A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[formContainerStyle]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$style(
										_elm_lang$core$Native_List.fromArray(
											[
												{ctor: '_Tuple2', _0: 'padding', _1: '2px'},
												{ctor: '_Tuple2', _0: 'display', _1: 'inline-block'}
											]))
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Field$fieldRead(model)
									])),
								labelBool
							]));
				} else {
					return A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[formContainerStyle]),
						_elm_lang$core$Native_List.fromArray(
							[
								labelHtml,
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$style(
										_elm_lang$core$Native_List.fromArray(
											[
												{ctor: '_Tuple2', _0: 'padding', _1: '2px'}
											])),
										_user$project$Field$alignment(model.field)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Field$fieldRead(model)
									]))
							]));
				}
			}
		case 'Table':
			var containerStyle = _user$project$Field$isMandatoryOk(model) ? _elm_lang$html$Html_Attributes$style(
				_elm_lang$core$Native_List.fromArray(
					[])) : _elm_lang$html$Html_Attributes$style(
				_elm_lang$core$Native_List.fromArray(
					[
						{ctor: '_Tuple2', _0: 'border', _1: '1px solid red'}
					]));
			var _p30 = model.mode;
			if (_p30.ctor === 'Edit') {
				return A2(
					_elm_lang$html$Html$td,
					_elm_lang$core$Native_List.fromArray(
						[
							_user$project$Field$alignment(model.field)
						]),
					_elm_lang$core$Native_List.fromArray(
						[editField]));
			} else {
				return A2(
					_elm_lang$html$Html$td,
					_elm_lang$core$Native_List.fromArray(
						[
							_user$project$Field$alignment(model.field),
							containerStyle
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_user$project$Field$fieldRead(model)
						]));
			}
		case 'Grid':
			var _p31 = model.mode;
			if (_p31.ctor === 'Edit') {
				return editField;
			} else {
				var _p32 = model.density;
				switch (_p32.ctor) {
					case 'Compact':
						return model.field.isSignificant ? A2(
							_elm_lang$html$Html$div,
							_elm_lang$core$Native_List.fromArray(
								[]),
							_elm_lang$core$Native_List.fromArray(
								[
									_user$project$Field$fieldRead(model)
								])) : A2(
							_elm_lang$html$Html$div,
							_elm_lang$core$Native_List.fromArray(
								[]),
							_elm_lang$core$Native_List.fromArray(
								[]));
					case 'Medium':
						if (model.field.isSignificant) {
							var textStyle = _elm_lang$html$Html_Attributes$style(
								_elm_lang$core$Native_List.fromArray(
									[
										{ctor: '_Tuple2', _0: 'font-weight', _1: 'bold'}
									]));
							return A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[textStyle]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Field$fieldRead(model)
									]));
						} else {
							return A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[]),
								_elm_lang$core$Native_List.fromArray(
									[]));
						}
					default:
						var textStyle = model.field.isSignificant ? _elm_lang$html$Html_Attributes$style(
							_elm_lang$core$Native_List.fromArray(
								[
									{ctor: '_Tuple2', _0: 'font-weight', _1: 'bold'}
								])) : _elm_lang$html$Html_Attributes$style(
							_elm_lang$core$Native_List.fromArray(
								[]));
						return A2(
							_elm_lang$html$Html$div,
							_elm_lang$core$Native_List.fromArray(
								[textStyle]),
							_elm_lang$core$Native_List.fromArray(
								[
									_user$project$Field$fieldRead(model)
								]));
				}
			}
		default:
			return _user$project$Field$fieldReadList(model);
	}
};
var _user$project$Field$fieldRead = function (model) {
	var _p33 = model.field.reference;
	if (_p33 === 'Table') {
		return _user$project$Field$lookupView(model);
	} else {
		var _p34 = model.value;
		switch (_p34.ctor) {
			case 'String':
				var _p35 = _p34._0;
				var emptyStyle = _elm_lang$html$Html_Attributes$style(
					_elm_lang$core$Native_List.fromArray(
						[
							{ctor: '_Tuple2', _0: 'border-bottom', _1: '1px solid #eee'}
						]));
				var fieldStyle = _elm_lang$html$Html_Attributes$style(
					_elm_lang$core$Native_List.fromArray(
						[
							{ctor: '_Tuple2', _0: 'width', _1: '300px'},
							{ctor: '_Tuple2', _0: 'height', _1: '20px'}
						]));
				return _elm_lang$core$String$isEmpty(_p35) ? A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[fieldStyle, emptyStyle]),
					_elm_lang$core$Native_List.fromArray(
						[])) : A2(
					_elm_lang$html$Html$div,
					_elm_lang$core$Native_List.fromArray(
						[fieldStyle]),
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html$text(_p35)
						]));
			case 'Bool':
				var _p36 = _p34._0;
				if (_p36 === true) {
					return A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-check text-center'),
								_elm_lang$html$Html_Attributes$style(
								_elm_lang$core$Native_List.fromArray(
									[
										{ctor: '_Tuple2', _0: 'color', _1: 'green'}
									]))
							]),
						_elm_lang$core$Native_List.fromArray(
							[]));
				} else {
					return A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-cancel text-center'),
								_elm_lang$html$Html_Attributes$style(
								_elm_lang$core$Native_List.fromArray(
									[
										{ctor: '_Tuple2', _0: 'color', _1: 'red'}
									]))
							]),
						_elm_lang$core$Native_List.fromArray(
							[]));
				}
			case 'I32':
				return _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'I64':
				return _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'F64':
				return _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(_p34._0));
			case 'Date':
				return _elm_lang$html$Html$text(_p34._0);
			case 'DateTime':
				return _elm_lang$html$Html$text(
					_user$project$Field$simpleDate(_p34._0));
			default:
				return _elm_lang$html$Html$text(
					_elm_lang$core$Basics$toString(_elm_lang$html$Html_Attributes$value));
		}
	}
};
var _user$project$Field$createSelectedLookupValue = F3(
	function (fieldList, daoList, model) {
		var keyField = _user$project$Field$getKeyField(fieldList);
		var fields = _user$project$Field$toList(
			_user$project$Field$mostSignificantField(fieldList));
		var selectedRowView = A2(
			_elm_lang$core$List$map,
			function (dao) {
				return A4(_user$project$Field$createSelectedReadRow, fields, keyField, dao, model);
			},
			daoList);
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[]),
			selectedRowView);
	});
var _user$project$Field$createSelectedReadRow = F4(
	function (fields, keyField, dao, model) {
		return A2(
			_elm_lang$html$Html$div,
			_elm_lang$core$Native_List.fromArray(
				[]),
			A2(
				_elm_lang$core$List$map,
				function (f) {
					var _p37 = keyField;
					if (_p37.ctor === 'Just') {
						var _p38 = A2(_user$project$Field$getValue, _p37._0, dao);
						if (_p38.ctor === 'Just') {
							var fieldModel = _user$project$Field$create(f);
							var updatedModel = function () {
								var _p39 = A2(_user$project$Field$getValue, f, dao);
								if (_p39.ctor === 'Just') {
									return _elm_lang$core$Native_Utils.update(
										fieldModel,
										{value: _p39._0, presentation: _user$project$Field$List, mode: _user$project$Field$Read});
								} else {
									return model;
								}
							}();
							return _elm_lang$core$Native_Utils.eq(_p38._0, model.value) ? _user$project$Field$view(updatedModel) : _elm_lang$html$Html$text('');
						} else {
							return _elm_lang$html$Html$text('No pk value');
						}
					} else {
						return _elm_lang$html$Html$text('no pk');
					}
				},
				fields));
	});

var _user$project$Row$toList = function (arg) {
	var _p0 = arg;
	if (_p0.ctor === 'Just') {
		return _elm_lang$core$Native_List.fromArray(
			[_p0._0]);
	} else {
		return _elm_lang$core$Native_List.fromArray(
			[]);
	}
};
var _user$project$Row$filterFieldModelsWithDensity = function (model) {
	var _p1 = model.density;
	switch (_p1.ctor) {
		case 'Compact':
			return _user$project$Row$toList(
				_user$project$Field$mostSignificantModel(model.fieldModels));
		case 'Medium':
			return _user$project$Field$significantModels(model.fieldModels);
		default:
			return model.fieldModels;
	}
};
var _user$project$Row$filterFieldsWithDensity = F2(
	function (fields, density) {
		var _p2 = density;
		switch (_p2.ctor) {
			case 'Compact':
				return _user$project$Row$toList(
					_user$project$Field$mostSignificantField(fields));
			case 'Medium':
				return _user$project$Field$significantFields(fields);
			default:
				return fields;
		}
	});
var _user$project$Row$onDoubleCheckNoPropagate = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'dblclick',
		_elm_lang$core$Native_Utils.update(
			_elm_lang$html$Html_Events$defaultOptions,
			{stopPropagation: true}),
		A2(_elm_lang$core$Json_Decode$map, msg, _elm_lang$html$Html_Events$targetChecked));
};
var _user$project$Row$onCheckNoPropagate = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'click',
		_elm_lang$core$Native_Utils.update(
			_elm_lang$html$Html_Events$defaultOptions,
			{stopPropagation: true}),
		A2(_elm_lang$core$Json_Decode$map, msg, _elm_lang$html$Html_Events$targetChecked));
};
var _user$project$Row$updateFields = F2(
	function (fieldMsg, model) {
		var updatedFields = A2(
			_elm_lang$core$List$map,
			function (f) {
				var _p3 = A2(_user$project$Field$update, fieldMsg, f);
				var updatedField = _p3._0;
				var cmd = _p3._1;
				return updatedField;
			},
			model.fieldModels);
		return _elm_lang$core$Native_Utils.update(
			model,
			{fieldModels: updatedFields});
	});
var _user$project$Row$updateLookupFields = F2(
	function (fieldMsg, model) {
		var updatedFields = A2(
			_elm_lang$core$List$map,
			function (f) {
				if (_elm_lang$core$Native_Utils.eq(f.field.reference, 'Table')) {
					var _p4 = A2(_user$project$Field$update, fieldMsg, f);
					var updatedField = _p4._0;
					var cmd = _p4._1;
					return updatedField;
				} else {
					return f;
				}
			},
			model.fieldModels);
		return _elm_lang$core$Native_Utils.update(
			model,
			{fieldModels: updatedFields});
	});
var _user$project$Row$update = F2(
	function (msg, model) {
		var _p5 = msg;
		switch (_p5.ctor) {
			case 'ChangeMode':
				var _p7 = _p5._0;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							mode: _p7,
							fieldModels: A2(
								_elm_lang$core$List$map,
								function (f) {
									var _p6 = A2(
										_user$project$Field$update,
										_user$project$Field$ChangeMode(_p7),
										f);
									var mr = _p6._0;
									var cmd = _p6._1;
									return mr;
								},
								model.fieldModels)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangePresentation':
				var _p9 = _p5._0;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							presentation: _p9,
							fieldModels: A2(
								_elm_lang$core$List$map,
								function (f) {
									var _p8 = A2(
										_user$project$Field$update,
										_user$project$Field$ChangePresentation(_p9),
										f);
									var mr = _p8._0;
									var cmd = _p8._1;
									return mr;
								},
								model.fieldModels)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangeDensity':
				var _p11 = _p5._0;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							density: _p11,
							fieldModels: A2(
								_elm_lang$core$List$map,
								function (f) {
									var _p10 = A2(
										_user$project$Field$update,
										_user$project$Field$ChangeDensity(_p11),
										f);
									var mr = _p10._0;
									var cmd = _p10._1;
									return mr;
								},
								model.fieldModels)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'UpdateField':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							fieldModels: A2(
								_elm_lang$core$List$map,
								function (f) {
									if (_elm_lang$core$Native_Utils.eq(f.field.column, _p5._0)) {
										var _p12 = A2(_user$project$Field$update, _p5._1, f);
										var mr = _p12._0;
										var cmd = _p12._1;
										return mr;
									} else {
										return f;
									}
								},
								model.fieldModels)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'DaoStateReceived':
				var _p15 = _p5._0;
				var fieldModels = A2(
					_elm_lang$core$List$map,
					function (f) {
						var value = A2(_elm_lang$core$Dict$get, f.field.column, _p15.dao);
						var _p13 = value;
						if (_p13.ctor === 'Just') {
							var _p14 = A2(
								_user$project$Field$update,
								_user$project$Field$SetValue(_p13._0),
								f);
							var mo = _p14._0;
							var cmd = _p14._1;
							return mo;
						} else {
							return f;
						}
					},
					model.fieldModels);
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{isFocused: _p15.focused, fieldModels: fieldModels}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Selection':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{isSelected: _p5._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ToggleSelect':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							isSelected: _elm_lang$core$Basics$not(model.isSelected)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'Close':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'FocusRecord':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{isFocused: true}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'LooseFocusRecord':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{isFocused: false}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'LookupTabsReceived':
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Row$updateLookupFields,
						_user$project$Field$LookupTabsReceived(_p5._0),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Row$updateLookupFields,
						_user$project$Field$LookupDataReceived(_p5._0),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Row$onDoubleClickNoPropagate = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'dblclick',
		_elm_lang$core$Native_Utils.update(
			_elm_lang$html$Html_Events$defaultOptions,
			{stopPropagation: true}),
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _user$project$Row$onClickNoPropagate = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'click',
		_elm_lang$core$Native_Utils.update(
			_elm_lang$html$Html_Events$defaultOptions,
			{stopPropagation: true}),
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _user$project$Row$empty = {
	rowId: 0,
	fieldModels: _elm_lang$core$Native_List.fromArray(
		[]),
	mode: _user$project$Field$Read,
	presentation: _user$project$Field$Table,
	density: _user$project$Field$Expanded,
	isFocused: false,
	isSelected: false
};
var _user$project$Row$create = F2(
	function (listFields, rowId) {
		var fieldModels = A2(
			_elm_lang$core$List$map,
			function (f) {
				return _user$project$Field$create(f);
			},
			listFields);
		return _elm_lang$core$Native_Utils.update(
			_user$project$Row$empty,
			{fieldModels: fieldModels, rowId: rowId});
	});
var _user$project$Row$Model = F7(
	function (a, b, c, d, e, f, g) {
		return {rowId: a, fieldModels: b, mode: c, presentation: d, density: e, isFocused: f, isSelected: g};
	});
var _user$project$Row$DaoState = F2(
	function (a, b) {
		return {dao: a, focused: b};
	});
var _user$project$Row$daoStateDecoder = A3(
	_elm_lang$core$Json_Decode$object2,
	_user$project$Row$DaoState,
	A2(_elm_lang$core$Json_Decode_ops[':='], 'dao', _user$project$Field$daoDecoder),
	A2(_elm_lang$core$Json_Decode_ops[':='], 'focused', _elm_lang$core$Json_Decode$bool));
var _user$project$Row$Close = {ctor: 'Close'};
var _user$project$Row$formRecordControls = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-mini btn-default')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Prev'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-left-open')
							]),
						_elm_lang$core$Native_List.fromArray(
							[]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-mini btn-default')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Next'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-right-open')
							]),
						_elm_lang$core$Native_List.fromArray(
							[]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-mini btn-default')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Maximize'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-resize-full')
							]),
						_elm_lang$core$Native_List.fromArray(
							[]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-mini btn-default'),
						_elm_lang$html$Html_Events$onClick(_user$project$Row$Close)
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Close'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-cancel')
							]),
						_elm_lang$core$Native_List.fromArray(
							[]))
					]))
			]));
};
var _user$project$Row$LookupDataReceived = function (a) {
	return {ctor: 'LookupDataReceived', _0: a};
};
var _user$project$Row$LookupTabsReceived = function (a) {
	return {ctor: 'LookupTabsReceived', _0: a};
};
var _user$project$Row$LooseFocusRecord = {ctor: 'LooseFocusRecord'};
var _user$project$Row$FocusRecord = {ctor: 'FocusRecord'};
var _user$project$Row$ToggleSelect = {ctor: 'ToggleSelect'};
var _user$project$Row$Selection = function (a) {
	return {ctor: 'Selection', _0: a};
};
var _user$project$Row$DaoStateReceived = function (a) {
	return {ctor: 'DaoStateReceived', _0: a};
};
var _user$project$Row$ChangeDensity = function (a) {
	return {ctor: 'ChangeDensity', _0: a};
};
var _user$project$Row$UpdateField = F2(
	function (a, b) {
		return {ctor: 'UpdateField', _0: a, _1: b};
	});
var _user$project$Row$ChangePresentation = function (a) {
	return {ctor: 'ChangePresentation', _0: a};
};
var _user$project$Row$ChangeMode = function (a) {
	return {ctor: 'ChangeMode', _0: a};
};
var _user$project$Row$rowControls = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text(
				_elm_lang$core$Basics$toString(model.rowId)),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangeMode(_user$project$Field$Edit))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Edit')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangeMode(_user$project$Field$Read))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Read')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangePresentation(_user$project$Field$Table))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Table')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangePresentation(_user$project$Field$Form))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Form')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangePresentation(_user$project$Field$Grid))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Grid')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangePresentation(_user$project$Field$List))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('List')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangeDensity(_user$project$Field$Compact))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Compact')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangeDensity(_user$project$Field$Medium))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Medium')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Row$ChangeDensity(_user$project$Field$Expanded))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Expanded')
					]))
			]));
};
var _user$project$Row$tabularRecordControls = function (model) {
	var modificationControls = function () {
		var _p16 = model.mode;
		if (_p16.ctor === 'Read') {
			return A2(
				_elm_lang$html$Html$td,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('record_control')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-menu tooltip'),
								_elm_lang$html$Html_Events$onClick(
								_user$project$Row$ChangePresentation(_user$project$Field$Form))
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$span,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('tooltiptext')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('Click to open record in a form')
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-pencil tooltip'),
								_elm_lang$html$Html_Events$onClick(
								_user$project$Row$ChangeMode(_user$project$Field$Edit))
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$span,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('tooltiptext')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('Click to edit record in the grid')
									]))
							]))
					]));
		} else {
			return A2(
				_elm_lang$html$Html$td,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('record_control')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-block tooltip'),
								_elm_lang$html$Html_Events$onClick(
								_user$project$Row$ChangeMode(_user$project$Field$Read))
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$span,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('tooltiptext')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('Click to cancel your changes')
									]))
							])),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-floppy tooltip'),
								_elm_lang$html$Html_Events$onClick(
								_user$project$Row$ChangeMode(_user$project$Field$Read))
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$span,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('tooltiptext')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text('Click to save your changes to the database')
									]))
							]))
					]));
		}
	}();
	var selection = function () {
		var tooltipText = model.isSelected ? 'Click to unselect this record' : 'Click to select this record';
		return A2(
			_elm_lang$html$Html$td,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('tooltip'),
					_user$project$Row$onClickNoPropagate(_user$project$Row$ToggleSelect),
					_user$project$Row$onDoubleClickNoPropagate(_user$project$Row$ToggleSelect)
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('checkbox'),
							_elm_lang$html$Html_Attributes$checked(model.isSelected),
							_user$project$Row$onCheckNoPropagate(_user$project$Row$Selection),
							_user$project$Row$onDoubleCheckNoPropagate(_user$project$Row$Selection)
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$html$Html$span,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('tooltiptext')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html$text(tooltipText)
						]))
				]));
	}();
	return A2(
		_elm_lang$core$List_ops['::'],
		selection,
		_elm_lang$core$Native_List.fromArray(
			[modificationControls]));
};
var _user$project$Row$view = function (model) {
	var fieldModels = _user$project$Row$filterFieldModelsWithDensity(model);
	var _p17 = model.presentation;
	switch (_p17.ctor) {
		case 'Form':
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Row$formRecordControls(model),
						A2(
						_elm_lang$html$Html$form,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$style(
								_elm_lang$core$Native_List.fromArray(
									[
										{ctor: '_Tuple2', _0: 'display', _1: 'flex'},
										{ctor: '_Tuple2', _0: 'flex-wrap', _1: 'wrap'},
										{ctor: '_Tuple2', _0: 'align-items', _1: 'flex-end'}
									]))
							]),
						A2(
							_elm_lang$core$List$map,
							function (f) {
								return A2(
									_elm_lang$html$Html_App$map,
									_user$project$Row$UpdateField(f.field.column),
									_user$project$Field$view(f));
							},
							fieldModels))
					]));
		case 'Table':
			return A2(
				_elm_lang$html$Html$tr,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onDoubleClick(
						_user$project$Row$ChangePresentation(_user$project$Field$Form)),
						_elm_lang$html$Html_Events$onClick(_user$project$Row$FocusRecord),
						_elm_lang$html$Html_Attributes$classList(
						_elm_lang$core$Native_List.fromArray(
							[
								{ctor: '_Tuple2', _0: 'focused', _1: model.isFocused},
								{ctor: '_Tuple2', _0: 'selected', _1: model.isSelected}
							]))
					]),
				A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$Row$tabularRecordControls(model),
					A2(
						_elm_lang$core$List$map,
						function (f) {
							return A2(
								_elm_lang$html$Html_App$map,
								_user$project$Row$UpdateField(f.field.column),
								_user$project$Field$view(f));
						},
						fieldModels)));
		case 'Grid':
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Row$rowControls(model),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$style(
								_elm_lang$core$Native_List.fromArray(
									[
										{ctor: '_Tuple2', _0: 'border', _1: '1px solid green'},
										{ctor: '_Tuple2', _0: 'width', _1: '200px'}
									]))
							]),
						A2(
							_elm_lang$core$List$map,
							function (f) {
								return A2(
									_elm_lang$html$Html_App$map,
									_user$project$Row$UpdateField(f.field.name),
									_user$project$Field$view(f));
							},
							fieldModels))
					]));
		default:
			return A2(
				_elm_lang$html$Html$option,
				_elm_lang$core$Native_List.fromArray(
					[]),
				A2(
					_elm_lang$core$List$map,
					function (f) {
						return A2(
							_elm_lang$html$Html_App$map,
							_user$project$Row$UpdateField(f.field.name),
							_user$project$Field$view(f));
					},
					fieldModels));
	}
};

var _user$project$Tab$updateAllRows = F2(
	function (rowMsg, model) {
		var rows = A2(
			_elm_lang$core$List$map,
			function (r) {
				var _p0 = A2(_user$project$Row$update, rowMsg, r);
				var mr = _p0._0;
				var cmd = _p0._1;
				return mr;
			},
			model.rows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{rows: rows});
	});
var _user$project$Tab$updateRow = F3(
	function (rowMsg, rowId, model) {
		var rows = A2(
			_elm_lang$core$List$map,
			function (r) {
				if (_elm_lang$core$Native_Utils.eq(r.rowId, rowId)) {
					var _p1 = A2(_user$project$Row$update, rowMsg, r);
					var mr = _p1._0;
					var cmd = _p1._1;
					return mr;
				} else {
					return r;
				}
			},
			model.rows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{rows: rows});
	});
var _user$project$Tab$completeTableName = function (tab) {
	var _p2 = tab.schema;
	if (_p2.ctor === 'Just') {
		return A2(
			_elm_lang$core$Basics_ops['++'],
			_p2._0,
			A2(_elm_lang$core$Basics_ops['++'], '.', tab.table));
	} else {
		return tab.table;
	}
};
var _user$project$Tab$buildLookupField = function (tabList) {
	return A2(
		_elm_lang$core$List$map,
		function (t) {
			return A2(
				_user$project$Field$newLookupTab,
				_user$project$Tab$completeTableName(t),
				t.fields);
		},
		tabList);
};
var _user$project$Tab$removeFocusedRecord = function (model) {
	var updatedRows = A2(
		_elm_lang$core$List$map,
		function (r) {
			var _p3 = A2(_user$project$Row$update, _user$project$Row$LooseFocusRecord, r);
			var mo = _p3._0;
			var cmd = _p3._1;
			return mo;
		},
		model.rows);
	return _elm_lang$core$Native_Utils.update(
		model,
		{rows: updatedRows, focusedRow: _elm_lang$core$Maybe$Nothing});
};
var _user$project$Tab$updateSelectionAllRecords = F2(
	function (model, checked) {
		var rows = A2(
			_elm_lang$core$List$map,
			function (r) {
				var _p4 = A2(
					_user$project$Row$update,
					_user$project$Row$Selection(checked),
					r);
				var mo = _p4._0;
				var cmd = _p4._1;
				return mo;
			},
			model.rows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{rows: rows});
	});
var _user$project$Tab$updateFocusedRow = F2(
	function (model, rowId) {
		var model = A2(_user$project$Tab$updateSelectionAllRecords, model, false);
		var updatedRows = A2(
			_elm_lang$core$List$map,
			function (r) {
				if (_elm_lang$core$Native_Utils.eq(r.rowId, rowId)) {
					var _p5 = A2(_user$project$Row$update, _user$project$Row$FocusRecord, r);
					var mo = _p5._0;
					var cmd = _p5._1;
					return mo;
				} else {
					var _p6 = A2(_user$project$Row$update, _user$project$Row$LooseFocusRecord, r);
					var mo = _p6._0;
					var cmd = _p6._1;
					return mo;
				}
			},
			model.rows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				rows: updatedRows,
				focusedRow: _elm_lang$core$Maybe$Just(rowId)
			});
	});
var _user$project$Tab$focusedRow = function (model) {
	var _p7 = model.focusedRow;
	if (_p7.ctor === 'Nothing') {
		return _elm_lang$core$Maybe$Nothing;
	} else {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (r) {
					return _elm_lang$core$Native_Utils.eq(r.rowId, _p7._0);
				},
				model.rows));
	}
};
var _user$project$Tab$updateMode = F2(
	function (model, mode) {
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				model,
				{
					mode: mode,
					rows: A2(
						_elm_lang$core$List$map,
						function (r) {
							var _p8 = A2(
								_user$project$Row$update,
								_user$project$Row$ChangeMode(mode),
								r);
							var mr = _p8._0;
							var cmd = _p8._1;
							return mr;
						},
						model.rows)
				}),
			_1: _elm_lang$core$Platform_Cmd$none
		};
	});
var _user$project$Tab$updatePresentation = F2(
	function (model, presentation) {
		return {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Native_Utils.update(
				model,
				{
					presentation: presentation,
					rows: A2(
						_elm_lang$core$List$map,
						function (r) {
							var _p9 = A2(
								_user$project$Row$update,
								_user$project$Row$ChangePresentation(presentation),
								r);
							var mr = _p9._0;
							var cmd = _p9._1;
							return mr;
						},
						model.rows)
				}),
			_1: _elm_lang$core$Platform_Cmd$none
		};
	});
var _user$project$Tab$update = F2(
	function (msg, model) {
		var _p10 = msg;
		switch (_p10.ctor) {
			case 'UpdateRow':
				var _p18 = _p10._1;
				var _p17 = _p10._0;
				var _p11 = _p18;
				switch (_p11.ctor) {
					case 'ChangePresentation':
						var _p15 = _p11._0;
						var _p12 = _p15;
						if (_p12.ctor === 'Form') {
							var _p13 = A2(_user$project$Tab$updatePresentation, model, _p15);
							var mo = _p13._0;
							var cmd = _p13._1;
							var _p14 = A2(_user$project$Tab$updateMode, mo, _user$project$Field$Edit);
							var mo2 = _p14._0;
							var cmd2 = _p14._1;
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Native_Utils.update(
									mo2,
									{
										focusedRow: _elm_lang$core$Maybe$Just(_p17),
										mode: _user$project$Field$Edit
									}),
								_1: cmd2
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: A3(_user$project$Tab$updateRow, _p18, _p17, model),
								_1: _elm_lang$core$Platform_Cmd$none
							};
						}
					case 'Close':
						var _p16 = A2(_user$project$Tab$updatePresentation, model, _user$project$Field$Table);
						var mo = _p16._0;
						var cmd = _p16._1;
						return A2(_user$project$Tab$updateMode, mo, _user$project$Field$Read);
					case 'FocusRecord':
						return {
							ctor: '_Tuple2',
							_0: A2(_user$project$Tab$updateFocusedRow, model, _p17),
							_1: _elm_lang$core$Platform_Cmd$none
						};
					case 'Selection':
						var updatedModel = _user$project$Tab$removeFocusedRecord(model);
						return {
							ctor: '_Tuple2',
							_0: A3(_user$project$Tab$updateRow, _p18, _p17, updatedModel),
							_1: _elm_lang$core$Platform_Cmd$none
						};
					default:
						return {
							ctor: '_Tuple2',
							_0: A3(_user$project$Tab$updateRow, _p18, _p17, model),
							_1: _elm_lang$core$Platform_Cmd$none
						};
				}
			case 'ChangeMode':
				return A2(_user$project$Tab$updateMode, model, _p10._0);
			case 'ChangePresentation':
				return A2(_user$project$Tab$updatePresentation, model, _p10._0);
			case 'ChangeDensity':
				var _p20 = _p10._0;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							density: _p20,
							rows: A2(
								_elm_lang$core$List$map,
								function (r) {
									var _p19 = A2(
										_user$project$Row$update,
										_user$project$Row$ChangeDensity(_p20),
										r);
									var mr = _p19._0;
									var cmd = _p19._1;
									return mr;
								},
								model.rows)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'TabReceived':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{fields: _p10._0.fields}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'TabDataReceived':
				var rows = A2(
					_elm_lang$core$List$indexedMap,
					F2(
						function (index, daoState) {
							var newRow = A2(_user$project$Row$create, model.fields, model.uid + index);
							var _p21 = A2(
								_user$project$Row$update,
								_user$project$Row$DaoStateReceived(daoState),
								newRow);
							var mo = _p21._0;
							var cmd = _p21._1;
							return mo;
						}),
					_p10._0);
				var firstRow = A2(
					_elm_lang$core$Maybe$withDefault,
					_user$project$Row$empty,
					_elm_lang$core$List$head(model.rows));
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							rows: rows,
							uid: model.uid + _elm_lang$core$List$length(rows)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'SelectionAll':
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Tab$updateAllRows,
						_user$project$Row$Selection(_p10._0),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'LookupTabsReceived':
				var listLookupFields = _user$project$Tab$buildLookupField(_p10._0);
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Tab$updateAllRows,
						_user$project$Row$LookupTabsReceived(listLookupFields),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Tab$updateAllRows,
						_user$project$Row$LookupDataReceived(_p10._0),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Tab$paging = A2(
	_elm_lang$html$Html$div,
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_lang$html$Html_Attributes$class('btn-group')
		]),
	_elm_lang$core$Native_List.fromArray(
		[
			A2(
			_elm_lang$html$Html$button,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('btn btn-large btn-default')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$span,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('icon icon-left-open icon-text')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					_elm_lang$html$Html$text('prev')
				])),
			A2(
			_elm_lang$html$Html$button,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('btn btn-large btn-default')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$span,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('icon icon-right-open icon-text')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					_elm_lang$html$Html$text('next')
				])),
			A2(
			_elm_lang$html$Html$button,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('btn btn-large btn-default')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$span,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('icon icon-arrows-ccw icon-text')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					_elm_lang$html$Html$text('refresh')
				]))
		]));
var _user$project$Tab$numberOfSelectedRecords = function (model) {
	return _elm_lang$core$List$length(
		A2(
			_elm_lang$core$List$filter,
			function (r) {
				return r.isSelected;
			},
			model.rows));
};
var _user$project$Tab$tabFilters = F2(
	function (model, filteredFields) {
		var selected = _user$project$Tab$numberOfSelectedRecords(model);
		var selectedStr = (_elm_lang$core$Native_Utils.cmp(selected, 0) > 0) ? _elm_lang$core$Basics$toString(selected) : '';
		var rows = _elm_lang$core$List$length(model.rows);
		return A2(
			_elm_lang$html$Html$tr,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('tab_filters'),
					_elm_lang$html$Html_Attributes$style(
					_elm_lang$core$Native_List.fromArray(
						[
							{ctor: '_Tuple2', _0: 'background-color', _1: '#fefefe'}
						]))
				]),
			A2(
				_elm_lang$core$Basics_ops['++'],
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$th,
						_elm_lang$core$Native_List.fromArray(
							[]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text(selectedStr)
							])),
						A2(
						_elm_lang$html$Html$th,
						_elm_lang$core$Native_List.fromArray(
							[]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text(
								_elm_lang$core$Basics$toString(rows)),
								A2(
								_elm_lang$html$Html$span,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('tooltip')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$i,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$style(
												_elm_lang$core$Native_List.fromArray(
													[
														{ctor: '_Tuple2', _0: 'margin-left', _1: '10px'}
													])),
												_elm_lang$html$Html_Attributes$class('icon ion-funnel')
											]),
										_elm_lang$core$Native_List.fromArray(
											[])),
										A2(
										_elm_lang$html$Html$span,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('tooltiptext')
											]),
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html$text('Click to clear filter')
											]))
									]))
							]))
					]),
				A2(
					_elm_lang$core$List$map,
					function (f) {
						return A2(
							_elm_lang$html$Html$th,
							_elm_lang$core$Native_List.fromArray(
								[
									_user$project$Field$alignment(f)
								]),
							_elm_lang$core$Native_List.fromArray(
								[
									A2(
									_elm_lang$html$Html$input,
									_elm_lang$core$Native_List.fromArray(
										[
											_elm_lang$html$Html_Attributes$style(
											_elm_lang$core$Native_List.fromArray(
												[
													{ctor: '_Tuple2', _0: 'width', _1: '300px'}
												])),
											_elm_lang$html$Html_Attributes$type$('text'),
											_user$project$Field$alignment(f)
										]),
									_elm_lang$core$Native_List.fromArray(
										[]))
								]));
					},
					filteredFields)));
	});
var _user$project$Tab$areAllRecordSelected = function (model) {
	var rows = _elm_lang$core$List$length(model.rows);
	var selected = _user$project$Tab$numberOfSelectedRecords(model);
	return (_elm_lang$core$Native_Utils.cmp(rows, 0) > 0) && _elm_lang$core$Native_Utils.eq(selected, rows);
};
var _user$project$Tab$empty = {
	name: '',
	table: '',
	rows: _elm_lang$core$Native_List.fromArray(
		[]),
	mode: _user$project$Field$Read,
	fields: _elm_lang$core$Native_List.fromArray(
		[]),
	presentation: _user$project$Field$Table,
	density: _user$project$Field$Expanded,
	isOpen: true,
	page: 0,
	pageSize: 15,
	uid: 0,
	focusedRow: _elm_lang$core$Maybe$Nothing
};
var _user$project$Tab$create = function (tab) {
	return _elm_lang$core$Native_Utils.update(
		_user$project$Tab$empty,
		{fields: tab.fields, name: tab.name, table: tab.table});
};
var _user$project$Tab$lookupDataDecoder = A2(
	_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
		_elm_lang$core$Json_Decode$succeed(_user$project$Field$LookupData),
		A2(_elm_lang$core$Json_Decode_ops[':='], 'table', _elm_lang$core$Json_Decode$string)),
	A2(
		_elm_lang$core$Json_Decode_ops[':='],
		'dao_list',
		_elm_lang$core$Json_Decode$list(_user$project$Field$daoDecoder)));
var _user$project$Tab$Model = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return {name: a, table: b, rows: c, mode: d, fields: e, presentation: f, density: g, isOpen: h, page: i, pageSize: j, uid: k, focusedRow: l};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Tab$Tab = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return function (k) {
											return function (l) {
												return function (m) {
													return function (n) {
														return function (o) {
															return {name: a, isOwned: b, isExtension: c, isHasOne: d, isHasMany: e, isDirect: f, linkerTable: g, description: h, info: i, table: j, schema: k, fields: l, logo: m, icon: n, pageSize: o};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var _user$project$Tab$tabDecoder = A2(
	_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
	A2(
		_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
		A2(
			_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
			A2(
				_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
				A2(
					_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
					A2(
						_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
						A2(
							_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
							A2(
								_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
								A2(
									_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
									A2(
										_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
										A2(
											_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
											A2(
												_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
												A2(
													_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
													A2(
														_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
														A2(
															_elm_community$elm_json_extra$Json_Decode_Extra_ops['|:'],
															_elm_lang$core$Json_Decode$succeed(_user$project$Tab$Tab),
															A2(_elm_lang$core$Json_Decode_ops[':='], 'name', _elm_lang$core$Json_Decode$string)),
														A2(_elm_lang$core$Json_Decode_ops[':='], 'is_owned', _elm_lang$core$Json_Decode$bool)),
													A2(_elm_lang$core$Json_Decode_ops[':='], 'is_extension', _elm_lang$core$Json_Decode$bool)),
												A2(_elm_lang$core$Json_Decode_ops[':='], 'is_has_one', _elm_lang$core$Json_Decode$bool)),
											A2(_elm_lang$core$Json_Decode_ops[':='], 'is_has_many', _elm_lang$core$Json_Decode$bool)),
										A2(_elm_lang$core$Json_Decode_ops[':='], 'is_direct', _elm_lang$core$Json_Decode$bool)),
									_elm_lang$core$Json_Decode$maybe(
										A2(_elm_lang$core$Json_Decode_ops[':='], 'linker_table', _elm_lang$core$Json_Decode$string))),
								_elm_lang$core$Json_Decode$maybe(
									A2(_elm_lang$core$Json_Decode_ops[':='], 'description', _elm_lang$core$Json_Decode$string))),
							_elm_lang$core$Json_Decode$maybe(
								A2(_elm_lang$core$Json_Decode_ops[':='], 'info', _elm_lang$core$Json_Decode$string))),
						A2(_elm_lang$core$Json_Decode_ops[':='], 'table', _elm_lang$core$Json_Decode$string)),
					_elm_lang$core$Json_Decode$maybe(
						A2(_elm_lang$core$Json_Decode_ops[':='], 'schema', _elm_lang$core$Json_Decode$string))),
				A2(
					_elm_lang$core$Json_Decode_ops[':='],
					'fields',
					_elm_lang$core$Json_Decode$list(_user$project$Field$fieldDecoder))),
			_elm_lang$core$Json_Decode$maybe(
				A2(_elm_lang$core$Json_Decode_ops[':='], 'logo', _elm_lang$core$Json_Decode$string))),
		_elm_lang$core$Json_Decode$maybe(
			A2(_elm_lang$core$Json_Decode_ops[':='], 'icon', _elm_lang$core$Json_Decode$string))),
	_elm_lang$core$Json_Decode$maybe(
		A2(_elm_lang$core$Json_Decode_ops[':='], 'page_size', _elm_lang$core$Json_Decode$int)));
var _user$project$Tab$LookupDataReceived = function (a) {
	return {ctor: 'LookupDataReceived', _0: a};
};
var _user$project$Tab$LookupTabsReceived = function (a) {
	return {ctor: 'LookupTabsReceived', _0: a};
};
var _user$project$Tab$SelectionAll = function (a) {
	return {ctor: 'SelectionAll', _0: a};
};
var _user$project$Tab$recordControlsHead = function (model) {
	var allSelected = _user$project$Tab$areAllRecordSelected(model);
	var unselect = allSelected ? 'unselect' : 'select';
	var rows = _elm_lang$core$List$length(model.rows);
	var tooltipText = A2(
		_elm_lang$core$Basics_ops['++'],
		'Click to ',
		A2(
			_elm_lang$core$Basics_ops['++'],
			unselect,
			A2(
				_elm_lang$core$Basics_ops['++'],
				' ',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_elm_lang$core$Basics$toString(rows),
					' record(s)'))));
	return _elm_lang$core$Native_List.fromArray(
		[
			A2(
			_elm_lang$html$Html$th,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('tooltip')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$input,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$type$('checkbox'),
							_elm_lang$html$Html_Events$onCheck(_user$project$Tab$SelectionAll),
							_elm_lang$html$Html_Attributes$checked(allSelected)
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					A2(
					_elm_lang$html$Html$span,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('tooltiptext')
						]),
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html$text(tooltipText)
						]))
				])),
			A2(
			_elm_lang$html$Html$th,
			_elm_lang$core$Native_List.fromArray(
				[]),
			_elm_lang$core$Native_List.fromArray(
				[]))
		]);
};
var _user$project$Tab$theadView = function (model) {
	var filteredFields = A2(_user$project$Row$filterFieldsWithDensity, model.fields, model.density);
	return A2(
		_elm_lang$html$Html$thead,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(_user$project$Tab$tabFilters, model, filteredFields),
				A2(
				_elm_lang$html$Html$tr,
				_elm_lang$core$Native_List.fromArray(
					[]),
				A2(
					_elm_lang$core$Basics_ops['++'],
					_user$project$Tab$recordControlsHead(model),
					A2(
						_elm_lang$core$List$map,
						function (f) {
							return A2(
								_elm_lang$html$Html$th,
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Field$alignment(f)
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html$text(f.name)
									]));
						},
						filteredFields)))
			]));
};
var _user$project$Tab$TabDataReceived = function (a) {
	return {ctor: 'TabDataReceived', _0: a};
};
var _user$project$Tab$TabReceived = function (a) {
	return {ctor: 'TabReceived', _0: a};
};
var _user$project$Tab$UpdateRow = F2(
	function (a, b) {
		return {ctor: 'UpdateRow', _0: a, _1: b};
	});
var _user$project$Tab$ChangeDensity = function (a) {
	return {ctor: 'ChangeDensity', _0: a};
};
var _user$project$Tab$ChangePresentation = function (a) {
	return {ctor: 'ChangePresentation', _0: a};
};
var _user$project$Tab$ChangeMode = function (a) {
	return {ctor: 'ChangeMode', _0: a};
};
var _user$project$Tab$tabControls = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeMode(_user$project$Field$Edit))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Edit All rows')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeMode(_user$project$Field$Read))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Read All rows')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangePresentation(_user$project$Field$Table))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Table All rows')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangePresentation(_user$project$Field$Form))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Form All rows')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangePresentation(_user$project$Field$Grid))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Grid All rows')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangePresentation(_user$project$Field$List))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('List All rows')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeDensity(_user$project$Field$Compact))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Compact All')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeDensity(_user$project$Field$Medium))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Medium All')
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeDensity(_user$project$Field$Expanded))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Expanded All')
					]))
			]));
};
var _user$project$Tab$toolbar = function (model) {
	var deleteTooltip = function () {
		var _p22 = model.presentation;
		if (_p22.ctor === 'Table') {
			return A2(
				_elm_lang$core$Basics_ops['++'],
				'Click to delete ',
				A2(
					_elm_lang$core$Basics_ops['++'],
					_elm_lang$core$Basics$toString(
						_user$project$Tab$numberOfSelectedRecords(model)),
					' record(s) from the database'));
		} else {
			return 'Click to delete this record from the database';
		}
	}();
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('btn-group')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-plus icon-text tab-action')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('New record'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Create a new record in a form')
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip'),
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeMode(_user$project$Field$Read))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-list-add icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Insert row'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Insert row')
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip'),
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangeMode(_user$project$Field$Read))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-floppy icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Save'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Save record into the database')
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip'),
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangePresentation(_user$project$Field$Table))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-cancel icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Close'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Close the current record and return to grid view')
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip'),
						_elm_lang$html$Html_Events$onClick(
						_user$project$Tab$ChangePresentation(_user$project$Field$Table))
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-block icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Cancel'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Cancel changes and return to the last saved state')
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-trash icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Delete'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text(deleteTooltip)
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-arrows-ccw icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Refresh'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Refresh the current data from the database')
							]))
					])),
				A2(
				_elm_lang$html$Html$button,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('btn btn-large btn-default tooltip')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('icon icon-export icon-text')
							]),
						_elm_lang$core$Native_List.fromArray(
							[])),
						_elm_lang$html$Html$text('Export'),
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('tooltiptext')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Export to spreadsheet')
							]))
					]))
			]));
};
var _user$project$Tab$view = function (model) {
	var background = _elm_lang$html$Html_Attributes$style(
		_elm_lang$core$Native_List.fromArray(
			[
				{ctor: '_Tuple2', _0: 'background-color', _1: '#fcfcfc'}
			]));
	var _p23 = model.presentation;
	switch (_p23.ctor) {
		case 'Form':
			var focused = _user$project$Tab$focusedRow(model);
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Tab$tabControls(model),
						_user$project$Tab$toolbar(model),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('form'),
								background
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								function () {
								var _p24 = focused;
								if (_p24.ctor === 'Just') {
									var _p25 = _p24._0;
									return A2(
										_elm_lang$html$Html_App$map,
										_user$project$Tab$UpdateRow(_p25.rowId),
										_user$project$Row$view(_p25));
								} else {
									return A2(
										_elm_lang$html$Html$div,
										_elm_lang$core$Native_List.fromArray(
											[]),
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html$text('No record selected')
											]));
								}
							}()
							]))
					]));
		case 'Table':
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Tab$tabControls(model),
						_user$project$Tab$toolbar(model),
						A2(
						_elm_lang$html$Html$table,
						_elm_lang$core$Native_List.fromArray(
							[background]),
						_elm_lang$core$Native_List.fromArray(
							[
								_user$project$Tab$theadView(model),
								A2(
								_elm_lang$html$Html$tbody,
								_elm_lang$core$Native_List.fromArray(
									[]),
								A2(
									_elm_lang$core$List$map,
									function (r) {
										return A2(
											_elm_lang$html$Html_App$map,
											_user$project$Tab$UpdateRow(r.rowId),
											_user$project$Row$view(r));
									},
									model.rows))
							])),
						_user$project$Tab$paging
					]));
		case 'Grid':
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Tab$tabControls(model),
						_user$project$Tab$toolbar(model),
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('grid')
							]),
						A2(
							_elm_lang$core$List$map,
							function (r) {
								return A2(
									_elm_lang$html$Html_App$map,
									_user$project$Tab$UpdateRow(r.rowId),
									_user$project$Row$view(r));
							},
							model.rows)),
						_user$project$Tab$paging
					]));
		default:
			return A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$Native_List.fromArray(
					[
						_user$project$Tab$tabControls(model),
						A2(
						_elm_lang$html$Html$select,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('list')
							]),
						A2(
							_elm_lang$core$List$map,
							function (r) {
								return A2(
									_elm_lang$html$Html_App$map,
									_user$project$Tab$UpdateRow(r.rowId),
									_user$project$Row$view(r));
							},
							model.rows))
					]));
	}
};

var _user$project$Window$updateTab = F2(
	function (tab_msg, model) {
		var _p0 = A2(_user$project$Tab$update, tab_msg, model.mainTab);
		var updatedMainTab = _p0._0;
		var cmd = _p0._1;
		return _elm_lang$core$Native_Utils.update(
			model,
			{mainTab: updatedMainTab});
	});
var _user$project$Window$update = F2(
	function (msg, model) {
		var _p1 = msg;
		switch (_p1.ctor) {
			case 'UpdateMainTab':
				var _p5 = _p1._0;
				var _p2 = A2(_elm_lang$core$Debug$log, 'tab_msg', _p5);
				var _p3 = _p5;
				switch (_p3.ctor) {
					case 'ChangePresentation':
						var model = _elm_lang$core$Native_Utils.update(
							model,
							{presentation: _p3._0});
						return {
							ctor: '_Tuple2',
							_0: A2(_user$project$Window$updateTab, _p5, model),
							_1: _elm_lang$core$Platform_Cmd$none
						};
					case 'UpdateRow':
						var _p4 = _p3._1;
						if (_p4.ctor === 'ChangePresentation') {
							var model = _elm_lang$core$Native_Utils.update(
								model,
								{presentation: _p4._0});
							return {
								ctor: '_Tuple2',
								_0: A2(_user$project$Window$updateTab, _p5, model),
								_1: _elm_lang$core$Platform_Cmd$none
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: A2(_user$project$Window$updateTab, _p5, model),
								_1: _elm_lang$core$Platform_Cmd$none
							};
						}
					default:
						return {
							ctor: '_Tuple2',
							_0: A2(_user$project$Window$updateTab, _p5, model),
							_1: _elm_lang$core$Platform_Cmd$none
						};
				}
			case 'WindowDetailReceived':
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Window$updateTab,
						_user$project$Tab$TabReceived(_p1._0.mainTab),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'WindowDataReceived':
				return {
					ctor: '_Tuple2',
					_0: function () {
						var _p6 = _elm_lang$core$List$head(_p1._0);
						if (_p6.ctor === 'Just') {
							return A2(
								_user$project$Window$updateTab,
								_user$project$Tab$TabDataReceived(_p6._0.daoList),
								model);
						} else {
							return model;
						}
					}(),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangeMode':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{mode: _p1._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ChangePresentation':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{presentation: _p1._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ActivateWindow':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{isActive: true}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'DeactivateWindow':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{isActive: false}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'LookupTabsReceived':
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Window$updateTab,
						_user$project$Tab$LookupTabsReceived(_p1._0),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: A2(
						_user$project$Window$updateTab,
						_user$project$Tab$LookupDataReceived(_p1._0),
						model),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Window$hasManyTabView = function (model) {
	return _elm_lang$core$Native_Utils.eq(model.presentation, _user$project$Field$Form) ? A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text('has_many tabs here.. direct and indirect')
			])) : A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text('extenstion not displayed')
			]));
};
var _user$project$Window$extensionTabView = function (model) {
	return _elm_lang$core$Native_Utils.eq(model.presentation, _user$project$Field$Form) ? A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text('extension tab here..')
			])) : A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html$text('extenstion not displayed')
			]));
};
var _user$project$Window$empty = {
	name: '',
	mainTab: _user$project$Tab$empty,
	presentation: _user$project$Field$Table,
	mode: _user$project$Field$Read,
	isActive: true,
	extTabs: _elm_lang$core$Native_List.fromArray(
		[]),
	hasManyTabs: _elm_lang$core$Native_List.fromArray(
		[]),
	hasManyIndirectTabs: _elm_lang$core$Native_List.fromArray(
		[]),
	windowId: 0
};
var _user$project$Window$init = {ctor: '_Tuple2', _0: _user$project$Window$empty, _1: _elm_lang$core$Platform_Cmd$none};
var _user$project$Window$create = F2(
	function (window, windowId) {
		return _elm_lang$core$Native_Utils.update(
			_user$project$Window$empty,
			{
				name: window.name,
				windowId: windowId,
				mainTab: _user$project$Tab$create(window.mainTab)
			});
	});
var _user$project$Window$Model = F9(
	function (a, b, c, d, e, f, g, h, i) {
		return {name: a, mainTab: b, presentation: c, mode: d, isActive: e, extTabs: f, hasManyTabs: g, hasManyIndirectTabs: h, windowId: i};
	});
var _user$project$Window$Window = F8(
	function (a, b, c, d, e, f, g, h) {
		return {name: a, description: b, table: c, schema: d, mainTab: e, extTabs: f, hasManyTabs: g, hasManyIndirectTabs: h};
	});
var _user$project$Window$windowDecoder = A9(
	_elm_lang$core$Json_Decode$object8,
	_user$project$Window$Window,
	A2(_elm_lang$core$Json_Decode_ops[':='], 'name', _elm_lang$core$Json_Decode$string),
	_elm_lang$core$Json_Decode$maybe(
		A2(_elm_lang$core$Json_Decode_ops[':='], 'description', _elm_lang$core$Json_Decode$string)),
	A2(_elm_lang$core$Json_Decode_ops[':='], 'table', _elm_lang$core$Json_Decode$string),
	_elm_lang$core$Json_Decode$maybe(
		A2(_elm_lang$core$Json_Decode_ops[':='], 'schema', _elm_lang$core$Json_Decode$string)),
	A2(_elm_lang$core$Json_Decode_ops[':='], 'main_tab', _user$project$Tab$tabDecoder),
	A2(
		_elm_lang$core$Json_Decode_ops[':='],
		'ext_tabs',
		_elm_lang$core$Json_Decode$list(_user$project$Tab$tabDecoder)),
	A2(
		_elm_lang$core$Json_Decode_ops[':='],
		'has_many_tabs',
		_elm_lang$core$Json_Decode$list(_user$project$Tab$tabDecoder)),
	A2(
		_elm_lang$core$Json_Decode_ops[':='],
		'has_many_indirect_tabs',
		_elm_lang$core$Json_Decode$list(_user$project$Tab$tabDecoder)));
var _user$project$Window$TableDao = F2(
	function (a, b) {
		return {table: a, daoList: b};
	});
var _user$project$Window$tableDaoDecoder = A3(
	_elm_lang$core$Json_Decode$object2,
	_user$project$Window$TableDao,
	A2(_elm_lang$core$Json_Decode_ops[':='], 'table', _elm_lang$core$Json_Decode$string),
	A2(
		_elm_lang$core$Json_Decode_ops[':='],
		'dao_list',
		_elm_lang$core$Json_Decode$list(_user$project$Row$daoStateDecoder)));
var _user$project$Window$DeactivateWindow = {ctor: 'DeactivateWindow'};
var _user$project$Window$ActivateWindow = {ctor: 'ActivateWindow'};
var _user$project$Window$LookupDataReceived = function (a) {
	return {ctor: 'LookupDataReceived', _0: a};
};
var _user$project$Window$LookupTabsReceived = function (a) {
	return {ctor: 'LookupTabsReceived', _0: a};
};
var _user$project$Window$WindowDataReceived = function (a) {
	return {ctor: 'WindowDataReceived', _0: a};
};
var _user$project$Window$WindowDetailReceived = function (a) {
	return {ctor: 'WindowDetailReceived', _0: a};
};
var _user$project$Window$UpdateMainTab = function (a) {
	return {ctor: 'UpdateMainTab', _0: a};
};
var _user$project$Window$view = function (model) {
	return model.isActive ? A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html_App$map,
				_user$project$Window$UpdateMainTab,
				_user$project$Tab$view(model.mainTab)),
				_user$project$Window$extensionTabView(model),
				_user$project$Window$hasManyTabView(model)
			])) : A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[]),
		_elm_lang$core$Native_List.fromArray(
			[]));
};
var _user$project$Window$ChangePresentation = function (a) {
	return {ctor: 'ChangePresentation', _0: a};
};
var _user$project$Window$ChangeMode = function (a) {
	return {ctor: 'ChangeMode', _0: a};
};

var _user$project$WindowList$update = F2(
	function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'WindowListReceived':
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{windowList: _p0._0}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'LoadWindow':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			default:
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							activeWindow: _elm_lang$core$Maybe$Just(_p0._0)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$WindowList$empty = {
	windowList: _elm_lang$core$Native_List.fromArray(
		[]),
	searchText: '',
	activeWindow: _elm_lang$core$Maybe$Nothing
};
var _user$project$WindowList$Model = F3(
	function (a, b, c) {
		return {windowList: a, searchText: b, activeWindow: c};
	});
var _user$project$WindowList$WindowName = F4(
	function (a, b, c, d) {
		return {name: a, description: b, table: c, schema: d};
	});
var _user$project$WindowList$windowNameDecoder = A5(
	_elm_lang$core$Json_Decode$object4,
	_user$project$WindowList$WindowName,
	A2(_elm_lang$core$Json_Decode_ops[':='], 'name', _elm_lang$core$Json_Decode$string),
	_elm_lang$core$Json_Decode$maybe(
		A2(_elm_lang$core$Json_Decode_ops[':='], 'description', _elm_lang$core$Json_Decode$string)),
	A2(_elm_lang$core$Json_Decode_ops[':='], 'table', _elm_lang$core$Json_Decode$string),
	_elm_lang$core$Json_Decode$maybe(
		A2(_elm_lang$core$Json_Decode_ops[':='], 'schema', _elm_lang$core$Json_Decode$string)));
var _user$project$WindowList$windowListDecoder = _elm_lang$core$Json_Decode$list(_user$project$WindowList$windowNameDecoder);
var _user$project$WindowList$UpdateActivated = function (a) {
	return {ctor: 'UpdateActivated', _0: a};
};
var _user$project$WindowList$WindowListReceived = function (a) {
	return {ctor: 'WindowListReceived', _0: a};
};
var _user$project$WindowList$LoadWindow = function (a) {
	return {ctor: 'LoadWindow', _0: a};
};
var _user$project$WindowList$view = function (model) {
	return A2(
		_elm_lang$html$Html$nav,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('nav-group')
			]),
		A2(
			_elm_lang$core$List_ops['::'],
			A2(
				_elm_lang$html$Html$h5,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('nav-group-title')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html$text('Window')
					])),
			A2(
				_elm_lang$core$List$map,
				function (w) {
					var isActive = function () {
						var _p1 = model.activeWindow;
						if (_p1.ctor === 'Just') {
							return _elm_lang$core$Native_Utils.eq(_p1._0, w.table);
						} else {
							return false;
						}
					}();
					return A2(
						_elm_lang$html$Html$a,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$classList(
								_elm_lang$core$Native_List.fromArray(
									[
										{ctor: '_Tuple2', _0: 'nav-group-item', _1: true},
										{ctor: '_Tuple2', _0: 'active', _1: isActive}
									])),
								_elm_lang$html$Html_Attributes$href(
								A2(_elm_lang$core$Basics_ops['++'], '#', w.table)),
								_elm_lang$html$Html_Events$onClick(
								_user$project$WindowList$LoadWindow(w.table))
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$span,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('icon icon-list')
									]),
								_elm_lang$core$Native_List.fromArray(
									[])),
								_elm_lang$html$Html$text(w.name)
							]));
				},
				model.windowList)));
};

var _user$project$Main$httpGet = F2(
	function (model, url) {
		var _p0 = A2(_elm_lang$core$Debug$log, 'Requesting', url);
		return A2(
			_evancz$elm_http$Http$send,
			_evancz$elm_http$Http$defaultSettings,
			{
				verb: 'GET',
				headers: _elm_lang$core$Native_List.fromArray(
					[
						{ctor: '_Tuple2', _0: 'db_url', _1: model.dbUrl}
					]),
				url: A2(_elm_lang$core$Basics_ops['++'], model.apiServer, url),
				body: _evancz$elm_http$Http$empty
			});
	});
var _user$project$Main$getWindowTable = F2(
	function (model, windowId) {
		var window = _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (w) {
					return _elm_lang$core$Native_Utils.eq(w.windowId, windowId);
				},
				model.openedWindows));
		var _p1 = window;
		if (_p1.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(_p1._0.mainTab.table);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
var _user$project$Main$inOpenedWindows = F2(
	function (model, windowId) {
		return _elm_lang$core$Basics$not(
			_elm_lang$core$List$isEmpty(
				A2(
					_elm_lang$core$List$filter,
					function (w) {
						return _elm_lang$core$Native_Utils.eq(w.windowId, windowId);
					},
					model.openedWindows)));
	});
var _user$project$Main$getActiveWindow = function (model) {
	var _p2 = model.activeWindow;
	if (_p2.ctor === 'Just') {
		return _elm_lang$core$List$head(
			A2(
				_elm_lang$core$List$filter,
				function (w) {
					return _elm_lang$core$Native_Utils.eq(w.windowId, _p2._0);
				},
				model.openedWindows));
	} else {
		return _elm_lang$core$Maybe$Nothing;
	}
};
var _user$project$Main$updateActivatedWindowList = function (model) {
	var windowList = function () {
		var _p3 = _user$project$Main$getActiveWindow(model);
		if (_p3.ctor === 'Just') {
			var _p4 = A2(
				_user$project$WindowList$update,
				_user$project$WindowList$UpdateActivated(_p3._0.mainTab.table),
				model.windowList);
			var mo = _p4._0;
			var cmd = _p4._1;
			return mo;
		} else {
			return model.windowList;
		}
	}();
	return _elm_lang$core$Native_Utils.update(
		model,
		{windowList: windowList});
};
var _user$project$Main$deactivateOpenedWindows = function (model) {
	var updatedWindows = A2(
		_elm_lang$core$List$map,
		function (w) {
			var _p5 = A2(_user$project$Window$update, _user$project$Window$DeactivateWindow, w);
			var mo = _p5._0;
			var cmd = _p5._1;
			return mo;
		},
		model.openedWindows);
	return _elm_lang$core$Native_Utils.update(
		model,
		{openedWindows: updatedWindows});
};
var _user$project$Main$activateFirstWindow = function (model) {
	var _p6 = _elm_lang$core$List$head(model.openedWindows);
	if (_p6.ctor === 'Just') {
		var _p8 = _p6._0;
		var _p7 = A2(_user$project$Window$update, _user$project$Window$ActivateWindow, _p8);
		var updatedWindow = _p7._0;
		var cmd = _p7._1;
		var allWindows = A2(
			_elm_lang$core$List_ops['::'],
			updatedWindow,
			A2(
				_elm_lang$core$Maybe$withDefault,
				_elm_lang$core$Native_List.fromArray(
					[]),
				_elm_lang$core$List$tail(model.openedWindows)));
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				activeWindow: _elm_lang$core$Maybe$Just(_p8.windowId),
				openedWindows: allWindows
			});
	} else {
		return model;
	}
};
var _user$project$Main$updateActivatedWindows = function (model) {
	var model = _user$project$Main$deactivateOpenedWindows(model);
	var _p9 = model.activeWindow;
	if (_p9.ctor === 'Just') {
		var _p11 = _p9._0;
		if (A2(_user$project$Main$inOpenedWindows, model, _p11)) {
			var updatedWindows = A2(
				_elm_lang$core$List$map,
				function (w) {
					if (_elm_lang$core$Native_Utils.eq(w.windowId, _p11)) {
						var _p10 = A2(_user$project$Window$update, _user$project$Window$ActivateWindow, w);
						var mo = _p10._0;
						var cmd = _p10._1;
						return mo;
					} else {
						return w;
					}
				},
				model.openedWindows);
			return _elm_lang$core$Native_Utils.update(
				model,
				{openedWindows: updatedWindows});
		} else {
			return _user$project$Main$activateFirstWindow(model);
		}
	} else {
		return model;
	}
};
var _user$project$Main$updateWindow = F3(
	function (model, windowMsg, windowId) {
		var updatedWindows = A2(
			_elm_lang$core$List$map,
			function (w) {
				if (_elm_lang$core$Native_Utils.eq(w.windowId, windowId)) {
					var _p12 = A2(_user$project$Window$update, windowMsg, w);
					var mo = _p12._0;
					var cmd = _p12._1;
					return mo;
				} else {
					return w;
				}
			},
			model.openedWindows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{openedWindows: updatedWindows});
	});
var _user$project$Main$closeWindow = F2(
	function (model, windowId) {
		var openedWindows = A2(
			_elm_lang$core$List$filter,
			function (w) {
				return !_elm_lang$core$Native_Utils.eq(w.windowId, windowId);
			},
			model.openedWindows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{openedWindows: openedWindows});
	});
var _user$project$Main$addWindow = F2(
	function (model, window) {
		var newWindow = A2(_user$project$Window$create, window, model.uid);
		var _p13 = A2(
			_user$project$Window$update,
			_user$project$Window$WindowDetailReceived(window),
			newWindow);
		var mo = _p13._0;
		var cmd = _p13._1;
		var allWindows = A2(_elm_lang$core$List_ops['::'], mo, model.openedWindows);
		return _elm_lang$core$Native_Utils.update(
			model,
			{
				openedWindows: allWindows,
				activeWindow: _elm_lang$core$Maybe$Just(mo.windowId),
				uid: model.uid + 1
			});
	});
var _user$project$Main$displayWindowDetail = F2(
	function (model, window) {
		return _user$project$Main$updateActivatedWindows(
			A2(_user$project$Main$addWindow, model, window));
	});
var _user$project$Main$settings = A2(
	_elm_lang$html$Html$div,
	_elm_lang$core$Native_List.fromArray(
		[
			_elm_lang$html$Html_Attributes$class('toolbar-actions')
		]),
	_elm_lang$core$Native_List.fromArray(
		[
			A2(
			_elm_lang$html$Html$button,
			_elm_lang$core$Native_List.fromArray(
				[
					_elm_lang$html$Html_Attributes$class('btn btn-default')
				]),
			_elm_lang$core$Native_List.fromArray(
				[
					A2(
					_elm_lang$html$Html$span,
					_elm_lang$core$Native_List.fromArray(
						[
							_elm_lang$html$Html_Attributes$class('icon icon-cancel icon-cog')
						]),
					_elm_lang$core$Native_List.fromArray(
						[])),
					_elm_lang$html$Html$text(' Settings')
				]))
		]));
var _user$project$Main$onClickNoPropagate = function (msg) {
	return A3(
		_elm_lang$html$Html_Events$onWithOptions,
		'click',
		_elm_lang$core$Native_Utils.update(
			_elm_lang$html$Html_Events$defaultOptions,
			{stopPropagation: true}),
		_elm_lang$core$Json_Decode$succeed(msg));
};
var _user$project$Main$appModel = {
	title: 'Curtain UI',
	dbUrl: 'postgres://postgres:p0stgr3s@localhost:5432/bazaar_v8',
	apiServer: 'http://localhost:8181',
	windowList: _user$project$WindowList$empty,
	openedWindows: _elm_lang$core$Native_List.fromArray(
		[]),
	error: _elm_lang$core$Native_List.fromArray(
		[]),
	uid: 0,
	activeWindow: _elm_lang$core$Maybe$Nothing
};
var _user$project$Main$Model = F8(
	function (a, b, c, d, e, f, g, h) {
		return {title: a, dbUrl: b, apiServer: c, windowList: d, openedWindows: e, error: f, uid: g, activeWindow: h};
	});
var _user$project$Main$FetchError = function (a) {
	return {ctor: 'FetchError', _0: a};
};
var _user$project$Main$LookupDataReceived = F2(
	function (a, b) {
		return {ctor: 'LookupDataReceived', _0: a, _1: b};
	});
var _user$project$Main$fetchLookupData = F2(
	function (model, windowId) {
		var mainTable = A2(_user$project$Main$getWindowTable, model, windowId);
		var _p14 = mainTable;
		if (_p14.ctor === 'Just') {
			return A3(
				_elm_lang$core$Task$perform,
				_user$project$Main$FetchError,
				_user$project$Main$LookupDataReceived(windowId),
				A2(
					_evancz$elm_http$Http$fromJson,
					_elm_lang$core$Json_Decode$list(_user$project$Tab$lookupDataDecoder),
					A2(
						_user$project$Main$httpGet,
						model,
						A2(_elm_lang$core$Basics_ops['++'], '/lookup_data/', _p14._0))));
		} else {
			return _elm_lang$core$Native_Utils.crashCase(
				'Main',
				{
					start: {line: 377, column: 5},
					end: {line: 383, column: 54}
				},
				_p14)('Unable to get matching table');
		}
	});
var _user$project$Main$LookupTabsReceived = F2(
	function (a, b) {
		return {ctor: 'LookupTabsReceived', _0: a, _1: b};
	});
var _user$project$Main$fetchLookupTabs = F2(
	function (model, windowId) {
		var mainTable = A2(_user$project$Main$getWindowTable, model, windowId);
		var _p16 = mainTable;
		if (_p16.ctor === 'Just') {
			return A3(
				_elm_lang$core$Task$perform,
				_user$project$Main$FetchError,
				_user$project$Main$LookupTabsReceived(windowId),
				A2(
					_evancz$elm_http$Http$fromJson,
					_elm_lang$core$Json_Decode$list(_user$project$Tab$tabDecoder),
					A2(
						_user$project$Main$httpGet,
						model,
						A2(_elm_lang$core$Basics_ops['++'], '/lookup_tabs/', _p16._0))));
		} else {
			return _elm_lang$core$Native_Utils.crashCase(
				'Main',
				{
					start: {line: 365, column: 5},
					end: {line: 371, column: 54}
				},
				_p16)('Unable to get matching table');
		}
	});
var _user$project$Main$WindowDataReceived = F2(
	function (a, b) {
		return {ctor: 'WindowDataReceived', _0: a, _1: b};
	});
var _user$project$Main$getWindowData = F3(
	function (model, mainTable, windowId) {
		return A3(
			_elm_lang$core$Task$perform,
			_user$project$Main$FetchError,
			_user$project$Main$WindowDataReceived(windowId),
			A2(
				_evancz$elm_http$Http$fromJson,
				_elm_lang$core$Json_Decode$list(_user$project$Window$tableDaoDecoder),
				A2(
					_user$project$Main$httpGet,
					model,
					A2(_elm_lang$core$Basics_ops['++'], '/app/', mainTable))));
	});
var _user$project$Main$GetWindowData = function (a) {
	return {ctor: 'GetWindowData', _0: a};
};
var _user$project$Main$WindowDetailReceived = function (a) {
	return {ctor: 'WindowDetailReceived', _0: a};
};
var _user$project$Main$fetchWindowDetail = F2(
	function (model, table) {
		return A3(
			_elm_lang$core$Task$perform,
			_user$project$Main$FetchError,
			_user$project$Main$WindowDetailReceived,
			A2(
				_evancz$elm_http$Http$fromJson,
				_user$project$Window$windowDecoder,
				A2(
					_user$project$Main$httpGet,
					model,
					A2(_elm_lang$core$Basics_ops['++'], '/window/', table))));
	});
var _user$project$Main$UpdateWindowList = function (a) {
	return {ctor: 'UpdateWindowList', _0: a};
};
var _user$project$Main$UpdateWindow = F2(
	function (a, b) {
		return {ctor: 'UpdateWindow', _0: a, _1: b};
	});
var _user$project$Main$ActivateWindow = function (a) {
	return {ctor: 'ActivateWindow', _0: a};
};
var _user$project$Main$CloseWindow = function (a) {
	return {ctor: 'CloseWindow', _0: a};
};
var _user$project$Main$view = function (model) {
	return A2(
		_elm_lang$html$Html$div,
		_elm_lang$core$Native_List.fromArray(
			[
				_elm_lang$html$Html_Attributes$class('window')
			]),
		_elm_lang$core$Native_List.fromArray(
			[
				A2(
				_elm_lang$html$Html$header,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('toolbar toolbar-header')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$h1,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('title')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text('Curtain')
							]))
					])),
				A2(
				_elm_lang$html$Html$div,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('window-content')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$div,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('pane-group')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('pane pane-sm sidebar')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										_user$project$Main$settings,
										A2(
										_elm_lang$html$Html_App$map,
										_user$project$Main$UpdateWindowList,
										_user$project$WindowList$view(model.windowList))
									])),
								A2(
								_elm_lang$html$Html$div,
								_elm_lang$core$Native_List.fromArray(
									[
										_elm_lang$html$Html_Attributes$class('pane')
									]),
								_elm_lang$core$Native_List.fromArray(
									[
										A2(
										_elm_lang$html$Html$div,
										_elm_lang$core$Native_List.fromArray(
											[
												_elm_lang$html$Html_Attributes$class('tab-group')
											]),
										A2(
											_elm_lang$core$List$map,
											function (w) {
												return A2(
													_elm_lang$html$Html$div,
													_elm_lang$core$Native_List.fromArray(
														[
															_elm_lang$html$Html_Attributes$classList(
															_elm_lang$core$Native_List.fromArray(
																[
																	{ctor: '_Tuple2', _0: 'tab-item', _1: true},
																	{ctor: '_Tuple2', _0: 'active', _1: w.isActive}
																])),
															_elm_lang$html$Html_Events$onClick(
															_user$project$Main$ActivateWindow(w.windowId))
														]),
													_elm_lang$core$Native_List.fromArray(
														[
															A2(
															_elm_lang$html$Html$span,
															_elm_lang$core$Native_List.fromArray(
																[
																	_user$project$Main$onClickNoPropagate(
																	_user$project$Main$CloseWindow(w.windowId)),
																	_elm_lang$html$Html_Attributes$class('icon icon-cancel icon-close-tab')
																]),
															_elm_lang$core$Native_List.fromArray(
																[])),
															_elm_lang$html$Html$text(w.name)
														]));
											},
											model.openedWindows)),
										A2(
										_elm_lang$html$Html$div,
										_elm_lang$core$Native_List.fromArray(
											[]),
										A2(
											_elm_lang$core$List$map,
											function (w) {
												return A2(
													_elm_lang$html$Html_App$map,
													_user$project$Main$UpdateWindow(w.windowId),
													_user$project$Window$view(w));
											},
											model.openedWindows))
									]))
							]))
					])),
				A2(
				_elm_lang$html$Html$footer,
				_elm_lang$core$Native_List.fromArray(
					[
						_elm_lang$html$Html_Attributes$class('toolbar toolbar-footer')
					]),
				_elm_lang$core$Native_List.fromArray(
					[
						A2(
						_elm_lang$html$Html$span,
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html_Attributes$class('pull-right')
							]),
						_elm_lang$core$Native_List.fromArray(
							[
								_elm_lang$html$Html$text(
								_elm_lang$core$Basics$toString(model.error))
							]))
					]))
			]));
};
var _user$project$Main$LoadWindow = function (a) {
	return {ctor: 'LoadWindow', _0: a};
};
var _user$project$Main$WindowListReceived = function (a) {
	return {ctor: 'WindowListReceived', _0: a};
};
var _user$project$Main$fetchWindowList = function (model) {
	return A3(
		_elm_lang$core$Task$perform,
		_user$project$Main$FetchError,
		_user$project$Main$WindowListReceived,
		A2(
			_evancz$elm_http$Http$fromJson,
			_user$project$WindowList$windowListDecoder,
			A2(_user$project$Main$httpGet, model, '/window')));
};
var _user$project$Main$init = {
	ctor: '_Tuple2',
	_0: _user$project$Main$appModel,
	_1: _user$project$Main$fetchWindowList(_user$project$Main$appModel)
};
var _user$project$Main$update = F2(
	function (msg, model) {
		var _p18 = msg;
		switch (_p18.ctor) {
			case 'UpdateWindow':
				var windowUpdates = A2(
					_elm_lang$core$List$map,
					function (w) {
						if (_elm_lang$core$Native_Utils.eq(w.windowId, _p18._0)) {
							var _p19 = A2(_user$project$Window$update, _p18._1, w);
							var mr = _p19._0;
							var cmd = _p19._1;
							return mr;
						} else {
							return w;
						}
					},
					model.openedWindows);
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{openedWindows: windowUpdates}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'CloseWindow':
				return {
					ctor: '_Tuple2',
					_0: _user$project$Main$updateActivatedWindowList(
						_user$project$Main$updateActivatedWindows(
							A2(_user$project$Main$closeWindow, model, _p18._0))),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'ActivateWindow':
				return {
					ctor: '_Tuple2',
					_0: _user$project$Main$updateActivatedWindowList(
						_user$project$Main$updateActivatedWindows(
							_elm_lang$core$Native_Utils.update(
								model,
								{
									activeWindow: _elm_lang$core$Maybe$Just(_p18._0)
								}))),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'UpdateWindowList':
				var _p20 = _p18._0;
				if (_p20.ctor === 'LoadWindow') {
					return {
						ctor: '_Tuple2',
						_0: model,
						_1: A2(_user$project$Main$fetchWindowDetail, model, _p20._0)
					};
				} else {
					return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
				}
			case 'GetWindowList':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: _user$project$Main$fetchWindowList(model)
				};
			case 'WindowListReceived':
				var _p21 = A2(
					_user$project$WindowList$update,
					_user$project$WindowList$WindowListReceived(_p18._0),
					model.windowList);
				var wm = _p21._0;
				var cmd = _p21._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{windowList: wm}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			case 'WindowDetailReceived':
				var _p22 = _p18._0;
				return {
					ctor: '_Tuple2',
					_0: _user$project$Main$updateActivatedWindowList(
						A2(_user$project$Main$displayWindowDetail, model, _p22)),
					_1: A3(_user$project$Main$getWindowData, model, _p22.table, model.uid)
				};
			case 'LoadWindow':
				return {
					ctor: '_Tuple2',
					_0: model,
					_1: A2(_user$project$Main$fetchWindowDetail, model, _p18._0)
				};
			case 'GetWindowData':
				return {ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none};
			case 'WindowDataReceived':
				var _p24 = _p18._0;
				var openedWindows = A2(
					_elm_lang$core$List$map,
					function (windowModel) {
						if (_elm_lang$core$Native_Utils.eq(windowModel.windowId, _p24)) {
							var _p23 = A2(
								_user$project$Window$update,
								_user$project$Window$WindowDataReceived(_p18._1),
								windowModel);
							var mo = _p23._0;
							var cmd = _p23._1;
							return mo;
						} else {
							return windowModel;
						}
					},
					model.openedWindows);
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{openedWindows: openedWindows}),
					_1: A2(_user$project$Main$fetchLookupTabs, model, _p24)
				};
			case 'LookupTabsReceived':
				var _p25 = _p18._0;
				return {
					ctor: '_Tuple2',
					_0: A3(
						_user$project$Main$updateWindow,
						model,
						_user$project$Window$LookupTabsReceived(_p18._1),
						_p25),
					_1: A2(_user$project$Main$fetchLookupData, model, _p25)
				};
			case 'LookupDataReceived':
				return {
					ctor: '_Tuple2',
					_0: A3(
						_user$project$Main$updateWindow,
						model,
						_user$project$Window$LookupDataReceived(_p18._1),
						_p18._0),
					_1: _elm_lang$core$Platform_Cmd$none
				};
			default:
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(
						model,
						{
							error: A2(
								_elm_lang$core$List_ops['::'],
								_elm_lang$core$Basics$toString(_p18._0),
								model.error)
						}),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
var _user$project$Main$main = {
	main: _elm_lang$html$Html_App$program(
		{
			init: _user$project$Main$init,
			update: _user$project$Main$update,
			view: _user$project$Main$view,
			subscriptions: function (_p26) {
				return _elm_lang$core$Platform_Sub$none;
			}
		})
};
var _user$project$Main$GetWindowList = {ctor: 'GetWindowList'};

var Elm = {};
Elm['Main'] = Elm['Main'] || {};
_elm_lang$core$Native_Platform.addPublicModule(Elm['Main'], 'Main', typeof _user$project$Main$main === 'undefined' ? null : _user$project$Main$main);

if (typeof define === "function" && define['amd'])
{
  define([], function() { return Elm; });
  return;
}

if (typeof module === "object")
{
  module['exports'] = Elm;
  return;
}

var globalElm = this['Elm'];
if (typeof globalElm === "undefined")
{
  this['Elm'] = Elm;
  return;
}

for (var publicModule in Elm)
{
  if (publicModule in globalElm)
  {
    throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
  }
  globalElm[publicModule] = Elm[publicModule];
}

}).call(this);

