var TypeCheck = (function () {
	function TypeCheck() {}

	var toString = Object.prototype.toString,
		getPrototypeOf = Object.getPrototypeOf,
		TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;

	PrototypeBase.extend(TypeCheck, {
		isPrimitive: _getConfig(isPrimitive),
		isUndefined: _getConfig(isUndefined),
		isNull: _getConfig(isNull),
		isDefined: _getConfig(isDefined),
		isObject: _getConfig(isObject),
		isBlankObject: _getConfig(isBlankObject),
		isString: _getConfig(isString),
		isNumber: _getConfig(isNumber),
		isDate: _getConfig(isDate),
		isArray: _getConfig(Array.isArray),
		isFunction: _getConfig(isFunction),
		isRegExp: _getConfig(isRegExp),
		isFile: _getConfig(isFile),
		isFormData: _getConfig(isFormData),
		isBlob: _getConfig(isBlob),
		isBoolean: _getConfig(isBoolean),
		isPromiseLike: _getConfig(isPromiseLike),
		isTypedArray: _getConfig(isTypedArray),
		isElement: _getConfig(isElement),
		isSymbol: _getConfig(isSymbol),
		isMap: _getConfig(isMap),
		isSet: _getConfig(isSet),
	});

	return new TypeCheck();

	// #region Helpers

	/*
	 * Primitive Types in Javascript:
	 * 		boolean
	 * 		null
	 * 		number
	 * 		string
	 * 		symbol
	 * 		undefined
	 */
	function isPrimitive(value) {
		var isPrimitive =

			isBoolean(value) ||
			isNull(value) ||
			isNumber(value) ||
			isString(value) ||
			isSymbol(value) ||
			isUndefined(value);

		return isPrimitive;
	}

	function isUndefined(value) {
		return typeof value === 'undefined';
	}

	function isDefined(value) {
		return !isUndefined(value);
	}

	function isNull(value) {
		return value === null;
	}

	function isObject(value) {
		return !isNull(value) && typeof value === 'object';
	}

	function isBlankObject(value) {
		return isObject(value) && !getPrototypeOf(value);
	}

	function isString(value) {
		return typeof value === 'string';
	}

	function isNumber(value) {
		return typeof value === 'number';
	}

	function isDate(value) {
		return toString.call(value) === '[object Date]';
	}

	function isFunction(value) {
		return typeof value === 'function';
	}

	function isRegExp(value) {
		return toString.call(value) === '[object RegExp]';
	}

	function isFile(obj) {
		return toString.call(obj) === '[object File]';
	}

	function isFormData(obj) {
		return toString.call(obj) === '[object FormData]';
	}

	function isBlob(obj) {
		return toString.call(obj) === '[object Blob]';
	}

	function isBoolean(value) {
		return typeof value === 'boolean';
	}

	function isPromiseLike(obj) {
		return obj && isFunction(obj.then);
	}

	function isTypedArray(value) {
		return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
	}

	function isElement(node) {
		return !!(node &&
			(node.nodeName // we are a direct element
				|| (node.prop && node.attr && node.find))); // we have an on and find method part of jQuery API
	}

	function isSymbol(value) {
		return typeof value === 'symbol';
	}

	function isMap(value) {
		return toString.call(value) === '[object Map]';
	}

	function isSet(value) {
		return toString.call(value) === '[object Set]';
	}

	function _getConfig(callback) {
		return {
			value: callback
		};
	}

	// #endregion

})();