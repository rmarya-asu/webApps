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
  this.players = JSON.parse(players)
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


function golfParser( input){
  console.log("type of input" + typeof input);
  var parsedData = JSON.parse(input);
  console.log("parsed data");
  console.log(parsedData);

  console.log(parsedData.tournament.players);
  return parsedData;
}

function testcase1(inputData){
  console.log("running test case 1 : check type of object passed into parser and log the returned data (parsed json into a js object)")
  console.log("typeof inputData : " + typeof inputData);
  console.log("parser : ");
  var t = golfParser(inputData);
  console.log(t.name);
  var Players = t.players;
  console.log(t.players);
}

testcase1(inputStringData);
