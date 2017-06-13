var mongoose 	= require( "mongoose" ),
	Schema 		= mongoose.Schema;

var eventoSchema 	= new Schema({
	eventoId: 		{ type: String },
	nombre: 		{ type: String },
	clave: 			{ type: String },
	mes: 			{ type: String },
	fechaInicio: 	{ type: Date },
	fechaTermino: 	{ type: Date },
	pais: 			{ type: String },
	mercado: 		{ type: String },
	disponible: 	{ type: Boolean }
});

module.exports = mongoose.model( "Evento", eventoSchema);