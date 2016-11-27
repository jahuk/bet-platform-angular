angular.module('dashboardStates', [])
	.config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.when('', '/home');

		$stateProvider
			.state('APP.dashboard', {
				url: '/home',
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
			})
            .state('APP.user', {
                url: '/user/:user',
                views: {
                    'fixturesUser@': {
                        controller: 'FixturesUserListCtrl as fixturesUserListCtrl',
                        templateUrl: 'app/templates/fixturesUser.tmpl.html'
                    }
                }
            });

	});