console.log('initialize Angular app.js');


angular.module('dataqApp')
    .controller('HomeCtrl', function($rootScope, $scope, $location, localStorageService, Login) {

        $scope.token = localStorageService.get('token');
        console.log("$scope.token");
        console.log($scope.token);

        if($scope.token == null){
            window.location = "/login";
        }

        $scope.currentUser = Login.getCurrentUser();
                        if ($scope.currentUser != null) {
                            console.log("current user Ok");
                            console.log($scope.currentUser);
                        };
        /*$scope.mePromise = Login.me.getData({'token': $scope.token});
        $scope.mePromise.$promise.then(function (response) {
            //$scope.mePromise    = response;
            console.log( response);
        });*/
    })