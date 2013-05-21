//======================================================================================================================

if (window && !global) var global = window;

String.prototype.format = String.prototype.f = function() {
	var s = this, i = arguments.length;
	while (i--) {
		s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
	}
	return s;
};

String.prototype.replaceTokens = function(token, arr) {
	var s = this;
	for (var i = 0; i < arr.length; i++) {
		s = s.replace(token, arr[i]);
	}
	return s;
};

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

Function.prototype.bind = function(oThis) {
	fBound = function () {
		return fToBind.apply(this instanceof fNOP && oThis
			? this
			: oThis,
			aArgs.concat(Array.prototype.slice.call(arguments))
		);
	};
};

Array.prototype.pad = function(s,v) {
	var l = Math.abs(s) - this.length;
	var a = [].concat(this);
	if (l <= 0)
		return a;
	for(var i=0; i<l; i++)
		s < 0 ? a.unshift(v) : a.push(v);
	return a;
};

/* IE fixes */
if (typeof console === 'undefined') console = {};
if (typeof console.log == 'undefined') console.log = function(){};

if (typeof Array.prototype.indexOf !== 'function') {
	Array.prototype.indexOf = function(elt /*, from*/)
	{
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			? Math.ceil(from)
			: Math.floor(from);
		if (from < 0) from += len;
		
		for (; from < len; from++)
		{
			if (from in this &&
			this[from] === elt)
			return from;
		}
		return -1;
	}
}

if (typeof (Date.prototype.toISOString) != 'function') {
	Date.prototype.toISOString = function()
	{
		function pad(n) { return n < 10 ? '0' + n : n }
		return (
			this.getUTCFullYear() + '-'
			+ pad(this.getUTCMonth() + 1) + '-'
			+ pad(this.getUTCDate()) + 'T'
			+ pad(this.getUTCHours()) + ':'
			+ pad(this.getUTCMinutes()) + ':'
			+ pad(this.getUTCSeconds()) + '.'
			+ pad(this.getUTCMilliseconds()) + 'Z'
		);
	}
}
/* IE fixes */

global.defArg = function (arg, def) {
	if (typeof arg === 'undefined' || arg === undefined) return def;
	return arg;
};

//======================================================================================================================

(function(){
	var utils, self;
	utils = self = {
		hexDigits: new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"),
		hex: function(x) {
			return isNaN(x) ? "00" : self.hexDigits[(x - x % 16) / 16] + self.hexDigits[x % 16];
		}, //hex
		rgb2hex: function(rgb) {
			rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			return "#" + self.hex(rgb[1]) + self.hex(rgb[2]) + self.hex(rgb[3]);
		}, //rgb2hex
		
		//------------------------------------------------------------------------
		
		// override
		baseTitle: '',
		localFormats: {
			date: 'Y-m-d',
			time: 'H:i:s',
			datetime: 'Y-m-d H:i:s'
		},
		
		//------------------------------------------------------------------------
		
		escapeRegex: function(str) {
			return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		},
		
		formats: {
			date: 'Y-m-d',
			time: 'H:i:s',
			datetime: 'Y-m-d H:i:s'
		},
		
		getBy: function(arr, key, val) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][key] === val) return arr[i];
			}
		},
		
		getFirst: function() {
			var args = Array.prototype.slice.call(arguments, 0);
			for (var i = 0; i < args.length; i++) {
				if (args[i] !== undefined && args[i] !== null) return args[i];
			}
			return null;
		}, //getFirst
		
		getDate: function(date){
			if (typeof date === 'undefined') return new Date();
			if (typeof date === 'number') return new Date(date);
			if (typeof date === 'string') return Ext.Date.parse(date, utils.formats.datetime);
		}, //getDate
		
		getRand: function(max, min) {
			min = defArg(min, 0);
			return Math.floor(Math.random()*max)+min;
		}, //getRand
		
		getRegex: function(str) {
			return new RegExp(str.substring(1, str.length - 1));
		},
		
		getSorterAlpha: function(key, dir) {
			dir = defArg(dir, 'ASC');
			dir = (dir === 'ASC' ? 1 : -1);
			return function(a,b){
				a = a[key].toLowerCase();
				b = b[key].toLowerCase();
				return dir * (a > b ? 1 : (a < b ? -1 : 0));
			};
		}, //getSorterAlpha
		
		getSorterNumeric: function(key, dir) {
			dir = defArg(dir, 'ASC');
			dir = (dir === 'ASC' ? 1 : -1);
			return function(a,b){
				return (dir === 1 ? a[key] - b[key] : b[key] - a[key]);
			};
		}, //getSorterNumeric
		
		isDef: function(obj) {
			return (typeof obj !== 'undefined' && obj !== undefined);
		}, //isDef
		
		isSet: function(obj) {
			return (typeof obj !== 'undefined' && obj !== undefined && obj !== null);
		}, //isSet
		
		isTruthy: function(obj) {
			if (typeof obj === 'undefined'
			 || obj === undefined
			 || obj === null
			 || obj === false
			 || obj === 0
			 || obj === ""
			 || obj === "0") {
				return false;
			} else {
				return true;
		   }
		}, //isTruthy
		
		nullToString: function(obj) {
			for (var key in obj) {
				if (obj[key] === undefined || obj[key] === null) {
					obj[key] = '';
				} else if (utils.typeOf(obj[key]) == 'object') {
					this.nullToString(obj[key]);
				}
			}
			/*
			$.each(obj,function(key,val){
				if (val === null) obj[key] = val;
				if (utils.typeOf(val) === 'object') obj[key] = utils.nullToString(val);
			});
			return obj;
			*/
		}, //nullToString
		
		objToArr: function(obj) {
			var arr = [];
			$.each(obj,function(key,val){
				arr.push([key,val]);
			});
			return arr;
		},
		
		prepareHtml: function(str) {
			str = defArg(str, '');
			if (str === null) str = '';
			
			str = Ext.String.htmlEncode(str);
			str = str.replace(/\n/g, '<br>');
			return str;
		},
		
		replaceTokens: function(str, token, arr) {
			for (var i = 0; i < arr.length; i++) {
				str = str.replace(token, arr[i]);
			}
			return str;
		},
		
		roundTo: function(amount, places) {
			if (typeof places === 'undefined') places = 0;
			var multiplier = Math.pow(10, places);
			return (Math.ceil(amount * multiplier) / multiplier);
		}, //roundTo
		
		setTitle: function(str, add) {
			if (typeof add === 'undefined') add = false;
			var baseTitle = (add ? window.document.title : this.baseTitle);
			window.document.title = baseTitle + ' - ' + str;
		}, //setTitle
		
		TEST_convert: function(obj) {
			switch (Object.prototype.toString.call(obj)) {
				case '[object Array]':
				case '[object Object]':
					//
				break;
				
				case '[object Boolean]':
				case '[object Date]':
				case '[object Function]':
				case '[object Number]':
				case '[object String]':
					//
				break;
				
				case '[object Null]':
				case '[object Undefined]':
					//
				break;
			}
		}, //TEST_convert
		
		toFloat: function(val,dec) {
			if (val === undefined || val === null || val === '') val = 0;
			return parseFloat(val).toFixed(dec);
		}, //toFloat
		
		trim: function(str) {
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}, //trim
		
		typeOf: function(obj) {
			var type = Object.prototype.toString.call(obj);
			type = type.split(' ')[1].toLowerCase();
			return type.substring(0,type.length-1);
		} //typeOf
	};
	window.utils = utils;
}).call(this);

//======================================================================================================================

(function(){
	var self, datetime;
	self = datetime = {
		getNow: function() {
			return self.getUtcIsoDatetimeSec(new Date());
		},
		
		getUtcIsoDatetime:       function(val) { return self.format(val, 'utc', 'iso', 'dt');  },
		getUtcIsoDatetimeSec:    function(val) { return self.format(val, 'utc', 'iso', 'dts'); },
		getUtcIsoDate:           function(val) { return self.format(val, 'utc', 'iso', 'd');   },
		getUtcIsoTime:           function(val) { return self.format(val, 'utc', 'iso', 't');   },
		getUtcIsoTimeSec:        function(val) { return self.format(val, 'utc', 'iso', 'ts');  },

		getUtcUserDatetime:      function(val) { return self.format(val, 'utc', 'usr', 'dt');  },
		getUtcUserDatetimeSec:   function(val) { return self.format(val, 'utc', 'usr', 'dts'); },
		getUtcUserDate:          function(val) { return self.format(val, 'utc', 'usr', 'd');   },
		getUtcUserTime:          function(val) { return self.format(val, 'utc', 'usr', 't');   },
		getUtcUserTimeSec:       function(val) { return self.format(val, 'utc', 'usr', 'ts');  },

		getLocalIsoDatetime:     function(val) { return self.format(val, 'loc', 'iso', 'dt');  },
		getLocalIsoDatetimeSec:  function(val) { return self.format(val, 'loc', 'iso', 'dts'); },
		getLocalIsoDate:         function(val) { return self.format(val, 'loc', 'iso', 'd');   },
		getLocalIsoTime:         function(val) { return self.format(val, 'loc', 'iso', 't');   },
		getLocalIsoTimeSec:      function(val) { return self.format(val, 'loc', 'iso', 'ts');  },

		getLocalUserDatetime:    function(val) { return self.format(val, 'loc', 'usr', 'dt');  },
		getLocalUserDatetimeSec: function(val) { return self.format(val, 'loc', 'usr', 'dts'); },
		getLocalUserDate:        function(val) { return self.format(val, 'loc', 'usr', 'd');   },
		getLocalUserTime:        function(val) { return self.format(val, 'loc', 'usr', 't');   },
		getLocalUserTimeSec:     function(val) { return self.format(val, 'loc', 'usr', 'ts');  },
		
		_format: function(value) {
			value = value.trim();
			var d = value.match(/^(\d{4})-?(\d{2})-?(\d{2})[T ](\d{2}):?(\d{2}):?(\d{2})(\.\d+)?(Z|UTC|(?:([+-])(\d{2}):?(\d{2})))$/i);
			if (!d) {
				console.log(value);
				throw "ISODate: Illegal date format '"+value+"'";
			}
			return new Date(
				Date.UTC(
					d[1], d[2]-1, d[3],
					d[4], d[5], d[6], d[7] || 0 % 1 * 1000 | 0
				) + (
					(d[8].toUpperCase() === "Z" || d[8].toUpperCase() === "UTC") ? 0 :
					(d[10]*3600 + d[11]*60) * (d[9] === "-" ? 1000 : -1000)
				)
			);
		}, //_format
		
		timestamp: function(value) {
			return self.parse(value).getTime();
		}, //timestamp
		
		parse: function(value) {
			//0. determine what type of value we have
			switch (utils.typeOf(value)) {
				case 'null':
				case 'undefined':
					value = new Date();
				break;
				case 'date':
					value = value;
				break;
				case 'number':
					// determine whether it's seconds or milliseconds
					// javascript needs timestamp in milliseconds
					if (value < 9999999999) {
						value = value * 1000
					}
					value = new Date(value);
				break;
				case 'string':
					value = value.trim();
					if (value.length === 10) value += ' 00:00:00';
					if (value.length === 8)  value =  '1970-01-01 '+value;
					value = self._format(value+'Z');
				break;
			}
			return value;
		}, //parse
		
		format: function(value, timezone, format, parts) {
			if (typeof value === 'undefined' || value === undefined || value === null) return '';
			value = self.parse(value);
			
			//1. output Date object as desired timezone in desired format
			switch (timezone) {
				case 'utc':
					switch (format) {
						case 'iso':
							value = ''
								+value.getUTCFullYear()
								+'-'
								+('0'+(value.getUTCMonth()+1)).slice(-2)
								+'-'
								+('0'+value.getUTCDate()).slice(-2)
								+' '
								+('0'+value.getUTCHours()).slice(-2)
								+':'
								+('0'+value.getUTCMinutes()).slice(-2)
								+':'
								+('0'+value.getUTCSeconds()).slice(-2);
						break;
						case 'usr':
							value = ''
								+('0'+value.getUTCDate()).slice(-2)
								+'-'
								+('0'+(value.getUTCMonth()+1)).slice(-2)
								+'-'
								+value.getUTCFullYear()
								+' '
								+('0'+value.getUTCHours()).slice(-2)
								+':'
								+('0'+value.getUTCMinutes()).slice(-2)
								+':'
								+('0'+value.getUTCSeconds()).slice(-2);
						break;
					}
				break;
				case 'loc':
					switch (format) {
						case 'iso':
							value = ''
								+(value.getFullYear())
								+'-'
								+('0'+(value.getMonth()+1)).slice(-2)
								+'-'
								+('0'+value.getDate()).slice(-2)
								+' '
								+('0'+value.getHours()).slice(-2)
								+':'
								+('0'+value.getMinutes()).slice(-2)
								+':'
								+('0'+value.getSeconds()).slice(-2);
						break;
						case 'usr':
							value = ''
								+('0'+value.getDate()).slice(-2)
								+'-'
								+('0'+(value.getMonth()+1)).slice(-2)
								+'-'
								+(value.getFullYear())
								+' '
								+('0'+value.getHours()).slice(-2)
								+':'
								+('0'+value.getMinutes()).slice(-2)
								+':'
								+('0'+value.getSeconds()).slice(-2);
						break;
					}
				break;
			}
			
			//2. split off desired parts
			switch (parts) {
				case 'dt':
					value = value.substring(0,16);
				break;
				case 'dts':
					value = value.substring(0,19);
				break;
				case 'd':
					value = value.substring(0,10);
				break;
				case 't':
					value = value.substring(11,16);
				break;
				case 'ts':
					value = value.substring(11,19);
				break;
			}
			
			return value;
		} //format
	};
	window.datetime = datetime;
}).call(this);

//======================================================================================================================

(function(){
	window.utils.cache = {
		// override
		prefix: '',
		
		//------------------------------------------------------------------------
		
		save: function(id, data, sec){
			if (typeof sec === 'undefined') sec = 300;
			
			var exp = new Date().getTime() + (sec * 1000);
			var obj = {data: data, exp: exp}
			console.log(datetime.getUtcIsoDatetimeSec(new Date())+' > Cache Save EXP '+datetime.getUtcIsoDatetimeSec(obj.exp)+' ['+id+']');
			window.localStorage.setItem(this.prefix+'/'+id, Ext.JSON.encode(obj));
		}, //save
		load: function(id){
			var obj = Ext.JSON.decode(window.localStorage.getItem(this.prefix+'/'+id));
			if (obj && obj.exp) {
				var now = new Date().getTime();
				if (obj.exp > now) {
					console.log(datetime.getUtcIsoDatetimeSec(new Date())+' > Cache Load EXP '+datetime.getUtcIsoDatetimeSec(obj.exp)+' ['+id+']');
					return obj.data;
				}
			}
			return false;
		} //load
	}
}).call(this);

//======================================================================================================================

(function(){
	window.utils.favorites = {
		// override
		prefix: '',
		onUpdate: function(favorites){},
		
		//------------------------------------------------------------------------
		
		has: function(id){
			id = parseInt(id,10);
			return ($.inArray(id, this.get()) !== -1);
		},
		add: function(id){
			id = parseInt(id,10);
			var arr = this.get();
			if ($.inArray(id, arr) === -1) arr.push(id);
			this.set(arr);
		},
		rem: function(id){
			id = parseInt(id,10);
			var arr = this.get();
			var i = $.inArray(id, arr);
			if (i !== -1) arr.splice(i, 1);
			this.set(arr);
		},
		merge: function(arr){
			var old = this.get();
			for (var i = 0; i < arr.length; i++) {
				if (!this.has(arr[i])) this.add(arr[i]);
			}
		},
		toggle: function(id, on){
			id = parseInt(id,10);
			if (on) {
				this.add(id);
			} else {
				this.rem(id);
			}
		},
		get: function(){
			var str = Ext.util.Cookies.get(this.prefix+"/favorites");
			var arr = Ext.JSON.decode(str);
			return (arr || []);
		},
		set: function(arr){
			var str = Ext.JSON.encode(arr);
			Ext.util.Cookies.set(this.prefix+"/favorites", str);
			this.onUpdate();
		},
		count: function(){
			return this.get().length;
		}
	}
}).call(this);

//======================================================================================================================

(function(){
	window.utils.hash = {
		// override
		onChange: function(parts, force){},
		
		//------------------------------------------------------------------------
		
		prev: null,
		get: function() {
			var h = window.location.hash;
			return (h.substring(0,1) === '#' ? h.substring(1) : h);
		},
		set: function(str) {
			this.prev = str;
			return window.location.hash = str;
		},
		load: function(str) {
			return window.location.hash = str;
		},
		reload: function() {
			return this.parse(true);
		},
		parse: function(bForce) {
			if (typeof bForce === 'undefined') bForce = false;
			
			var h, parts, sPage, sData;
			h = this.get();
			
			if (h !== '' && h === this.prev && !bForce) return false;
			
			parts = h.split('/');
			
			if (typeof parts[0] === 'undefined' || parts[0] === '') {
				this.load('home');
				return;
			}
			
			this.prev = parts.join('/');
			
			this.onChange(parts, bForce);
		}
	}
}).call(this);

//======================================================================================================================

(function(){
	window.utils.popups = {
		current: [],
		
		//------------------------------------------------------------------------
		
		closeAll: function() {
			for (var i = 0; i < this.current.length; i++) {
				if (this.current[i]) this.current[i].close();
			}
			return true;
		}, //closeAll
		
		openChild: function(/*...*/) {
			var popup = window.open.apply(window, arguments);
			this.current.push(popup);
		} //openChild
	};
	
	$(window).unload(function(){
		utils.popups.closeAll();
	});
}).call(this);

//======================================================================================================================

(function(){
	var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		gap = '',
		indent = '\t',
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};
	
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
	
	function getUTCTimestamp(date) {
		return date.getTime() + (date.getTimezoneOffset()*60*1000);
	}
	
	function quote(string) {
		/*
		string = string
			.replace(/\\/g, '\\\\')
			//.replace(/\b/g, '\\b')
			//.replace(/\f/g, '\\f')
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t')
			.replace(/"/g, '\\"');
		return '"' + string + '"';
		*/
		escapable.lastIndex = 0;
		if (escapable.test(string)) {
			return '"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string'
				? c
				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"';
		} else {
			return '"' + string + '"';
		}
	};
	
	function jsonify(key, holder) {
		var i,          // The loop counter.
			k,          // The member key.
			v,          // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];
		
		var type = Object.prototype.toString.call(value);
		switch (type) {
			case '[object Array]':
				origGap = gap;
				gap += indent;
				partial = [];
				
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = jsonify(i, value) || 'null';
				}
				
				var sub = partial.join(',\n' + gap);
				if (sub.substring(0,1) === '[' || sub.substring(0,1) === '{') {
					sub = sub.replace(/([\t]*)\t/g, '$1');
				}
				
				v = partial.length === 0
					? '[]'
					: gap
					? '[\n' + gap + sub + '\n' + mind + ']'
					: '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			break;
			
			case '[object Object]':
				origGap = gap;
				gap += indent;
				partial = [];
				
				var regex = /['": ]/;
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = jsonify(k, value);
						if (v) {
							if (regex.test(k)) k = quote(k);
							partial.push(k + ': ' + v);
						}
					}
				}
				
				v = partial.length === 0
					? '{}'
					: gap
					? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
					: '{' + partial.join(',') + '}';
				gap = mind;
				return v;
			break;
			
			case '[object Date]':
				var str = 'new Date('+getUTCTimestamp(value)+'), //' +
					value.getUTCFullYear()     + '-' +
					pad(value.getUTCMonth()+1) + '-' +
					pad(value.getUTCDate())    + ' ' +
					pad(value.getUTCHours())   + ':' +
					pad(value.getUTCMinutes()) + ':' +
					pad(value.getUTCSeconds()) + ' UTC';
				return str;
			break;
			
			case '[object Number]':
				if (value === Infinity) return 'Infinity';
				if (value === -Infinity) return '-Infinity';
				return String(value);
			break;
			
			case '[object String]':
				return quote(value);
			break;
			
			case '[object Function]':
				var str = String(value);
				str = str.replace(/\n([\s]+)/g, '\n' + gap + indent);
				str = str.substring(0,str.length-1) + gap + '}';
				return str;
			break;
			
			case '[object Boolean]':
			case '[object Null]':
			case '[object Undefined]':
				return String(value);
			break;
			
			case '[object JSON]':
			case '[object Math]':
			// et cetera...
			default:
				console.log('unidentified type!')
				console.log(type);
				return type.substring(8,type.length-1);
			break;
		}
	};
	
	//---------------------------------------------------------------------------
	
	window.utils.pretty = {
		print: function(value, spacer) {
			if (typeof spacer === 'undefined') {
				spacer = '\t';
			} else if (typeof spacer === 'number') {
				var str = '';
				for (i = 0; i < spacer; i += 1) {
					str += ' ';
				}
				spacer = str;
			}
			
			json = jsonify('', {'': value})
				.replace(/\[\s*\[/g, '[[')
				.replace(/\[\s*\{/g, '[{')
			
				.replace(/\]\s*\]/g, ']]')
				.replace(/\}\s*\]/g, '}]')
			
				.replace(/\],\s*\[/g, '],[')
				.replace(/\},\s*\{/g, '},{')
				
				.replace(/\t/g, spacer);
			
			return json;
		}
	}
}).call(this);

//======================================================================================================================