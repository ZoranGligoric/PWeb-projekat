
var app = angular.module('filevalApp', ['ngRoute']);

app.controller('listCtrl', function ($scope, $rootScope, $http) {
    $rootScope.title='Sheme ocenjivanja';
    $http.get("services/api.php?on=seme&all=false").then(function(response) {
        console.log(response.data);
        if(response.data!=="null")
            $scope.data=response.data;
        else
            $scope.data="Nonexisting!";
    });
});

app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, $http) {
    var shema = ($routeParams.shemaID) ? parseInt($routeParams.shemaID) : 0;
    $rootScope.title = (shema > 0) ? 'Izmena Sheme '+shema : 'Nova shema';
    $scope.buttonText = (shema > 0) ? 'Izmeni shemu' : 'Dodaj shemu';
    $scope.shId=shema;
    $scope.nkriterijumi = [{opis:'', poeni:'', rbr: 1}];
    $scope.npodeoci = [{opis:'', poeni:''}];
    $scope.shUslov=0.5;

    $scope.changeSuccessful = false;

    $scope.addNewKrit = function() {
        $scope.nkriterijumi.push({opis:'', poeni:'', rbr:$scope.nkriterijumi.length+1});
    };

    $scope.removeKrit = function() {
        var lastItem = $scope.nkriterijumi.length-1;
        $scope.nkriterijumi.splice(lastItem);
    };
    $scope.addNewPod = function() {
        $scope.npodeoci.push({opis:'', poeni:''});
    };

    $scope.removePod = function() {
        var lastItem = $scope.npodeoci.length-1;
        $scope.npodeoci.splice(lastItem);
    };
    if(shema>0){
    $http.get("services/api.php?on=seme&all=true&id="+shema).then(function(response) {
        if (response.data !== "null") {
            console.log(response.data);
            $scope.shNaziv = response.data.naziv;
            $scope.shUslov = parseFloat(response.data.uslov);

            $http.get("services/api.php?on=kriterijumi&shemaId=" + shema).then(function (response1) {
                console.log(response1.data);
                if (response1.data !== "null")
                    $scope.shKriterijumi = response1.data;
                else
                    $scope.shKriterijumi = "Nonexisting!";
            });
            $http.get("services/api.php?on=podeoci&shemaId=" + shema).then(function (response2) {
                console.log(response2.data);
                if (response2.data !== "null")
                    $scope.shPodeoci = response2.data;
                else
                    $scope.shPodeoci = "Nonexisting!";
            });
        }
        else
            $scope.data = "Nonexisting!";
    });
    }
    $scope.saveShema= function(){
        if($scope.npodeoci.length>0) {
            $test = $scope.npodeoci.pop();
            while (($test.opis.length == 0 || $test.poeni.length == 0) && $scope.npodeoci.length > 0) {
                $test = $scope.npodeoci.pop();
            }
            if ($scope.npodeoci.length != 0) {
                $scope.npodeoci.push($test);
            }
            else if ($test.opis.length != 0 && $test.poeni.length != 0) {
                $scope.npodeoci.push($test);
            }
        }

        if($scope.nkriterijumi.length>0) {
            $test = $scope.nkriterijumi.pop();
            while (($test.opis.length == 0 || $test.poeni.length == 0) && $scope.nkriterijumi.length > 0) {
                $test = $scope.nkriterijumi.pop();
            }
            if ($scope.nkriterijumi.length != 0) {
                $scope.nkriterijumi.push($test);
            }
            else if ($test.opis.length != 0 && $test.poeni.length != 0) {
                $scope.nkriterijumi.push($test);
            }
        }
        
        var sh={'id':shema, 'naziv':$scope.shNaziv, 'uslov':$scope.shUslov};
        var krit=$scope.shKriterijumi;
        var nkrit=$scope.nkriterijumi;
        var pod=$scope.shPodeoci;
        var npod=$scope.npodeoci;

        if(shema>0){
            var request={action:'update', shema:sh, kriterijumi:krit, noviKriterijumi:nkrit, podeoci:pod, noviPodeoci:npod};
            $http.post("services/api.php",  JSON.stringify(request)).then(function(response){
                $scope.changeSuccessful = true;
            });
        }
        else{
            var request={action:'insert', shema:sh, noviKriterijumi:nkrit, noviPodeoci:npod, on: "sheme"};
            console.log(request);
            console.log(request.type);
            $http.post("services/api.php",  JSON.stringify(request)).then(function(response){
                $scope.changeSuccessful = true;
            });
        }

    }
    $scope.deleteShema=function(){
        if(confirm("Da li ste sigurni da želite da obrišete shemu?")==true) {
            var request = {action: 'delete', id: shema};
            console.log(request);
            $http.post("services/api.php", JSON.stringify(request)).then(function(response){
                $scope.changeSuccessful = true;
            });
        }
    }
});


/************************************   kontroleri za rezultate   *********************************************************/

app.controller('rezultatiCtrl', function($scope) {
        //console.log("scope...");
        $scope.izabraniZadatak = '';
        $scope.zadaci = ["Zadatak1", "Zadatak2", "Zadatak3", "Zadatak4", "Zadatak5", "Zadatak6"];
        $scope.rezultati = [
            {"Indeks" : "111", "PrezimeIme":"Ivanovic Ivan", "Kriterijum1":"3", "Kriterijum2":"5", "Kriterijum3":"2", "Ukupno":10},
            {"Indeks" : "112", "PrezimeIme":"Peric Lazar", "Kriterijum1":"2", "Kriterijum2":"5", "Kriterijum3":"2", "Ukupno":9},
            {"Indeks" : "113", "PrezimeIme":"Mojicevic Rade", "Kriterijum1":"2", "Kriterijum2":"1", "Kriterijum3":"5", "Ukupno":8},
            {"Indeks" : "114", "PrezimeIme":"Zetovic Milos", "Kriterijum1":"5", "Kriterijum2":"3", "Kriterijum3":"4", "Ukupno":12}
        ];
        $scope.proseci = [
            {"Krit" : "Pogođena tema", "Poeni":3},
            {"Krit" : "Fond reči", "Poeni":4.667},
            {"Krit" : "Rod imenice", "Poeni":4.33},
            {"Krit" : "Ukupno",      "Poeni":9.75}
        ];
        
        $scope.myOrderBy = "PrezimeIme";
        
        $scope.orderByMe = function(x) {
            $scope.myOrderBy = x;
            
            
        $scope.show = false;
        $scope.show2 = false;
        
       
        }
              
    });
    
    app.controller('ChartController', function($scope) {

    CanvasJS.addColorSet("greenShades",
                [//colorSet Array

                
                "#008080"
                          
                ]);
                
    $scope.chart = new CanvasJS.Chart("chartContainer", {
        theme: 'theme1',
        colorSet: "greenShades",
        title:{
            text: "Broj članova po kategorijama kriterijuma"              
        },
        axisY: {
            title: "broj članova",
            labelFontSize: 16,
        },
        axisX: {
			title: "Rod imenice",
            labelFontSize: 16,
        },
        data: [              
            {
                type: "column",
                dataPoints: [
                    { label: "[0-1)", y: 0 },
                    { label: "[1-2)", y: 0 },
                    { label: "[2-3)", y: 2 },
                    { label: "[3-4)", y: 0 },
                    { label: "[4-5]", y: 2 },
                    
                ]
            }
        ]
    });

    $scope.chart.render(); //render the chart for the first time
            
    

});


/****************************************************************************************************************************/


/*********************************  zadaci controler    *********************************************************************/
/*
    var shema = ($routeParams.shemaID) ? parseInt($routeParams.shemaID) : 0;
    $rootScope.title = (shema > 0) ? 'Izmena Sheme '+shema : 'Nova shema';
    $scope.buttonText = (shema > 0) ? 'Izmeni shemu' : 'Dodaj shemu';
    $scope.shId=shema;
*/
app.controller('zadaciCitanjeCtrl', function($scope, $rootScope, $location, $routeParams, $http) {
		
		$http.get("services/api.php?on=zadaci&all=true").then(function(response){
				console.log(response.data);
				if(response.data!=="null"){
					console.log("imamo podatke u data");
					$scope.data=response.data;
				}
				else
					$scope.data="Nonexisting!";
			});

});

	
app.controller('zadaciCtrl', function($scope, $rootScope, $location, $routeParams, $http) {

		var zadatakID = ($routeParams.zadatakID) ? parseInt($routeParams.zadatakID) : 0;
		//$scope.zadId=zadatakID;
		
		if(zadatakID == 0)
			$scope.brisanjeShow = false;
		else
			$scope.brisanjeShow = true;

		$scope.koordinator = "Izaberite koordinatora";
		$scope.grupa = "Izaberite grupu kandidata";
		$scope.sema = "Izaberite semu ocenjivanja";
		
		//kupimo koordinatore
			$http.get("services/api.php?on=koordinatori&all=true").then(function(response){
				console.log(response.data);
				if(response.data!=="null"){
					console.log("imamo podatke u data");
					$scope.koordinatori=response.data;
				}
				else
					$scope.koordinatori="Nonexisting!";
			});
			
		//kupimo grupe kandidata
		$http.get("services/api.php?on=grupe").then(function(response) {
				console.log(response.data);
				if(response.data!=="null")
					$scope.grupeKandidata=response.data;
				else
					$scope.grupeKandidata="Nonexisting!";
		});
		
		//kupimo seme ocenjivanja
		$http.get("services/api.php?on=seme&all=false").then(function(response) {
			console.log(response.data);
			if(response.data!=="null")
				$scope.semeOcenjivanja=response.data;
			else
				$scope.semeOcenjivanja="Nonexisting!";
		});

	if(zadatakID>0){
		$http.get("services/api.php?on=zadaci&all=false&id="+zadatakID).then(function(response) {
        if (response.data !== "null") {
            console.log(response.data);
			
			$scope.nazivZadatka = response.data.naziv;
			$scope.opisZadatka = response.data.opis;
			$scope.pdfLink = response.data.pdfLink;
			$scope.obavezan = "";
			$scope.brojPoena = parseInt(response.data.poeni);
			$scope.datumKreiranja = response.data.datumKreiranja;
			$scope.koordinator = response.data.koordinatorID.toString() + ': ' + response.data.imeKoordinatora + ', ' + response.data.institucija;;
			console.log("Koordinator: " + $scope.koordinator);
			$scope.grupa = response.data.grupaID.toString() + ': ' + response.data.nazivGrupe;
			$scope.sema = response.data.semaID.toString() + ': ' + response.data.nazivSeme;

            $scope.color = "grey";
        }
        else{
			$scope.color = "white";
            $scope.data = "Nonexisting!";
		}
    });
    }

		/*
		$scope.definisi = function(){
			$scope.poruka = "definisi";
			$scope.showDefinisi = true;
			$scope.showPregledaj = false;
			//kupimo koordinatore
			$http.get("services/api.php?on=koordinatori&all=true").then(function(response){
				console.log(response.data);
				if(response.data!=="null"){
					console.log("imamo podatke u data");
					$scope.koordinatori=response.data;
				}
				else
					$scope.koordinatori="Nonexisting!";
			}
			
		)};
		
		
		$scope.pregledaj = function(){
			$scope.poruka = "pregledaj";
			console.log("pregledaj() iz kontrolera");
			$scope.showPregledaj = true;
			$scope.showDefinisi = false;
			$http.get("services/api.php?on=zadaci&all=true").then(function(response){
				console.log(response.data);
				if(response.data!=="null"){
					console.log("imamo podatke u data");
					$scope.data=response.data;
				}
				else
					$scope.data="Nonexisting!";
			}
		)};
		*/
		$scope.uzmiID = function(s){
			return parseInt(s.substring(0, s.indexOf(":")));
		}
		
		$scope.IDKoordinatora = $scope.uzmiID($scope.koordinator);
		$scope.IDGrupe = $scope.uzmiID($scope.grupa);
		$scope.IDSeme = $scope.uzmiID($scope.sema);
		$scope.zaBrisanje=0;

		$scope.submit = function(){
			console.log("\nsubmit()\n");
			//ispisujemo sve vrednosti 
			console.log("Naziv zadatka: " + $scope.nazivZadatka);
			console.log("Opis zadatka: " + $scope.opisZadatka);
			console.log("Pdf link: " + $scope.pdfLink);
			console.log("Obavezan: " + $scope.obavezan);
			console.log("Broj poena: " + $scope.brojPoena);
			console.log("Datum kreiranja: " + $scope.datumKreiranja);
			console.log("Koordinator: " + $scope.koordinator);
			console.log("ID Koordinatora: " + $scope.uzmiID($scope.koordinator));
			console.log("Grupa: " + $scope.grupa);
			console.log("ID Grupe: " + $scope.IDGrupe);
			console.log("Sema: " + $scope.sema);
			console.log("ID Seme: " + $scope.IDSeme);
			
			if(!$scope.nazivZadatka.trim()){
				window.alert("Morate popuniti naziv zadatka!");
				
			}
			else if(!$scope.opisZadatka.trim()){
				window.alert("Morate popuniti opis zadatka!");
				
			}
			else if(!$scope.pdfLink.trim()){
				window.alert("Morate popuniti pdf link!");
				
			}
			else if(!$scope.obavezan){
				window.alert("Morate odabrati da li je zadatak obavezan!");
				
			}
			else if(!$scope.brojPoena){
				window.alert("Morate popuniti broj poena!");
				
			}
			else if(!$scope.koordinator.trim() || $scope.koordinator == "Izaberite koordinatora"){
				window.alert("Morate izabrati koordinatora!");
				
			}
			else if(!$scope.grupa.trim()  || $scope.grupa == "Izaberite grupu kandidata"){
				window.alert("Morate izabrati grupu kandidata!");
				
			}
			else if(!$scope.sema.trim()  || $scope.sema == "Izaberite semu ocenjivanja"){
				window.alert("Morate izabrati semu ocenjivanja!");
				
			}
			/*
			else {
				window.confirm("Uspesno ste popunili zadatak.");
			}
			*/
			
			console.log("\n\n");
			
			if($scope.obavezan == "da")
				$scope.obavezanBroj = 1;
			else
				$scope.obavezanBroj = 0;
			
			zad = {'idZadatak': zadatakID, 'naziv': $scope.nazivZadatka, 'opis': $scope.opisZadatka, 'pdfLink' : $scope.pdfLink, 
				   'obavezan' : $scope.obavezanBroj, 'brojPoena' : $scope.brojPoena, 'datumKreiranja' : $scope.datumKreiranja, 
				   'Koordinator_idKoordinator' : $scope.uzmiID($scope.koordinator), 
				   'Grupa_idGrupa' : $scope.uzmiID($scope.grupa), 
				   'SemaOcenjivanja_idSemaOcenjivanja' : $scope.uzmiID($scope.sema)};
			
			//update
			if(zadatakID>0){
				/*
				var request={action:'update', zadatak:zad, on:"zadatak"};
				console.log(request);
				$http.post("services/api.php",  JSON.stringify(request)).then(function(response){
					$scope.changeSuccessful = true;
					console.log("Update uspeo.");
            }, function(response){
					console.log("ne radi update");
					
				});
				*/
				/*
				var request = $http({
                    method: "post",
                    url: "process.cfm",
                    transformRequest: transformRequestAsFormPost,
                    data: {
                        id: 4,
                        name: "Kim",
                        status: "Best Friend"
                    }
                });*/
				$.ajax({
                        url: "services/api.php",
                        type: "put",
                        contentType: "application/json",
                        data: JSON.stringify({zadatak:zad}),
                        success: function(result, statusText, jqxhr){
							console.log("Uspesno ste promenili zadatak. :)");
                        },

                        error: function(result, statusText, jqxhr){
							console.log("Menjanje zadatka neuspesno: " + statusText);

                        }

                    });
				
			}//end if ID>0 odnosno radimo update a ne insert
			else {
				var request={action:'insert', zadatak:zad, on:"zadatak"};
				console.log(request);
				//console.log(request.type);
				$http.post("services/api.php",  JSON.stringify(request)).then(function(response){
					$scope.changeSuccessful = true;
				});
			}
			
			
			
		}//end submit
		
		$scope.izmenaZadatka = function(zadatakID){
			console.log("Menjamo zadatak: " + zadatakID);
			
		};
		
		$scope.obrisiZadatak = function(){
			//console.log("Brisemo zadatak: " + zadatakID);
			console.log("Brisemo zadatak: " + zadatakID);
			if(confirm("Da li ste sigurni da želite da obrišete zadatak?")==true) {
				/*$http({
				  method: 'DELETE',
				  url: '/someUrl',
				  data: 'JSON.stringify(request))'
				}).then(function successCallback(response) {
					console.log("Brisanje uspesno.");
				  }, function errorCallback(response) {
					console.log("Brisanje neuspesno.");
				  });*/
				
				/*
				var request = {action: "delete", id: zadatakID};
				console.log(request);
				$http.delete("services/api.php", JSON.stringify(request)).then(function(response){
					$scope.changeSuccessful = true;
					$scope.zadatakID = 0;
				});
				}*/
				
				/*
				var data = $.param({
					id: zadatakID,
					on: "zadatak"
				});

				$http.delete('services/api.php' + data)
				.success(function (data, status, headers) {
					console.log("Uspesno obrisan zadatak: \n" + data);
				})
				.error(function (data, status, header, config) {
					console.log(htmlDecode("Data: " + data +
						"\n\n\n\nstatus: " + status +
						"\n\n\n\nheaders: " + header +
						"\n\n\n\nconfig: " + config));
				});
				*/
				window.location.href = "#/izmeniZadatak/0";
				$.ajax({
                        url: "services/api.php",
                        type: "delete",
                        contentType: "application/json",
                        data: JSON.stringify({id:zadatakID}),
                        success: function(result, statusText, jqxhr){
							console.log("Uspesno obrisano. :)");
							//header("Location: #/izmeniZadatak/0");
							
                        },

                        error: function(result, statusText, jqxhr){
							console.log("Neuspesno obrisano. :( " + statusText);

                        }

                    });
			
    }//end confirm
				
		};//end obrisiZadatak()
		
		//za <select> i search 
		//$scope.koordinatori = ["Koordinator1", "Koordinator2", "Koordinator3", "Koordinator4", "Koordinator5"];
		/*
		if($scope.showPregledaj){
			
			$http.get("services/api.php?on=zadaci&all=true").then(function(response) {
				console.log(response.data);
				if(response.data!=="null")
					$scope.data=response.data;
				else
					$scope.data="Nonexisting!";
    });
	}
		*/	
		
		
		
	});


/****************************************************************************************************************************/

/*********************************  ocenjivanje controler    *********************************************************************/

app.controller('ocenjivanjeCtrl', function($scope, $rootScope, $location, $routeParams, $http) {
	
		$scope.kandidati = ["Mika Mitrovic", "Mia Mitrovic", "Patak Daca", "Miki Maus", "Mini Maus", "Snoopy", "Kica"];
		$scope.selZadatak = false;
		$scope.selGrupaKandidata = false;
		$scope.sel = false;
		//console.log("log");
		
		$scope.zadatakModel = 'Izaberite zadatak:';
		$scope.grupaModel = 'Izaberite grupu:';
		$scope.i = 0;
		$scope.brojKandidata = $scope.kandidati.length;
		//console.log("Broj kandidata je: " + ($scope.brojKandidata-1));
		
		
		//citanje grupe kandidata iz baze
		//$scope.grupeKandidata = [];
		$http.get("services/api.php?on=grupe").then(function(response) {
				console.log(response.data);
				if(response.data!=="null")
					$scope.grupeKandidata=response.data;
				else
					$scope.grupeKandidata="Nonexisting!";
		});
		//$scope.zadaci = [];
		$http.get("services/api.php?on=zadaci$all=true").then(function(response) {
				console.log(response.data);
				if(response.data!=="null")
					$scope.zadaci=response.data;
				else
					$scope.zadaci="Nonexisting!";
		});
		
	
		$scope.selektovano = function(){
			if($scope.selGrupaKandidata && $scope.selZadatak)
				$scope.sel = true;
		};
	
		$scope.selektovanZadatak = function(){
			$scope.selZadatak = true;
			console.log("selektovanZadatak()");
			$scope.selektovano();
		};
		
		$scope.selektovanaGrupaKandidata = function(){
			$scope.selGrupaKandidata = true;
			$scope.selektovano();
		};
	
	
		$scope.kriterijumi = ["Kriterijum 1", "Kriterijum 2", "Kriterijum 3"];
		$scope.podeociSkale = ["nedovoljan", "dovoljan", "dobar", "vrlo dobar", "odlican", "izuzetno odlican"];
		
		$scope.sledeciEnabled = true;
		$scope.prethodniEnabled = false;
		
		console.log("Definisemo sledeciKandidat()");
		$scope.sledeciKandidat = function(){
			
			$scope.i++;
			console.log("sledeciKandidat() \t" + $scope.i);
			if($scope.i == $scope.brojKandidata-1){
				console.log("sledeci disableujemo");
				$scope.sledeciEnabled = false;
			}
			if($scope.i == 0)
				$scope.prethodniEnabled = false;
			else{
				console.log("prethodni enableujemo");
				$scope.prethodniEnabled = true;
				$("#prethodniButton").attr("ng-disabled", "false");
			}
		}
		
		$scope.prethodniKandidat = function(){

			$scope.i--;
			console.log("prethodniKandidat() \t" + $scope.i);
			if($scope.i == 0)
				$scope.prethodniEnabled = false;
			if($scope.i == $scope.brojKandidata-1)
				$scope.sledeciEnabled = false;
			else
				$scope.sledeciEnabled = true;
		}
	
		
		
		$scope.showDefinisi = true;
		$scope.showPregledaj = false;
		
		$scope.definisi = function(){
			
			$scope.showDefinisi = true;
			$scope.showPregledaj = false;
		};
		$scope.pregledaj = function(){
			
			$scope.showPregledaj = true;
			$scope.showDefinisi = false;
		};
		
		//za <select> i search 
		$scope.koordinatori = ["Koordinator1", "Koordinator2", "Koordinator3", "Koordinator4", "Koordinator5"];
	});

/****************************************************************************************************************************/


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      /*when('/', {
        templateUrl: 'partials/sheme.html',
        controller: 'listCtrl'
      })*/
	  when('/pages/sheme', {
        templateUrl: 'partials/sheme.html',
        controller: 'listCtrl'
      })
      .when('/izmeniShemu/:shemaID', {
        templateUrl: 'partials/shemeIzmena.html',
        controller: 'editCtrl'
      })
	  .when('/pages/rezultati', {
            templateUrl: 'partials/rezultati.html',
            controller: 'rezultatiCtrl',
        })	  
	  .when('/pages/zadaci', {
            templateUrl: 'partials/zadaci.html',
            controller: 'zadaciCtrl',
        })
		.when('/izmeniZadatak/:zadatakID', {
            templateUrl: 'partials/izmenaDodavanjeZadatka.html',
            controller: 'zadaciCtrl',
        })
			
	  .when('/pages/ocenjivanje', {
            templateUrl: 'partials/ocenjivanje.html',
            controller: 'ocenjivanjeCtrl',
        })
      .otherwise({
        redirectTo: '/'
      });
}]);