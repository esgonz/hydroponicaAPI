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
        $scope.incrementPagination = 1;
        $scope.totalPage = [];
        
        //user from DB
        $scope.userPromise    = User.query();
        
        $scope.userPromise.$promise.then(function (response) {
            
            //when the factory return the data, userPromise its ok
            $scope.userPromise    = response;

            //count the total users to use on pagination
            var auxTotalPage        = Math.ceil($scope.userPromise.length /QTYPAGE);
            for (var i = 0; i < auxTotalPage; i++) {
                $scope.totalPage.push(i);
            };
            console.log("$scope.totalPage");
            console.log($scope.totalPage);

            //crop the list of user in function of the pagination
            $scope.usersToShow    = $scope.userPromise.slice($scope.limitPagination[0], $scope.limitPagination[1]);        
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
    .controller( 'NewUserCtrl', function( $scope, $rootScope, $location, $http, User, tiposService, marketsService){

        console.log("newCtrl");
        $rootScope.PAGE = "new";

        $scope.userFields   =
            {
                userId:         ["text", true],
                name:           ["text", true],
                email:          ["email", true],
                password:       ["password", false],
                market:         ["text", true],
                type:           ["text", true],
                status:         ["checkbox", true],
                userObj:      [   
                                    new User(
                                        {
                                            userId:     "",
                                            nombnamere: "",
                                            email:      "",
                                            password:   "",
                                            market:     "",
                                            type:       "",
                                            status:     ""
                                        }), 
                                    false
                                ]
            };

        //find the tipos with the service
        var tipos = [];
        tiposService.getData().then(function(result){
            for (var i = 0; i< result.data.length; i++) {               
                tipos.push({"name": result.data[i].name , "value": result.data[i].value});
            };
            $scope.userFields.tipo.push(tipos);
        });

        //find the market with the service
        var markets = [];
        marketsService.getData().then(function(result){
            for (var i = 0; i< result.data.length; i++) {               
                markets.push({"name": result.data[i].name , "value": result.data[i].value});
            };
            $scope.userFields.market.push(markets);
        });                  



        

        $scope.save = function(){


            //validando "nuevoUsuario"-> formulario
            if($scope.nuevoUsuario.$invalid){
                console.log("invalid save user from ctrl");
                console.log($scope.userFields.userObj[0]);
                //broadcast usando angular Message
                //$scope.broadcast('record:invalid');
            }else{
                console.log("save user from ctrl ok");
                console.log($scope.userFields.userObj[0]);

                $scope.userFields.userObj[0].$insert();
                $location.url("/users");
            }

        }            
    })
    
    /*
    .controller('SingleUserCtrl', function($rootScope, $scope, $location , Event, $routeParams, paisesService, marketsService){
        $rootScope.PAGE = "single";
        $scope.event = new Event(
                                        {
                                            _id:            "", 
                                            eventId:       "",
                                            nombre:         "",
                                            clave:          "",
                                            month:            "",
                                            initDate:    "",
                                            endDate:   "",
                                            country:           "",
                                            market:        "",
                                            status:     ""
                                        });

        $scope.eventPromise   = Event.get({id: $routeParams.id});
        $scope.eventPromise.$promise.then(function (response) {
            $scope.eventPromise = response;


            $scope.event._id          = $scope.eventPromise._id;
            $scope.event.eventId     = $scope.eventPromise.eventId;
            $scope.event.nombre       = $scope.eventPromise.nombre;
            $scope.event.clave        = $scope.eventPromise.clave;
            $scope.event.month          = $scope.eventPromise.month;
            $scope.event.initDate  = $scope.eventPromise.initDate;
            $scope.event.endDate = $scope.eventPromise.endDate;
            $scope.event.country         = $scope.eventPromise.country;
            $scope.event.market      = $scope.eventPromise.market;
            $scope.event.status   = $scope.eventPromise.status;

            $scope.eventFields   =
            {
                eventId:       ["text",        true ],
                nombre:         ["text",        true ],
                clave:          ["password",    true ],
                month:            ["text",        false ],
                initDate:    ["date",        true ],
                endDate:   ["date",        true ],
                country:           ["select",      true ],
                market:        ["select",      true ],
                status:     ["checkbox",    true ],
                eventObj:      [$scope.event, false]
            };


            var paises = [];
            paisesService.getData().then(function(result){
                for (var i = 0; i< result.data.length; i++) {               
                    paises.push({"name": result.data[i].name , "value": result.data[i].value});
                };
                $scope.eventFields.country.push(paises);
            });

            var markets = [];
            marketsService.getData().then(function(result){
                for (var i = 0; i< result.data.length; i++) {               
                    markets.push({"name": result.data[i].name , "value": result.data[i].value});
                };
                $scope.eventFields.market.push(markets);
            }); 

            console.log($scope.eventFields.event);
        });//end then promise


        
        $scope.update   = function(){
            $scope.event.$update({id: $scope.event._id});
            $location.url('/events');

        };

        $scope.delete   = function(){
            $scope.event.$delete({id: $scope.event._id});
            $location.url('/events');

        };
    })*/