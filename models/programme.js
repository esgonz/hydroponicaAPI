var mongoose 	= require( "mongoose" ),
	Schema 		= mongoose.Schema;

var programmeSchema 	= new Schema({
	user: 		{ type: String },
	farmer: 	{ type: String },
	crop: 		{ type: String },
	stage: 		{ type: String },
	date: 		{ type: Date },
	data: 		{ type: String },
	country: 	{ type: String },
	market: 	{ type: String },
	status: 	{ type: Number }
});

module.exports = mongoose.model( "Programme", programmeSchema);
