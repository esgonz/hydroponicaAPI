var mongoose 	= require( "mongoose" ),
	Schema 		= mongoose.Schema;

var eventSchema 	= new Schema({
	eventId: 		{ type: String },
	name: 			{ type: String },
	password: 		{ type: String },
	month: 			{ type: String },
	initDate: 		{ type: Date },
	endDate: 		{ type: Date },
	country: 		{ type: String },
	market: 		{ type: String },
	status: 		{ type: Boolean }
});

module.exports = mongoose.model( "Event", eventSchema);