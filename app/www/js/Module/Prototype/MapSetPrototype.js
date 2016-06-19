(function () {
	// #region Map proto

	PrototypeBase.extend(Map, {
		stringify: _getConfig(stringify),
	});

	// #endregion

	// #region Set proto

	PrototypeBase.extend(Set, {
		stringify: _getConfig(stringify),
	});

	// #endregion

	function stringify() {
		Json.stringify([...this]);
	}

	// #region Helpers

	function _getConfig(callback) {
		return {
			value: callback
		};
	}

	// #endregion

})();