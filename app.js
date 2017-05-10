var express 		= require( "express" ),
	app				= express(),
	bodyParser		= require( "body-parser" ),
	methodOverride	= require( "method-override" ),
	mongoose		= require( "mongoose" );

app
	.use(bodyParser.urlencoded( { exended:false } ))
	.use(bodyParser.json())
	.use(methodOverride());

var router 	= express.Router();

router.get( '/', function( req, res ){
	res.send("Hello World!");
} );

app.use(router)
	.listen( 3000, function(){
		console.log( "Node server running on http://localhost:3000" );
	} );
