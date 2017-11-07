var game = {};
var rooms = ['Kitchen', 'Study', 'Living Room', 'Dining Room', 'Library'];
var guests = ['Mrs. Peacock', 'Mrs. Green', 'Miss Scarlet', 'Colonel Mustard', 'Professor Plum'];
var weapons = ['Pistol', 'Knife', 'Wrench', 'Lead Pipe', 'Candlestick'];
var gameStates = ['started', 'user', 'computer', 'finished']

var showComputerRecord = function(){
  if(!localStorage.getItem('clue')){
    var nodeP = document.createElement("P");
      var data = "no stats available right now";
      nodeP.appendChild(document.createTextNode(data));
    document.getElementById('computerStats').appendChild(nodeP);
  }else{
    var clue=JSON.parse(localStorage.getItem('clue'));
    console.log(clue);
    console.log("CLUEEE");
    var table = document.getElementById('table');
    var node0 = document.createElement("TR");
    var node1 = document.createElement("TD");
    var node2 = document.createElement("TD");
    var node3 = document.createElement("TD");
    node1.value = clue.userName;
    node1.appendChild(document.createTextNode(clue.username));
    var now = new Date(clue.time);
    node2.appendChild(document.createTextNode(now.getMonth() + " " +now.getDate() + " " + now.getYear()));
    node3.appendChild(document.createTextNode(clue.userScore + " - " + clue.computerScore));
    node0.appendChild(node1);
    node0.appendChild(node2);
    node0.appendChild(node3);
    table.appendChild(node0);
  }
}

var setLocalStorageWithScore = function(userScore,computerScore){
  var arr = [];
  var found = false;
  var obj = {};
  obj.username = sessionStorage.getItem('username');
  obj.userScore = userScore;
  obj.computerScore = computerScore;
  obj.time = Date.now();

  if(localStorage.getItem('clue')){
    var cluArray = JSON.parse(localStorage.getItem('clue'));
    for (index in cluArray){
      if(cluArray[index].username === obj.username){
        cluArray[index].userScore = userScore;
        cluArray[index].computerScore = computerScore;
        cluArray[index].time = obj.time;
        found = true;
      }
    }
    if(!found){
      cluArray.push(obj);
      localStorage.setItem('clue',JSON.stringify(cluArray));
    }
  }else{
    arr.push(obj);
    localStorage.setItem('clue',JSON.stringify(arr));
  }
  console.log("OBJJJJ");
  console.log(obj);
  localStorage.setItem('clue',JSON.stringify(obj));
}

var Game = function(secretTriple, user, computer,remain) {
  this.secretTriple = secretTriple;
  this.userCards = user;
  this.computerCards = computer;
  this.remainingCards = remain;
  this.state = gameStates[0];
  this.userGuesses = [];
  this.computerGuesses = [];
  this.isguessvalid = function(r, g, w) {
    var found = true;
    var a = this.secretTriple.indexOf(r);
    console.log(a);
    var b = this.secretTriple.indexOf(g);
    console.log(b);
    var c = this.secretTriple.indexOf(w);
    console.log(c);
    if (a == -1 || b == -1 || c == -1) {
      found = false;
    }
    return found;
  }


  this.computerGuess = function() {
    //get the guess in terms of r,g,w
    var score = {}
    var historyString = "Computer Guessed - ";
    var r = this.remainingCards[getRandomArbitrary(0,this.remainingCards.length)];
    var g = this.remainingCards[getRandomArbitrary(0,this.remainingCards.length)];
    var w = this.remainingCards[getRandomArbitrary(0,this.remainingCards.length)];
    var temp = [];
    temp.push(r);
    temp.push(g);
    temp.push(w);
    historyString=historyString+r +","+g+","+w+".";
    this.computerGuesses.push(temp);
    if (this.isguessvalid(r, g, w)) {
      document.getElementById('computerWON').hidden = false;
      document.getElementById('computerLOST').hidden = true;
      document.getElementById('userWON').hidden = true;
      document.getElementById('userLOST').hidden = true;
      document.getElementById('output').hidden = false;
      if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        console.log('localStorage is supported');

        if (localStorage.getItem('clueComputerScore')) {
          var score = parseInt(localStorage.getItem('clueComputerScore'));
          score= score+1;
          localStorage.setItem('clueComputerScore',score);
        } else {
          localStorage.setItem('clueComputerScore','1');
          if(!localStorage.getItem('clueUserScore')){
              localStorage.setItem('clueUserScore','0');
          }
        }

      } else {
        console.log('localStorage is not supported')
      }
    } else {
      //computer guessed wrong
      document.getElementById('computerWON').hidden = true;
      document.getElementById('computerLOST').hidden = false;
      document.getElementById('userWON').hidden = true;
      document.getElementById('userLOST').hidden = true;
      document.getElementById('output').hidden = false;
      var rand = getRandomArbitrary(0, this.userCards.length);
      document.getElementById('userOut').innerText = this.userCards[rand];
      historyString = historyString+"User has card - " + this.userCards[rand];
      populateHistory(historyString);
      if (storageAvailable('sessionStorage')) {
        // Yippee! We can use localStorage awesomeness
        console.log('sessionStorage is supported');
        sessionStorage.setItem('clueComputerGuess',this.computerGuesses);

      } else {
        console.log('localStorage is not supported')
      }
    }
  }

  this.userGuess = function(r, g, w) {
    var historyString = "User Guessed - ";
    var temp = [];
    temp.push(r);
    temp.push(g);
    temp.push(w);
    this.userGuesses.push(temp);
    historyString=historyString+r +","+g+","+w+".";
    var found = false;
    if (this.isguessvalid(r, g, w)) {
      //user WON
      document.getElementById('userWON').hidden = false;
      document.getElementById('computerWON').hidden = true;
      document.getElementById('computerLOST').hidden = true;
      document.getElementById('userLOST').hidden = true;
      document.getElementById('userSuggestion').hidden = true;
      document.getElementById('output').hidden = false;

      if (storageAvailable('localStorage')) {
        console.log('localStorage is supported');
        if (localStorage.getItem('clueUserScore')) {
          var score = parseInt(localStorage.getItem('clueUserScore'));
          score= score+1;
          localStorage.setItem('clueUserScore',score);
        } else {
          localStorage.setItem('clueUserScore','1');
          if(!localStorage.getItem('clueComputerScore')){
              localStorage.setItem('clueComputerScore','0');
          }
        }
      } else {
        console.log('localStorage is not supported')
      }
      //reset game. show alert that the game is finished,
      //state change
      //reset the sessionStorage - update score on the localStorage
    } else {
      //USER GUESSED WRONG
      document.getElementById('userLOST').hidden = false;
      document.getElementById('userWON').hidden = true;
      document.getElementById('computerWON').hidden = true;
      document.getElementById('computerLOST').hidden = true;
      document.getElementById('userSuggestion').hidden = true;
      document.getElementById('output').hidden = false;
      //this could potentially give out the same card again and again.
      var rand = getRandomArbitrary(0, this.computerCards.length);
      document.getElementById('computerOut').innerText = this.computerCards[rand];
      historyString = historyString+"Computer has card - " + this.computerCards[rand];
      console.log(historyString);
      populateHistory(historyString);
      if (storageAvailable('sessionStorage')) {
        // Yippee! We can use localStorage awesomeness
        console.log('sessionStorage is supported');
        sessionStorage.setItem('clueUserGuess',this.userGuesses);

      } else {
        console.log('localStorage is not supported')
      }
      //return the wrong info, give away computers random card.
      //computerTurn,
      //change state,
      //render ok button to let computer guess
    }
  }
};

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

var shuffle = function() {
  var secretTriple = [];
  var remainingCards = [];
  var userCards = [];
  var computerCards = [];
  //TODO: remember the values of the secret triple? or just store the indices in the secretTriple??
  var secretRoomIndex = getRandomArbitrary(0, rooms.length);
  var secretGuestIndex = getRandomArbitrary(0, guests.length);
  var secretWeaponIndex = getRandomArbitrary(0, weapons.length);
  secretTriple.push(rooms[secretRoomIndex]);
  secretTriple.push(guests[secretGuestIndex]);
  secretTriple.push(weapons[secretWeaponIndex]);
  var remainingRooms = rooms.filter(function(word) {
    return word != secretTriple[0];
  });
  for (card in remainingRooms) {
    remainingCards.push(remainingRooms[card]);
  }
  var remainingGuests = guests.filter(function(word) {
    return word != secretTriple[1];
  });
  for (card in remainingGuests) {
    remainingCards.push(remainingGuests[card]);
  }
  var remainingWeapons = weapons.filter(function(word) {
    return word != secretTriple[2];
  });
  for (card in remainingWeapons) {
    remainingCards.push(remainingWeapons[card]);
  }
  console.log('remaining');
  console.log(remainingCards);
  shuffleArray(remainingCards);
  for (card in remainingCards) {
    if (card % 2 == 0) {
      userCards.push(remainingCards[card]);
    } else {
      computerCards.push(remainingCards[card]);
    }
  }
  return {
    secretTriple: secretTriple,
    userCards: userCards,
    computerCards: computerCards,
    remainingCards:remainingCards
  }
}




//on click of go.
//bget the username, save it in storage. initialize game
//display game start html.

//code from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}


var populateOptionSet = function(userCards, computerCards) {

  var testrooms = rooms;
  var testweapons = weapons;
  var testguests = guests;
  var spanUserCards = document.getElementById('user-cards');
  spanUserCards.innerText = "";
  for (card in userCards) {
    text = userCards[card] + '||';
    spanUserCards.innerText += text;
    testrooms = testrooms.filter(function(room) {
      return room != userCards[card];
    });
    testweapons = testweapons.filter(function(room) {
      return room != userCards[card];
    });
    testguests = testguests.filter(function(room) {
      return room != userCards[card];
    });
  }
  var roomListOptions = document.getElementById('roomlist');
  var guestListOptions = document.getElementById('guestlist');
  var weaponListOptions = document.getElementById('weaponlist');
  document.getElementById('gameSummary').hidden=false;
  for (ind in testrooms) {
    var node = document.createElement("option");
    node.value = testrooms[ind];
    roomListOptions.appendChild(node);
  }
  for (ind in testguests) {
    var node = document.createElement("option");
    node.value = testguests[ind];
    guestListOptions.appendChild(node);
  }
  for (ind in testweapons) {
    var node = document.createElement("option");
    node.value = testweapons[ind];
    weaponListOptions.appendChild(node);
  }
}



var gameStart = function() {
  console.log('game started');
  //DISABLE GO BUTTON FROM PREVIOUS STEP -> MAKE IT RESET MAYBE?
  var usernameDiv = document.getElementById('usernameDiv');
  usernameDiv.hidden = true;
  var name = document.getElementById('username').value;
  var usernameSpan = document.getElementById('user');
  var btn = document.getElementById('startButton');

  document.getElementById('GUESS!!').disabled = false;
  if (storageAvailable('sessionStorage')) {
    // Yippee! We can use sessionStorage awesomeness
    console.log('sessionStorage is supported');
    if (!sessionStorage.username) {
      sessionStorage.username = name;
    }
    usernameSpan.innerText = sessionStorage.username;
  } else {
    console.log('sessionStorage is notsupported');
    // Too bad, no sessionStorage for us
    usernameSpan.innerText = name;
  }
  // TODO: save the username in browserMemory
  //1. show the div for the first guess.
  var gameDiv = document.getElementById('game');
  gameDiv.hidden = false;

  var obj = shuffle();
  console.log(obj);
  populateOptionSet(obj.userCards, obj.computerCards)
  game = new Game(obj.secretTriple, obj.userCards, obj.computerCards,obj.remainingCards);
  //next event is going to happen from an onClick on the form submit ->
}


var guess = function() {
  var roomGuess = document.getElementById('roomGuess').value;
  var guestGuess = document.getElementById('guestGuess').value;
  var weaponGuess = document.getElementById('weaponGuess').value;
  document.getElementById('GUESS!!').disabled=true;
  game.userGuess(roomGuess, guestGuess, weaponGuess);

}
var resetGame = function() {
  init();
  var usernameDiv = document.getElementById('usernameDiv');
  usernameDiv.hidden = false;
  var gameDiv = document.getElementById('game');
  gameDiv.hidden = true;
  sessionStorage.setItem('clueUserGuess',null);
  sessionStorage.setItem('clueComputerGuess',null);
  var myNode = document.getElementById("gameMoves");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
  setLocalStorageWithScore(localStorage.getItem('clueUserScore'),localStorage.getItem('clueComputerScore'))
  game = {};
  shuffle();
  gameStart();
}

var userTurn = function(){
  document.getElementById('roomGuess').value=""
  document.getElementById('guestGuess').value="";
  document.getElementById('weaponGuess').value="";
  document.getElementById('GUESS!!').disabled=false;
  document.getElementById('userSuggestion').hidden = false;
  document.getElementById('computerLOST').hidden = true;

}

var populateHistory=function(data){

  var li = document.createElement("LI");
  li.className="guessHistory";
  li.appendChild(document.createTextNode(data));
  var ul = document.querySelector('.moves');
  console.log(ul);
  ul.appendChild(li);
}

var computerTurn = function(){
  game.computerGuess();
  console.log(sessionStorage.getItem('clueUserGuess'));

  document.getElementById('userSuggestion').hidden = true;
  //  if(!localStorage.getItem('clueComputerScore')
}
