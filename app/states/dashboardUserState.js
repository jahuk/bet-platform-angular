angular.module('dashboardUserState', [])
	.config(function($stateProvider){
		$stateProvider
			.state('EuroAPP.dashboard.user', {
				url: 'users/:user',
				views: {
					'test@': {
						controller: 'FixturesUserListCtrl as fixturesUserListCtrl',
						templateUrl: 'app/templates/fixturesUser.tmpl.html'
					}
				}
			});
	});