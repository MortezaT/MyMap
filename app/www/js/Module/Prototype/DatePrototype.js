(function () {

	Object.defineProperties(Date.prototype, {

		clone: _getConfig(function () {
			return new Date(this);
		}),
	});

	// #region Helpers

	function _getConfig(callback) {
		return {
			value: callback
		};
	}
	// #endregion
})();