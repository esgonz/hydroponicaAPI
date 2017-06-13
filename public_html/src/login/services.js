/**
 * Module dataQServerApp
 */
console.log('initialize Angular app.js');

angular.module('dataQServerApp', ['ngRoute', 'ngResource', 'ngMessages', 'LocalStorageModule'])
    .config( function( $routeProvider, $locationProvider, localStorageServiceProvider){
        //route config
        $routeProvider
            .when('/login/', {
                templateUrl:    'views/home/signin.html',
                controller:     'HomeCtrl'
            })
            .when('/me/', {
                templateUrl:    'views/home/me.html',
                controller:     'MeCtrl'
            })
            .otherwise({
                redirectTo:     '/login/'
            })

        $locationProvider 
            .html5Mode( true );
        
        localStorageServiceProvider
            .setPrefix('dataQServerApp')
            .setStorageType('sessionStorage')
            .setDefaultToCookie(false);
    })


    .controller('HomeCtrl', function($rootScope, $scope, $location, localStorageService, Main) {

        /*Verifi if token exists*/
        $rootScope.token = localStorageService.get('token');
        console.log("$rootScope.token");
        console.log($rootScope.token);

        if($rootScope.token != null){
            console.log("token exist");
            window.location = "/me";
        }


        $scope.signin = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }



        
            /* make a call to login signin */
            $scope.loginPromise = Main.signin.try(formData);
            $scope.loginPromise.$promise.then(function (response) {
                $scope.loginPromise    = response;
                
                /*if response its true*/
                if($scope.loginPromise.type){
                    //obtain the token
                    var token = $scope.loginPromise.token;
                    if (token != null) {                        

                        var storing = localStorageService.set('token', $scope.loginPromise.token);
                        
                        //if storage its ok,setting the current user, redirect to main page
                        if (storing){
                            alert("login ok!"); 
                            $rootScope.currentUser = Main.currentUser()._doc;
                            console.log("$rootScope.currentUser ");
                            console.log($rootScope.currentUser);
                            window.location = "/me";
                        }else{
                            console.log("error localStorage");
                        }
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


    .controller('MeCtrl', function($rootScope, $scope, $location, localStorageService, Main) {

        $scope.token = localStorageService.get('token');
        console.log("$scope.token");
        console.log($scope.token);

        if($scope.token == null){
            window.location = "/login";
        }

        $scope.mePromise = Main.me.getData({'token': $scope.token});
        $scope.mePromise.$promise.then(function (response) {
            //$scope.mePromise    = response;
            console.log( response);
        });
    })

