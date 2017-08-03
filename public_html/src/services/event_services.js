angular.module('dataqApp')
    .service('countryService',function($http)
    {    
       this.getData = function()
       {
           var defer = $.Deferred();
           $http.get('/src/data/country.json')
           .then(function(response) {
              //alert("country GET OK");
              //console.log(response);
              defer.resolve(response);

          })                 
           return defer.promise();      
       }
    })
    .service('marketsService',function($http)
    {    
       this.getData = function()
       {
           var defer = $.Deferred();
           $http.get('/src/data/markets.json')
           .then(function(response) {
              //alert("country GET OK");
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
              //alert("country GET OK");
              //console.log(response);
              defer.resolve(response);

          })                 
           return defer.promise();      
       }
    })
    .service('camposServices', function(){
      this.getData = function(){
        return {
          eventId:    "ID",
          name:       "Nombre",
          password:   "Clave",
          month:      "Mes",
          initDate:   "Fecha de inicio",
          endDate:    "Fecha de termino",
          country:    "Pais",
          market:     "Mercado",
          status:     "Estado"
        };
      }    
    })
    .service('camposUserServices', function(){
      this.getData = function(){
        return {
          userId:     "ID",
          name:       "Nombre",
          email:      "Email",
          password:   "Clave",
          market:     "Mercado",
          type:       "Tipo",
          status:     "Estado"   
        };
      }     
    })