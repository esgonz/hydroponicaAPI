var express 		= require( "express" ),
	app				= express(),
	bodyParser		= require( "body-parser" ),
	methodOverride	= require( "method-override" ),
	mongoose		= require( "mongoose" ),
	jwt 			= require("jsonwebtoken"),
	morgan 			= require("morgan");



//connection to DB
mongoose.connect( 'mongodb://localhost/eventos' );

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log( "we're connected! eventos DB" );
});

//middlewares
app
	.use(bodyParser.urlencoded( { extended: true } ))
	.use(bodyParser.json())
	.use(methodOverride())
	.use(morgan("dev"));

app.use( function( req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		res.setHeader('Access-Control-Allow-headers', 'X-Requested-With, content-type, Authorization');
		next();
})




//import models and controllers
var	evento 			= require( "./models/evento"),
	eventoCtrl 		= require( "./controllers/eventos" );


//API routes 
var eventos = express.Router();
	//get all eventos
	eventos.route('/eventos')
		.get(eventoCtrl.findAllEvents)
		.post(eventoCtrl.addEvento);
	
	eventos.route('/eventos/:id')
		.get(eventoCtrl.findById)
		.put( eventoCtrl.updateEvento)
		.delete( eventoCtrl.deleteEvento);
	eventos.route('/eventos/mercado/:mercado')
		.get(eventoCtrl.findByMercado);


app.use('/api', eventos);


//import models and controllers
var	user 			= require( "./models/user"),
	userCtrl 		= require( "./controllers/users" );





var auth = express.Router();
	//get all users
	auth.route('/auth')
		.post(userCtrl.auth);


app.use('/api', auth);


//API routes 
var users = express.Router();
	//get all users
	users.route('/users')
		.get(userCtrl.findAllUsers)
		.post(userCtrl.ensureAuthorized, userCtrl.signUp);
	
	/*users.route('/users/:id')
		.get(userCtrl.findById)
		.put( userCtrl.updateUser)
		.delete( userCtrl.deleteUser);*/

	users.route('/users/me')
		.post(userCtrl.tokenfy ,  eventoCtrl.findAllEvents);
	

app.use('/api', users);

//basic route
/*
var router 	= express.Router();

router.get( '/', function( req, res ){
	res.send("Hello World!");
} );*/

//app.use(router);
app
	.use(express.static('./public_html'))
	.get('*', function (req, res){
		res.sendfile('public_html/main.html');
	})
/*
mongoose.connect( 'mongodb://localhost/eventos',
	function( err, res){
		if(err){
			console.log( 'ERROR: connecting to Database. ' + err );
		}else{
			console.log( 'conected to Database. ');
		}
		app.use(router)
		.listen( 3000, function(){
			console.log( "Node server running on http://localhost:3000" );
		} );
	});
*/


// start server

		app.listen( 3000, function(){
			console.log( "Node server running on http://localhost:3000" );
		} );

