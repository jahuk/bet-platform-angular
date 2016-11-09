angular.module('EuroAPP', [
	'ngAnimate',
	'ui.router',
	'dashboardState',
	'dashboardUserState'
])
	.config(function($stateProvider, $urlRouterProvider){

		$stateProvider.state('EuroAPP', {
			url: '',
			abstract: true
		});

		$urlRouterProvider.otherwise('/');

	})
;