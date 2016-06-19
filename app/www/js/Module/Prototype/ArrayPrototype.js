(function () {
	PrototypeBase.extend(Array, {

		contains: _getConfig(Array.prototype.contains ||
			function (value) {
				return !!~this.indexOf(value);
			}
		),

		clone: _getConfig(clone),

		/** in order to work keyExpresion return value must convert to string properly. **/
		toDictionary: _getConfig(toDictionary),

		toMap: _getConfig(function (keyExpresion, valueExpresion) {
			return this
				.reduce((map, v, i, a) => map.set(keyExpresion(v, i, a), valueExpresion(v, i, a)), new Map);
		}),

		groupBy: _getConfig(groupBy),

		first: _getConfig(function (expresion) {
			return _filterIfExpresion(this, expresion)[0];
		}),

		last: _getConfig(function (expresion) {
			var arr = _filterIfExpresion(this, expresion);
			return arr[arr.length - 1];
		}),

		sortBy: _getConfig(function (...fields) {
			return this.sort(_sortByMultiFields.apply(null, fields));
		}),

		orderBy: _getConfig(function (...expresions) {
			return this.sort(_orderByMultiExpresion.call(null, expresions));
		}),

		orderByDesc: _getConfig(function (...expresions) {
			return this.sort(_orderByMultiExpresion.call(null, expresions, -1));
		}),

		clear: _getConfig(function () {
			this.length = 0;
		}),

		any: _getConfig(function (expresion) {
			return expresion ? this.some(expresion) : this.length > 0;
		}),

		intersect: _getConfig(function (otherArray) {
			return this.filter(d => otherArray.contains(d));
		}),

		distinct: _getConfig(function (expresion = (d => d)) {
			return this.groupBy(expresion).map(g => g.first());
		}),

		selectMany: _getConfig(function (expresion) {
			return this
				.reduce((many, collectin) => many.concat(_mapIfExpresion(collection, expresion)), []);
		}),

		sum: _getConfig(function (expresion) {
			return _mapIfExpresion(this, expresion)
				.reduce((s, v) => s + v, 0);
		}),

		average: _getConfig(function (expresion) {
			var arr = _mapIfExpresion(this, expresion);
			return (!arr.length) ? 0 : arr.sum() / arr.length;
		}),

		min: _getConfig(function (expresion) {
			return _mapIfExpresion(this, expresion)
				.orderBy(v => v).first();
		}),

		max: _getConfig(function (expresion) {
			return _mapIfExpresion(this, expresion)
				.orderBy(v => v).last();
		}),

		toggleItem: _getConfig(function (item) {
			var arr = this,
				index = arr.indexOf(item);
			return (index === -1) ? arr.push(item) : arr.splice(index, 1);
		}),

		add: _getConfig(function (item) {
			var arr = this,
				index = arr.indexOf(item);
			return index === -1 && arr.push(item);
		}),

		remove: _getConfig(function (item) {
			var arr = this,
				index = arr.indexOf(item);
			return (index !== -1) && arr.splice(index, 1);
		}),
	});

	// #region Helpers

	function clone(goDeep = false, depthLevel = 1) {
		var arr = !(goDeep && depthLevel) ?
			this :
			// clone all items if goDeep is true.
			_mapIfExpresion(this, item => item.clone ? item.clone(goDeep, depthLevel - 1) : item);

		return Array.from(arr);
	}

	function _orderByMultiExpresion(expresions, order = 1) {
		return function (a, b) {
			var result;
			expresions.every(expresion => (result = order * _orderBy(expresion)(a, b)) === 0);
			return result;
		};
	}

	function _orderBy(expresion) {
		return function (a, b) {
			var aval = expresion(a);
			var bVal = expresion(b);
			return (aval > bVal) - (aVal < bVal);
		};
	}

	function _sortByMultiFields(...fields) {
		return function (a, b) {
			var result;
			fields.every(field => (result = _sortByField(field.trim())(a, b)) === 0);
			return result;
		};
	}

	function _sortByField(field) {
		var order = (field[0] === '-') ? -1 : 1;
		field = field.substr(1);
		var aVal, bVal;
		return (a, b) => (aVal = ObjectHelper.getObject(a, field),
			bVal = ObjectHelper.getObject(b, field),
			order * (aVal > bVal) - (aVal < bVal));
	}

	function toDictionary(keyExpresion, valueExpresion) {
		var arr = this,
			dictionary = {};
		arr.forEach((v, i, arr) =>
			dictionary[keyExpresion(v, i, arr).toString()] = valueExpresion(v, i, arr)
		);
		return dictionary;
	}

	function groupBy(expresion, asMap = false) {
		var mapped = new Map();

		this.forEach((v, k, a) => {
			var key = expresion(v, k, a);
			mapped.set(key, [...(mapped.get(key) || []), v]);
		});

		return asMap ? mapped : [...mapped.entries()]
			.map(keyValue => (keyValue[1].Key = keyValue[0], keyValue[1]));
	}

	function _filterIfExpresion(arr, expresion) {
		return expresion ? arr.filter(expresion) : arr;
	}

	function _mapIfExpresion(arr, expresion) {
		return expresion ? arr.map(expresion) : arr;
	}

	function _getConfig(callback) {
		return {
			value: callback
		};
	}
	// #endregion

})();