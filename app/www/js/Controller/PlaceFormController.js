(function () {
	var app = angular.module(appName);
	var defaultPlace = {
		title: '',
		address: '',
	};

	app.controller('PlaceFormCtrl', ['$scope', '$element', '$localStorage', 'googleMapService',
		function ($scope, $element, $Storage, mapService) {
			var options = appSys.nav.topPage.pushedOptions;
			var actions = appSys.config.actions;

			$scope.placeType = {
				heightLimit: true,
				dialogParent: $element,
				openerTemplate: '<ons-icon icon="fa-caret-down" size="2x"></ons-icon>',
				items: $scope._placeTypes,
			};

			$scope.defaultIcon = 'zmdi zmdi-pin';

			$scope.action = options.action;

			$scope.place = options.place;

			$scope.type = {
				items: $scope._placeTypes,
				dataItem: $scope._placeTypes.find(i => i.id === $scope.place.type)
			};

			$scope.shadow = ($scope.action === actions.NEW) ?
				Object.assign({}, defaultPlace, $scope.place) :
				angular.copy($scope.place);

			$scope.changeIcon = () => $scope.shadow.type = $scope.type.dataItem.id;

			$scope.canEdit = () => $scope.action !== actions.VIEW;

			$scope.edit = () => $scope.action = actions.EDIT;

			$scope.getAddress = () => {
				console.info($scope.shadow.latLng);
				if (confirm('Do you want to get address from google services?'))
					mapService.getAddress($scope.place.latLng)
					.then(address => $scope.shadow.address = address.extra.lines.join(', '));
			};

			$scope.cancel = () => {
				if ($scope.action === actions.NEW)
					appSys.nav.popPage();
				$scope.action = actions.VIEW;
				$scope.shadow = angular.copy($scope.place);
			};

			$scope.save = () => {
				var cloned = angular.copy($scope.shadow);
				if ($scope.action === actions.NEW)
					$Storage.places.push(cloned);

				$scope.action = actions.VIEW;
				Object.assign($scope.place, cloned);
			};

			$scope.showOnMap = () => {
				$Storage.center = $scope.place.latLng;
				appSys.menu.navigateTo($scope._menuRoutes.map);
			};
		}
	]);
})();