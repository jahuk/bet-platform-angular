angular.module('APP')

    .directive('loading', ['$http', function ($http) {
        return {
            restrict: 'A',
            link: function (scope, loader) {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };
                scope.$watch(scope.isLoading, function (isLoading) {
                    if (isLoading) {
                        loader.show();
                    } else {
                        loader.hide();
                    }
                });
            }
        };

    }]);