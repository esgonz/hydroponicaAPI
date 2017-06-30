var mongoose 	= require( "mongoose" ),
	Schema 		= mongoose.Schema;

var settingSchema 	= new Schema({
	key: 		{ type: String },
	value: 		{ type: String },	
});

module.exports = mongoose.model( "Setting", settingSchema, "settings");