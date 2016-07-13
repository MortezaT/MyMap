(function () {
	var app = angular.module(appName);

	app.controller('PlaceListCtrl', ['$scope', '$localStorage',
		function ($scope, $localStorage) {

			$scope.$storage = $localStorage;
			$scope.myPlaces = $scope.$storage.places;
			$scope.selectedItems = $scope.myPlaces.map(() => false);

			$scope.isManageMode = () => $scope.selectedItems.any(selected => selected);
			$scope.isAllSelected = () => $scope.selectedItems.every(selected => selected);

			$scope.selectAll = () => $scope.selectedItems = $scope.selectedItems.map(() => true);
			$scope.deselectAll = () => $scope.selectedItems = $scope.selectedItems.map(() => false);

			$scope.toggle = index => $scope.selectedItems[index] = !$scope.selectedItems[index];
			$scope.longPressed = index => $scope.toggle(index);

			$scope.deleteSelected = () => {
				if (!confirm("By Accepting this all selected items will be removed!\nAre you sure?"))
					return;
				for (var i = $scope.selectedItems.length - 1; i >= 0; i--) {
					if (!$scope.selectedItems[i])
						continue;
					$scope.selectedItems.splice(i, 1);
					$scope.myPlaces.splice(i, 1);
				}
			};

			$scope.open = function (place) {
				appSys.nav.pushPage('templates/Place/place-form.html', {
					animation: "lift",
					place: place,
					action: appSys.config.actions.VIEW
				});
			};

			$scope.pressed = function (place, index) {
				if (!$scope.isManageMode())
					return $scope.open(place);
				$scope.toggle(index);
			};

		}
	]);
})();