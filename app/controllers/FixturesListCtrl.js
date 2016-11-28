angular.module('APP')

.controller('FixturesListCtrl', function FixturesListCtrl($rootScope, $state, $stateParams, $log, FixturesService) {
	var fixtureListCtrl = this;
	var userParam = $state.params.user;

	// console.log($state, $stateParams);

	$rootScope.$on('$locationChangeStart', function() {
		// console.log(userParam);
	});

	if (!userParam) {
		FixturesService.getFixtures()
			.then(success, error);

		function success(result) {
			fixtureListCtrl.fixtures = result;
		}

		function error(error) {
			$log.error('ERROR status', error.status);
		}
	}

});