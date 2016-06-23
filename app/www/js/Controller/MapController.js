(function () {
	var app = angular.module(appName);

	app.controller('MapCtrl', ['$scope', '$timeout', 'googleMapService', 'cordovaGeolocationService',
		function ($scope, $timeout, mapService, geoService) {

			$scope.mapType = {
				satellite: {
					icon: 'fa fa-rss',
					typeId: 'SATELLITE',
					text: 'satellite',
				},
				hybrid: {
					icon: 'fa fa-globe',
					typeId: 'HYBRID',
					text: 'hybrid',
				},
				roadMap: {
					icon: 'fa fa-road',
					typeId: 'ROADMAP',
					text: 'road map',
				},
				terrain: {
					icon: 'fa fa-picture-o',
					typeId: 'TERRAIN',
					text: 'terrain',
				},
			};

			$scope.markers = [];

			$scope.hasMarker = () => !!$scope.markers.length;

			$scope.hasMultiMurkers = () => $scope.markers.length > 1;

			$scope.toggleSpeedDial = function () {

				var isOpen = $scope.mapTypeDial.isOpen();
				mapService.map.setClickable(isOpen);
				$scope.mapTypeDial.toggleItems();
			};

			$scope.setType = function (type) {
				$scope.mapTypeDial.hideItems();
				$scope.typeChange = true;
				if ($scope.viewType === type)
					return;
				$scope.viewType = type;
				$scope.setStatusText('map view type changed to ' + type.text);

				mapService.waitTillReady()
					.then(function () {
						var mapType = mapService.plugin.MapTypeId[type.typeId];

						mapService.map.setMapTypeId(mapType);

						// Hide speed dial items and allow map touch control
						mapService.map.setClickable(true);
						$scope.mapTypeDial.hideItems();
						$scope.typeChange = false;

					});
			};

			var statusTimeout;
			$scope.setStatusText = function (text, delay = 2000) {
				$scope.status = text;
				if (statusTimeout)
					$timeout.cancel(statusTimeout);

				statusTimeout = $timeout(function () {
					$scope.status = '';
				}, delay);
			};

			$scope.watch = function () {
				if ($scope.watchId)
					$scope.unWatch();
				$scope.watchId = geoService.watch(function change(position) {
					var latLng = new mapService.plugin.LatLng(
						geoService.positionToLatLng(position)
					);
					mapService.setCenter(latLng);
				});
				$scope.watching = true;

				return $scope.watchId;
			};

			$scope.unWatch = function () {
				geoService.clear($scope.watchId);
				$scope.watchId = null;
				$scope.watching = false;

				return null;
			};

			$scope.addMarkerEvents = function (marker) {

				mapService
					.onMarkerClick(marker, () => {
						mapService.showMarkerInfo(marker);
					});

				mapService
					.onMarkerInfoClick(marker, () => marker.hideInfoWindow());

				/*mapService.onMarkerDrag(marker, function () {
					// console.warn('marker drag');
				});*/

				mapService.onMarkerDragStart(marker, function () {
					marker.hideInfoWindow();
					// marker.getPosition(pos => console.log(pos));
				});

				mapService.onMarkerDragEnd(marker, function () {
					mapService
						.getMarkerLatLng(marker)
						.then(latLng => mapService.getAddress(latLng, true))
						.then(address => {
							marker.set('address', address);
						});
				});
			};

			$scope.addMarker = function (latLng) {
				// Adds a marker if not exist.
				mapService
					.addMarker({
						position: latLng,
						draggable: true,
					})
					.then(marker => {
						marker.showInfoWindow();
						$scope.markers.push(marker);
						$scope.addMarkerEvents(marker);
					});
			};

			ons.ready(function () {
				$scope.mapTypeDial = document.getElementById('map-dial');

				$scope.canvas = document.getElementById('map_canvas');
				// $scope.speedDialFab = document.getElementById('map-dial-fab');
				// $scope.fabBtn = document.getElementById('fab-button');
				// #region Initalizing

				// #region service init

				mapService.init($scope.canvas);
				geoService.init();
				// #endregion

				mapService.waitTillReady()
					.then(function () {

						mapService.onsenFix();

						mapService.onLongClick($scope.addMarker);

						// Navigate to my location
						mapService.onMyLocationClick(function () {
							return $scope.watchId ?
								$scope.unWatch() :
								$scope.watch();
							/*
						var options = {
							maximumAge: 3000,
							timeout: 30000,
							enableHighAccuracy: true
						};

						navigator.geolocation.getCurrentPosition(_success, _fail, options);
						*/
							// function _success(position) {
							// position fields
							/*
							 * coords: {
							 * 		latitude
							 * 		longitude
							 * 		altitude
							 *
							 * 		accuracy
							 * 		altitudeAccuracy
							 * 		heading
							 * 		speed
							 * },
							 * timestamp
							 */

							// }

							// function _fail(error) {}
							// Get My Location takes two callbacks (success, fail) as argument
							/*
							 * Success arument decription:
							 * location: {
							 * 		latLng 		<LatLng> [Device location]
							 * 		time 		<number> [timestamp]
							 * 		elapsedRealtimeNanos <number> [elapsed real-time since system boot]
							 * 		accuracy 	<number> [estimated accuracy of location in meters]
							 * 		bearing 	<number> [Bearing in degrees]
							 * 		altitude 	<number> [Meters above sea level "if available"]
							 * 		speed 		<number> [Meters/second "if available"]
							 * 		provider 	<number> the name of provider of this location
							 */
							/*mapService.map.getMyLocation(
							location => console.log(location) ||
							navigator.notification.alert(location),

							reason => console.log(reason) ||
							// navigator.notification.alert(reason) ||
							plugins.toast.showLongBottom(reason.error_code + '\n' + reason.error_message)
						);*/
						});
					});
				// #endregion
			});

		}
	]);
})();