(function () {
	var app = angular.module(appName);

	app.controller('NavigateCtrl', ['$scope', '$localStorage', 'googleMapService',
		function ($scope, $Storage, mapService) {
			if ($Storage.lastLocation)
				$scope.from = mapService.getAddress($Storage.lastLocation, true);
			//.then(address => $scope.shadow.address = address.extra.lines.join(', '))

			var _showList = false;

			$scope.navigation = {
				from: {
					latLng: $Storage.lastLocation
				},
				to: {}
			};
			$scope.from = $scope.to = "";
			$scope.myPlaces = $Storage.places;

			$scope.getIcon = place => ($scope._placeTypes.find(i => i.id === place.type) || {}).icon;
			$scope.showList = () => _showList;
			$scope.filter = () => $scope.$evalAsync(() => $scope.q = $scope[$scope.focusOn].toLowerCase());

			$scope.sameness = () => $scope.navigation.from === $scope.navigation.to;
			$scope.validFromTo = () => !!($scope.navigation.from.latLng && $scope.navigation.to.latLng);
			$scope.canNavigate = () => $scope.validFromTo() && !$scope.sameness();

			$scope.calculateDistance = function () {
				var distance = !$scope.validFromTo() ? 0 :
					mapService.distance($scope.navigation.from.latLng, $scope.navigation.to.latLng);
				if (distance < 2) distance *= 1000;
				if (distance !== $scope.distance)
					$scope.$evalAsync(() => $scope.distance = distance);
				return distance;
			};

			$scope.navigate = () => {
				var message = `This will open google maps for  navigation\nfrom:  ${$scope.navigation.from.title}\nto: ${$scope.navigation.to.title}\n\nAre you sure`;
				if ($scope.canNavigate() && confirm(message))
					mapService.navigate($scope.navigation.from.latLng, $scope.navigation.to.latLng);
			};

			$scope.select = place => {
				$scope.navigation[$scope.focusOn] = place;
				$scope[$scope.focusOn] = place.title;
				if ($scope.validFromTo())
					$scope.calculateDistance();
				_showList = false;
			};

			$scope.setFocusOn = (inputName) => {
				$scope.focusOn = inputName;
				$scope.navigation[$scope.focusOn] = {};
				$scope.filter();

				_showList = true;
			};
		}
	]);
}());