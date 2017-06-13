/**
 * Module dataQServerApp
 */
console.log('initialize Angular app.js');

angular.module('dataQServerApp', ['ngRoute', 'ngResource', 'ngMessages'])
    .config( function( $routeProvider, $locationProvider){
        //route config
        $routeProvider
            .when('/eventos/', {
                templateUrl:    'views/list.html',
                controller:     'listCtrl'
            })

            .when( '/evento/nuevo', {
                templateUrl:    'views/new.html',
                controller:     'newCtrl'
            })

            .when( '/evento/:id', {
                templateUrl:    'views/single.html',
                controller:     'singleCtrl'
            })

            .otherwise({
                redirectTo:     '/eventos/'
            })

        $locationProvider
            .html5Mode( true );
    })

    .controller( 'listCtrl', function( $scope, $rootScope, $location, Evento){

        console.log("listCtrl");
        $rootScope.PAGE         = "eventos";
        $scope.limitPagination  = [0, 10];
        $scope.incrementPagination = 1;
        $scope.totalPage = [];
        $scope.eventoPromise    = Evento.query();
        
        $scope.eventoPromise.$promise.then(function (response) {
            $scope.eventoPromise    = response;

            var auxTotalPage        = Math.ceil($scope.eventoPromise.length /10);
            for (var i = 0; i < auxTotalPage; i++) {
                $scope.totalPage.push(i);
            };
            console.log("$scope.totalPage");
            console.log($scope.totalPage);
            $scope.eventosToShow    = $scope.eventoPromise.slice($scope.limitPagination[0], $scope.limitPagination[1]);        
            console.log($scope.eventosToShow);
        });    
        
        $scope.show     = function (id){
            $location.url('/evento/'+ id);
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
                $scope.eventosToShow        = $scope.eventoPromise.slice($scope.limitPagination[0], $scope.limitPagination[1]);
                console.log($scope.eventosToShow);  

            
        };


            
    })

    .controller( 'newCtrl', function( $scope, $rootScope, $location, $http, Evento, paisesService, mercadosService){

        console.log("newCtrl");
        $rootScope.PAGE = "new";


        $scope.eventoFields   =
            {
                eventoId:       ["text", true],
                nombre:         ["text", true],
                clave:          ["password", true],
                mes:            ["text", false],
                fechaInicio:    ["date", true],
                fechaTermino:   ["date", true],
                pais:           ["select", true],
                mercado:        ["select", true],
                disponible:     ["checkbox", true],
                eventoObj:      [   
                                    new Evento(
                                        {
                                            eventoId:       "",
                                            nombre:         "",
                                            clave:          "",
                                            mes:            "",
                                            fechaInicio:    "",
                                            fechaTermino:   "",
                                            pais:           "",
                                            mercado:        "",
                                            disponible:     ""
                                        }), 
                                    false
                                ]
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



        

        $scope.save = function(){


            //validando "nuevoEvento"-> formulario
            if($scope.nuevoEvento.$invalid){
                console.log("invalid save event from ctrl");
                console.log($scope.eventoFields.eventoObj[0]);
                //broadcast usando angular Message
                //$scope.broadcast('record:invalid');
            }else{
                console.log("save event from ctrl ok");
                console.log($scope.eventoFields.eventoObj[0]);

                $scope.eventoFields.eventoObj[0].$insert();
                $location.url("/eventos");
            }

        }            
    })

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
    })






