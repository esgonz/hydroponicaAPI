angular.module('dataQServerApp')
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
			Evento:referencia a objeto, = significa que es una referencia directa, cualquier cambio al obj se ve reflejada en todo el modulo
			field , live, required : son solo referencias (solo lectura)
		link: funcion constructora del elemento	, se le pasa el scope como objeto
	 */
	.directive('formField', function($timeout, FieldTypes, MonthsStrings){
		return{
			restrict:'EA',
			templateUrl: 'views/form-field.html',
			replace: true,
			scope: {

				record: 		'=',
				field: 			'@',
				live: 			'@',
				required: 		'@'
				
			},
			link: function (scope, element, attr){
				//escucho la funcion invalid del record(obj Evento)
				//set field como dirty 
				scope.$on('record:invalid', function(){
					scope[scope.field].$setDirty();
				});

				scope.types = FieldTypes;

				scope.blurUpdate = function(){
					console.log("blurUpdate");
					console.log(scope.record.eventoObj[0]);
					
					if(scope.record.eventoObj[0].fechaInicio !="" && scope.record.eventoObj[0].fechaInicio !== undefined ){

						var fechaBruta = new Date( scope.record.eventoObj[0].fechaInicio);
						var fechaLimpia = fechaBruta.toISOString().substring(0, 10);
						
						/*scope.record.eventoObj[0].fechaInicio =	fechaLimpia.substring(5,7) + "-" + 
															 	fechaLimpia.substring(8,11) + "-" +
																fechaLimpia.substring(0,4);*/
						scope.record.eventoObj[0].mes 	= 	MonthsStrings[fechaLimpia.substring(5,7)] + " " + fechaLimpia.substring(0,4);


					}

					/*if(scope.record.eventoObj[0].fechaTermino !="" && scope.record.eventoObj[0].fechaTermino !== undefined ){

						var fechaBruta 	= new Date( scope.record.eventoObj[0].fechaTermino);
						var fechaLimpia = fechaBruta.toISOString().substring(0, 10);

						scope.record.eventoObj[0].fechaTermino =	fechaLimpia.substring(5,7 ) + "-" + 
															 		fechaLimpia.substring(8,11) + "-" +
																	fechaLimpia.substring(0,4);						
					}*/



					if(scope.record.eventoObj[0]["_id"] == ""|| scope.record.eventoObj[0]["_id"] === undefined){
						console.log("evento no existe todavia..");
					}else{
						if (scope.live !== 'false'){
							//scope.record referencia hacia el objeto Evento (factory) y su funcion Update (put)
							scope.record.eventoObj[0].$update({id : scope.record.eventoObj[0]["_id"]}, function(updateRecord){
								scope.record.eventoObj[0] = updateRecord;
							});
						}
					}

					
				};

				var saveTimeout;
				scope.update = function(){
					$timeout.cancel(saveTimeout);
					saveTimeout = $timeout(scope.blurUpdate, 1000);
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
