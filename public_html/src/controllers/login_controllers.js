/**
 * Module dataQServerLogin
 */
console.log('initialize Angular app.js');


angular.module('dataqApp')
    .controller('LoginCtrl', function($rootScope, $scope, $location, localStorageService, Login) {

        /*Verifi if token exists*/
        $rootScope.token = localStorageService.get('token');
        console.log("$rootScope.token");
        console.log($rootScope.token);

        if($rootScope.token != null){
            console.log("token exist");
            window.location = "/events";
        }


        $scope.signin = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }



        
            /* make a call to login signin */
            $scope.loginPromise = Login.signin.try(formData);
            $scope.loginPromise.$promise.then(function (response) {
                $scope.loginPromise    = response;
                
                /*if response its true*/
                if($scope.loginPromise.type){
                    //obtain the token
                    var token = $scope.loginPromise.token;
                    if (token != null) {                        
                        $scope.currentUser = Login.setToken(token);
                        if ($scope.currentUser != null) {
                            console.log("current user Ok");
                            window.location = "/login/home";
                        };
                        
                    }else{
                        console.log("error Token null");
                    }                      
                }else{
                    console.log("error signin, fals:" + $scope.loginPromise.data);
                    alert($scope.loginPromise.data);
                }                
            });
        };
    })
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

