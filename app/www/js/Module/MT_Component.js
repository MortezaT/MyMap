(function () {
	angular
		.module('MT_Component', [])
		.filter(
			'titlecase', function () {
				return input => input ? input[0].toUpperCase() + input.substr(1) : '';
			});
})();