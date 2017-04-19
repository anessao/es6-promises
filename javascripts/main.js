// Use AJAX | Promises to load all 3 JSON files
// Iterate over all JSON files and match the human with their appropriate pet(s)
// ES6-ify it all!


$(document).ready(function(){
	var outputContainer = $("#output");
	var writeToDOM = function (humanArray) {
	  var domString = "";
	  for (var i = 0; i < humanArray.length; i++) {
	    domString += `<div class="human row">`;
	    domString += `<div class="col-sm-4">`;
	    domString += `<img src="${humanArray[i].image}">`;
	    domString += `<p>${humanArray[i].name}</p>`;
	    domString += `</div>`;
	    domString += `<div class="col-sm-8 overflow-row">`;
	    for (var j = 0; j < humanArray[i].matches.length; j++){
	      domString += `<div class="animal">`;
	      domString += `<img src="${humanArray[i].matches[j].image}">`;
	      domString += `<p>${humanArray[i].matches[j].name}</p>`;
	      domString += `<p>${humanArray[i].matches[j].description}</p>`;
	      domString += `</div>`;
	    }
	    domString += `</div>`;
	    domString += `</div>`;
	  }
	  outputContainer.append(domString);
	};

	//VARIABLES
	var myHumans = [];
	var myAnimals = [];

	//COMPARE AND MATCH THE DATA SETS
	function checkForTypeMatch(human, pet){
		var interestedInArray = human["interested-in"];
		var isMatchNumber = interestedInArray.indexOf(pet.type);
		if(isMatchNumber === -1){
			return false;
		} else {
			return true;
		}
	}
	function checkForKidFriendly (human, pet){
		var hasKidsArray = human["has-kids"];
		var isKidFriendly = pet["kid-friendly"];
		var isMatched = true;
		if (hasKidsArray && !isKidFriendly) {
			isMatched = false;
		}
		return isMatched;
	}

	//PROMISE FUNCTIONS TO LOAD JSON FILES
	var loadHumans = function(){
		return new Promise(function(resolve, reject){
			$.ajax("./database/humans.json").done(function(data1){
				resolve(data1.humans);
			}).fail(function(error1){
				reject(error1);
			});
		});
	};
	var loadCats = function(){
		return new Promise(function(resolve, reject){
			$.ajax("./database/cats.json").done(function(data2){
				resolve(data2.cats);
			}).fail(function(error2){
				reject(error2);
			});
		});
	};
	var loadDinos = function(){
		return new Promise(function(resolve, reject){
			$.ajax("./database/dinos.json").done(function(data3){
				resolve(data3.dinos);
			}).fail(function(error3){
				reject(error3);
			});
		});
	};
	var loadDogs = function(){
		return new Promise(function(resolve, reject){
			$.ajax("./database/dogs.json").done(function(data4){
				resolve(data4.dogs);
			}).fail(function(error4){
				reject(error4);
			});
		});
	};

	//CALLING PROMISES
	loadHumans().then(function(humans){
		humans.forEach(function(humanData){
			humanData.matches = [];
			myHumans.push(humanData);
		});
		Promise.all([loadCats(), loadDinos(), loadDogs()])
		.then(function(allData){
			allData.forEach(function(ajaxCalls){
				ajaxCalls.forEach(function(animal){
					myAnimals.push(animal);
				});
			});
			for(var i = 0; i < myHumans.length; i++){
				for (var j = 0; j < myAnimals.length; j++){
					if (checkForTypeMatch(myHumans[i], myAnimals[j]) && checkForKidFriendly(myHumans[i], myAnimals[j])) {
						myHumans[i].matches.push(myAnimals[j]);
					}
				}
			}
			writeToDOM(myHumans);
		}).catch(function(errors){
			console.log(errors);
		});
	}).catch(function(humanError){
		console.log(humanError);
	});














































});
