/* 	Smith Jones Cribbage
*	By: Keegan Jones
*	This file contains the main functions necessary for running the game, including the objects that make up the cards, the deck, the players
*	and the pieces of the board.  This is an unfinished product, but is being displayed on github to show my abilities and coding style.  It is 
*	very close to being done however the following things still need to be done:
*	-fix bug causing browser to become non-responsive upon starting of a new round of play	
*	-reduce/eliminate global variables
*	-work connectivity issues(e.g. user discconnects mid game etc.)
*	-addition of third player feature/ make code more reusable
*	-end game conditions
*	-movement of pegs down the sinusodal curve(the board)
*/
window.Game = {};
var deck = [];
var turn = true;
var state = 0;
var status = "";
var players = [];
var player1;
var name = "";
var twoCard = [];
var crib = {name:"",currHand:[]};
var clicked = 0;
var flipCard;
var count = 0;
var playedCards = [];
var possibleRuns = [];
var chatTxt = [];
var chat;
var z = 0;
var flip = false;
var timesCounted = 0;
var pointName = "";
var opponent;
var alreadyScored = [];


//this function serves as the constructor for the player object
(function(){
	function Player(name, colour){
		this.name = name;
		this.currHand = [];
		this.score = 0;
		this.colour = colour;
		this.cardsLeft = 4;
	}
	Game.Player = Player;
})();


//this function serves as the constructor for the card objects
//depending of the values inputted it also assigns a appropriate url for the image associated with the card
(function(){
	function Card(suit, number, value, runVal, chosen){
		var addr = "";
		this.suit = suit;
		this.number = number;
		this.value = value;
		this.chosen = chosen;
		this.runVal = runVal;
		this.backImage = new Image();
		this.backImage = "Images/back.jpg";
		if(suit == "hearts"){
			addr = "Images/Hearts/";
			if(number == "jack"){
				addr = addr + "jack_of_hearts.png";
			}else if(number == "queen"){
				addr = addr + "queen_of_hearts.png";
			}else if(number == "king"){
				addr = addr + "king_of_hearts.png";
			}else if(number == "ace"){
				addr = addr + "ace_of_hearts.png";
			}else{
				addr = addr + number + "_of_hearts.png";
			}
		}else if(suit == "clubs"){
			addr = "Images/Clubs/";
			if(number == "jack"){
				addr = addr + "jack_of_clubs.png";
			}else if(number == "queen"){
				addr = addr + "queen_of_clubs.png";
			}else if(number == "king"){
				addr = addr + "king_of_clubs.png";
			}else if(number == "ace"){
				addr = addr + "ace_of_clubs.png";
			}else{
				addr = addr + number + "_of_clubs.png";
			}
		}else if(suit == "diamonds"){
			addr = "Images/Diamonds/";
			if(number == "jack"){
				addr = addr + "jack_of_diamonds.png";
			}else if(number == "queen"){
				addr = addr + "queen_of_diamonds.png";
			}else if(number == "king"){
				addr = addr + "king_of_diamonds.png";
			}else if(number == "ace"){
				addr = addr + "ace_of_diamonds.png";
			}else{
				addr = addr + number + "_of_diamonds.png";
			}
		}else if(suit == "spades"){
			addr = "Images/Spades/";
			if(number == "jack"){
				addr = addr + "jack_of_spades.png";
			}else if(number == "queen"){
				addr = addr + "queen_of_spades.png";
			}else if(number == "king"){
				addr = addr + "king_of_spades.png";
			}else if(number == "ace"){
				addr = addr + "ace_of_spades.png";
			}else{
				addr = addr + number + "_of_spades.png";
			}
		}
		this.frontImage = new Image();
		this.frontImage = addr;
	}
	Game.Card = Card;
})();


//this function creates an array of all possible 2,3,4, and 5 card combinations that can be made for any given hand of 5 cards
//this is used when tallying the points at the end of each round
var makeArr = function(player){	
	var finalHand = [];
	player.currHand.push(flipCard);
	finalHand.push(player.currHand);//adds the one 5-card permutation of the hand
	var hand = player.currHand;
	
	for(var i = 0; i < 5; i++){
		var fourCardArr = [];
		for(var j = 0; j < 5; j++){//this loop  goes through and creates all the 2 and 4 four card hands
			var twoCardArr = [];
			if(i != j){
				fourCardArr.push(hand[j]);
				twoCardArr.push(hand[i]);
				twoCardArr.push(hand[j]);
			}
			if(twoCardArr.length != 0 && i < j){
				finalHand.push(twoCardArr);
			}
		}
		finalHand.push(fourCardArr);
		for(var j = 0; j < 5; j++){// this loop goes through and creates all the 3 card hands
			var threeCardArr = [];
			for(var k = 0; k < 5; k++){
				if(k != i && k != j && i != j && i < j ){
					threeCardArr.push(hand[k]);
				}
			}
			if(threeCardArr.length != 0){
				finalHand.push(threeCardArr);
			}
		}

	}
	finalHand.sort(sortFn);
	var tempPerson = {name: player.name, currHand: finalHand};
	countPoints(tempPerson);// sends the array to be checked to determine the number of point scored by said hand
};


/*this function is used to sort the array  of all possible 2,3,4, and 5 card hands in order by size, from largest to smallest
*this is because in order for the points to be correctly tallied, smaller versions of something that has already been accounted
*for doesn't cause duplicate points. For example,  if a run of 4 cards is already accounted for it would be incorrect if a subset
*of those cards also gains the player points
*/
var sortFn = function(a1, a2){
	if(a1.length > a2.length){
		return -1;
	}else if(a1.length > a2.length){
		return 1;
	}else{
		return 0;
	}
}


//this holds the array representing the deck of cards, and contains 52 card objects representing all 52 cards in the deck
var stdDeck = [
	new Game.Card("hearts", "ace", 1, 1, 0),
	new Game.Card("hearts", "2", 2, 2, 0),
	new Game.Card("hearts", "3", 3, 3, 0),
	new Game.Card("hearts", "4", 4, 4, 0),
	new Game.Card("hearts", "5", 5, 5, 0),
	new Game.Card("hearts", "6", 6, 6, 0),
	new Game.Card("hearts", "7", 7, 7, 0),
	new Game.Card("hearts", "8", 8, 8, 0),
	new Game.Card("hearts", "9", 9, 9, 0),
	new Game.Card("hearts", "10", 10, 10, 0),
	new Game.Card("hearts", "jack", 10, 11, 0),
	new Game.Card("hearts", "queen", 10, 12, 0),
	new Game.Card("hearts", "king", 10, 13, 0),
	new Game.Card("diamonds", "ace", 1, 1, 0),
	new Game.Card("diamonds", "2", 2, 2, 0),
	new Game.Card("diamonds", "3", 3, 3, 0),
	new Game.Card("diamonds", "4", 4, 4, 0),
	new Game.Card("diamonds", "5", 5, 5, 0),
	new Game.Card("diamonds", "6", 6, 6, 0),
	new Game.Card("diamonds", "7", 7, 7, 0),
	new Game.Card("diamonds", "8", 8, 8, 0),
	new Game.Card("diamonds", "9", 9, 9, 0),
	new Game.Card("diamonds", "10", 10, 10, 0),
	new Game.Card("diamonds", "jack", 10, 11, 0),
	new Game.Card("diamonds", "queen", 10, 12, 0),
	new Game.Card("diamonds", "king", 10, 13, 0),
	new Game.Card("clubs", "ace", 1, 1, 0),
	new Game.Card("clubs", "2", 2, 2, 0),
	new Game.Card("clubs", "3", 3, 3, 0),
	new Game.Card("clubs", "4", 4, 4, 0),
	new Game.Card("clubs", "5", 5, 5, 0),
	new Game.Card("clubs", "6", 6, 6, 0),
	new Game.Card("clubs", "7", 7, 7, 0),
	new Game.Card("clubs", "8", 8, 8, 0),
	new Game.Card("clubs", "9", 9, 9, 0),
	new Game.Card("clubs", "10", 10, 10, 0),
	new Game.Card("clubs", "jack", 10, 11, 0),
	new Game.Card("clubs", "queen", 10, 12, 0),
	new Game.Card("clubs", "king", 10, 13, 0),
	new Game.Card("spades", "ace", 1, 1, 0),
	new Game.Card("spades", "2", 2, 2, 0),
	new Game.Card("spades", "3", 3, 3, 0),
	new Game.Card("spades", "4", 4, 4, 0),
	new Game.Card("spades", "5", 5, 5, 0),
	new Game.Card("spades", "6", 6, 6, 0),
	new Game.Card("spades", "7", 7, 7, 0),
	new Game.Card("spades", "8", 8, 8, 0),
	new Game.Card("spades", "9", 9, 9, 0),
	new Game.Card("spades", "10", 10, 10, 0),
	new Game.Card("spades", "jack", 10, 11, 0),
	new Game.Card("spades", "queen", 10, 12, 0),
	new Game.Card("spades", "king", 10, 13, 0)
];

/*this function also serves as an init function and upon the player entering their name and starting the game set up their respective player object 
*initializes other aspects of the game
*/
function startGame(){
	var nameStr = document.getElementById("nameInput").value;
	if(nameStr.charCodeAt(0) > 97){
		var result = nameStr.replace(nameStr.charAt(0), String.fromCharCode(nameStr.charCodeAt(0) - 32));
	}
	name = result;
	if(document.getElementById("blueSelect").checked){
		var colour = "blueText";
	}else if(document.getElementById("whiteSelect").checked){
		var colour = "whiteText";
	}else if(document.getElementById("redSelect").checked){
		var colour = "redText";
	}

	player1 = new Game.Player(name, colour);
	players[0] = player1;
	transition();
	putPegs();
	chat = 2;
	Game.sendMessage();
	chat = 0;
}


//this function checks if it ispossible for either player to play anymore cards without the count exceeding 31
var checkForGo = function(){
	var p1 = players[0];
	var p2 = players[1];
	if((!checkSingleGo(p1) && p1.name != name) || (!checkSingleGo(p2) && p2.name != name)){
		return 0;
	}else if((checkSingleGo(p1) && !checkSingleGo(p2)) || (!checkSingleGo(p1) && checkSingleGo(p2))){
		return 1;
	}else{
		return 2;
	}
}

/*recMsg is the main controlling function for the game.  Since the game operates on constant communication back and forth between the players what is done 
* upon recieving a message is crucial to the flow of the game.  This is mainly done through the use of the state variable which is used to determine 
* what state the game is currently in and then proceeds to follow through with appropriate functionality accordingly. Each time the ready button is clicked the state
* is increased by one.  
*TODO:
*	-better encapsulate this function and reduce the sheer size of it  
*/
var recMsg = function(msg){
	if(msg.isChatMsg == 1 && msg.chatTxt[0] != ""){//checks if the msg coming through is either a message from the other player, a notification to be displayed about a player joining the game, or points scored during the play
		for(var i = 0; i < msg.chatTxt.length; i++){
			updateChat(msg, msg.pointName, msg.chatTxt[i], false, i);
		}
		displayNames(msg);
		msg.chatTxt = [];
		chatTxt = [];
	}else if(msg.isChatMsg == 3 && msg.chatTxt[0] != ""){//checks if the message is a notification detailing what points have been scored and by who during the counting of cards
		for(var i = 0; i < msg.chatTxt.length; i++){
			updateChat(msg, msg.pointName, msg.chatTxt[i], true, i);
		}		
		displayNames(msg);
		msg.chatTxt = [];
		chatTxt = [];
	}else if(msg.isChatMsg == 3 && msg.chatTxt[0] == ""){
		return;
	}else{	
		if(msg.sentFrom.name == name && msg.state != 8 && msg.state != 14 && msg.state != 15){//returns right away if the message is from itself, unless the game is in state 8, 14, or 15
			if(msg.state == 0 || msg.state == 1){
				updateChat(msg, msg.sentFrom.name);
			}
			return;
		}
		state = msg.state;
		count = msg.count;
		flipCard = msg.flipCard;
		if(state > 1){
			deck = msg.deck;
		}
		if(msg.state > 8){
			for(var i = 0; i < msg.players.length; i++){
				if(msg.players[i].name == name){
					players[i] = player1;
				}else{
					players[i] = msg.players[i];
				}
			}
		}
		if(state != 9 && state !=10){	
			crib = msg.crib;
		}
		switch(state){//if it has reached this point it means that it is not a message and the appropriate actions can be taken depending on the state
			case 0://start game
				state = 1;
				removeSelected(msg.sentFrom.colour);
				updateChat(msg, msg.sentFrom.name);
				break;
			case 1://first player joins
				shuffle(deck);
				var newPlayer = msg.players[0];
				players[1] = newPlayer;
				msg.players = players;
				displayNames(msg);
				updateChat(msg, msg.sentFrom.name);
				state = 2;
				Game.sendMessage();
				state = 3;
				Game.update();
				break;
			case 2://other player joins
				var newPlayer = msg.players[0];
				players[1] = newPlayer;
				msg.players = players;
				displayNames(msg);
				state = 3;
				Game.update();
				break;
			case 5://both players have "readied up" and two cards are randomly selected to determine whos crib it is first
				var val1 = 0;
				var val2 = 0;
				while(val1 == val2){
					var rand1 = Math.floor(Math.random()*51 + 1);
					var rand2 = Math.floor(Math.random()*51 + 1);
					card1 = msg.deck[rand1];
					card2 = msg.deck[rand2];
					val1 = card1.value;
					val2 = card2.value;
				}
				display2Cards(card1, card2);
				twoCard[0] = card1;
				twoCard[1] = card2;
				state = 6;
				if(card1.value < card2.value){
					crib.name = name;
				}else if(card1.value > card2.value){
					crib.name = msg.sentFrom.name;
				}
				Game.sendMessage();
				Game.update();
				enableBtn();
				break;
			case 6://diplays both cards and waits for both players to ready up again
				display2Cards(msg.twoCard[1],msg.twoCard[0]);
				Game.update();
				enableBtn();
				break;
			case 8://creates each players 6 cards hand and displays it on screen
				Game.update();
				clearBoard();
				clicked = 0;
				if(crib.name == name){
					player1.currHand = [msg.deck[0], msg.deck[2], msg.deck[4], msg.deck[6], msg.deck[8], msg.deck[10]];
				}else{
					player1.currHand = [msg.deck[1], msg.deck[3], msg.deck[5], msg.deck[7], msg.deck[9], msg.deck[11]];
				}
				players[0].cardsLeft = 4;
				players[1].cardsLeft = 4;
				displayHands();
				break;
			case 10://once both players have discarded two cards the hands are updated and a flip cardis chosen
				var index = [];
				for(var i = 0; i < 6; i++){
					if(player1.currHand[i].chosen == 0){
						index.push(i);
					}
				}
				player1.currHand.splice(index[1],1);
				player1.currHand.splice(index[0],1);
				if(msg.sentFrom.name != name){
					crib.currHand.push(msg.crib.currHand[0], msg.crib.currHand[1]);
				}
				state++;
				displayHands();
				var randFlip = Math.floor((Math.random()*39) + 13);
				flipCard = msg.deck[randFlip];
				if(flipCard.number == "jack" && crib.name == name){
					player1.score += 2;
					pointName = player1.name;
					chatTxt.push("2 points for his heels");
					chat = 1;
					Game.sendMessage();
					chat = 0;
				}
				displayFlipCard(flipCard);
				Game.sendMessage();
				Game.update();
				break;
			case 11://once both players have discarded two cards the hands are updated
				var index = [];
				for(var i = 0; i < 6; i++){
					if(player1.currHand[i].chosen == 0){
						index.push(i);
					}
				}
				player1.currHand.splice(index[1],1);
				player1.currHand.splice(index[0],1);
				Game.update();
				displayHands();
				if(msg.flipCard.number == "jack" && crib.name == name){
					player1.score += 2;
					pointName = player1.name;
					chatTxt.push("2 points for his heels");
					chat = 1;
					Game.sendMessage();
					chat = 0;
				}
				displayFlipCard(msg.flipCard);
				state++;
				Game.sendMessage();
				break;
			case 12://these two states are used to determine whose turn it is to play a card. one state for each of the players,
			case 13://state 13 is for whoevers crib it is and state 12 is for the other players
				playedCards = msg.playedCards;
				if(playedCards.length > 0){
					moveOppCard(players);
				}else if(player1.cardsLeft < 4){
					hideOppCard();
				}
				Game.update();
				displayNames(msg);	
				if(msg.flip){
					doAFlip();
				}
				break;
			case 14://this state is for counting the points gained from each of the hands
				displayHands();
				if(crib.name != name){
					opponent = getOpponent();
					alreadyScored = [];
					makeArr(player1);
					timesCounted++;

					showPointsInChat();
					
					alreadyScored = [];
					makeArr(opponent);
					timesCounted++;

					showPointsInChat();
					
					alreadyScored = [];
					makeArr(crib);
					timesCounted++;
					
					showPointsInChat();
					
					state++;
					Game.sendMessage();
				}
				Game.update();

				break;
			case 15://first person hit ready
				Game.update();
				displayHands();
				enableBtn();
				break;
			case 17://second person hit ready and the game is updated to start a new round
				shuffle(deck);
				player1.currHand = [];
				opponent.currHand = [];
				crib.currHand = [];
				if(crib.name == player1.name){
					crib.name = opponent.name;
				}else{
					crib.name = player1.name;
				}
				state = 8;
				Game.sendMessage();
				break;
			default:
		}
	}
}


//sorts the scores by the reason for the score purely so when the reasoning is displayed in the chat area it looks better
var scoreSort = function(s1, s2){
	if(s1.reason < s2.reason){
		return -1;
	}else if(s1.reason > s2.reason){
		return 1;
	}else{
		return 0;
	}
}

//function run each time the ready button is clicked
function ready(){
	state++;
	Game.update();
	Game.sendMessage();
	disableBtn();
}


//function for shuffling the deck of cards
var shuffle = function(deck){
	var j;
	for(var i = 0; i < 52; i++){
		do{
			j = Math.round(Math.random()*51);
		}while(stdDeck[j].chosen == 1);
		deck[i] = stdDeck[j];
		stdDeck[j].chosen = 1;
	}
};

//function used for when the user enter a message in the box and wants to send it to the other player, to be displayed in the chat area
var sendText = function(){
	chat = 1;
	chatTxt.push(document.getElementById("msgInput").value);
	Game.sendMessage();
	chat = 0;
	document.getElementById("msgInput").value = "";
};


//creates a string version of the cardsinvolved in a run or a combination of equalling 15 to be displayed in the chat area
var getStringCombo = function(h){
	var str = "(";
	var sortedArr = [];
	for(var j = 0; j < h.length; j++){
		sortedArr.push(h[j]);
	}
	sortedArr.sort(sortStr);
	for(var i = 0; i < h.length; i++){
		if(i < h.length - 1){	
			str += sortedArr[i].number + " of " + sortedArr[i].suit + ", ";
		}else{
			str += sortedArr[i].number + " of " + sortedArr[i].suit;
		}
	}
	str += ")";
	return str;
};

//sorts the order of the cards from lowest to highest purely for output purposes in the chat area
var sortStr = function(c1, c2){
	if(c1.runVal < c2.runVal){
		return -1;
	}else if(c1.runVal > c2.runVal){
		return 1;
	}else{
		return 0;
	}
	
};

(function() {//Main Function that runs the game engine
	
	Game.update = function() {//depending on the state, this is used to give an appropriate status update at the top of the screen to tell the user what going on
		var str;
		switch(state){
			case 1:
				str = "Waiting On Opponent To Join";
				break;
			case 3:
			case 5:
			case 6:
			case 14:
			case 15:
				str = "Waiting On You To Hit Ready";
				break;
			case 4:
			case 7:
			case 16:
				str = "Waiting On Opponent To Hit Ready";
				break;
			case 8:
				str = "Choose 2 Cards To Discard";
				remove2Cards();
				break;
			case 9:
				str = "Waiting On Opponent To Discard";
				break;
			case 10:
			case 11:
			case 12:
				if(crib.name == name){
					str = "Waiting On the Opponent To Play"; 
				}else{
					str = "Waiting On You To Play";
				}
				break;
			case 13:
				if(crib.name != name){
					str = "Waiting On the Opponent To Play"; 
				}else{
					str = "Waiting On You To Play";
				}
				break;
			default:
				str = "oops i shouldnt be here";
		}	
		updateStatus(str);
		var c;
		if(state >= 5){
			if(crib.name == name){
				c = 1;
			}else{
				c = 0;
			}
			updateCrib(c);
		}
	};

    Game.sendMessage = function() {//function setups the object with the most current values to be sent to the other player
		var message = {deck: deck, state: state, players:players, sentFrom: player1, twoCard: twoCard, crib: crib, flipCard: flipCard, count: count, chatTxt:chatTxt, isChatMsg:chat, playedCards: playedCards, flip: flip, pointName: pointName};
		sendMessage(message);
	};

})();


	
