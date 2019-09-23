/* 	Smith Jones Cribbage
*	By: Keegan Jones
*	This file contains the main functions necessary for creating and updating the playing environment and everything that is visible to the user
*/

//this function sets the pegs up in their starting posiition
//TODO: Update this function so it moves the pegs down the sinusodal curve as the players earn points
var putPegs = function(){
	var k = 0;
	for(var i = 0; i < 2; i++){
		for(var j = 0; j < 3; j++){
			var peg = document.createElement("img");
			var name = "peg" + k;
			var yPos = (10.8 + (i * 2.9333333)) + "%";
			var xPos = (12.5 + (j * 4.2)) + "%";
			peg.setAttribute("src", "Images/peg.png");
			peg.setAttribute("name", name);
			peg.style.position = "absolute"
			peg.style.top = yPos;
			peg.style.left = xPos;
			peg.style.width = "1.6%"
			peg.style.height = "2.133333%";
			document.body.appendChild(peg);
			k++;
		}
	}
}

//displays the players name and their points on the screen
var displayNames = function(msg){
	for(var i = 0; i < msg.players.length;i++){
		if(msg.players[i].name == name){	
			var scoreLabel = document.getElementById("urScore");
			var tPos = "6.7%";
		}else{
			var scoreLabel = document.getElementById("theirScore");
			var tPos = "40%";
		}
		var text = "<span class='" + msg.players[i].colour + "'>" + msg.players[i].name + ": " + msg.players[i].score + "</span><br>"; 
		scoreLabel.innerHTML = text;
		scoreLabel.style.position = "absolute";
		scoreLabel.style.left = "37.75%";
		scoreLabel.style.top = tPos;
		scoreLabel.style.fontSize = "3vh";
		scoreLabel.style.fontFamily = "Mistral";
		scoreLabel.style.color = "#ff3a47";
	}
	
}

//when one player choses a colour and has already hit "Lets Play" that colour choice is removed for the other player to avoid two players being the same colour
var removeSelected = function(colour){
	console.log(colour);
	if(colour == "blueText"){
		document.getElementById("blueSelect").style.display = "none";
		document.getElementById("blueLabel").style.display = "none";
	}else if(colour == "whiteText"){
		document.getElementById("whiteSelect").style.display = "none";
		document.getElementById("whiteLabel").style.display = "none";
	}else if(colour == "redText"){
		document.getElementById("redSelect").style.display = "none";
		document.getElementById("redLabel").style.display = "none";
	}
}


//transitions from the start screen to the actual gameplay screen
var transition = function(){
	document.body.style.backgroundImage = "url(Images/backgroundFinal.png)";
	document.getElementById("nameInput").type = "hidden";
	document.getElementById("btnId").style.display = "none";
	document.getElementById("msgDisplay").style.display = "block";
	document.getElementById("msgInput").style.display = "block";
	document.getElementById("msgBtn").style.display = "block";
	document.getElementById("blueSelect").style.display = "none";
	document.getElementById("whiteSelect").style.display = "none";
	document.getElementById("redSelect").style.display = "none";
	document.getElementById("blueLabel").style.display = "none";
	document.getElementById("whiteLabel").style.display = "none";
	document.getElementById("redLabel").style.display = "none";
}

//upadtes the status using the string determined by the state in the Game.update function and displays it to the screen
var updateStatus = function(str){
	var statusLabel = document.getElementById("statusText");
	statusLabel.innerText = str;
	statusLabel.style.position = "absolute";
	statusLabel.style.left = "52.5%";
	statusLabel.style.top = "0.1%";
	statusLabel.style.fontSize = "5.7vh";
	statusLabel.style.fontFamily = "Mistral";
	statusLabel.style.color = "#ff3a47";
	document.body.appendChild(statusLabel);
	document.getElementById("readyBtn").style.display = "block";
	document.getElementById("p1Crib").style.display = "block";
	document.getElementById("p2Crib").style.display = "block";
	var countLabel = document.getElementById("count");
	countLabel.innerText = count;
	countLabel.style.position = "absolute";
	countLabel.style.left = "97.2%"
	countLabel.style.top = "38%";
	countLabel.style.fontSize = "3.6vh";
	countLabel.style.fontFamily = "Mistral";
	countLabel.style.color = "#ff3a47";
}


//displays the two random cards to the screen
//TODO: possibly create an encapsulated function for displaying cards (e.g. displayCard(x,y,card))
var display2Cards = function(card1, card2) {
	var cardImg1 = document.createElement("img");
	var name = "card1";
	cardImg1.setAttribute("src", card1.frontImage);
	cardImg1.setAttribute("id", name);
	cardImg1.style.position = "absolute"
	cardImg1.style.top = "15.8333333%";
	cardImg1.style.left = "63.5%";
	cardImg1.style.width = "7.5%";
	cardImg1.style.height = "14%";
	document.body.appendChild(cardImg1);
	var cardImg2 = document.createElement("img");
	var name2 = "card2";
	cardImg2.setAttribute("src", card2.frontImage);
	cardImg2.setAttribute("id", name2);
	cardImg2.style.position = "absolute"
	cardImg2.style.top = "49.1666666%";
	cardImg2.style.left = "63.5%";
	cardImg2.style.width = "7.5%"
	cardImg2.style.height = "14%";
	document.body.appendChild(cardImg2);
}


//displays the flip card
var displayFlipCard = function(card){
	var flip = document.getElementById("flipCard");
	flip.style.display = "block";
	flip.src = card.frontImage;
	flip.style.left = "76%";
	flip.style.top = "33%";
}


//removes the two initial random cards
var remove2Cards = function(){
	document.getElementById("card1").style.display = "none";
	document.getElementById("card2").style.display = "none";
}


//updates the two little crib icons to signify to the user whose crib it is
var updateCrib = function(c){
	switch(c){
		case 0:
			var crib = document.getElementById("p2Crib");
			var crib2 = document.getElementById("p1Crib");
			crib.style.opacity = "1.0";
			crib2.style.opacity = "0.5";
			crib.style.filter = "alpha(opacity=100)";
			crib2.style.filter = "alpha(opacity=50)";
			break;
		case 1:
			var crib = document.getElementById("p1Crib");
			var crib2 = document.getElementById("p2Crib");
			crib.style.opacity = "1.0";
			crib2.style.opacity = "0.5";
			crib.style.filter = "alpha(opacity=100)";
			crib2.style.filter = "alpha(opacity=50)";
			break;
		default:
	}
}


//displays each players hand either 6 card(before disposing of 2 cards for the crib) or 4 card(after disposing of the 2 cards)
//also ensure that the player cannot see the other players hand or crib until the counting cards section of gameplay
var displayHands = function(){
	var xPos = [];
	var xPosOpp = [];
	opponent = getOpponent();
	for(var i = 0; i < player1.currHand.length; i++){// stes the x position fo the card
		xPos[i] = (39.5 + (i*7.5)) + "%";
	}
	
	for(var i = 0; i < player1.currHand.length; i++){//loops through each card in the hand
		var str = "playerCard" + (i+1);
		var str2 = "oppCard" + (i+1);
		var str3 = "cribCard" + (i+1);
		var card = document.getElementById(str);
		var oppCard = document.getElementById(str2);
		var cribCard = document.getElementById(str3);
		card.src = player1.currHand[i].frontImage;
		card.style.left = xPos[i];
		card.style.top =  "11%";

		oppCard.style.left = xPos[i];
		oppCard.style.top = "44.4%";
		oppCard.style.display = "block";
		if(state >= 14){//if it is in the counting cards section of gameplay
			document.getElementById("coverCard1").style.display = "none";
			document.getElementById("coverCard2").style.display = "none";
			document.getElementById("oppCard5").style.display = "none";
			document.getElementById("oppCard6").style.display = "none";
			if(i < 4){
				oppCard.src = opponent.currHand[i].frontImage;
				cribCard.src = crib.currHand[i].frontImage;
				card.style.display = "block";
			}
		}else if(state > 9 && state < 14){
			cribCard.src = "Images/back.jpg";
			cribCard.style.left = xPos[i];
			cribCard.style.display = "block";
			card.style.display = "block";
			if(crib.name == name){
				cribCard.style.top =  "25%";
			}else{
				cribCard.style.top =  "58.2%";
			}
		}else{
			oppCard.src = "Images/back.jpg";
			card.style.display = "block";
		}
	}
	if(player1.currHand.length == 4){
		document.getElementById("playerCard5").style.display = "none";
		document.getElementById("playerCard6").style.display = "none";
		document.getElementById("oppCard5").style.display = "none";
		document.getElementById("oppCard6").style.display = "none";
	}
	
}

//this function updates the chat with the appropriate message and player colour depending on the entry conditions
var updateChat = function(msg, pName, txt, isScore, i){
	var theMsg;
	if(msg.state > 1){//makes sure the correct colour of text is used
		if(player1.name == pName){
			var colour = player1.colour;
		}else{
			opponent = getOpponent();
			var colour = opponent.colour; 
		}
	}else{
		var colour = msg.sentFrom.colour;
	}
	if(state == 0){//makes sure the correct message format is used
		theMsg = "<span class='" + colour + "'>" + pName + " has entered the game.</span><br>";
	}else if(state == 1){
		theMsg = "<span class='" + colour + "'>" + pName + " has entered the game.</span><br>";
	}else if(isScore && i == 0){
		theMsg = "<span class='" + colour + "'>" + txt + "</span><br>"; 
	}else if(msg.isChatMsg == 3 || msg.isChatMsg == 1){
		theMsg = "<span class='" + colour + "'>" + pName + ": " + txt + "</span><br>"; 
	}
	var chat = document.getElementById("msgDisplay");
	chat.innerHTML += theMsg;
	chat.scrollTo(0,chat.scrollHeight)
}


var disableBtn = function(){//disables the ready button
	var btn = document.getElementById("readyBtn");
	btn.disabled = true;
	btn.style.opacity = "0.5";
	btn.style.filter = "alpha(opacity=50)";
}

var enableBtn = function(){//enables the ready button
	var btn = document.getElementById("readyBtn");
	btn.disabled = false;
	btn.style.opacity = "1";
	btn.style.filter = "alpha(opacity=100)";
}

//function to determine the correct functionality upon a card being clicked
function cardClick(card){
	var dIndex = card.id.indexOf("d");
	var numStr = card.id.substring(dIndex+1);
	var arrPos = parseInt(numStr) - 1;
	var handCard = player1.currHand[arrPos];
	if(state < 10){//this chunk of code is for when the two cards are being discarded
		if(handCard.chosen == 0){
			/*if there are already two cards chosen to be discarded but the user clicks one of them again(ie changes their mind)
			*and it is the furthest left card, the second card become the furthest left card and the selected card is returned to the players hand
			*/			
			if(clicked == 2 && card.style.left == "39.5%" ){
				crib.currHand[0] = crib.currHand[1];
				var otherCard = crib.currHand[0];
				crib.currHand.pop();
				for(var i = 0; i < 6; i++){
					if(otherCard.suit == player1.currHand[i].suit && otherCard.number == player1.currHand[i].number){
						var tempStr = "playerCard" + (i+1);
						var otherCardImg = document.getElementById(tempStr);
					}
				}
				otherCardImg.style.left = "39.5%";
			}else if(clicked == 2){
				crib.currHand.pop();
			}else{
				crib.currHand.pop();
			}
			handCard.chosen = 1;
			card.style.left = (39.5 + (arrPos*7.5)) + "%";;
			card.style.top = "11%";
			clicked--;
		}else if(crib.name == name && clicked == 0){//if no cards have already been selected and it is that players crib
			card.style.left = "39.5%";
			card.style.top = "25%";
			crib.currHand.push(handCard);
			handCard.chosen = 0;
			clicked++;
		}else if(crib.name == name && clicked == 1){//if one card has already been selected and it is that players crib
			card.style.left = "47%";
			card.style.top = "25%";
			crib.currHand.push(handCard);
			handCard.chosen = 0;
			clicked++;
		}else if(crib.name != name && clicked == 0){//if no cards have already been selected and it is not that players crib
			card.style.left = "39.5%";
			card.style.top = "58.2%";
			crib.currHand.push(handCard);
			handCard.chosen = 0;
			clicked++;
		}else if(crib.name != name && clicked == 1){//if one card has already been selected and it is not that players crib
			card.style.left = "47%";
			card.style.top = "58.2%";
			crib.currHand.push(handCard);
			handCard.chosen = 0;
			clicked++;
		}
		if(clicked == 2){//enables the ready button when 2 cards have been selected to be discarded, and disables it there is <two cards ready to be discarded
			enableBtn();
		}else{
			disableBtn();
		}
	}else{//for when players are playing their cards
		if(handCard.chosen == 1 && (count + handCard.value) <= 31){
			if((state == 12 && crib.name != name) || (state == 13 && crib.name == name)){
				var tempMsg = {players:players};
				handCard.chosen = 0;
				player1.cardsLeft--;
				count += handCard.value;
				card.style.top = "23%";
				card.style.left = "92.2%";
				card.style.zIndex = z;
				z++;
				playedCards.push(handCard);
				checkPoints(handCard);//each time a card is played it is checked with the previously played cards to see if the player is deserving of points
				displayNames(tempMsg);
				var c = checkForGo();
				if(c == 2){
					if(count != 31 && !(!hasCardsLeft() && player1.cardsLeft == 0)){//checking that the count does not exceed 31
						player1.score += 1;
						chatTxt.push("1 point for go");
					}
					count = 0;
					playedCards = [];
					doAFlip();
					flip = true;
					if(hasCardsLeft()){//these ensure that the play ends when both players run out of cards
						if(state == 12){
							state++;
						}else{
							state--;
						}
					}else if(!hasCardsLeft() && player1.cardsLeft == 0){
						player1.score += 1;
						pointName = player1.name;
						chatTxt.push("1 point for last card");					
						state = 14;
						count = 0;
					}
					Game.update();
					Game.sendMessage();
					flip = false;
				}else if(c == 1){
					Game.update();
					Game.sendMessage();
				}else{
					if(state == 12){
						state++;
					}else{
						state--;
					}
					Game.update();
					Game.sendMessage();
				}
			}
		}
	}
}

//cleans up the board at the start of a new round
var clearBoard = function(){
	for(var i = 1; i < 5; i++){
		var str = "cribCard" + i;
		document.getElementById(str).style.display = "none";
	}
	document.getElementById("flipCard").style.display = "none";
}
//check if the other  player has cards left in their hand
var hasCardsLeft = function(){
	var opponent = getOpponent();
	if(opponent.cardsLeft > 0){
		return true;
	}else{
		return false;
	}
}


//as their opponent plays cards is removes the number of visible cards the player can see to show how many cards that player has left
var hideOppCard = function(){
	var opponent = getOpponent();
	var len = opponent.cardsLeft + 1;
	var cardId = "oppCard" + (len);
	var oppCard = document.getElementById(cardId);
	oppCard.style.display = "none";
}

//moves the opponents card so that the player can see the last cardthe opponent played
var moveOppCard = function(){	
	opponent = getOpponent();
	var len = opponent.cardsLeft + 1;
	var cardId = "oppCard" + (len);
	var oppCard = document.getElementById(cardId);
	oppCard.src = playedCards[playedCards.length - 1].frontImage;
	oppCard.style.left = "92.2%";
	oppCard.style.top = "43.13333333%";
	oppCard.style.zIndex = z;
	oppCard.style.display = "block";
	z++;
}

//everytime the count reaches 31 or as close to 31 as it can 2 cards are flipped over the piles of played cards to show that a new count has begun
var doAFlip = function(){
	var turnover1 = document.getElementById("coverCard1");
	var turnover2 = document.getElementById("coverCard2");
	turnover1.style.display = "block";
	turnover2.style.display = "block";
	turnover1.style.top = "23%";
	turnover2.style.top = "43.13333%";
	turnover1.style.zIndex = z;
	turnover2.style.zIndex = z;
	z++;
}











