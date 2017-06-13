var mongoose 	= require( "mongoose" ),
	Evento 		= mongoose.model( "Evento" );


//GET - Return all Eventos in the DB 
exports.findAllEvents = function (req, res){
	Evento.find( function(err, eventos){
		if (err) { 
			res.send(500, err.message);
		};

		console.log( 'findAllEvents: GET /eventos' )
			res.status(200).jsonp(eventos);
	});
};

//GET - Return all Eventos in the DB with the id 
exports.findById = function (req, res){
	Evento.findById( req.params.id, function(err, evento){
		if (err) { 
			res.send(500, err.message);
		};

		console.log( 'FindById: GET /evento/' + req.params.id )
			res.status(200).jsonp(evento);
	});
};

//GET - Return all Eventos in the DB with the id 
exports.findByMercado = function (req, res){


	// find each person with a last name matching 'Ghost'
	var query = Evento.find({ 'mercado':  req.params.mercado });

	// selecting the `name` and `occupation` fields
	//query.select('nombre pais');

	// execute the query at a later time
	query.exec(function (err, evento) {
	  if (err) return handleError(err);
	  console.log('%s %s', evento.nombre, evento.mercado) // Space Ghost is a talk show host.
	  res.status(200).jsonp(evento);
	})
};


//GET - Return all Eventos in the DB with the id 
exports.findByPais = function (req, res){


	// find each person with a last name matching 'Ghost'
	var query = Evento.find({ 'pais':  req.params.pais });

	// selecting the `name` and `occupation` fields
	//query.select('nombre pais');

	// execute the query at a later time
	query.exec(function (err, evento) {
	  if (err) return handleError(err);
	  console.log('%s %s', evento.nombre, evento.pais) // Space Ghost is a talk show host.
	  res.status(200).jsonp(evento);
	})
};



//POST - Insert a new evento in the db
exports.addEvento = function (req, res){
	console.log( 'addEvento POST /eventos' );
	console.log( req.body );

	var evento = new Evento({
		eventoId: 		req.body.eventoId,
		nombre: 		req.body.nombre,
		clave: 			req.body.clave,
		mes: 			req.body.mes,
		fechaInicio: 	req.body.fechaInicio,
		fechaTermino: 	req.body.fechaTermino,
		pais: 			req.body.pais,
		mercado: 		req.body.mercado,
		disponible: 	req.body.disponible
	});

	evento.save( function( err, evento) {
		if( err ){
			return res.status(500).send( err.message );

		}else{
			res.status(200).jsonp(evento);
		}

	});

};

//PUT update one event
exports.updateEvento = function( req, res) {
	console.log( 'updateEvento PUT /eventos'+  req.params.id );

	Evento.findById(req.params.id, function (err, evento) {

	  	evento.eventoId 	= req.body.eventoId;
		evento.nombre 		= req.body.nombre;
		evento.clave 		= req.body.clave;
		evento.mes 			= req.body.mes;
		evento.fechaInicio 	= req.body.fechaInicio;
		evento.fechaTermino = req.body.fechaTermino;
		evento.pais 		= req.body.pais;
		evento.mercado 		= req.body.mercado;
		evento.disponible 	= req.body.disponible;

		evento.save( function( err, evento) {
			if( err ){
				return res.status(500).send( err.message );

			}else{
				res.status(200).jsonp(evento);
			}

		});
	  
	});
}

//DELETE delete one event
exports.deleteEvento = function ( req, res ){
	Evento.findById( req.params.id, function ( err, evento){
		evento.remove(function(err){
			if(err) return res.status(500).send(err.message);

		res.status(200).send();

		});

	});
};

