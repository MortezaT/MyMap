(function () {
	var app = angular.module(appName);

	app.factory('googleMapService', ['$q', '$document', '$timeout',
		function ($q, $document, $timeout) {
			var svc = {};

			function _getOptions(options) {
				// TODO: Map options must be memorized upon to user change.
				var ShamsipourUniversity =
					new svc.plugin.LatLng(35.70472646510231, 51.45291410386562);

				_getOptions.defaults = _getOptions.defaults || {
					backgroundColor: '#ffffff',
					mapType: svc.plugin.MapTypeId.HYBRID,
					controls: {
						compass: true,
						// myLocationButton: true,
						indoorPicker: true,
						// zoom: true
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

			var isMapReady = false;
			var mapInitiationLock = false;

			// #region Other methods

			// returns deferred which will resolve when map is ready.
			svc.waitTillReady = function () {
				if (isMapReady)
					return $q.resolve();
				if (!mapInitiationLock)
					svc.init();

				var deferred = $q.defer();
				(function _resolveOnMapReady() {
					if (isMapReady)
						return deferred.resolve();
					plugins.toast.showShortTop('Wait for google map.');
					$timeout(_resolveOnMapReady, 1000);
				})();
				return deferred.promise;
			};

			svc.setCenter = function (latLng) {
				svc.map.moveCamera({
					"target": latLng,
					"zoom": 18
				});
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
				if(marker.get('title'))
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

			svc.init = function (div, options) {
				if (mapInitiationLock)
					return;

				isMapReady = false;
				mapInitiationLock = true;

				svc.plugin = svc.plugin || plugin.google.maps;

				if (svc.map) {
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

						isMapReady = true;
						mapInitiationLock = false;
					}
				);
			};
			// #endregion

			return svc;
		}
	]);
})();