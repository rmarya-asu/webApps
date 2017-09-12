// a.	Implement a function to parse the JSON string below into objects of type Tournament and Player. It should be obvious that a Tournament will have many Players.
function Player(lastname, firstinitial, score, hole) {
  this.lastname = lastname;
  this.firstinitial = firstinitial;
  this.score = score;
  this.hole = hole;

  this.sayName = function() {
    console.log(this.lastname + " " + this.firstinitial);
  }

  this.getHole = function() {
    if (this.hole === 'finished') {
      console.log("making the value 18");
      return 18;
    } else {
      return this.hole
    }
  }
}

function Tournament(input) {
  var parsedData = JSON.parse(input);
  var tour = parsedData.tournament;
  var players = parsedData.tournament.players;
  var playersArray = new Array();

  for (x in players) {
    var playerObject = new Player(players[x].lastname, players[x].firstinitial, players[x].score, players[x].hole);
    playersArray.push(playerObject);
  }

  this.name = tour.name;
  this.year = tour.year;
  this.yardage = tour.yardage;
  this.par = tour.par;
  this.round = tour.round;
  this.players = playersArray;

  this.printTournamentName = function() {
    console.log(this.name);
  }

  this.leaderboard = function() {
    console.log("this.players " + this.players);
    this.players.sort(function(a, b) {
      return a.score - b.score;
    });
    //TODO: clhow to sort it next by hole?
    return JSON.stringify(this.players);
  }

  this.findPlayer = function(lastname, firstinitial) {
    console.log("Finding player with name " + lastname);
    for (x in this.players) {
      if (players[x].lastname === lastname && players[x].firstinitial === firstinitial) {
        return x;
      }
    }
    //player not found
    return null;
  }

  this.getAverageOfAllScores = function() {
    console.log("average of ");
    var totalScore = 0;
    var totalHoles = 18 * (this.round - 1);
    console.log("round = " + this.round + "total holes :" + totalHoles);
    var i = 0;
    for (x in this.players) {
      var playerHole = this.players[x].getHole();
      var scorebyHole = this.players[x].score / (totalHoles + playerHole);
      totalScore += scorebyHole;
      i++;
    }
    return (totalScore) / i;
  }

  this.projectScoreByIndividual = function(lastname, firstinitial) {
    console.log("inside project score by individual");
    var playerIndex = this.findPlayer(lastname, firstinitial);
    if (!playerIndex) {
      //what do i return if player is not found?
      return console.log("player with name " + lastname + " " + firstinitial + " not found!");
    }
    console.log(this.players[playerIndex].lastname);
    //TODO: handle error case for 'hole can be finished' - done, added getHole method to convert -> "finised to 18"
    var scorePerHole = this.players[playerIndex].score / this.players[playerIndex].getHole();
    //TODO: I have assumed that 18 is the hole for the particular game.
    console.log("score per hole : " + scorePerHole);
    var projectedScore = (scorePerHole * (18 - this.players[playerIndex].getHole())) + players[playerIndex].score;
    return math.round(projectedScore);
  }

  this.projectScoreByHole = function(lastname, firstinitial) {
    console.log("project by hole");
    var playerIndex = this.findPlayer(lastname, firstinitial);
    if (!playerIndex) {
      //what do i return if player is not found?
      return console.log("player with name " + lastname + " " + firstinitial + " not found!");
    }
    console.log("got the player");
    console.log(players[playerIndex].lastname);
    //TODO: handle error case for 'hole can be finished'
    var averageScore = this.getAverageOfAllScores();
    var projectedScoreByH = this.players[playerIndex].score + ((18 - this.players[playerIndex].getHole()) * averageScore);
    console.log(averageScore);
    console.log(projectedScoreByH);
    return Math.round(projectedScoreByH);
  }

  this.isRoundCompleted = function() {
    for (x in this.players) {
      if (players[x].hole !== 'finished')
        return false;
      }
    return true;
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
}

var inputStringData = JSON.stringify(inputData);

function testcase1(inputData) {
  console.log("running test case 1 : check type of object passed into parser and log the returned data (parsed json into a js object)")
  var tournamentObject = new Tournament(inputData);
  // //console.log("constructor: "+tournamentObject.constructor)
  // console.log("tournament Name: "+tournamentObject.name);
  // tournamentObject.players[0].sayName();
  // console.log("the leaderboard "+tournamentObject.leaderboard());
  // console.log("is it completed? "+tournamentObject.isRoundCompleted());
  //console.log("project score of Montgomerie :" + tournamentObject.projectScoreByIndividual("Montgomerie", "C"));
  //console.log("project score of Montgomerie :" + tournamentObject.projectScoreByIndividual("Mont", "C"));
  //console.log("project score of Fulke :" + tournamentObject.projectScoreByIndividual("Fulke", "P"));
  console.log("project score of Mont :" + tournamentObject.projectScoreByHole("Montgomerie", "C"));
  // tournamentObject.projectScoreByHole("Montgomerie", "C");
}

testcase1(inputStringData);
