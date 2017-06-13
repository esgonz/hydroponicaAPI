angular.module('dataQServerApp')
    .service('paisesService',function($http)
    {    
       this.getData = function()
       {
           var defer = $.Deferred();
           $http.get('/src/data/paises.json')
           .then(function(response) {
              //alert("paises GET OK");
              //console.log(response);
              defer.resolve(response);

          })                 
           return defer.promise();      
       }
    })
    .service('mercadosService',function($http)
    {    
       this.getData = function()
       {
           var defer = $.Deferred();
           $http.get('/src/data/mercados.json')
           .then(function(response) {
              //alert("paises GET OK");
              //console.log(response);
              defer.resolve(response);

          })                 
           return defer.promise();      
       }
    })
    .service('tiposService',function($http)
    {    
       this.getData = function()
       {
           var defer = $.Deferred();
           $http.get('/src/data/tipos.json')
           .then(function(response) {
              //alert("paises GET OK");
              //console.log(response);
              defer.resolve(response);

          })                 
           return defer.promise();      
       }
    })