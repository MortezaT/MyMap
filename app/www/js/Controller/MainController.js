(function () {
	var app = angular.module(appName);

	app.controller('MainCtrl', ['$scope', '$localStorage',
		function ($scope, $localStorage) {
			$scope.appName = appName;

			$scope.hideMask = function ($event) {
				$event.target.classList.add('hidden');
			};

			// #region Seed

			$localStorage.places = $localStorage.places || [{
				title: "دانشگاه شهید شمسی پور",
				address: "تهران، میدان امام حسین (ع), ابتدای خیابان دماوند, روبروی خیابان شهید منتظری",
				type: 8,
				latLng: {
					lat: 35.704822026928866,
					lng: 51.45277697592974
				},
			}];
			$localStorage.mapConfig = $localStorage.mapConfig || {};
			$localStorage.appConfig = $localStorage.appConfig || {
				darkTheme: false,
				darkThemeIndex: 5,
				themeColor: '#ffffff'
			};

			// #endregion

			$scope._menuRoutes = {
				map: {
					title: 'Map',
					icon: 'ion-map fa-lg',
					route: 'templates/map.html'
				},
				myPlaces: {
					title: 'My Places',
					icon: 'ion-location fa-lg',
					route: 'templates/Place/place-list.html'
				},
				navigation: {
					title: 'Navigation',
					icon: 'ion-navigate fa-lg',
					route: 'templates/navigate.html'
				},
				about: {
					title: 'About',
					icon: 'ion-information-circled fa-lg',
					route: 'templates/about.html'
				},
			};

			$scope._placeTypes = [{
				id: 1,
				icon: 'zmdi zmdi-local-airport',
				name: 'Airport',
				path: 'https://www.dropbox.com/s/ije0htu28499ydd/airport.png?dl=1'
			}, {
				id: 2,
				icon: 'zmdi zmdi-money',
				name: 'Bank/ATM',
				path: 'https://www.dropbox.com/s/q8uzjhge9pts4x8/bank.png?dl=1'
			}, {
				id: 3,
				icon: 'zmdi zmdi-bus',
				name: 'Transportaion',
				path: 'https://www.dropbox.com/s/d0bfwmlt0xcstd5/transportaion_1.png?dl=1'
			}, {
				id: 4,
				icon: 'zmdi zmdi-pizza',
				name: 'Food',
				path: 'https://www.dropbox.com/s/4py224lahbr8wsu/food_6.png?dl=1'
			}, {
				id: 5,
				icon: 'zmdi zmdi-home',
				name: 'House',
				path: 'https://www.dropbox.com/s/q4d2ju8xkw0cfoe/house_1.png?dl=1'
			}, {
				id: 6,
				icon: 'zmdi zmdi-info',
				name: 'Info',
				path: 'https://www.dropbox.com/s/wcqmd7jou2t4eaz/information.png?dl=1'
			}, {
				id: 7,
				icon: 'zmdi zmdi-local-library',
				name: 'Library',
				path: 'https://www.dropbox.com/s/la9vc3c7ydzdvaq/library.png?dl=1'
			}, {
				id: 8,
				icon: 'ion-university',
				name: 'University/School',
				path: 'https://www.dropbox.com/s/yie44mh071sld2a/university.png?dl=1'
			}, {
				id: 9,
				icon: 'zmdi zmdi-hospital',
				name: 'Medical',
				path: 'https://www.dropbox.com/s/yyenpgwo0ny8asu/medical_4.png?dl=1'
			}, {
				id: 10,
				icon: 'zmdi zmdi-store',
				name: 'Store',
				path: 'https://www.dropbox.com/s/7tbj1qs357i6rzq/store_1.png?dl=1'
			}, {
				id: 11,
				icon: 'zmdi zmdi-case',
				name: 'Work',
				path: 'https://www.dropbox.com/s/p3f33cpfrddgrsb/work_1.png?dl=1'
			}, {
				id: 12,
				icon: 'zmdi zmdi-local-hotel',
				name: 'Living',
				path: 'https://www.dropbox.com/s/9s5ga4z7aatr2qk/house_2.png?dl=1'
			}, ];
			/*$scope._placeTypes = [
				{ id: 1, icon: 'zmdi zmdi-local-airport', name: 'Airport', path: 'airport.png' },
				{ id: 2, icon: 'zmdi zmdi-money', name: 'Bank/ATM', path: 'bank.png' },
				{ id: 3, icon: 'zmdi zmdi-bus', name: 'Transportaion', path: 'transportation_1.png' },
				{ id: 4, icon: 'zmdi zmdi-pizza', name: 'Food', path: 'food_6.png' },
				{ id: 5, icon: 'zmdi zmdi-home', name: 'House', path: 'house_1.png' },
				{ id: 6, icon: 'zmdi zmdi-info', name: 'Info', path: 'information.png' },
				{ id: 7, icon: 'zmdi zmdi-local-library', name: 'Library', path:'library.png' },
				{ id: 8, icon: 'ion-university', name: 'University/School', path:'university.png' },
				{ id: 9, icon: 'zmdi zmdi-hospital', name: 'Medical', path: 'medical_4.png' },
				{ id: 10, icon: 'zmdi zmdi-store', name: 'Store', path: 'store_1.png' },
				{ id: 11, icon: 'zmdi zmdi-case', name: 'Work', path: 'work_1.png' },
				{ id: 12, icon: 'zmdi zmdi-local-hotel', name: 'Living', path:'house_2.png' },
			];*/

		}
	]);
})();