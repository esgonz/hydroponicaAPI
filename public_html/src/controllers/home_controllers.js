console.log('initialize Angular app.js');


angular.module('dataqApp')
    .controller('HomeCtrl', function($rootScope, $scope, $location, localStorageService, Login) {

        $scope.token = localStorageService.get('token');
        console.log("$scope.token");
        console.log($scope.token);

        if($scope.token == null){
            window.location = "/login";
        }

        $scope.userLogin = Login.getCurrentUser();
                        if ($scope.userLogin != null) {
                            console.log("current user Ok");
                            console.log($scope.userLogin);
                        };
        /*$scope.mePromise = Login.me.getData({'token': $scope.token});
        $scope.mePromise.$promise.then(function (response) {
            //$scope.mePromise    = response;
            console.log( response);
        });*/
    })