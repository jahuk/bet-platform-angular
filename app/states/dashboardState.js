angular.module('dashboardState', [])
	.config(function($stateProvider){
		$stateProvider
			.state('EuroAPP.dashboard', {
				url: '/',
				views: {
					'users@': {
						controller: 'UsersListCtrl as usersListCtrl',
						templateUrl: 'app/templates/users.tmpl.html'
					},
					'fixtures@': {
						controller: 'FixturesListCtrl as fixturesListCtrl',
						templateUrl: 'app/templates/fixtures.tmpl.html'
					}
				}
			});
	});