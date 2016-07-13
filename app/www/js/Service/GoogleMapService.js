(function () {
	var app = angular.module(appName);

	app.factory('googleMapService', ['$q', '$document', '$timeout',
		function ($q, $document, $timeout) {
			var svc = {
				isMapReady: false,
				initiationLock: false,
				mapStatus: ''
			};

			function _getOptions(options) {
				// TODO: Map options must be memorized upon to user change.
				var ShamsipourUniversity =
					new svc.plugin.LatLng(35.70472646510231, 51.45291410386562);

				_getOptions.defaults = _getOptions.defaults || {
					backgroundColor: '#000000',
					mapType: svc.plugin.MapTypeId.HYBRID,
					controls: {
						compass: true,
						myLocationButton: true,
						indoorPicker: true,
						zoom: true
					},
					gestures: {
						scroll: true,
						tilt: true,
						rotate: true,
						zoom: true
					},
					camera: {
						latLng: ShamsipourUniversity,
						tilt: 30,
						zoom: 18,
						bearing: 300
					}
				};

				return Object.assign({}, _getOptions.defaults, options);
			}

			// #region Other methods

			// returns deferred which will resolve when map is ready.
			svc.waitTillReady = function () {
				if (svc.isMapReady)
					return $q.resolve();
				if (!svc.initiationLock)
					svc.init();

				var deferred = $q.defer();
				(function _resolveOnMapReady() {
					if (svc.isMapReady)
						return deferred.resolve();
					plugins.toast.showShortTop('Wait for google map.');
					$timeout(_resolveOnMapReady, 1000);
				})();
				return deferred.promise;
			};

			svc.setCenter = function (latLng) {
				svc.map.animateCamera({
					"target": latLng,
					"zoom": 18
				});
			};

			svc.current = function (accurate = true) {
				if (this.deferred)
					return this.deferred.promise;
				console.info('Get current location');

				this.deferred = $q.defer();
				var options = {
					enableHighAccuracy: accurate
				};
				svc.map.getMyLocation(options,
					result => this.deferred.resolve(result),
					error => this.deferred.reject(error)
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

			svc.tryCurrent = function (retries = 3, accurate = true) {
				var deferred = $q.defer();
				var resolved = false;
				var retry = true;

				(function _resolveOnLocationFound() {
					if (resolved)
						return;
					if (retry && retries) {
						retry = false;
						svc.current()
							.then(
								result => {
									resolved = true;
									deferred.resolve(result);
								},
								error => {
									retry = !!(--retries);
									if (!retry)
										deferred.reject(error);

									console.warn(`Retry ${retries} after error ${error.error_code}\t${error.error_message}`);
									$timeout(_resolveOnLocationFound, 1000);
								}
						);
					}
				})();

				return deferred.promise;
			};

			svc.setTheme = (themeColor) => {
				if (!svc.map)
					return;
				svc.map.setBackgroundColor(themeColor);
			};

			// #region Marker

			svc.addMarker = function (options) {
				var deferred = $q.defer();
				svc.map
					.addMarker(options, function (marker) {
						deferred.resolve(marker);
					});

				return deferred.promise;
			};

			svc.addMarkerAll = function (optionsList) {
				var deferred = $q.defer();
				var markerList = [];

				optionsList.forEach(function (options) {
					svc.addMarker(options)
						.then(function (marker) {
							markerList.push(marker);
							if (markerList.length < optionsList.length)
								return;
							deferred.resolve(markerList);
						});
				});

				return deferred.promise;
			};

			svc.getMarkerLatLng = function (marker) {
				var deferred = $q.defer();
				marker.getPosition(latLng => deferred.resolve(latLng));
				return deferred.promise;
			};

			svc.checkMarkerInfoVisible = marker => {
				var deferred = $q.defer();
				marker.isInfoWindowShown(isVisible => {
					console.info(`info visibility: ` + (isVisible ? 'visible' : 'hidden'));
					return deferred.resolve(isVisible);
				});
				return deferred.promise;
			};

			svc.showMarkerInfo = marker => {
				if (marker.get('title'))
					marker.showInfoWindow();
			};
			// #endregion

			// #region GeoCoder

			/*
			 * Get geocode data
			 *
			 */
			svc.geocode = function (request) {
				var deferred = $q.defer();
				svc.plugin.Geocoder.geocode(request, function (result) {
					return (result.length) ?
						deferred.resolve(result) :
						deferred.reject();
				});
				return deferred.promise;
			};

			svc.getAddress = function (latLng, asString) {
				var request = {
					position: latLng,
				};

				return svc.geocode(request).then(function (result) {
					var address = result.first();
					return asString ?
						address.extra.lines.toString() :
						address;
				});
			};

			// #endregion
			// #endregion

			// #region Event listener

			svc.addEventListener = (object, event, listener, ...args) => object.addEventListener
				.apply(object, [svc.plugin.event[event], listener, [...args]]);

			svc.removeEventListener = (object, event, listener) => object.removeEventListener
				.apply(object, [svc.plugin.event[event], listener]);

			svc.addMapListener = (event, listener, ...args) =>
				svc.addEventListener.apply(null, [svc.map, event, listener, ...args]);

			svc.removeMapListener = (event, listener) =>
				svc.removeEventListener.apply(null, [svc.map, event, listener, ...args]);

			// #region Map events

			/*
			 * Apply Map event listeners
			 * Click: MAP_CLICK
			 * Long click: MAP_LONG_CLICK
			 * Location button click: MY_LOCATION_BUTTON_CLICK
			 * Camera: CAMERA_CHANGE
			 * Camera: CAMERA_IDLE(iOS)
			 * Map: MAP_READY
			 * Map: MAP_LOADED(Android)
			 * Map: MAP_WILL_MOVE(iOS)
			 * Map: MAP_CLOSE
			 *
			 *
			 * @return void
			 */

			/* **************************** */

			svc.onClick = listener =>
				svc.addMapListener('MAP_CLICK', listener);

			svc.onLongClick = listener =>
				svc.addMapListener('MAP_LONG_CLICK', listener);

			svc.onMyLocationClick = listener =>
				svc.addMapListener('MY_LOCATION_BUTTON_CLICK', listener);
			// #endregion

			// #region Marker events

			svc.onMarkerClick = (marker, listener) =>
				svc.addEventListener(marker, 'MARKER_CLICK', listener);

			svc.onMarkerInfoClick = (marker, listener) =>
				svc.addEventListener(marker, 'INFO_CLICK', listener);

			svc.onMarkerDrag = (marker, listener) =>
				svc.addEventListener(marker, 'MARKER_DRAG', listener);

			svc.onMarkerDragStart = (marker, listener) =>
				svc.addEventListener(marker, 'MARKER_DRAG_START', listener);

			svc.onMarkerDragEnd = (marker, listener) =>
				svc.addEventListener(marker, 'MARKER_DRAG_END', listener);
			// #endregion
			// #endregion

			svc.onsenFix = function () {
				// OnsenUI Fix
				angular.element(document.querySelectorAll('.page__background'))
					.css('background-color', 'rgba(0,0,0,0)');
				/*
				 *If using sliding menu with type of overlay (or so) then you sould add another selector ([style*='background-color: "black"']) for transparency.
				 * but then problem would be the dark theme which don't show.
				 * because color and background-color will be the same.
				 * and by the way all of this is a nasty way to get rid of these frameworks problems.
				 */
				/*.not('.page--menu-page__background')*/
				// toggle map clickable
				// $scope.speedDialFab.addEventListener('click',_toggleClickable);

				// $scope.fabBtn.addEventListener('click', $scope.toggleSpeedDial);
			};

			// #region Map initiation

			svc.init = function (div, options, freshMap = false) {
				console.info('Initializing google map service...');
				if (svc.initiationLock)
					return;

				svc.isMapReady = false;
				svc.initiationLock = true;

				svc.plugin = svc.plugin || plugin.google.maps;

				if (svc.map && freshMap) {
					svc.map.clear();
					svc.map.remove();
					$document.find('.gmap_div:not(:last)').remove();
					svc.map = '';
				}

				// this is important for reinit
				svc.canvas = div || document.getElementById("map_canvas");
				svc.options = _getOptions(options || {});

				// Initialize the map view
				svc.map = svc.plugin.Map
					.getMap(svc.canvas, svc.options);
				// Listen for map ready status.
				svc.map.addEventListener(svc.plugin.event.MAP_READY,
					function () {

						svc.isMapReady = true;
						svc.initiationLock = false;
					}
				);
			};
			// #endregion

			return svc;
		}
	]);
})();