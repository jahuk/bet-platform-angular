angular.module('APP', [
	'ngAnimate',
	'ui.router',
	'dashboardStates'
])
	.config(function($stateProvider){

		$stateProvider.state('APP', {
			url: '',
			abstract: true
		});

	})
;