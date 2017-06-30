var mongoose 		= require( "mongoose" ),
	Setting 		= mongoose.model( "Setting" );

//GET - Return all Settings Values in the DB 
exports.findAllSetting = function (req, res, next){
	console.log( 'findAllSetting: GET /settings' )
	Setting.find( function(err, settings){
		if (err) { 
			res.send(500, err.message);
		};		
			res.status(200).jsonp(settings);
	});
};



//POST - Return all Settings Values in the DB with the id 
exports.findByKey = function (req, res){
	Setting.findById( req.body.key, function(err, setting){
		if (err) { 
			res.send(500, err.message);
		};

		console.log( 'findByKey: POST /settings/' + req.body.key)
			res.status(200).jsonp(setting);
	});
};


exports.validateTokenTablet = function (req, res, next){
	console.log("body token : " + req.body.token);
	Setting.findOne({ key: 'tokentablet', value:req.body.token }, function(err, settingResponse) {
	  if (err) {
	  	console.log("TokenTablet invalid");		  	  	
	  	res.status(500).send( err.message );
	  }
	  if (settingResponse != null) {
	  	console.log("TokenTablet valid");	
	  	next();
	  };
	  //res.status(200).jsonp(settingResponse);

	});

}
//POST - Insert a new Setting Value in the db
exports.addSetting = function (req, res){
	console.log( 'addSetting POST /setting' );
	var setting = new Setting({
		key: 		req.body.key,
		value: 		req.body.value
	});

	setting.save( function( err, settingResponse) {
		if( err ){
			return res.status(500).send( err.message );

		}else{
			res.status(200).jsonp(settingResponse);
		}
	});

};

//PUT update one setting
exports.updateSetting = function( req, res) {
	console.log( 'updateSetting PUT /settings'+  req.params.id );

	Setting.findById(req.params.id, function (err, setting) {

	  	setting.key 		= req.body.key;
		setting.value 	= req.body.value;

		setting.save( function( err, settingResponse) {
			if( err ){
				return res.status(500).send( err.message );

			}else{
				res.status(200).jsonp(settingResponse);
			}

		});
	  
	});
}

//DELETE delete one setting
exports.deleteSetting = function ( req, res ){
	Setting.findById( req.params.id, function ( err, settingResponse){
		settingResponse.remove(function(err){
			if(err) return res.status(500).send(err.message);

		res.status(200).send();

		});

	});
};

