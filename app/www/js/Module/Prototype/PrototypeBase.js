var PrototypeBase = (function () {
	function PrototypeBase() {}

	Object.defineProperties(PrototypeBase.prototype, {
		extend: {
			value: function (obj, properties) {
				Object.defineProperties(obj.prototype, properties);
			}
		}
	});

	return new PrototypeBase;
})();