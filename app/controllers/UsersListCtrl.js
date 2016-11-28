angular.module('APP')

.controller('UsersListCtrl', function UsersListCtrl($q, $log, UsersService, FixturesService) {
	var usersListCtrl = this;

	$q.all([
		UsersService.getUsers(),
		FixturesService.getPureFixtures()
	]).then(success, error);

	function success(response) {
		var users = response[0];
		var fixtures = response[1];

		usersListCtrl.users = users;

		_.forEach(users, function(user, index) {
			var userId = index;
			var userBets = user.bets;

			usersListCtrl.users[userId].points = FixturesService.calculateUserPoints(userBets, fixtures);
		});

		usersListCtrl.users = UsersService.sortUsers(usersListCtrl.users);
	}

	function error(error) {
		$log.error('ERROR status', error.status);
	}

});