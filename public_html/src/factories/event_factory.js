angular.module('dataqApp')
    .factory('Event',  function($resource, Login){
        function dynamicHeaderVal(requestConfig){

             return Login.getToken();
            // this function will be called every time the "get" action gets called
            // the result will be used as value for the header item
            // if it doesn't return a value, the key will not be present in the header
        }

        return $resource('/api/events/:id', {id: '@id'}, {
            'insert':   { 
                method: 'POST', 
                isArray: false,
                headers: { 'token': dynamicHeaderVal }
            },
            'delete':   {    
                method: 'DELETE', 
                isArray: false,
                headers: { 'token': dynamicHeaderVal }
            },
            'getAll':     {     
                method: 'GET', 
                isArray: true,
                headers: { 'token': dynamicHeaderVal }
            },
            'get':     {     
                method: 'GET', 
                isArray: false,
                headers: { 'token': dynamicHeaderVal }
            },
            'update':     {     
                method: 'PUT', 
                isArray: false,
                headers: { 'token': dynamicHeaderVal }
            },

        });
    });
