angular.module('dataQServerApp')
    .factory('Evento',  function($resource){
        return $resource('/api/eventos/:id', {id: '@id'}, {
            'insert': { method: 'POST'},
            'update': { method: 'PUT'},
            'delete': { method: 'DELETE'},
        })
    })
    .factory('User',  function($resource){
        return $resource('/api/users/:id', {id: '@id'}, {
            'insert': { method: 'POST'},
            'update': { method: 'PUT'},
            'delete': { method: 'DELETE'},
        })
    })
    .factory('Main',function($resource, localStorageService){
        


        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            console.log('getUserFromToken')
            var token = localStorageService.get('token');
            console.log('token:');   
            console.log(token)

            var user = {};
            
            if (token != null) {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;            
        }
        
        function logout(){
            localStorageService.remove('token');
        }

        return {
            'signin': $resource('/api/auth/', {}, {
                'try': { method: 'POST'}           
            }),
            'me': $resource('/api/users/me/', {}, {
                'getData': { method: 'POST', isArray: true}           
            }),
            'currentUser': getUserFromToken,
            'logout': logout
        }

    }
);