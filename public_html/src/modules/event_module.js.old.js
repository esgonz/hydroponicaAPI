/**
 * Module dataqApp
 */
console.log('initialize Angular app.js');

angular.module('dataqApp', ['ngRoute', 'ngResource', 'ngMessages','dataqLogin'])
    .config( function( $routeProvider, $locationProvider){
        //route config
        $routeProvider
            .when('/events/', {
                templateUrl:    'views/events/list.html',
                controller:     'ListEventCtrl'
            })

            .when( '/event/nuevo', {
                templateUrl:    'views/events/new.html',
                controller:     'NewEventCtrl'
            })

            .when( '/event/:id', {
                templateUrl:    'views/events/single.html',
                controller:     'SingleEventCtrl'
            })

            /*

            .otherwise({
                redirectTo:     '/events/'
            })
            */

        $locationProvider
            .html5Mode( true );
    })






