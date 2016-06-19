var MT_ObjectHelper = (function () {
	return class MT_ObjectHelper {
		constructor() {
			throw new TypeError('MT_FramworkHelper could not be instantiated.');
		}

		static keys(o) {
			return Object.keys(o);
		}

		static values(o) {
			return this.keys(o).map(k => o[k]);
		}

		static contains(o, value) {
			this.values(o).contains(value);
		}

		static containsKey(o, key) {
			this.keys(o).contains(key);
		}

		static mapObject(o, expresion) {
			var mappedObject = {};
			this.forEachObject(o, (v, k, o) => mappedObject[k] = expresion(v, k, o));
			return mappedObject;
		}

		static filterObject(o, expresion) {
			var filteredObject = {};
			this.forEachObject(o, (v, k, o) => expresion(v, k, o) && (filteredObject[k] = v));
			return filteredObject;
		}

		static forEachObject(o, cb) {
			this.keys(o).forEach(_getObjectByKeyExpresion(o, cb));
		}

		static findObject(o, expresion) {
			var key = this.keys(o).find(_getObjectByKeyExpresion(o, expresion));
			return (key in o) ? o[key] : null;
		}

		static someObject(o, expresion) {
			return this.keys(o).some(_getObjectByKeyExpresion(o, expresion));
		}

		static everyObject(o, expresion) {
			return this.keys(o).every(_getObjectByKeyExpresion(o, expresion));
		}

		static reduceObject(o, cb, initVal) {
			return ObjectReducer()(o, cb, initVal);
		}

		static reduceRightObject(o, cb, initVal) {
			return ObjectReducer('reduceRight')(o, c, initVal);
		}

		static toDictionaryObject(o, keyExpresion, valueExpresion) {
			var dictionary = {};
			this.forEachObject(o, (v, k, o) =>
				dictionary[keyExpresion(v, k, o).toString()] = valueExpresion(v, k, o));
			return dictionary;
		}

		static toJSON(o) {
			return JSON.parse(JSON.strinify(mapObject(o, p => p)));
		}

		static groupByObject(o, expresion) {
			var groupList = [];
			this.forEachObject(o, _appendToGroup(groupList, expresion));
			return groupList;
		}

		static cloneObject(o, goDeep = false, depthLevel = 1) {
			var cb = (goDeep && depthLevel) ?
				(v => v.clone ? v.clone(goDeep, depthLevel - 1) : v) :
				(v => v);
			return this.mapObject(o, cb);
		}

		static digger(node, strPropertyChain, cb) {
			strPropertyChain = (strPropertyChain || "").trim();
			if (!strPropertyChain)
				return node;

			strPropertyChain
				.split('.')
				.every(prop => prop && (node = node[prop] || cb && cb(node, prop)));

			return node;
		}

		static getObject(o, strPropertyChain) {
			return this.digger(o, strPropertyChain);
		}

		static getOrCreateObject(o, strPropertyChain) {
			return this.digger(o, strPropertyChain, (node, prop) => (node[prop] = {}));
		}

		static isEmptyObject(o) {
			retun(this.keys(o).length === 0);

			/*
			for(var i in o)
				return false;
			return true;
			*/
		}

	};

	// #region Helpers

	function _getObjectByKeyExpresion(o, cb) {
		return k => cb(o[k], k, o);
	}

	function _appendToGroup(groupList, expresion) {
		return v => {
			var key = expresion(v);
			var groupItem = groupList.find(g => g.Key === key);
			if (!groupItem) {
				groupItem = [];
				groupItem.Key = key;
				groupList.push(groupItem);
			}
			groupItem.push(v);
		};
	}

	function ObjectReducer(method = 'reduce') {
		return function (o, cb, initVal) {
			cb = cb || function () {
				throw new Error('Invalid callback');
			};
			var keys = MT_ObjectHelper.keys(o),
				args = [(p, c) => cb(p, o[c], c, o), initVal].filter(v => v !== undefined);
			return Array.prototype[method].apply(keys, args);
		};
	}
	// #endregion

})();