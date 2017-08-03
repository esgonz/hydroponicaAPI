    /*
        ListCtrl list users from the database, using angular factory
     */
angular.module('dataqApp')
    .controller( 'ListUserCtrl', function( $scope, $rootScope, $location, User, Login){

        console.log("ListUserCtrl");
        //verify login
        $scope.login           = Login.verifySession();


        var QTYPAGE = 15;
        $rootScope.PAGE         = "users";
        var limitPagination  = [0, QTYPAGE];
        var incrementPagination = 1;
        var totalPage = [];
        
        //user from DB
        $scope.userPromise    = User.getAll();
        
        $scope.userPromise.$promise.then(function (response) {
            
            //when the factory return the data, userPromise its ok
           $scope.userPromise    = response;

            //if exists something wrong with the login
            if ($scope.userPromise.length <= 1 ) {
                console.log("poor promise");
                var response = $scope.userPromise[0];
                if (response.type == false) {
                    console.log("Login problems!");
                    return;
                };
               
            };

            var auxTotalPage        = Math.ceil($scope.userPromise.length / QTYPAGE);
            for (var i = 0; i < auxTotalPage; i++) {
                totalPage.push(i);
            };
            console.log("totalPage");
            console.log(totalPage);
            $scope.usersToShow    = $scope.userPromise.slice(limitPagination[0], limitPagination[1]);
            console.log($scope.usersToShow);
        });    
        

        $scope.show     = function (id){
            $location.url('/users/'+ id);
        };

        $scope.pagination = function (increment){
            if(increment =='prev'){
                console.log("prev page");
                if ($scope.incrementPagination > 1){
                    $scope.incrementPagination = $scope.incrementPagination - 1;
                }
            }
            else if(increment =='next'){
                console.log("next page");
                if ($scope.incrementPagination < $scope.totalPage.length-1){
                    $scope.incrementPagination = $scope.incrementPagination + 1;
                }
            }
            else{
                $scope.incrementPagination    = increment;                
            }

                $scope.limitPagination[0]   = ($scope.incrementPagination * QTYPAGE) -QTYPAGE;
                $scope.limitPagination[1]   = $scope.incrementPagination * QTYPAGE;
                console.log("$scope.limitPagination");
                console.log($scope.limitPagination);
                $scope.usersToShow          = $scope.userPromise.slice($scope.limitPagination[0], $scope.limitPagination[1]);
                console.log($scope.usersToShow);  

            
        };


            
    })

    /*
        Register a new user in the db using angular factory and connect via post express/nodejs
     */
    .controller( 'NewUserCtrl', function( $scope, $rootScope, $location, $http, User, 
        camposUserServices, tiposService, marketsService, Login){

        console.log("newCtrl");
        $scope.login        = Login.verifySession();

        $rootScope.PAGE     = "new";
        $scope.errors       = {};
        $scope.userFields   =
            {
                userId:         ["text",        false],
                name:           ["text",        true],
                email:          ["email",       true],
                password:       ["password",    true],
                market:         ["select",      true],
                type:           ["select",      true],
                status:         ["checkbox",    true],                
                userObj:       [
                                    new User(
                                        {
                                            userId:     "",
                                            name:       "",
                                            email:      "",
                                            password:   "",
                                            market:     "",
                                            type:       "",
                                            status:     ""                                            
                                        }),
                                    false
                                ]
            };


        var type = [];

        tiposService.getData().then(function(result){
            var userLogin = Login.getCurrentUser();
            /*for (var i = 0; i< result.data.length; i++) {
                type.push({"name": result.data[i].name , "value": result.data[i].value});
            };*/
            //$scope.userFields.type.push(type);
            
            for (var i = 0; i< result.data.length; i++) {
                if (userLogin.type == "superuser") {
                    type.push({"name": result.data[i].name , "value": result.data[i].value});
                }
                else if (userLogin.type != "superuser") {

                    if( result.data[i].value !="superuser" ){
                        console.log("mercado objetivo encontrado");
                        type.push({"name": result.data[i].name , "value": result.data[i].value});
                    }
                    
                }                  
  


                
            };
            $scope.userFields.type.push(type);


        });

        var markets = [];


        marketsService.getData().then(function(result){
             var userLogin = Login.getCurrentUser();
             if (userLogin == null || userLogin === undefined ) {
                return;
             };

            for (var i = 0; i< result.data.length; i++) {
                if (userLogin.type == "superuser") {
                    markets.push({"name": result.data[i].name , "value": result.data[i].value});
                }else{
                    if ( result.data[i].value.toLowerCase() == userLogin.market.toLowerCase()){
                        console.log("mercado objetivo encontrado");
                        markets.push({"name": result.data[i].name , "value": result.data[i].value}); 
                    }
                }
                
            };
            $scope.userFields.market.push(markets);
        });





        $scope.save = function(){
            if (Object.keys($scope.errors).length >= 1) {
                console.log("Existe errores");
                return;
            };

            //validando "newUser"-> formulario
            if($scope.newUser.$invalid){
                console.log("invalid save user from ctrl");
                console.log($scope.userFields.userObj[0]);
                //broadcast usando angular Message
                //$scope.broadcast('record:invalid');
            }else{
                console.log("save event from ctrl ok");
                console.log($scope.userFields.userObj[0]);

                $scope.userFields.userObj[0].$insert({'token': $scope.login.token});
                $location.url("/users");
            }

        }
    })
    
    
    .controller('SingleUserCtrl', function($rootScope, $scope, $location , User, $routeParams, marketsService, tiposService, Login){
        console.log('SingleUserCtrl')
        $scope.login        = Login.verifySession();
        $rootScope.PAGE     = "single User";
        $scope.user         =  new User(
                            {
                                userId:     "",
                                name:       "",
                                email:      "",
                                password:   "",
                                market:     "",
                                type:       "",
                                status:     ""    
                            }
                        );
        $scope.errors           = {};
        $scope.userPromise      = User.get({id: $routeParams.id});
        $scope.userPromise.$promise.then(function (response) {
            $scope.userPromise          = response;
            $scope.user._id             = $scope.userPromise._id;
            $scope.user.userId          = $scope.userPromise.userId;
            $scope.user.name            = $scope.userPromise.name;
            $scope.user.email           = $scope.userPromise.email;
            $scope.user.password        = "";
            $scope.user.market          = $scope.userPromise.market;
            $scope.user.type            = $scope.userPromise.type;
            $scope.user.status          = $scope.userPromise.status;

            $scope.userFields   =
            {
                userId:     ["text",        false ],
                name:       ["text",        true ],
                email:      ["email",       true ],
                password:   ["password",    true ],
                market:     ["select",      true ],
                type:       ["select",      true ],
                status:     ["checkbox",    true ],
                userObj:    [$scope.user, false]
               
            };


            var type = [];
            tiposService.getData().then(function(result){
                for (var i = 0; i< result.data.length; i++) {
                    type.push({"name": result.data[i].name , "value": result.data[i].value});
                };
                $scope.userFields.type.push(type);
            });

            var markets = [];
            marketsService.getData().then(function(result){

                var userLogin = Login.getCurrentUser();
                 if (userLogin == null || userLogin === undefined ) {
                    return;
                 };

                for (var i = 0; i< result.data.length; i++) {
                    if (userLogin.type == "superuser") {
                        markets.push({"name": result.data[i].name , "value": result.data[i].value});
                    }else{
                        if ( result.data[i].value.toLowerCase() == userLogin.market.toLowerCase()){
                            console.log("mercado objetivo encontrado");
                            markets.push({"name": result.data[i].name , "value": result.data[i].value}); 
                        }
                    }
                    
                };
                $scope.userFields.market.push(markets);
            });

            console.log($scope.userFields.event);
        });//end then promise



        $scope.update   = function(){
            if (Object.keys($scope.errors).length >= 1) {
                console.log("Existe errores");
                return;
            };

            $scope.user.$update({id: $scope.user._id});
            $location.url('/users');

        };

        $scope.delete   = function(){
            $scope.user.$delete({id: $scope.user._id});
            $location.url('/users');

        };
    })