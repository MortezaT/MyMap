(function () {
	var app = angular.module(appName);

	app.factory('cordovaGeolocationService', ['$q',
		function _geolocation($q) {
			var svc = {};

			svc.init = function () {
				svc.plugin = navigator.geolocation;
			};

			svc.positionToLatLng = position => ({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});

			svc.current = function () {
				var deferred = $q.defer();
				svc.plugin.getCurrentPosition(
					position => deferred.resolve(position),
					error => deferred.reject(error)
				);
				return deferred.promise;
			};

			/*
			 * Monitors current position of device
			 *
			 * change			callback which called with updated position on position change.
			 * fail	(optional)	callback which used to inform of any error.
			 * options:(optional)
			 *	{
			 * 		maximumAge	number of miliseconds which cached position is acceptable.
			 * 		timeout 	number of miliseconds waiting for call of success then calls fail.
			 * 		enableHighAccuracy boolean
			 * 			If true device will true using more accurate methods (like satellite).
			 * }
			 * @return 			watchId refrence to this watcher
			 */
			svc.watch = (change, fail, options) =>
				svc.plugin.watchPosition(change, fail, options);

			/*
			 * stop watcher of the given watchId
			 */
			svc.clear = watchId => svc.plugin.clearWatch(watchId);

			return svc;
		}
	]);

})();