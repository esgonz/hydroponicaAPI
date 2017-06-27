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

        $locationProvider 
            .html5Mode( true );
        
        localStorageServiceProvider
            .setPrefix('dataqApp')
            .setStorageType('sessionStorage')
            .setDefaultToCookie(false);
    })

