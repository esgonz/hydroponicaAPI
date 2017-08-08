
var mongoose 	= require( "mongoose" ),
	jwt 		= require( "jsonwebtoken"),
	User 		= mongoose.model( "User" ),
	Sha1 		= require("sha1"),	
	uuidv1 		= require("uuid/v1"), 
	SALT 		= "^rM%Mj6okx?yGT|gJg9c.KKJMs/BGy^njuILKl~?[8RQ*r:bo$sNDMgpx*tZD|3";
/*
Module to auth an intent to login
 */
exports.auth = function (req, res){



	var passwordHashed = Sha1(req.body.password + SALT);
	User.findOne( { email: req.body.email , password: passwordHashed.toUpperCase() }, function (err, user){
		if(err){
			res.json({
				type: false,
				data: "Error Ocurred: " + err
			});
		}else{
			if(user){

				var userReturn = new User({
					userId: 	user.id,
					name: 		user.name,
					email: 		user.email,					
					market: 	user.market,
					type: 		user.type,
					token: 		user.token
				});


				res.json({
					type: 	true,
					data: 	userReturn,
					token: 	user.token
				});
			}else{
				res.json({
					type: 	false,
					data: 	"Incorrect email/password"
				});

			}
		}
	});
};





/*
Register new users
 */
exports.addUser = function (req, res){
	User.findOne( { email: req.body.email }, function ( err, user){
		if( err ){
			res.json({
				type: false,
				data: "error Occured: " +err
			});
		}else{
			if( user ){
				res.json({
					type: false,
					data: "User already exists!"
				});
			}else{
				var passwordHashed = Sha1(req.body.password + SALT);
				var userUuid = uuidv1();
				var user = new User({
					userId: 		userUuid,
					name: 			req.body.name,
					email: 			req.body.email,
					password: 		passwordHashed.toUpperCase(),
					market: 		req.body.market,
					type: 			req.body.type,
					status: 		req.body.status
				});
				var userToken = new User({
					userId: 		userUuid,
					name: 			req.body.name,
					email: 			req.body.email,
					market: 		req.body.market,
					type: 			req.body.type,
					status: 		req.body.status
				});
				user.token = jwt.sign(userToken, SALT);	
				user.save( function( err, user1) {
					if( err ){
						return res.status(500).send( err.message );

					}else{
						console.log(user1);
						res.json({
							type: 	true,
							data: 	user1,
							token: 	user1.token
						});	
						//res.status(200).jsonp(user);
					}

				});
			}
		}
	});
};

//GET - Return all Users in the DB 
exports.findAllUsers = function (req, res){
	User.find( function(err, users){
		if (err) {
			console.log( 'findAllUsers: error' ) 
			res.send(500, err.message);
		};

		console.log( 'findAllUsers: GET /users' )
		res.status(200).jsonp(users);
	});
};


//GET - Return all Userss in the DB with the id 
exports.findByMarket = function (req, res){
	console.log( 'findByMarket: GET /users MARKET' )


	//3console.log("req.user:");
	//console.log(req.user);
	// find each person with a last name matching 'Ghost'
	
	var query = null;

	if (req.user.market =="all") {
		query = User.find();
	}else{
		query = User.find({ 'market':  req.user.market.toLowerCase() });
	}
	console.log("req.user.market");
	console.log(req.user.market);
	//console.log("query");
	//console.log(query);
	// selecting the `name` and `occupation` fields
	//query.select('name country');

	// execute the query at a later time
	query.exec(function (err, users) {
	  if (err) {
	  	console.log("err QUERY");
	  	return handleError(err);
	  }
	  //console.log('%s %s', event.name, event.market); // Space Ghost is a talk show host.
	  console.log(users.length);
	  res.status(200).jsonp(users);
	})
};

//GET - Return all Users in the DB 
exports.findAllUsersTablet = function (req, res){
	User.find( function(err, users){
		if (err) {
			console.log( 'findAllUsersTablet: error' ) 
			res.send(500, err.message);
		};

		console.log( 'findAllUsersTablet: GET /users' )
		res.status(200).jsonp(users);
	});
};



//GET - Return all Users in the DB with the id 
exports.findById = function (req, res){
	User.findById( req.params.id, function(err, user){
		if (err) { 
			res.send(500, err.message);
		};

		console.log( 'FindById: GET /user/' + req.params.id )
		res.status(200).jsonp(user);
	});
};


//PUT update one user
exports.updateUser = function( req, res) {
	console.log( 'updateUser PUT /users'+  req.params.id );
	/*User.findById(req.params.id, function (err, user) {
		user.name 			= req.body.name;
		user.email 			= req.body.email.toLowerCase();
		
		if (passwordHashed != "") {
			console.log("passwordHashed no Empty" );
			user.password 	= passwordHashed.toUpperCase();
		};

		user.token 			= req.body.token;
		user.market 		= req.body.market.toLowerCase();
		user.type 			= req.body.type.toLowerCase();
		user.status 		= req.body.status;

		user.save( function( err, user) {
			if( err ){
				return res.status(500).send( err.message );

			}else{
				console.log ("UPDATE USER:");
				console.log (user);
				//res.status(200).jsonp(user);
				res.json({
					type: 	true,
					data: 	user,
					token: 	user.token
				});	
			}

		});
	});*/

	User.findById( req.params.id, function ( err, user){
		if( err ){
			res.json({
				type: false,
				data: "error Occured: " + err
			});
		}else{
			if( user ){
				var passwordHashed = "";
					user.name 	=	req.body.name;
					user.email 	=	req.body.email;
					user.market =	req.body.market;
					user.type 	=	req.body.type;
					user.status =	req.body.status;
			
				if (req.body.password != "") {
					console.log("req.body.password no Empty" );
					passwordHashed 	= Sha1(req.body.password + SALT);
					user.password 	= passwordHashed.toUpperCase();
				};

				var userToken = new User({
					userId: 		user.id ,
					name: 			user.name ,
					email: 			user.email,
					market: 		user.market,
					type: 			user.type,
					status: 		user.status
				});
				user.token = jwt.sign(userToken, SALT);	
				user.save( function( err, userResponse) {
					if( err ){
						return res.status(500).send( err.message );

					}else{
						console.log(userResponse);
						res.json({
							type: 	true,
							data: 	userResponse,
							token: 	userResponse.token
						});	
						//res.status(200).jsonp(user);
					}

				});
			
				
			}else{
				res.json({
					type: false,
					data: "User doesnt exits"
				});
			}
		}
	});
}

//DELETE delete one user
exports.deleteUser = function ( req, res ){
	User.findById( req.params.id, function ( err, user){
		user.remove(function(err){
			if(err) return res.status(500).send(err.message);
		res.status(200).send();

		});
	});
};

/*

En esta función, se interceptan los encabezados de la petición y 
se extrae el encabezado authorization. Si en este encabezado 
existe un token portador, dicho token es asignado a req.token 
para ser utilizado a lo largo de la petición, y la misma 
puede continuar mediante next(). Si no existe ningún token, 
obtendremos un error 403 (Prohibido). Regresemos al 
controlador /me, y usemos req.token para obtener los datos de 
usuario con este token. Cada vez que creemos un nuevo usuario, 
se genera un token y se guarda en el modelo de usuario en la 
base de datos. Dichos tokens son únicos.
 */
exports.ensureAuthorized = function(req,res, next){
	

	/*var bearerToken;
		var bearerHeader = req.header["authorization"];
			if(typeof bearerHeader !== "undefined") {
				var bearer = bearerHeader.split(" ");
				bearerToken = bearer [1];
				req.token = bearerToken;
				next();

			} else{
				res.send(403);
			}*/

}



//PUT update one event
exports.postAuth = function( req, res, next) {
	console.log( 'postAuth POST');
	console.log( 'token');
	console.log(req.body.token);
	console.log(req.body);
	User.findOne({ token: req.body.token }, function (err, user) {
	  	if( err ){
	  		console.log( 'postAuth HEADER Error');
			res.json([{
				type: false,
				data: "error Occured WITH TOKEN: " +err
			}]);
		}else{
			if( user ){
				console.log( 'postAuth HEADER True');
				req.user = user;
				next();
			}else{
				console.log( 'postAuth false');
				res.json([{
					type: false,
					data: "User NOT LOGIN TOKEN!"
				}]);
			}	
		}
	  
	});
}


exports.getUser = function (req, res, next){
	User.findOne({ token: req.headers.token }, function (err, user) {
		  	if( err ){
		  		console.log( 'getUser Error');
				res.json([{
					type: false,
					data: "error Occured WITH TOKEN: " +err
				}]);
			}else{
				if( user ){
					console.log( 'getUser True');
					req.user = user;
					next();
				}else{
					console.log( 'getUser false');
					res.json([{
						type: false,
						data: "User NOT LOGIN TOKEN!"
					}]);
				}	
			}		  
	});
}

//headerAuth
exports.headerAuth = function( req, res, next) {
	console.log( 'headerAuth GET');
	User.findOne({ token: req.headers.token }, function (err, user) {
	  	if( err ){
	  		console.log( 'headerAuth HEADER Error');
			res.json([{
				type: false,
				data: "error Occured WITH TOKEN: " + err
			}]);
		}else{
			if( user ){
				console.log( 'headerAuth HEADER True');
				req.user = user;
				next();
			}else{
				console.log( 'headerAuth false');
				res.json([{
					type: false,
					data: "User NOT LOGIN TOKEN!"
				}]);
			}	
		}	  
	});
}
