(function () {
	var app = angular.module(appName);

	app.controller('PlaceFormCtrl', ['$scope', '$element', '$localStorage',
		function ($scope, $element, $localStorage) {
			$scope.$storage = $localStorage;

			var options = $scope.appSys.nav.topPage.pushedOptions;
			var actions = appSys.config.actions;

			$scope.placeType = {
				heightLimit: true,
				dialogParent: $element,
				openerTemplate: '<ons-icon icon="fa-caret-down" size="2x"></ons-icon>',
				items: $scope._placeTypes,
			};

			$scope.type = {
				items: $scope._placeTypes,
			};

			$scope.place = options.place;

			$scope.shadow = angular.copy($scope.place);

			$scope.action = options.action;

			$scope.canEdit = () => $scope.action !== actions.VIEW;

			$scope.edit = () => {
				$scope.action = actions.EDIT;
			};

			$scope.cancel = () => {
				$scope.action = actions.VIEW;
				$scope.shadow = angular.copy($scope.place);
			};

			$scope.save = () => {
				var cloned = angular.copy($scope.shadow);
				$scope.action = actions.VIEW;

				if($scope.action === actions.NEW)
					$scope.$storage.places.push(cloned);
				Object.assign($scope.place, cloned);
			};

			// #region Place type

			// #endregion
		}
	]);
})();