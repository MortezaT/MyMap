(function () {
	var app = angular.module(appName);

	app.factory('acceleroMeterService', ['$q', '$timeout',
		function ($q, $timeout) {
			var svc = {};

			svc.watch = (success, fail, options) =>
				svc.accelerometer.watchAcceleration(success, fail, options);

			svc.current = (success, fail) =>
				svc.accelerometer.getCurrentAcceleration(success, fail);

			svc.clear = whatchId => svc.accelerometer.clearWhatch(whatchId);

			svc.init = function () {
				svc.accelerometer = navigator.accelerometer;
			};

			return svc;
		}
	]);

})();