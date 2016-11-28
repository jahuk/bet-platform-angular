angular.module('APP')

.controller('FixturesUserListCtrl', function FixturesUserListCtrl($state, $log, FixturesService) {
	var fixturesUserListCtrl = this;

	fixturesUserListCtrl.user = $state.params.user;

	FixturesService.getFixtures()
		.then(success, error);

	function success(result) {
		fixturesUserListCtrl.fixtures = result;
	}

	function error(error) {
		$log.error('ERROR status', error.status);
	}

});