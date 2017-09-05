// a.	Implement a function to parse the JSON string below into objects of type Tournament and Player. It should be obvious that a Tournament will have many Players.
function Player(lastname, firstinitial, score, hole) {
  this.lastname = lastname,
  this.firstinitial = firstinitial,
  this.score = score,
  this.hole = hole,
  this.sayName = function() {
    console.log(this.lastname + " "+ this.firstinitial);
  }
}

function Tournament(name,year,award,yardage,par,round,players) {
  this.name = name,
  this.year = year,
  this.yardage = yardage,
  this.par=par,
  this.round = round,
  this.players = players,
  this.printTournament = function(){
    console.log(this.name);
  }
}



//test cases:
var inputData = {
  "tournament": {
    "name": "British Open",
    "year": " ",
    "award": 840000,
    "yardage": 6905,
    "par": 71,
    "round": 1,
    "players": [
      {
        "lastname": "Montgomerie",
        "firstinitial": "C",
        "score": -3,
        "hole": 17
      }, {
        "lastname": "Fulke",
        "firstinitial": "P",
        "score": -5,
        "hole": "finished"
      }
    ]
  }
};

var inputStringData = JSON.stringify(inputData);

function golfParser(input){
  var parsedData = JSON.parse(input);
  var tour = parsedData.tournament;
  var players = parsedData.tournament.players;
  var playersArray = new Array();
  for(x in players){
    var playerObject = new Player(players[x].lastname,players[x].firstinitial,players[x].score,players[x].hole);
    playersArray.push(playerObject);
  }
  return new Tournament(tour.name,tour.year,tour.award,tour.yardage,tour.par,tour.round,playersArray);
}

function testcase1(inputData){
  console.log("running test case 1 : check type of object passed into parser and log the returned data (parsed json into a js object)")
  var tournamentObject = golfParser(inputData);
  console.log(tournamentObject.constructor)
  console.log(tournamentObject.name);
  console.log(tournamentObject.players[0].sayName());
}

testcase1(inputStringData);
