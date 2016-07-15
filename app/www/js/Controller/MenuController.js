(function () {
	var app = angular.module(appName);

	app.controller('MenuCtrl', ['$scope', '$localStorage', 'googleMapService',
		function ($scope, $localStorage, mapService) {
			var app = $scope.app;
			$scope.config = $localStorage.appConfig;

			$scope.menuRoutes = $scope._menuRoutes;

			appSys.menu.navigateTo = function (page) {
				appSys.menu.closeMenu();
				console.info(`Prepare navigate to \t "${page.title}"`);
				var current = $scope.appSys.menu.currentPage;
				if (!page.route || (!current && page.route === $scope.appSys.menu._currentPageUrl) || current === page)
					return;
				console.info(`Navigate to \t "${page.title}"`);

				appSys.menu.currentPage = page;

				appSys.nav.resetToPage(page.route);
			};

			$scope.navigateTo = appSys.menu.navigateTo;

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