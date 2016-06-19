(function () {
	Object.defineProperties(Number.prototype, {
		clone: _getConfig(function () {
			return Number(this);
		}),

		degToRad: _getConfig(function () {
			return this * Math.PI / 180;
		}),

		degToGrad: _getConfig(function () {
			return this / 0.9;
		}),

		radToDeg: _getConfig(function () {
			return this * 180 / Math.PI;
		}),

		radToGrad: _getConfig(function () {
			return this * 200 / Math.PI;
		}),

		gradToDeg: _getConfig(function () {
			return this * 0.9;
		}),

		gradToRad: _getConfig(function () {
			return this * Math.PI / 200;
		})
	});

	// #region Helpers

	function _getConfig(callback) {
		return {
			value: callback
		};
	}
	// #endregion

})();