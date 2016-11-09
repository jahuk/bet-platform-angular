angular.module('Euro2016', [])
    .controller('MainCtrl', function($scope) {

        const PERFECT_POINTS = 3;
        const CLOSE_POINTS = 2;
        const SOME_POINTS = 1;

        const TOKEN = 'd6d13ff9c73843b8ac45326b4d7b88d9';
        const FIXTURES_URL = 'http://api.football-data.org/v1/soccerseasons/424/fixtures';
        const MATCH_FINISHED_STATUS = 'FINISHED';

        const betUsers = [
            'michalw',
            'paweln',
            'danielk',
            'joannai',
            'tog',
            'rafalm',
            'pawelk',
            'jakubn',
            'jaceks',
            'pawela',
            'darekw',
            'kasias',
            'jaceko',
            'witekd',
            'agnieszkab',
            'agnieszkad',
            'jagnak',
            'maciejo'
        ];

        $scope.matchesCompleted = 0;
        $scope.loaderVisible = true;
        $scope.userSelected = '';

        $scope.resultsFull = [];
        $scope.resultsSimple = [];
        $scope.allBets = [];

        $scope.users = [];

        // $scope.allBets = [
        //     {
        //         'id': 'id',
        //         'name': 'Example Name',
        //         'userBets': [
        //             {
        //                 'id': '0',
        //                 'bet': '2-1'
        //             }
        //         ]
        //     }
        // ];

        function transformToSimpleResults (resultsFull) {
            var resultsSimple = [];

            _.forEach(resultsFull, function(match, key) {

                var matchStatus = match.status;
                var matchGoalsHomeTeam = match.result.goalsHomeTeam;
                var matchGoalsAwayTeam = match.result.goalsAwayTeam;

                if (matchStatus === MATCH_FINISHED_STATUS) {
                    $scope.matchesCompleted++;
                    resultsSimple.push({
                        'id': key,
                        'result': matchGoalsHomeTeam + '-' + matchGoalsAwayTeam
                    });
                }
            });

            return resultsSimple;
        }

        function getResults() {
            var resultCall = $.Deferred();

            $.ajax({
                headers: { 'X-Auth-Token': TOKEN },
                url: FIXTURES_URL,
                dataType: 'json',
                type: 'GET'
            }).done(function(response) {
                var fixtures = response.fixtures;
                $scope.resultsFull = fixtures;
                $scope.resultsSimple = transformToSimpleResults($scope.resultsFull);
                resultCall.resolve();
            });

            return resultCall;
        }

        function getBets() {
            var allUsersBets = [];

            _.forEach(betUsers, function(name) {

                var betsCall = $.Deferred();

                $.ajax({
                    url: 'bets/' + name + '.json',
                    dataType: 'json',
                    type: 'GET'
                })
                .done(function(user) {
                    var userBets = {
                        'id': user.id,
                        'name': user.name,
                        'userBets': user.bets
                    };
                    $scope.allBets.push(userBets);
                    betsCall.resolve();
                })
                .fail(function(){
                    console.error('ENDPOINT FAILED');
                });

                allUsersBets.push(betsCall);

            });

            return $.when.apply(undefined, allUsersBets).promise();
        }

        function compareBetResult(userBet, result) {
            var pointsToAdd = 0;

            if (userBet === '-') {
                pointsToAdd = 0;
            } else if (userBet === result) {
                pointsToAdd = PERFECT_POINTS;
            } else {

                var userBetHomeGoals = parseInt(userBet[0]);
                var userBetAwayGoals = parseInt(userBet[2]);
                var resultHomeGoals = parseInt(result[0]);
                var resultAwayGoals = parseInt(result[2]);
                var winnerResult;
                var winnerUserBet;

                // result
                if ( resultHomeGoals > resultAwayGoals ) {
                    winnerResult = 'home';
                } else if ( resultHomeGoals === resultAwayGoals ) {
                    winnerResult = 'none';
                } else {
                    winnerResult = 'away';
                }

                // user bet
                if ( userBetHomeGoals > userBetAwayGoals ) {
                    winnerUserBet = 'home';
                } else if ( userBetHomeGoals === userBetAwayGoals ) {
                    winnerUserBet = 'none';
                } else {
                    winnerUserBet = 'away';
                }

                if (winnerResult === winnerUserBet) {

                    // with winner
                    if (winnerResult === 'home' || winnerResult === 'away') {

                        var userBetGoalsDiff = userBetHomeGoals - userBetAwayGoals;
                        var resultGoalsDiff = resultHomeGoals - resultAwayGoals;

                        if (userBetGoalsDiff === resultGoalsDiff) {
                            pointsToAdd = CLOSE_POINTS;
                        }
                        else {
                            pointsToAdd = SOME_POINTS;
                        }

                    }
                    // without winner - draw
                    else {
                        var userBetGoals = userBetHomeGoals;
                        var resultGoals = resultHomeGoals;
                        var goalsDifference = userBetGoals - resultGoals;

                        if ( goalsDifference === -1 || goalsDifference === 1 ) {
                            pointsToAdd = CLOSE_POINTS;
                        } else {
                            pointsToAdd = SOME_POINTS;
                        }
                    }

                    // without winner

                } else {
                    pointsToAdd = 0;
                }
            }


            return pointsToAdd;
        }

        function calculateUserPoints() {

            // all users
            _.forEach($scope.allBets, function(userBets) {

                $scope.users.push({
                    'id': userBets.id,
                    'name': userBets.name,
                    'points': 0
                });

                // all user's bets
                _.forEach(userBets.userBets, function(userBet) {

                    var userBetMatch = userBet.bet;
                    var userBetMatchId = userBet.id;

                    if ($scope.resultsSimple[userBetMatchId]) {
                        var matchResult = $scope.resultsSimple[userBetMatchId].result;
                        var user = _.find($scope.users, ['id', userBets.id]);
                        var pointsToAdd = compareBetResult(userBetMatch, matchResult);

                        if (pointsToAdd > 0 && userBetMatchId > 35) {
                            pointsToAdd = pointsToAdd*2;
                        }

                        user.points += pointsToAdd;
                    }
                });
            });
        }

        function sortTable() {
            $scope.users = _.sortBy($scope.users, ['points']).reverse();
        }

        function getBetByUser(allBets, userName, index) {
            var user = _.find(allBets, function(user) {
                return user.name === userName;
            });
            return user.userBets[index].bet;
        }
        $scope.getBetByUser = getBetByUser;

        function getPoints(bet, result, matchday) {
            var res = result.goalsHomeTeam + '-' + result.goalsAwayTeam;
            var points = compareBetResult(bet, res);

            if (points > 0 && matchday > 3) {
                points = points*2;
            }

            return points;
        }
        $scope.getPoints = getPoints;
        
        function init() {
            $.when( getResults(), getBets() )
                .done(function(){
                    calculateUserPoints();
                    sortTable();
                    $scope.loaderVisible = false;
                    $scope.$apply();
                });
        }

        init();

    });