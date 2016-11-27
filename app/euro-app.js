angular.module('EuroAPP', [
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