angular.module('dataqApp')    
    .factory('Login',function($resource, localStorageService, $window){
        
        var KEYNAME = 'token';

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
            var token = localStorageService.get(KEYNAME);
            //console.log('token:');   
            //console.log(token)

            var user = {};
            
            if (token != null) {
                console.log('encode tthe token')
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user._doc;            
        }
        
        function logout(){
            console.log('logout')
            localStorageService.remove(KEYNAME);
            redirectLogin();
        }

        function setTokenLocalStorage(token){
             console.log('setTokenLocalStorage')
            var storing = localStorageService.set(KEYNAME, token);
                        
                        //if storage its ok,setting the current user, redirect to main page
                        if (storing){
                            console.log("Usuario stored DB");
                            currentUser = getUserFromToken();
                            console.log(currentUser);
                            return currentUser;
                        }else{
                            console.log("error localStorage");
                            return null;
                        }
        }

        function getToken(){
            console.log('getToken')
            return localStorageService.get(KEYNAME);
        }

        function redirectLogin(){
            console.log('redirectLogin')
            $window.location.href = '/login';
        }

        function verifySession(){
            console.log('verifySession')
            var token = getToken();
            var currentUser = getUserFromToken();
            if(token == null || currentUser == null){
                console.log('token null')
                redirectLogin();
            }else{
                console.log('token found')
                return {
                        'token':        token, 
                        'currentUser':  currentUser
                        };
            }
        }


        return {
            'signin': $resource('/api/auth/', {}, {
                'try': { method: 'POST'}           
            }),
            'getCurrentUser':   getUserFromToken,            
            'setToken':         setTokenLocalStorage,
            'getToken':         getToken,
            'logout':           logout,
            'redirectLogin':    redirectLogin,
            'verifySession':    verifySession
        }
    });