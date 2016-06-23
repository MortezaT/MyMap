var appName = 'my Map';
(function () {

	var app = ons.bootstrap(appName, ['onsen', 'ngStorage', 'MT_Component']);

	app.config(['$localStorageProvider',
		function (storageProvider) {
			storageProvider.setKeyPrefix(`${appName}-`);
			storageProvider.setSerializer(value =>
				value.stringify ? value.stringify() : angular.toJson(value));
		}
	]);
})();