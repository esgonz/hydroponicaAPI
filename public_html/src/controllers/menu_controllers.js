/**
 * Module dataQServerLogin
 */
console.log('initialize Angular app.js');


angular.module('dataqApp')
    .controller('navMenuCtrl', function($rootScope, $scope, Login) {

        $scope.user = Login.getCurrentUser();
        console.log($scope.user);


        $scope.logout = function() {
            Login.logout();
        
        };
    })

