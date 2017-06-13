
var mongoose 	= require( "mongoose" ),
	jwt 		= require( "jsonwebtoken"),
	User 		= mongoose.model( "User" );


/*
Module to auth an intent to login
 */
exports.auth = function (req, res){
	User.findOne( { email: req.body.email , password: req.body.password }, function (err, user){
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
exports.signUp = function (req, res){
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
					data: "User already login!"
				});
			}else{

				var user = new User({
					userId: 		req.body.userId,
					name: 			req.body.name,
					email: 			req.body.email,
					password: 		req.body.password,
					market: 		req.body.market,
					type: 			req.body.type,
					status: 		req.body.status
				});
				var userToken = new User({
					userId: 		req.body.userId,
					name: 			req.body.name,
					email: 			req.body.email,
					market: 		req.body.market,
					type: 			req.body.type,
					status: 		req.body.status
				});
				user.token = jwt.sign(userToken, "^rM%Mj6okx?yGT|gJg9c.KKJMs/BGy^njuILKl~?[8RQ*r:bo$sNDMgpx*tZD|3");	
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
			console.log( 'findAllEvents: error' ) 
			res.send(500, err.message);
		};

		console.log( 'findAllEvents: GET /users' )
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


//PUT update one event
exports.updateUser = function( req, res) {
	console.log( 'updateUser PUT /users'+  req.params.id );

	User.findById(req.params.id, function (err, user) {
	  	user.userId 		= req.body.userId;
		user.name 			= req.body.name;
		user.email 			= req.body.email;
		user.password 		= req.body.password;
		user.token 			= req.body.token;
		user.market 		= req.body.market;
		user.type 			= req.body.type;
		user.status 		= req.body.status;

		user.save( function( err, user) {
			if( err ){
				return res.status(500).send( err.message );

			}else{
				res.status(200).jsonp(user);
			}

		});
	  
	});
}

//DELETE delete one event
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
exports.tokenfy = function( req, res, next) {
	console.log( 'tokenfy GET');
	//console.log(req.body.token);
	
	User.findOne({ token: req.body.token }, function (err, user) {
	  	if( err ){
	  		console.log( 'tokenfy Error');
			res.json({
				type: false,
				data: "error Occured WITH TOKEN: " +err
			});
		}else{
			if( user ){
				console.log( 'tokenfy True');
				next();
			}else{
				console.log( 'tokenfy false');
				res.json({
					type: false,
					data: "User NOT LOGIN TOKEN!"
				});
			}	
		}
	  
	});
}
