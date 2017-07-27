angular.module('dataqApp')
    .controller( 'ListEventCtrl', function( $scope, $rootScope, $location, Event, Login){

        console.log("listCtrl");
        //verify login
        $scope.login           = Login.verifySession();

        //page vars
        var QTYPAGE = 15;
        $rootScope.PAGE         = "events";
        var limitPagination  = [0, QTYPAGE];
        var incrementPagination = 1;
        var totalPage = [];
        $scope.eventPromise    = Event.getAll();

        $scope.eventPromise.$promise.then(function (response) {
            $scope.eventPromise    = response;

            //if exists something wrong with the login
            if ($scope.eventPromise.length <= 1 ) {
                console.log("poor promise");
                var response = $scope.eventPromise[0];
                if (response.type == false) {
                    console.log("Login problems!");
                    return;
                };
               
            };

            var auxTotalPage        = Math.ceil($scope.eventPromise.length / QTYPAGE);
            for (var i = 0; i < auxTotalPage; i++) {
                totalPage.push(i);
            };
            console.log("totalPage");
            console.log(totalPage);
            $scope.eventsToShow    = $scope.eventPromise.slice(limitPagination[0], limitPagination[1]);
            console.log($scope.eventsToShow);
        });

        $scope.show     = function (id){
            $location.url('/events/'+ id);
        };

        $scope.pagination = function (increment){
            if(increment =='prev'){
                console.log("prev page");
                if (incrementPagination > 1){
                    incrementPagination = incrementPagination - 1;
                }
            }
            else if(increment =='next'){
                console.log("next page");
                if (incrementPagination < totalPage.length-1){
                    incrementPagination = incrementPagination + 1;
                }
            }
            else{
                incrementPagination    = increment;
            }

                limitPagination[0]   = (incrementPagination * QTYPAGE) - QTYPAGE;
                limitPagination[1]   = incrementPagination * QTYPAGE;
                console.log("limitPagination");
                console.log(limitPagination);
                $scope.eventsToShow        = $scope.eventPromise.slice(limitPagination[0], limitPagination[1]);
                console.log($scope.eventsToShow);


        };
    })
    .controller( 'NewEventCtrl', function( $scope, $rootScope, $location, $http, Event, camposServices, countryService, marketsService, Login){

        console.log("newCtrl");
        $scope.login           = Login.verifySession();

        $rootScope.PAGE = "new";
        $scope.errors = {};
        $scope.eventFields   =
            {
                eventId:       ["text",     true],
                name:          ["text",     true],
                password:      ["password", true],
                month:         ["text",     false],
                initDate:      ["date",     true],
                endDate:       ["date",     true],
                country:       ["select",   true],
                market:        ["select",   true],
                status:        ["checkbox", true],
                eventObj:      [
                                    new Event(
                                        {
                                            eventId:    "",
                                            name:       "",
                                            password:   "",
                                            month:      "",
                                            initDate:   "",
                                            endDate:    "",
                                            country:    "",
                                            market:     "",
                                            status:     ""
                                        }),
                                    false
                                ]
            };


        var country = [];
        countryService.getData().then(function(result){
            for (var i = 0; i< result.data.length; i++) {
                country.push({"name": result.data[i].name , "value": result.data[i].value});
            };
            $scope.eventFields.country.push(country);
        });

        var markets = [];


        marketsService.getData().then(function(result){
             var user = Login.getCurrentUser();
             if (user == null || user === undefined ) {
                return;
             };

            for (var i = 0; i< result.data.length; i++) {
                if (user.type == "superuser") {
                    markets.push({"name": result.data[i].name , "value": result.data[i].value});
                }else{
                    if ( result.data[i].value.toLowerCase() == user.market.toLowerCase()){
                        console.log("mercado objetivo encontrado");
                        markets.push({"name": result.data[i].name , "value": result.data[i].value}); 
                    }
                }
                
            };
            $scope.eventFields.market.push(markets);
        });





        $scope.save = function(){
            if (Object.keys($scope.errors).length >= 1) {
                console.log("Existe errores");
                return;
            };

            //validando "nuevoEvent"-> formulario
            if($scope.nuevoEvent.$invalid){
                console.log("invalid save event from ctrl");
                console.log($scope.eventFields.eventObj[0]);
                //broadcast usando angular Message
                //$scope.broadcast('record:invalid');
            }else{
                console.log("save event from ctrl ok");
                console.log($scope.eventFields.eventObj[0]);

                $scope.eventFields.eventObj[0].$insert({'token': $scope.login.token});
                $location.url("/events");
            }

        }
    })
    .controller('SingleEventCtrl', function($rootScope, $scope, $location , Event, $routeParams, countryService, marketsService, Login){
        console.log('SingleEventCtrl')
        $scope.login           = Login.verifySession();

        $rootScope.PAGE = "single";
        $scope.event = new Event(
                                        {
                                            _id:        "",
                                            eventId:    "",
                                            name:       "",
                                            password:   "",
                                            month:      "",
                                            initDate:   "",
                                            endDate:    "",
                                            country:    "",
                                            market:     "",
                                            status:     ""
                                        });
        $scope.errors = {};

        $scope.eventPromise   = Event.get({id: $routeParams.id});
        $scope.eventPromise.$promise.then(function (response) {
        $scope.eventPromise = response;

            $scope.event._id            = $scope.eventPromise._id;
            $scope.event.eventId        = $scope.eventPromise.eventId;
            $scope.event.name           = $scope.eventPromise.name;
            $scope.event.password       = $scope.eventPromise.password;
            $scope.event.month          = $scope.eventPromise.month;
            $scope.event.initDate       = new Date($scope.eventPromise.initDate) ;
            $scope.event.endDate        = new Date($scope.eventPromise.endDate);
            $scope.event.country        = $scope.eventPromise.country;
            $scope.event.market         = $scope.eventPromise.market;
            $scope.event.status         = $scope.eventPromise.status;

            $scope.eventFields   =
            {
                eventId:      ["text",        false ],
                name:         ["text",        true ],
                password:     ["password",    true ],
                month:        ["text",        false ],
                initDate:     ["date",        true ],
                endDate:      ["date",        true ],
                country:      ["select",      true ],
                market:       ["select",      true ],
                status:       ["checkbox",    true ],
                eventObj:     [$scope.event, false]
            };


            var country = [];
            countryService.getData().then(function(result){
                for (var i = 0; i< result.data.length; i++) {
                    country.push({"name": result.data[i].name , "value": result.data[i].value});
                };
                $scope.eventFields.country.push(country);
            });

            var markets = [];
            marketsService.getData().then(function(result){

                var user = Login.getCurrentUser();
                 if (user == null || user === undefined ) {
                    return;
                 };

                for (var i = 0; i< result.data.length; i++) {
                    if (user.type == "superuser") {
                        markets.push({"name": result.data[i].name , "value": result.data[i].value});
                    }else{
                        if ( result.data[i].value.toLowerCase() == user.market.toLowerCase()){
                            console.log("mercado objetivo encontrado");
                            markets.push({"name": result.data[i].name , "value": result.data[i].value}); 
                        }
                    }
                    
                };
                $scope.eventFields.market.push(markets);
            });

            console.log($scope.eventFields.event);
        });//end then promise



        $scope.update   = function(){
            if (Object.keys($scope.errors).length >= 1) {
                console.log("Existe errores");
                return;
            };

            $scope.event.$update({id: $scope.event._id});
            $location.url('/events');

        };

        $scope.delete   = function(){
            $scope.event.$delete({id: $scope.event._id});
            $location.url('/events');

        };
    })