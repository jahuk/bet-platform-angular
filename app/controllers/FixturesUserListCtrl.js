angular.module('APP')

    .controller('FixturesUserListCtrl', function FixturesUserListCtrl($state, $q, $log, UsersService, FixturesService, PointsService) {
        var fixturesUserListCtrl = this;
        var user = $state.params.user;

        fixturesUserListCtrl.user = user;

        $q.all([
            UsersService.getUsers(),
            FixturesService.getFixtures()
        ]).then(success, error);

        function success(response) {
            var users = response[0];
            var fixtures = response[1];
            var userBet = users.filter(function(obj){
				return obj.name === user;
			});

            fixturesUserListCtrl.fixtures = fixtures;
            fixturesUserListCtrl.userBets = userBet[0].bets;
            fixturesUserListCtrl.userPoints = fixturesUserListCtrl.userBets.map(function(obj, index){
            	var bet = obj.bet;
            	var goalsHome = fixtures[index].result.goalsHomeTeam;
                var goalsAway = fixtures[index].result.goalsAwayTeam;
                var matchday = fixtures[index].matchday;
            	var fixture = goalsHome + '-' + goalsAway;

            	return PointsService.getPoints(bet, fixture, matchday);
			});

        }

        function error(error) {
            $log.error('ERROR status', error.status);
        }

    });