/**
 * Module dataqApp
 */
console.log('initialize Angular app.js');

angular.module('dataqApp', ['ngRoute', 'ngResource', 'ngMessages', 'LocalStorageModule'])
    .config( function( $routeProvider, $locationProvider, localStorageServiceProvider){
        //route config
        $routeProvider
            .when('/login/', {
                templateUrl:    'views/login/signin.html',
                controller:     'LoginCtrl'
            })
            .when('/login/home', {
                templateUrl:    'views/login/home.html',
                controller:     'HomeCtrl'
            })
            .when('/users/', {
                templateUrl:    'views/users/list.html',
                controller:     'ListUserCtrl'
            })

            .when( '/users/new', {
                templateUrl:    'views/users/new.html',
                controller:     'NewUserCtrl'
            })

            .when( '/users/:id', {
                templateUrl:    'views/users/single.html',
                controller:     'SingleUserCtrl'
            })
           
            .when('/events/', {
                templateUrl:    'views/events/list.html',
                controller:     'ListEventCtrl'
            })

            .when( '/events/new', {
                templateUrl:    'views/events/new.html',
                controller:     'NewEventCtrl'
            })

            .when( '/events/:id', {
                templateUrl:    'views/events/single.html',
                controller:     'SingleEventCtrl'
            })

        $locationProvider 
            .html5Mode( true );
        
        localStorageServiceProvider
            .setPrefix('dataqApp')
            .setStorageType('sessionStorage')
            .setDefaultToCookie(false);
    })

    .run('', function(Login){
        /*Verifi if token exists*/
        $rootScope.token = localStorageService.get('token');
        console.log("$rootScope.token");
        console.log($rootScope.token);

        if($rootScope.token != null){
            console.log("token exist");
            window.location = "/login/home";
            $scope.user =  Login.getCurrentUser();
            console.log("user");
            console.log($scope.user);
        }


    })








