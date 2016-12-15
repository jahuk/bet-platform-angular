angular.module('APP')

    .controller('MatchListCtrl', function MatchListCtrl($state, $q, $log, UsersService, FixturesService, PointsService) {
        var matchListCtrl = this;
        var matchId = $state.params.match;

        $q.all([
            UsersService.getUsers(),
            FixturesService.getFixtures()
        ]).then(success, error);

        function success(response) {
            var users = response[0];
            var fixtures = response[1];

            var match = fixtures[matchId];
            var goalsHome = match.result.goalsHomeTeam;
            var goalsAway = match.result.goalsAwayTeam;

            var fixture = goalsHome + '-' + goalsAway;
            var matchday = fixtures[matchId].matchday;

            matchListCtrl.users = users;

            _.forEach(users, function (user, index) {
                var userId = index;
                var userBets = user.bets;
                var bet = userBets[matchId].bet;

                matchListCtrl.users[userId].bet = bet;
                matchListCtrl.users[userId].points = PointsService.getPoints(bet, fixture, matchday);
            });

            matchListCtrl.homeTeamName = match.homeTeamName;
            matchListCtrl.awayTeamName = match.awayTeamName;
            matchListCtrl.result = fixture;
            matchListCtrl.users = UsersService.sortUsers(matchListCtrl.users);
        }

        function error(error) {
            $log.error('ERROR status', error.status);
        }
    });