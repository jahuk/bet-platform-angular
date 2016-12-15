angular.module('APP')

    .service('UsersService', function UsersListCtrl($http, $q, $log) {
        var model = this;
        var users;
        var URLS = {
            LOCATION: 'data/bets/',
            USERS: [
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
            ]
        };

        function excludeProp(array, prop) {
            return _.map(array, function (obj) {
                return _.omit(obj, prop);
            });
        }

        function extractUsers(result) {
            var extractedResult = [];

            _.forEach(result, function (user) {
                var userData = user.data;
                extractedResult[userData.id] = {
                    name: userData.name,
                    bets: excludeProp(userData.bets, 'id'),
                    points: 0
                }
            });

            return extractedResult;
        }

        function cacheUsers(result) {
            users = extractUsers(result);
            return users;
        }

        function error(error) {
            $log.error('ERROR status', error.status);
        }

        model.getUsers = function () {
            if (users) {
                return $q.when(users);

            } else {
                var usersPromises = [];
                _.forEach(URLS.USERS, function (name) {
                    var userPromise = $http({
                        url: URLS.LOCATION + name + '.json',
                        dataType: 'json',
                        type: 'GET'
                    });
                    usersPromises.push(userPromise);
                });
                return $q.all(usersPromises).then(cacheUsers, error);
            }
        };

        model.sortUsers = function (users) {
            var sortedUsers;
            sortedUsers = _.sortBy(users, ['points']).reverse();
            return sortedUsers;
        };

    });