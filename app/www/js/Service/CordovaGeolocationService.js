(function () {
	var app = angular.module(appName);

	app.factory('cordovaGeolocationService', ['$q', '$timeout',
		function _geolocation($q, $timeout) {
			var svc = {};

			svc.init = function () {
				if (svc.initialized)
					return;
				console.info('Initializing cordova geolocation service...');
				svc.initialized = true;
				svc.plugin = navigator.geolocation;
			};

			svc.positionToLatLng = position => ({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});

			svc.current = function (options) {
				if (this.deferred)
					return this.deferred.promise;
				console.info('Get current location');

				this.deferred = $q.defer();
				svc.plugin.getCurrentPosition(
					position => this.deferred.resolve(position),
					error => this.deferred.reject(error),
					options
				);
				this.deferred.promise.finally(() => this.deferred = null);
				return this.deferred.promise;
			};

			// #region Track
			// track just checks if current location is available. and changes check period against availablity.
			svc.track = function () {
				var tracker = svc.track;
				if (tracker.tracking)
					return;
				svc.init();
				tracker.tracking = $q.defer();
				tracker.tracking.promise.finally(() => tracker.tracking = null);

				tracker.timeout = tracker.time.normal;
				(function _track() {
					if (!tracker.tracking)
						return;
					$timeout(_track, tracker.timeout);
					if (_track.tracking)
						return;
					_track.tracking = true;
					svc.current()
						.then(() => {
							tracker.timeout = tracker.time.lazy;
							svc.online = true;
						})
						.catch(() => {
							tracker.timeout = tracker.time.fast;
							svc.online = false;
						})
						.finally(() => _track.tracking = false);
				})();
				return tracker.tracking.promise;
			};

			svc.track.time = {
				time: 1000, // 1 second
				fast: 300, // 0.3 second
				lazy: 3000, // 3 seconds
			};

			svc.track.stop = function () {
				if (svc.track.tracking)
					svc.track.tracking.reject();
			};

			// #endregion

			svc.findMyLocation = function (options, delay = 1000) {
				var deferred = $q.defer(),
					retry = true,
					resolved = false;

				(function _resolveOnLocationFound() {
					if (resolved)
						return;

					if (retry) {
						retry = false;
						svc.current(options)
							.then(position => {
									resolved = true;
									console.log('location found', position);
									deferred.resolve(position);
								},
								error => retry = true
						);
					}

					$timeout(_resolveOnLocationFound, delay);
				})();

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