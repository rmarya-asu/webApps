// a.	Implement a function to parse the JSON string below into objects of type Tournament and Player. It should be obvious that a Tournament will have many Players.
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
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
      return 18;
    } else {
      return this.hole;
    }
  }

  this.nextHole = function(){
    if(this.hole == 17){
      this.hole = 'finished';
      myEmitter.emit('playerFinished');
    }
    else{
      this.hole++;
    }
  }
  this.postScore = function(score){
    if(typeof score === 'number'){
      //score applies to the round of the tournament.
      //player cannot add score if his hole ==18.
      //update 'finished when score is 18'
      if(this.getHole()==18){
        return "player cannot post score -> he has finished the round";
      }
      this.score = score;
      this.nextHole(); // to update the hole number after posting the score (managing 'finished')
      return "score posted -> check leaderboard for updates"
    }
    else{
      return "NOT a number"
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
  this.award = tour.award;

  myEmitter.on('playerFinished', () => {
    //one player has finished posting his scores. can we check if all the players have finished? and trigger next event?
    //value of this is right... so i can continue.
    console.log("player has finished, checking all players if they have finished");
    for (t in this.players){
      //how to check if all players finished??
      if(this.players[t].getHole() <18){
        console.log("atleast 1 player hasnt finished");
        return "score posted";
      }
    }
    //all players have completed.
    myEmitter.emit('RoundFinished');
  });


  myEmitter.on('RoundFinished',()=>{
    if(this.round == 4){
      //tournament is finished.
      myEmitter.emit('TournamentFinished');
    }
    else{
      this.round ++;
      //resetting holes to 0 if round is completed
      for(y in this.players){
        this.players[y].hole = 0;
      }
      return "round finished"
    }
  });

  myEmitter.on('TournamentFinished',()=>{
    console.log("tournament has finished");
    console.log('-------------------------');
    var winner = this.getWinner();
    console.log("WINNER -> " +winner.firstinitial + "winner");
    this.setWinnings();
  });


  this.printTournamentName = function() {
    console.log(this.name);
  }


  this.getWinner = function(){
    this.leaderboard();
    return this.players[0]; //should return last name
  }

  this.setWinnings = function(){
    this.leaderboard();//just to sort the players again.
    this.players[0].winnings = this.award *0.5;
    this.players[1].winnings = this.award *0.3;
    this.players[2].winnings = this.award *0.2;
  }
  this.findPlayer = function(lastname, firstinitial) {
    for (x in this.players) {
      if (players[x].lastname === lastname && players[x].firstinitial === firstinitial) {
        return x;
      }
    }
    //player not found
    return null;
  }

  this.getAverageOfAllScores = function() {
    var totalScore = 0;
    var totalHoles = 18 * (this.round - 1);
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
    var playerIndex = this.findPlayer(lastname, firstinitial);
    if (!playerIndex) {
      //what do i return if player is not found?
      return console.log("player with name " + lastname + " " + firstinitial + " not found!");
    }
    //TODO: handle error case for 'hole can be finished' - done, added getHole method to convert -> "finised to 18"
    var scorePerHole = this.players[playerIndex].score / this.players[playerIndex].getHole();
    //TODO: I have assumed that 18 is the hole for the particular game.
    var projectedScore = (scorePerHole * (18 - this.players[playerIndex].getHole())) + players[playerIndex].score;
    return Math.round(projectedScore);
  }

  this.projectScoreByHole = function(lastname, firstinitial) {
    var playerIndex = this.findPlayer(lastname, firstinitial);
    if (!playerIndex) {
      //what do i return if player is not found?
      return console.log("player with name " + lastname + " " + firstinitial + " not found!");
    }
    //console.log("got the player");
    //console.log(players[playerIndex].firstinitial);
    //TODO: handle error case for 'hole can be finished'
    var averageScore = this.getAverageOfAllScores();
    var projectedScoreByH = this.players[playerIndex].score + ((18 - this.players[playerIndex].getHole()) * averageScore);
    return Math.round(projectedScoreByH);
  }

  this.isRoundCompleted = function() {
    for (x in this.players) {
      if (players[x].hole !== 'finished')
        return false;
      }
    return true;
  }
  this.leaderboard = function() {
    //sorts players based on -> score and then on hole.
    this.players.sort(function(a, b) {
      if(a.score!=b.score){
        return a.score - b.score;
      }else{
        return b.getHole() - a.getHole();
      }
      //return a.score - b.score;
    });
    //TODO: clhow to sort it next by hole?
    return JSON.stringify(this.players,null,4);
  }

  this.projectScoreByXXX = function() {
    //console.log("here2");
    var i = 0;
    for (index in this.players) {
      console.log(index);
      this.players[index].oldScore = this.players[index].score;
      console.log("player : " +this.players[index].firstinitial + " score = " +this.players[index].score);
      this.players[index].score = this.projectScoreByHole(this.players[x].lastname, this.players[index].firstinitial);
      console.log("player : " +this.players[index].firstinitial + " Projscore = "+ this.players[index].score);
      this.players[index].projectedScore = this.players[index].score;
      console.log("player : " +this.players[index].firstinitial + " Projscore.2= " +this.players[index].projectedScore);
    }
    this.leaderboard();
    for(y in this.players){
      //reseting scores
      console.log(y);
      this.players[y].score = this.players[y].oldScore;
     delete this.players[y].oldScore;
    }
    return JSON.stringify(this.players,null,4);
  }

  this.projectedLeaderboard = function(projectScoreByYYY) {
    return projectScoreByYYY();
  //  console.log("hmmm");
  }

}
//e.	Implement a function named projectedLeaderboard that does exactly what leaderboard does except it takes another
//argument representing a function (projectScoreByXXX) and uses this function to determine a leaderboard based on each
//player’s projected finishing score. If you are really clever you can reuse the leaderboard function.
Tournament.prototype.printLeaderboard = function() {
  console.log(this.leaderboard());
}



var inputData = {
  tournament: {
    name: "test",
    year: 2000,
    yardage: 6905,
    award: 100000,
    par: 69,
    round: 4,
    players: [
      {
        lastname: "Player",
        firstinitial: "1",
        score: -1,
        hole: "finished"
      }, {
        lastname: "Player",
        firstinitial: "2",
        score: -2,
        hole: 17
      }, {
        lastname: "Player",
        firstinitial: "3",
        score: 0,
        hole: 16
      }, {
        lastname: "Player",
        firstinitial: "4",
        score: -2,
        hole: 17
      },
      {
        lastname: "Player",
        firstinitial: "5",
        score: -2,
        hole: 17
      }
    ]
  }
}

var inputStringData = JSON.stringify(inputData);


function testcase1(inputData) {
  console.log("running test case 1 : check type of object passed into parser and log the returned data (parsed json into a js object)")
  var tournamentObject = new Tournament(inputData);
  console.log("constructor: " + tournamentObject.constructor)
  console.log("tournament Name: " + tournamentObject.name);
  tournamentObject.players[0].sayName();
  console.log("the leaderboard "+tournamentObject.leaderboard());
  console.log("is it completed? "+tournamentObject.isRoundCompleted());
  console.log("project score of Montgomerie :" + tournamentObject.projectScoreByIndividual("Player", "1"));
}

function testcase2(inputData){
  console.log("running testcase2  : leaderboard()");
  var t = new Tournament(inputData);
  console.log("leaderboard: "+t.leaderboard());

}

function testcase3(inputData){
  console.log("running testcase3  : projectScoreByIndividual()");
  var t = new Tournament(inputData);
  console.log("projected Score for player 1 : " +t.projectScoreByIndividual("Player","1"));
  console.log("projected Score for player 2 : " +t.projectScoreByIndividual("Player","2"));
  console.log("projected Score for player 3 : " +t.projectScoreByIndividual("Player","3"));
  console.log("projected Score for player 4 : " +t.projectScoreByIndividual("Player","4"));
  console.log("projected Score for player 5 : " +t.projectScoreByIndividual("Player","5"));
}

function testcase4(inputData){
  console.log("running testcase4  : projectScoreByHole()");
  var t = new Tournament(inputData);
  console.log("projected Score by Hole for player 1 : " +t.projectScoreByHole("Player","1"));
  console.log("projected Score by Hole for player 2 : " +t.projectScoreByHole("Player","2"));
  console.log("projected Score by Hole for player 3 : " +t.projectScoreByHole("Player","3"));
  console.log("projected Score by Hole for player 4 : " +t.projectScoreByHole("Player","4"));
  console.log("projected Score by Hole for player 5 : " +t.projectScoreByHole("Player","5"));
}


function testcase5(inputData){
  console.log("running testcase5  : projectedLeaderboard()");
  var t = new Tournament(inputData);
  console.log("current leaderboard : "+t.leaderboard());
  console.log("---------------------------------------------------------");
  console.log("projected leaderboard : " +t.projectedLeaderboard(t.projectScoreByXXX.bind(t)));
}


function testcase6(inputData){
  console.log("running testcase6  prototype: printLeaderboard()");
  var t = new Tournament(inputData);
  t.printLeaderboard();
}

function testcase7(inputData){
  console.log("running testcase7 : postScore() -> adding them in this value we can test both player finising a round -> Tournament finishing.");
  var t = new Tournament(inputData);
  t.printLeaderboard();
  console.log(t.players[0].postScore(-3));
  t.printLeaderboard();
  console.log(t.players[1].postScore(-4));
  t.printLeaderboard();
  console.log(t.players[2].postScore(1));
  t.printLeaderboard();
  console.log(t.players[3].postScore(-2));
  t.printLeaderboard();
  console.log(t.players[2].postScore(-3));
  t.printLeaderboard();


}
// testcase1(inputStringData);
// testcase2(inputStringData);
// testcase3(inputStringData);
// testcase4(inputStringData);
// testcase5(inputStringData);
// testcase6(inputStringData);
//testcase7(inputStringData);
