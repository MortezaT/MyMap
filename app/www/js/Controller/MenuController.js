(function () {
	var app = angular.module(appName);

	app.controller('MenuCtrl', ['$scope',
		function ($scope) {
			var app = $scope.app;

			$scope.menuRoutes = [{
				title: 'Map',
				icon: 'ion-map fa-lg',
				route: 'templates/map.html'
			}, {
				title: 'My Locations',
				icon: 'ion-location fa-lg',
				route: 'templates/Place/place-list.html'
			}, {
				title: 'About',
				icon: 'ion-information-circled fa-lg',
				route: 'templates/about.html'
			}, ];

			$scope.navigateTo = function (page) {
				if (!page.route || $scope.appSys.menu.currentPage === page)
					return $scope.appSys.menu.closeMenu();
				console.info('Navigate to page:\t "{title}" on\t "{route}"'.formatWith(page));

				appSys.menu.currentPage = page;

				appSys.menu.setMainPage(page.route, {
					closeMenu: true
				});
			};

		}
	]);
})();