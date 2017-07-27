var mongoose 	= require( "mongoose" ),
	Event 		= mongoose.model( "Event" );

//GET - Return all Events in the DB 
exports.findAllEvents = function (req, res, next){
	console.log( 'findAllEvents: GET /events' )
	//console.log(req.headers);
	//console.log("req.user:");
	//console.log(req.user);
	Event.find( function(err, events){
		if (err) { 
			res.send(500, err.message);
		};

		
			res.status(200).jsonp(events);
	});
};



//GET - Return all Events in the DB with the id 
exports.findById = function (req, res){
	Event.findById( req.params.id, function(err, event){
		if (err) { 
			res.send(500, err.message);
		};

		console.log( 'FindById: GET /event/' + req.params.id )
			res.status(200).jsonp(event);
	});
};

//GET - Return all Events in the DB with the id 
exports.findByMarket = function (req, res){
	console.log( 'findByMarket: GET /events MARKET' )


	//3console.log("req.user:");
	//console.log(req.user);
	// find each person with a last name matching 'Ghost'
	
	var query = null;

	if (req.user.market =="all") {
		query = Event.find();
	}else{
		query = Event.find({ 'market':  req.user.market.toLowerCase() });
	}
	console.log("req.user.market");
	console.log(req.user.market);
	//console.log("query");
	//console.log(query);
	// selecting the `name` and `occupation` fields
	//query.select('name country');

	// execute the query at a later time
	query.exec(function (err, events) {
	  if (err) {
	  	console.log("err QUERY");
	  	return handleError(err);
	  }
	  //console.log('%s %s', event.name, event.market); // Space Ghost is a talk show host.
	  console.log(events.length);
	  res.status(200).jsonp(events);
	})
};


//GET - Return all Events in the DB with the id 
exports.findByCountry = function (req, res){


	// find each person with a last name matching 'Ghost'
	var query = Event.find({ 'country':  req.params.country });

	// selecting the `name` and `occupation` fields
	//query.select('name country');

	// execute the query at a later time
	query.exec(function (err, event) {
	  if (err) return handleError(err);
	  console.log('%s %s', event.name, event.country) // Space Ghost is a talk show host.
	  res.status(200).jsonp(event);
	})
};



//POST - Insert a new event in the db
exports.addEvent = function (req, res){
	console.log( 'addEvent POST /events' );
	var event = new Event({
		eventId: 	req.body.eventId,
		name: 		req.body.name,
		password: 	req.body.password,
		month: 		req.body.month,
		initDate: 	req.body.initDate,
		endDate: 	req.body.endDate,
		country: 	req.body.country.toLowerCase(),
		market: 	req.body.market.toLowerCase(),
		status: 	req.body.status
	});

	event.save( function( err, event) {
		if( err ){
			return res.status(500).send( err.message );

		}else{
			res.status(200).jsonp(event);
		}

	});

};

//PUT update one event
exports.updateEvent = function( req, res) {
	console.log( 'updateEvent PUT /events'+  req.params.id );

	Event.findById(req.params.id, function (err, event) {

	  	event.eventId 	= req.body.eventId;
		event.name 		= req.body.name;
		event.password 	= req.body.password;
		event.month 	= req.body.month;
		event.initDate 	= req.body.initDate;
		event.endDate 	= req.body.endDate;
		event.country 	= req.body.country.toLowerCase();
		event.market 	= req.body.market.toLowerCase();
		event.status 	= req.body.status;

		event.save( function( err, event) {
			if( err ){
				return res.status(500).send( err.message );

			}else{
				res.status(200).jsonp(event);
			}

		});
	  
	});
}

//DELETE delete one event
exports.deleteEvent = function ( req, res ){
	Event.findById( req.params.id, function ( err, event){
		event.remove(function(err){
			if(err) return res.status(500).send(err.message);

		res.status(200).send();

		});

	});
};

