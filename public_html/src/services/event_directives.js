angular.module('dataqApp')
	.value('FieldTypes', {
		text: 		['Text', 'Should be text'],
		email: 		['Email', 'Should be email'],
		number: 	['Number', 'Should be number'],
		date: 		['Date', 'Should be date'],
		datatime: 	['Datatime', 'Should be datatime'],
		time: 		['Time', 'Should be time'],
		month: 		['Month', 'Should be month'],
		week: 		['Week', 'Should be week'],
		url: 		['Url', 'Should be url'],
		tel: 		['Tel', 'Should be tel'],
		color: 		['Color', 'Should be color'],
		password: 	['Clave', 'Should be clave'],
		checkbox: 	['Checkbox', 'Should be checbok'],
		select: 	['Select', 'Should select One']
	})
	.value('MonthsStrings',{
		"01": [ "ENERO /JANUARY"],
		"02": [ "FEBRERO /FEBRUARY"],
		"03": [ "MARZO /MARCH"],
		"04": [ "ABRIL /APRIL"],
		"05": [ "MAYO /MAY"],
		"06": [ "JUNIO /JUNE"],
		"07": [ "JULIO /JULY"],
		"08": [ "AGOSTO /AUGUST"],
		"09": [ "SEPTIEMBRE /SEPTEMBER"],
		"10": [ "OCTUBRE /OCTOBER"],
		"11": [ "NOVIEMBRE /NOVEMBER"],
		"12": [ "DICIEMBRE /DECEMBER"],

	})
	/*
	directive crea un alemento angular
	retorna el objeto del elemento como un scope
		restrict: EA significa como E elemento o A atributo es decir 
		    elemento :<from-field.. > </form-field>
		    atributo : <div form-field ..> </div>
		template: la plantilla html de la directiva
		replace: remplazar el elemento html con la plantilla (true) ó insertar dentro del elemento html (false)
		scope:  variables a utilizar en la directiva
			Event:referencia a objeto, = significa que es una referencia directa, cualquier cambio al obj se ve reflejada en todo el modulo
			field , live, required : son solo referencias (solo lectura)
		link: funcion constructora del elemento	, se le pasa el scope como objeto
	 */
	.directive('formField', function($timeout, FieldTypes, MonthsStrings, camposServices ){
		return{
			restrict:'EA',
			templateUrl: 'views/events/form-field.html',
			replace: true,
			scope: {

				errors: 		'=',
				record: 		'=',
				field: 			'@',
				live: 			'@',
				required: 		'@'
				
			},
			link: function (scope, element, attr){
				//escucho la funcion invalid del record(obj Event)
				//set field como dirty 
				scope.$on('record:invalid', function(){
					scope[scope.field].$setDirty();
				});

				scope.types = FieldTypes;
				scope.eventsFieldsName = camposServices.getData();



				scope.blurUpdate = function(){
					console.log("blurUpdate");
					console.log(scope.record.eventObj[0]);
					
					if(scope.record.eventObj[0].country == "-1" ||  
						scope.record.eventObj[0].country == undefined ||  
						scope.record.eventObj[0].country == ''  )	
					{
						scope.errors["country"] = "Ingrese un Pais.";
						console.log("error Country");
					
					}
					else{
						delete scope.errors.country;
					}

					if( scope.record.eventObj[0].market == "-1" ||  
						scope.record.eventObj[0].market == undefined ||  
						scope.record.eventObj[0].market == '')	
					{
						scope.errors["market"] 	= "Ingrese un Mercado.";
						console.log("error market");
						
					}
					else{
						delete scope.errors.market;
					}

					if( scope.record.eventObj[0].initDate == "" ||  scope.record.eventObj[0].initDate == undefined   )	
					{
						scope.errors["initDate"] 	= "Ingrese una Fecha de inicio.";
						console.log("error initDate");
					
					}
					else{
						delete scope.errors.initDate;
					}

					if( scope.record.eventObj[0].endDate == "" ||  scope.record.eventObj[0].endDate == undefined   )	
					{
						scope.errors["endDate"] 	= "Ingrese una Fecha de Termino.";
						console.log("error endDate");
			
					}
					else{
						delete scope.errors.endDate;
					}

					if( scope.record.eventObj[0].name == "" ||  scope.record.eventObj[0].name == undefined  )	
					{
						scope.errors["name"] 	= "Ingrese un Nombre.";
						console.log("error name");

					}
					else{
						delete scope.errors.name;
					}

					if( scope.record.eventObj[0].password == "" ||  scope.record.eventObj[0].password == undefined  )	
					{
						scope.errors["password"] 	= "Ingrese una clave.";
						console.log("error password");

					}
					else{
						delete scope.errors.password;
					}


					if (Object.keys(scope.errors).length >= 1) {
						return;
					};


					if(scope.record.eventObj[0].initDate !="" && scope.record.eventObj[0].initDate !== undefined ){

						var fechaBruta = new Date( scope.record.eventObj[0].initDate);
						var fechaLimpia = fechaBruta.toISOString().substring(0, 10);
						
						/*scope.record.eventObj[0].initDate =	fechaLimpia.substring(5,7) + "-" + 
															 	fechaLimpia.substring(8,11) + "-" +
																fechaLimpia.substring(0,4);*/
						scope.record.eventObj[0].month 	= 	MonthsStrings[fechaLimpia.substring(5,7)] + " " + fechaLimpia.substring(0,4);
					}

					/*if(scope.record.eventObj[0].endDate !="" && scope.record.eventObj[0].endDate !== undefined ){

						var fechaBruta 	= new Date( scope.record.eventObj[0].endDate);
						var fechaLimpia = fechaBruta.toISOString().substring(0, 10);

						scope.record.eventObj[0].endDate =	fechaLimpia.substring(5,7 ) + "-" + 
															 		fechaLimpia.substring(8,11) + "-" +
																	fechaLimpia.substring(0,4);						
					}*/



					if(scope.record.eventObj[0]["_id"] == ""|| scope.record.eventObj[0]["_id"] === undefined){
						console.log("event no existe todavia..");
					}else{
						if (scope.live !== 'false'){
							//scope.record referencia hacia el objeto Event (factory) y su funcion Update (put)
							scope.record.eventObj[0].$update({id : scope.record.eventObj[0]["_id"]}, function(updateRecord){
								scope.record.eventObj[0] = updateRecord;
							});
						}
					}

					
				};

				var saveTimeout;
				scope.update = function(){
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout(scope.blurUpdate, 2600);
				};
			}
		};
	})
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			// templateUrl: '',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
