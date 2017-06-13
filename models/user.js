var mongoose 	= require( "mongoose" ),
	Schema 		= mongoose.Schema;

var userSchema 	= new Schema({
	userId: 		{ type: String },
	name: 			{ type: String },
	email: 			{ type: String },
	password: 		{ type: String },
	token: 			{ type: String },
	market: 		{ type: String },
	type: 			{ type: String },
	status: 		{ type: Boolean }

});

module.exports = mongoose.model( "User", userSchema);

