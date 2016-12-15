angular.module('APP')

    .service('PointsService', function UsersListCtrl() {
        var model = this;

        const MAX_POINTS = 3;
        const MID_POINTS = 2;
        const MIN_POINTS = 1;
        const MULTIPLIER_POINTS = 2;

        model.getPoints = function (bet, fixture, matchday) {
            var points = 0;

            if (bet === '-') {
                points = 0;
            } else if (bet === fixture) {
                points = MAX_POINTS;
            } else {

                var betHomeGoals = parseInt(bet[0]);
                var betAwayGoals = parseInt(bet[2]);
                var fixtureHomeGoals = parseInt(fixture[0]);
                var fixtureAwayGoals = parseInt(fixture[2]);
                var winnerFixture;
                var winnerBet;

                // fixture
                if (fixtureHomeGoals > fixtureAwayGoals) {
                    winnerFixture = 'home';
                } else if (fixtureHomeGoals === fixtureAwayGoals) {
                    winnerFixture = 'none';
                } else {
                    winnerFixture = 'away';
                }

                // bet
                if (betHomeGoals > betAwayGoals) {
                    winnerBet = 'home';
                } else if (betHomeGoals === betAwayGoals) {
                    winnerBet = 'none';
                } else {
                    winnerBet = 'away';
                }

                if (winnerFixture === winnerBet) {

                    // with winner
                    if (winnerFixture === 'home' || winnerFixture === 'away') {

                        var betGoalsDiff = betHomeGoals - betAwayGoals;
                        var fixtureGoalsDiff = fixtureHomeGoals - fixtureAwayGoals;

                        if (betGoalsDiff === fixtureGoalsDiff) {
                            points = MID_POINTS;
                        }
                        else {
                            points = MIN_POINTS;
                        }

                    }
                    // without winner - draw
                    else {
                        var betGoals = betHomeGoals;
                        var fixtureGoals = fixtureHomeGoals;
                        var goalsDifference = betGoals - fixtureGoals;

                        if (goalsDifference === -1 || goalsDifference === 1) {
                            points = MID_POINTS;
                        }
                        else {
                            points = MIN_POINTS;
                        }
                    }

                    // without winner

                } else {
                    points = 0;
                }
            }

            if (matchday > 3) {
                points *= MULTIPLIER_POINTS;
            }

            return points;
        }

    });