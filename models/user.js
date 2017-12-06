var mongoose 	= require( "mongoose" ),
	Schema 		= mongoose.Schema;

var userSchema 	= new Schema({
	name: 			{ type: String },
	email: 			{ type: String },
	password: 		{ type: String },
	market: 		{ type: String },
	type: 			{ type: String },
	status: 		{ type: Boolean },
	token: 			{ type: String }

});

module.exports = mongoose.model( "User", userSchema);


