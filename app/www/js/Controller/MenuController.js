(function () {
	var app = angular.module(appName);

	app.controller('MenuCtrl', ['$scope', '$localStorage', 'googleMapService',
		function ($scope, $localStorage, mapService) {
			var app = $scope.app;
			$scope.config = $localStorage.appConfig;

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
				appSys.menu.closeMenu();
				if (!page.route || $scope.appSys.menu.currentPage === page)
					return;
				console.info('Navigate to page:\t "{title}" on\t "{route}"'.formatWith(page));

				appSys.menu.currentPage = page;

				appSys.nav.resetToPage(page.route);
			};

			// dark theme index
			$scope.changeTheme = () => {
				// appSys.menu.closeMenu();
				ons.ready(function () {
					document.styleSheets[$scope.config.darkThemeIndex].disabled = !$scope.config.darkTheme;
					$scope.config.themeColor = !$scope.config.darkTheme ? '#ffffff' : '#000000';
					mapService.waitTillReady().then(function () {
						mapService.setTheme($scope.config.themeColor);
					});
				});
			};

			document.styleSheets[$scope.config.darkThemeIndex].disabled = !$scope.config.darkTheme;

		}
	]);
})();