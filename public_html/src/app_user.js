/**
 * Module dataQServerApp
 */
console.log('initialize Angular app.js');

angular.module('dataQServerApp', ['ngRoute', 'ngResource', 'ngMessages'])
    .config( function( $routeProvider, $locationProvider){
        //route config
        $routeProvider
            .when('/users/', {
                templateUrl:    'views/users/list.html',
                controller:     'listCtrl'
            })

            .when( '/users/nuevo', {
                templateUrl:    'views/users/new.html',
                controller:     'newCtrl'
            })

            .when( '/users/:id', {
                templateUrl:    'views/users/single.html',
                controller:     'singleCtrl'
            })

            .otherwise({
                redirectTo:     '/users/'
            })

        $locationProvider
            .html5Mode( true );
    })

    /*
        ListCtrl list users from the database, using angular factory
     */
    .controller( 'listCtrl', function( $scope, $rootScope, $location, User){

        console.log("listCtrl");
        $rootScope.PAGE         = "users";
        //pagination vars
        $scope.limitPagination  = [0, 10];
        $scope.incrementPagination = 1;
        $scope.totalPage = [];
        
        //user from DB
        $scope.userPromise    = User.query();
        
        $scope.userPromise.$promise.then(function (response) {
            
            //when the factory return the data, userPromise its ok
            $scope.userPromise    = response;

            //count the total users to use on pagination
            var auxTotalPage        = Math.ceil($scope.userPromise.length /10);
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
            $location.url('/userPromise/'+ id);
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

                $scope.limitPagination[0]   = ($scope.incrementPagination * 10) -10;
                $scope.limitPagination[1]   = $scope.incrementPagination * 10;
                console.log("$scope.limitPagination");
                console.log($scope.limitPagination);
                $scope.usersToShow          = $scope.userPromise.slice($scope.limitPagination[0], $scope.limitPagination[1]);
                console.log($scope.usersToShow);  

            
        };


            
    })

    /*
        Register a new user in the db using angular factory and connect via post express/nodejs
     */
    .controller( 'newCtrl', function( $scope, $rootScope, $location, $http, User, tiposService, mercadosService){

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
        var mercados = [];
        mercadosService.getData().then(function(result){
            for (var i = 0; i< result.data.length; i++) {               
                mercados.push({"name": result.data[i].name , "value": result.data[i].value});
            };
            $scope.userFields.mercado.push(mercados);
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
    .controller('singleCtrl', function($rootScope, $scope, $location , Evento, $routeParams, paisesService, mercadosService){
        $rootScope.PAGE = "single";
        $scope.evento = new Evento(
                                        {
                                            _id:            "", 
                                            eventoId:       "",
                                            nombre:         "",
                                            clave:          "",
                                            mes:            "",
                                            fechaInicio:    "",
                                            fechaTermino:   "",
                                            pais:           "",
                                            mercado:        "",
                                            disponible:     ""
                                        });

        $scope.eventoPromise   = Evento.get({id: $routeParams.id});
        $scope.eventoPromise.$promise.then(function (response) {
            $scope.eventoPromise = response;


            $scope.evento._id          = $scope.eventoPromise._id;
            $scope.evento.eventoId     = $scope.eventoPromise.eventoId;
            $scope.evento.nombre       = $scope.eventoPromise.nombre;
            $scope.evento.clave        = $scope.eventoPromise.clave;
            $scope.evento.mes          = $scope.eventoPromise.mes;
            $scope.evento.fechaInicio  = $scope.eventoPromise.fechaInicio;
            $scope.evento.fechaTermino = $scope.eventoPromise.fechaTermino;
            $scope.evento.pais         = $scope.eventoPromise.pais;
            $scope.evento.mercado      = $scope.eventoPromise.mercado;
            $scope.evento.disponible   = $scope.eventoPromise.disponible;

            $scope.eventoFields   =
            {
                eventoId:       ["text",        true ],
                nombre:         ["text",        true ],
                clave:          ["password",    true ],
                mes:            ["text",        false ],
                fechaInicio:    ["date",        true ],
                fechaTermino:   ["date",        true ],
                pais:           ["select",      true ],
                mercado:        ["select",      true ],
                disponible:     ["checkbox",    true ],
                eventoObj:      [$scope.evento, false]
            };


            var paises = [];
            paisesService.getData().then(function(result){
                for (var i = 0; i< result.data.length; i++) {               
                    paises.push({"name": result.data[i].name , "value": result.data[i].value});
                };
                $scope.eventoFields.pais.push(paises);
            });

            var mercados = [];
            mercadosService.getData().then(function(result){
                for (var i = 0; i< result.data.length; i++) {               
                    mercados.push({"name": result.data[i].name , "value": result.data[i].value});
                };
                $scope.eventoFields.mercado.push(mercados);
            }); 

            console.log($scope.eventoFields.evento);
        });//end then promise


        
        $scope.update   = function(){
            $scope.evento.$update({id: $scope.evento._id});
            $location.url('/eventos');

        };

        $scope.delete   = function(){
            $scope.evento.$delete({id: $scope.evento._id});
            $location.url('/eventos');

        };
    })*/






