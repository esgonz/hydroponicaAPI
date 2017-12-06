var mongoose 	= require( "mongoose" ),
	uuidv1 		= require("uuid/v1"), 
	Programme 		= mongoose.model( "Programme" );

//GET - Return all Promgrammes in the DB 
exports.findAllProgrammes = function (req, res, next){
	console.log( 'findAllProgrammes: GET /programmes' )
	//console.log(req.headers);
	//console.log("req.user:");
	//console.log(req.user);
	Programme.find( function(err, programmes){
		if (err) { 
			res.send(500, err.message);
		};

		
			res.status(200).jsonp(programmes);
	});
};



//GET - Return all Programmes in the DB with the id 
exports.findById = function (req, res){
	Programme.findById( req.params.id, function(err, programme){
		if (err) { 
			res.send(500, err.message);
		};

		console.log( 'FindById: GET /programme/' + req.params.id )
			res.status(200).jsonp(programme);
	});
};

//GET - Return all Programmes in the DB with the market id 
exports.findByMarket = function (req, res){
	console.log( 'findByMarket: GET /programmes MARKET' )


	//3console.log("req.user:");
	//console.log(req.user);
	// find each person with a last name matching 'Ghost'
	
	var query = null;

	if (req.user.market =="all") {
		query = Programme.find();
	}else{
		query = Programme.find({ 'market':  req.user.market.toLowerCase() });
	}
	console.log("req.user.market");
	console.log(req.user.market);
	//console.log("query");
	//console.log(query);
	// selecting the `name` and `occupation` fields
	//query.select('name country');

	// execute the query at a later time
	query.exec(function (err, programmes) {
	  if (err) {
	  	console.log("err QUERY");
	  	return handleError(err);
	  }
	  //console.log('%s %s', programme.name, programme.market); // Space Ghost is a talk show host.
	  console.log(programmes.length);
	  res.status(200).jsonp(programmes);
	})
};


//GET - Return all programmes in the DB with the contry id 
exports.findByCountry = function (req, res){


	// find each person with a last name matching 'Ghost'
	var query = Programme.find({ 'country':  req.params.country });

	// selecting the `name` and `occupation` fields
	//query.select('name country');

	// execute the query at a later time
	query.exec(function (err, programme) {
	  if (err) return handleError(err);
	  console.log('%s %s', programme.name, programme.country) // Space Ghost is a talk show host.
	  res.status(200).jsonp(programme);
	})
};

//GET - Return all programmes in the DB with the user id 
exports.findByUser = function (req, res){


	// find each person with a last name matching 'Ghost'
	var query = Programme.find({ 'user':  req.params.user });

	// selecting the `name` and `occupation` fields
	//query.select('name user');

	// execute the query at a later time
	query.exec(function (err, programme) {
	  if (err) return handleError(err);
	  console.log('%s %s', programme.name, programme.user) // Space Ghost is a talk show host.
	  res.status(200).jsonp(programme);
	})
};



//POST - Insert a new programme in the db
exports.addProgramme = function (req, res){
	console.log( 'addProgramme POST /programmes' );
	var programme = new Programme({
		farmer: 	req.body.farmer,
		crop: 		req.body.crop,
		stage: 		req.body.stage,
		date: 		req.body.date,
		data: 		req.body.data,
		country: 	req.body.country.toLowerCase(),
		market: 	req.body.market.toLowerCase(),
		status: 	req.body.status
	});

	programme.save( function( err, programme) {
		if( err ){
			return res.status(500).send( err.message );

		}else{
			res.status(200).jsonp(programme);
		}

	});

};

//PUT update one programme
exports.updateProgramme = function( req, res) {
	console.log( 'updateProgramme PUT /programmes'+  req.params.id );

	Programme.findById(req.params.id, function (err, programme) {

	  	programme.farmer  	= 	req.body.farmer,
		programme.crop 		=	req.body.crop,
		programme.stage 	= 	req.body.stage,
		programme.date 		=	req.body.date,
		programme.data		= 	req.body.data,
		programme.country	= 	req.body.country.toLowerCase(),
		programme.market	=	req.body.market.toLowerCase(),
		programme.status 	= 	req.body.status

		programme.save( function( err, programme) {
			if( err ){
				return res.status(500).send( err.message );

			}else{
				res.status(200).jsonp(programme);
			}

		});
	  
	});
}

//DELETE delete one programme
exports.deleteProgramme = function ( req, res ){
	Programme.findById( req.params.id, function ( err, programme){
		programme.remove(function(err){
			if(err) return res.status(500).send(err.message);

		res.status(200).send();

		});

	});
};

