(function () {
	var app = angular.module(appName);

	app.controller('PlaceListCtrl', ['$scope', '$localStorage',
		function ($scope, $localStorage) {

			$scope.$storage = $localStorage;

			$scope.myPlaces = $scope.$storage.places;

			$scope.show = function (place) {
				$scope.appSys.nav.pushPage('templates/Place/place-form.html', {
					animation: "lift",
					place: place,
					action: appSys.config.actions.VIEW
				});
			};
		}
	]);
})();