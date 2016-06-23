(function () {
	var app = angular.module(appName);

	app.controller('MainCtrl', ['$scope', '$localStorage',
		function ($scope, $localStorage) {
			$scope.appName = appName;

			$scope.hideMask = function($event) {
				$event.target.classList.add('hidden');
			};

			var placeFeed = JSON.parse('[{"title":"خانه","address":"Some where near","date":"2016-06-10T14:06:47.021Z"},{"title":"Work"},{"title":"University"},{"title":"Resturant"}]');
			if (!$localStorage.places)
				$localStorage.places = placeFeed;

			$scope._placeTypes = [
				{icon: 'zmdi zmdi-hc-lg zmdi-home', name:'Home'},

				{icon: 'zmdi zmdi-hc-lg zmdi-local-activity', name:'Activity'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-airport', name:'Airport'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-atm', name:'Atm'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-bar', name:'Bar'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-cafe', name:'Cafe'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-car-wash', name:'Car Wash'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-convenience-store', name:'Convenience Store'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-dining', name:'Dining'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-drink', name:'Drink'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-florist', name:'Florist'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-gas-station', name:'Gas Station'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-grocery-store', name:'Grocery Store'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-hospital', name:'Hospital'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-hotel', name:'Hotel'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-laundry-service', name:'Laundry Service'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-library', name:'Library'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-mall', name:'Mall'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-movies', name:'Movies'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-offer', name:'Offer'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-parking', name:'Parking'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-pharmacy', name:'Pharmacy'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-phone', name:'Phone'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-pizza', name:'Pizza'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-activity', name:'Activity'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-post-office', name:'Post Office'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-printshop', name:'Printshop'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-see', name:'See'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-shipping', name:'Shipping'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-store', name:'Store'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-taxi', name:'Taxi'},
				{icon: 'zmdi zmdi-hc-lg zmdi-local-wc', name:'Wc'},
			];

		}
	]);
})();