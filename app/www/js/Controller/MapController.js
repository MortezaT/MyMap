(function () {
	var app = angular.module(appName);

	app.controller('MapCtrl', ['$scope', '$timeout', 'googleMapService', 'cordovaGeolocationService', '$localStorage',
		function ($scope, $timeout, mapService, geoService, $Storage) {

			var mapType = {
				open: () => {
					mapType.dial.showItems();
					mapService.map.setClickable(!(mapType.isOpen = true));
				},
				close: () => {
					mapType.dial.hideItems();
					mapService.map.setClickable(!(mapType.isOpen = false));
				},
				toggle: () => mapType.isOpen ? mapType.close() : mapType.open(),

				// dial: document.getElementById('map-dial'),
				isOpen: false,
				enum: {
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
				}
			};

			$scope.config = $Storage.mapConfig;
			$scope.appConfig = $Storage.appConfig;
			$scope.myPlaces = $Storage.places;

			$scope.markers = [];

			$scope.hasMarker = () => !!$scope.markers.length;

			$scope.hasMultiMurkers = () => $scope.markers.length > 1;

			$scope.hasNewMarker = () => !!$scope.newMarker;

			$scope.infoCellClass = () => 'text-info blink';

			$scope.add = () => {
				if (!$scope.newMarker)
					return;
				$scope.newMarker.getPosition(_add);
				$scope.removeNewMarker();
			};

			$scope.getBtnStatusClass = active => active ? 'item-primary' : 'text-info';

			$scope.getGpsStatusIcon = () => {
				// For sure if it's tracking.
				geoService.track();
				if (!$scope.watching)
					return 'zmdi zmdi-gps';
				return 'zmdi zmdi-gps-dot' + (geoService.online ? '' : ' blink text-warning');
			};

			var statusTimeout;
			$scope.showStatus = function (text, delay = 2000) {
				$scope.status = text;
				if (statusTimeout)
					$timeout.cancel(statusTimeout);

				statusTimeout = $timeout(function () {
					$scope.status = '';
				}, delay);
			};

			$scope.current = () => {
				console.log('Get current location from geoService...');
				geoService.current({
					maximumAge: 3000,
					timeout: 5000,
					enableHighAccuracy: true
				}).then(function (position) {
					console.log(position);
					var latLng = new mapService.plugin
						.LatLng(geoService.positionToLatLng(position));
					mapService.setCenter(latLng);
				}, function (error) {
					console.warn(error);
				});
			};

			$scope.navigate = () => {
				appSys.nav.pushPage('templates/navigate.html');
			};

			$scope.removeNewMarker = () => {
				if (!$scope.newMarker)
					return;
				$scope.newMarker.remove();
				$scope.$applyAsync(function () {
					$scope.newMarker = null;
				});
			};

			$scope.setType = function (type, override = false) {
				$scope.mapType.close();

				if ($scope.config.mapType === type && !override)
					return;

				$scope.typeChange = true;
				$scope.config.mapType = type;
				console.info(`change map type to ${type.text}`);

				mapService.waitTillReady().then(function () {
					var typeId = mapService.plugin.MapTypeId[type.typeId];

					mapService.map.setMapTypeId(typeId);

					$scope.mapType.close();
					$scope.typeChange = false;

				});
			};

			$scope.watch = function () {
				// TODO: Location watch and center should stop on map drag
				if ($scope.watching || $scope.watchLock)
					return $scope.watchId;
				console.info('Start watching');
				mapService.current();
				$scope.watchLock = true;
				return geoService.findMyLocation({
						timeout: 5000,
						enableHighAccuracy: true
					})
					.then(position => {
						$scope.watching = true;
						$scope.watchLock = false;
						mapService.getCameraPosition().then(camera => {
							var args = {};
							console.log(`Camera zoom: ${camera.zoom}`);
							/*
								if (camera.zoom < 18 || camera.zoom > 20)
									args.zoom = 18;
							*/
							mapService.setCenter(geoService.positionToLatLng(position), args);
						});
					})
					.then(() => $scope.watchId = geoService.watch(
						position => {
							if ($scope.moving)
								return;

							var duration = 1000;
							$scope.moving = true;
							var currentLocation = geoService.positionToLatLng(position);
							console.info('Location changed to\t', currentLocation);
							$scope.lastLocation = currentLocation;
							mapService.setCenter(currentLocation, duration);
							setTimeout(() => $scope.moving = false, duration);
						},
						error => {
							console.error('Unable to watch due to error\t', error);
							$scope.unWatch();
							$scope.watchLock = false;
						}
					));
			};

			$scope.unWatch = function () {
				console.info('Stop watching');
				geoService.clear($scope.watchId);
				$scope.watchId = null;
				$scope.watching = false;

				return null;
			};

			$scope.toggleWatch = () => $scope.watching ? $scope.unWatch() : $scope.watch();

			$scope.traffic = function (stat) {
				if (stat === undefined)
					return $scope.config.traffic;
				return (mapService.map.setTrafficEnabled($scope.config.traffic = stat));
			};

			$scope.toggleTraffic = () => $scope.traffic(!$scope.traffic());

			$scope.addMarkerEvents = function (marker) {

				/*mapService
					.onMarkerClick(marker, () => {
						mapService.showMarkerInfo(marker);
					});*/

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
				if ($scope.newMarker)
					$scope.newMarker.remove();

				mapService
					.addMarker({
						position: latLng,
						draggable: true,
					})
					.then(marker => {
						marker.showInfoWindow();
						$scope.newMarker = marker;
						$scope.addMarkerEvents(marker);
					});
			};

			var getPlaceType = place => ($scope._placeTypes.find(i => i.id === place.type));

			$scope.showPlace = place => {
				var args = {
					position: place.latLng,
					draggable: false,
				};
				var type = getPlaceType(place);
				if (type)
					args.icon = {
						url: type.path
					};
				mapService.addMarker(args)
					.then(marker => marker.showInfoWindow());
			};

			$scope.showMyPlaces = function () {
				$scope.myPlaces.forEach(place => place.latLng && $scope.showPlace(place));
			};

			$scope.addMapEvents = () => {
				mapService.onClick($scope.removeNewMarker);
				mapService.onLongClick($scope.addMarker);
				mapService.onMyLocationClick($scope.toggleWatch);
			};

			$scope.refreshMap = function () {

				var ShamsipourUniversity =
					new mapService.plugin.LatLng(35.70472646510231, 51.45291410386562);

				mapService.onsenFix();
				mapService.map.clear();
				// TODO: if maps current type is equal to requested type don't change it.
				$scope.setType($scope.config.mapType || $scope.mapType.enum.satellite, true);
				$scope.traffic($scope.config.traffic || false);
				// If center option was set then set center of map to given center latLng.

				$scope.showMyPlaces();

				if ($Storage.center) {
					console.info(`Center was set to `, $Storage.center);
					mapService.setCenter($Storage.center);
					delete $Storage.center;
				} else if ($Storage.lastLocation)
					mapService.setCenter($Storage.lastLocation);
				else
					mapService.setCenter(ShamsipourUniversity);

				$scope.addMapEvents();
			};

			ons.ready(function () {
				$scope.mapTypeDial = mapType.dial = document.getElementById('map-dial');
				$scope.canvas = document.getElementById('map_canvas');

				$scope.mapType = mapType;

				// #region Initalizing

				// #region service init

				mapService.init($scope.canvas, {
					backgroundColor: $scope.appConfig.themeColor,
				});
				geoService.init();
				// #endregion

				mapService.waitTillReady().then($scope.refreshMap);
				// #endregion
			});

		}
	]);

	function _add(latLng) {
		appSys.nav.pushPage('templates/Place/place-form.html', {
			animation: "lift",
			place: {
				latLng: latLng
			},
			action: appSys.config.actions.NEW
		});
	}
})();