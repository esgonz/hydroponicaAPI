/**
 * Module dataQServerLogin
 */
console.log('initialize Angular app.js');


angular.module('dataqApp')
    .controller('navMenuCtrl', function($rootScope, $scope, Login) {

        $scope.userLogin = Login.getCurrentUser();
        console.log($scope.userLogin);


        $scope.logout = function() {
            Login.logout();
        
        };
    })

