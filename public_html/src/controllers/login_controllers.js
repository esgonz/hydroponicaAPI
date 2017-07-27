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

        $scope.error = "";
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
                            window.location = "/home";
                        };
                        
                    }else{
                        console.log("error Token null");
                    }                      
                }else{
                    console.log("error signin, fals:" + $scope.loginPromise.data);
                    $scope.error = $scope.loginPromise.data;
                }                
            });
        };
    })


