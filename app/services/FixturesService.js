angular.module('APP')

.service('FixturesService', function UsersListCtrl($http, $q, $log, PointsService) {
	var model = this;
	var fixtures;
	var pureFixtures;
	var URLS = {
		FIXTURES: 'http://api.football-data.org/v1/soccerseasons/424/fixtures',
		TOKEN: 'd6d13ff9c73843b8ac45326b4d7b88d9'
	};

	/* FIXTURES */
	function cacheFixtures(result) {
		fixtures = extractFixtures(result);
		return fixtures;
	}

	function extractFixtures(result) {
		return result.data.fixtures;
	}

	/* PURE FIXTURES */
	function cachePureFixtures(result) {
		pureFixtures = extractPureFixtures(result);
		return pureFixtures;
	}

	function extractPureFixtures(result) {
		var extractedPureFixtures = [];

		_.forEach(result, function(fixture) {
			var homeGoals = fixture.result.goalsHomeTeam;
			var awayGoals = fixture.result.goalsAwayTeam;
			var divider = '-';

			extractedPureFixtures.push({
				bet : homeGoals + divider + awayGoals,
				matchday: fixture.matchday
			})
		});

		return extractedPureFixtures;
	}

	function error(error) {
		$log.error('ERROR status', error.status);
	}

	model.calculateUserPoints = function(userBets, fixtures) {
		var userPoints = 0;

		_.forEach(userBets, function(userBet,index) {
			var bet = userBet.bet;
			var fixture = fixtures[index].bet;
			var matchday = fixtures[index].matchday;

			userPoints += PointsService.getPoints(bet, fixture, matchday);
		});

		return userPoints;
	};

	model.getPureFixtures = function () {
		return model.getFixtures().then(cachePureFixtures);
	};

	model.getFixtures = function() {
		return (fixtures) ? $q.when(fixtures) : $http({
			headers: { 'X-Auth-Token': URLS.TOKEN },
			url: URLS.FIXTURES,
			dataType: 'json',
			type: 'GET'
		}).then(cacheFixtures, error);
	}
});