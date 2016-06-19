(function () {
	PrototypeBase.extend(String, {
		formatWith: _getConfig(formatWith),
		makeCharMap: _getConfig(makeCharMap),
		escapeForRegexp: _getConfig(escapeForRegexp),
	});

	// #region Helpers

	function formatWith(...replaceWith) {
		var str = this;
		if (!replaceWith.length)
			return str;
		// if only on argument passed
		if (replaceWith.length === 1)
			return _format(str, replaceWith[0]);

		if (_isAllPrimitive(replaceWith))
			return _format(str, replaceWith);

		// if more than on argument (non primitives) passed
		return replaceWith.reduce((st, rWith) => st.formatWith(rWith), str);
	}

	function makeCharMap() {
		var arr = Array.from(this),
			mapped = {};
		arr.forEach(ch => mapped[ch] = true);
		return mapped;
	}

	function charRepeatCount() {
		var arr = Array.from(this),
			repeatCounts = {};
		arr.forEach(ch => mapped[ch] = (mapped[ch] || 0) + 1);
		return repeatCounts;
	}

	function wordCount() {
		return this.split().length;
	}

	function wordRepeatCount() {
		var repeatCounts = {},
			items = this.split();

		items.forEach(w => obj[w] = (obj[w] || 0) + 1);
		return obj;
	}

	function escapeForRegexp() {
		var str = this;
		return str.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
		replace(/\x08/g, '\\x08');
	}

	function _getConfig(callback) {
		return {
			value: callback
		};
	}

	function _isAllPrimitive(valueArray) {
		return valueArray.every(value => TypeCheck.isPrimitive(value));
	}

	function _format(str, replaceWith) {
		if (TypeCheck.isPrimitive(replaceWith))
			replaceWith = [replaceWith];

		return _reduce(replaceWith, function (str, value, key) {
			var reg = new RegExp("\\{" + key + "\\}", "gm");
			return str.replace(reg, value);
		}, str);
	}

	function _reduce(obj, func, intiVal) {
		return (TypeCheck.isArray(obj)) ?
			obj.reduce(func, intiVal) :
			MT_ObjectHelper.reduceObject(obj, func, intiVal);
	}

	// #endregion
})();