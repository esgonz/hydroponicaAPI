var express 		= require( "express" ),
	app				= express(),
	bodyParser		= require( "body-parser" ),
	methodOverride	= require( "method-override" ),
	mongoose		= require( "mongoose" ),
	jwt 			= require("jsonwebtoken"),
	morgan 			= require("morgan"),
	sha1 			= require("sha1"),
	dbName 			= "hydroponica001";



//connection to DB
mongoose.connect( 'mongodb://localhost/'+ dbName );

var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  // we're connected!
	  console.log( "we're connected!: "+ dbName +" DB" );
	});

//Middlewares
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



var setting 			= require("./models/setting.js"),
	settingCtrl 		= require("./controllers/settings");

//import models and controllers Events
/*var	event 			= require( "./models/event"),
	eventCtrl 		= require( "./controllers/events" );*/



//import models and controllers Users
var	user 			= require( "./models/user"),
	userCtrl 		= require( "./controllers/users" );

var programme 		= require("./models/programme"),
	programmeCtrl 	= require ("./controllers/programmes");



//URis API Settings
var setting = express.Router();
	//get all users
	setting.route('/settings')
		.get(settingCtrl.findAllSetting)
		.post(settingCtrl.addSetting);

	setting.route('/tablet/users')
		.post(settingCtrl.validateTokenTablet, userCtrl.findAllUsers);

app.use('/api', setting);


//URis API auths
var auth = express.Router();
	//get all users
	auth.route('/auth')
		.post(userCtrl.auth);


app.use('/api', auth);


//URis API users 
var users = express.Router();
	//get all users
	users.route('/users')
		/*.get(
			userCtrl.headerAuth, 
			userCtrl.findByMarket
			)
		
		.post(
			userCtrl.headerAuth, 
			userCtrl.addUser
			);*/

		.get(
			userCtrl.findAllUsers
			)
		
		.post(
			userCtrl.addUser
			);
	

	
	users.route('/users/:id')
		.get(
			userCtrl.headerAuth,
			userCtrl.findById
			)
		.put(
			userCtrl.headerAuth,
			userCtrl.updateUser)
		.delete(
			userCtrl.headerAuth,
			userCtrl.deleteUser);



app.use('/api', users);


//URis API programme

var programmes =  express.Router();
	//get all programmes
	programmes.route('/programmes')
		.get( 
				programmeCtrl.findAllProgrammes
			)
		.post(
				programmeCtrl.addProgramme
			)

app.use('/api', programmes);



//URis API events
/*

var events = express.Router();
	//get all events
	events.route('/events')
		.get(	userCtrl.headerAuth ,
				eventCtrl.findByMarket
			)
		.post(	userCtrl.headerAuth , 
				eventCtrl.addEvent
			);

	
	events.route('/events/:id')
		.get(
			userCtrl.headerAuth,
			eventCtrl.findById
			)
		.put( 
			userCtrl.headerAuth, 
			eventCtrl.updateEvent
			)
		.delete(
			userCtrl.headerAuth, 
			eventCtrl.deleteEvent
			);


	events.route('/events/market/:market')
		.get(
			userCtrl.headerAuth, 
			eventCtrl.findByMarket
			);


app.use('/api', events);

*/

//URis API movils 
/*

var eventsMovil = express.Router();
	//get all events
	eventsMovil.route('/events')
		.post(	userCtrl.postAuth , 
				eventCtrl.findAllEvents
			);

	eventsMovil.route('/events/market/:market')
		.post(
			userCtrl.postAuth, 
			eventCtrl.findByMarket
			);


app.use('/api/movil', eventsMovil);
*/



//basic route
/*
	var router 	= express.Router();

	router.get( '/', function( req, res ){
		res.send("Hello World!");
	} );
*/

//app.use(router);



app
	.use(express.static('./public_html'))
	.get('*', function (req, res){
		res.sendfile('public_html/main.html');
})
// start server

app.listen( 3000, function(){
	console.log( "Node server running on http://localhost:3000" );
});

