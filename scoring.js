/* 	Smith Jones Cribbage
*	By: Keegan Jones
*	This file contains the main functions necessary for scoring and counting points throughout the gameplay
*/

//retrieves the other players info as an object
var getOpponent = function(){
	for(var i = 0; i < players.length; i++){
		if(players[i].name != name){
			return players[i];
		}
	}
}

//checks if the card the player has selected will cause the count to exceed 31
var checkSingleGo = function(p){
	for(var j = 0; j < p.currHand.length; j++){
		if(p.currHand[j].chosen == 1 && (count + p.currHand[j].value) <= 31){
			return false;
		}
	}
	return true;
}

//checks if the card played causes the player to gain any points
var checkPoints = function(card){
	chatTxt = [];
	if(playedCards.length > 1 && playedCards[playedCards.length - 2].runVal == card.runVal){//this chunk checks if a pair, three of a kind, or four of kind is played
			if(playedCards.length > 2 && playedCards[playedCards.length - 3].runVal == card.runVal){
				if(playedCards.length > 3 && playedCards[playedCards.length - 4].runVal == card.runVal){
					player1.score += 12;
					chatTxt.push("12 points for a 4-of-a-kind of " + card.number + "'s");
				}else{
					player1.score += 6;
					chatTxt.push("6 points for a 3-of-a-kind of " + card.number + "'s");
				}
			}else{
				player1.score += 2;
				chatTxt.push("2 points for a pair of " + card.number + "'s");
			}
	}else if(playedCards.length > 2){//this chunks checks if a run of 3, 4, or 5 cards is played
		var h = card.runVal;
		var i = playedCards[playedCards.length - 2].runVal;
		var j = playedCards[playedCards.length - 3].runVal;
		if(playedCards.length > 4){
			var k = playedCards[playedCards.length - 4].runVal;
			var m = playedCards[playedCards.length - 5].runVal;
		}
		if(playedCards.length > 4 && i != j && i != k && i != m && i != h && j != k && j != m && j != h && k != m && k != h && m != h && (Math.max(i,j,k,m,h) - Math.min(i,j,k,m,h) == 4)){
			var str = getStringCombo([playedCards[playedCards.length - 2],playedCards[playedCards.length - 3],playedCards[playedCards.length - 4],playedCards[playedCards.length - 5],card]);
			player1.score += 5;
			chatTxt.push("5 points for a run of 5 cards" + str);
		}else if(playedCards.length > 3 && i != j && i != k && i != h && j != k && j != h && k != h && (Math.max(i,j,k,h) - Math.min(i,j,k,h) == 3)){
			var str = getStringCombo([playedCards[playedCards.length - 2],playedCards[playedCards.length - 3],playedCards[playedCards.length - 4],card]);
			player1.score += 4;
			chatTxt.push("4 points for a run of 4 cards" + str);
		}else if(playedCards.length > 2 && i != j && i != h && j != h && (Math.max(i,j,h) - Math.min(i,j,h) == 2)){
			var str = getStringCombo([playedCards[playedCards.length - 2],playedCards[playedCards.length - 3],card]);
			player1.score += 3;
			chatTxt.push("3 points for a run of 3 cards" + str);
		}
	}
	if(count == 15){//checks if the count is equal to 15
		player1.score += 2;
		chatTxt.push("2 points for hitting 15");
	}else if(count == 31){
		player1.score += 2;
		chatTxt.push("2 points for hitting 31");
		playedCards = [];
		count == 0;
	}
	pointName = player1.name
	chat = 1;
	Game.sendMessage();
	chat = 0;
};

var countPoints = function(person){//the function responsiblefor counting points during the counting points section of gameplay
	for(var i = 0; i < person.currHand.length; i++){
		var hand = person.currHand[i];
		if(hand.length == 5){
			checkFifteen(hand, person.name);
			checkRun(hand, person.name);
			checkFlush(hand, person.name);
		}else{
			checkFifteen(hand, person.name);
			if(notSubsetOfAlreadyScored(hand, "pair")){
				checkPair(hand, person.name);
			}
			if(hand.length >= 3 && notSubsetOfAlreadyScored(hand, "run")){
				checkRun(hand, person.name);
			}
		}
	}
	checkNobs(hand, person.name);
};


//check to ensure a smaller subset of an already accounted for set of cards doesn't receive duplicate points
var notSubsetOfAlreadyScored = function(hand, str){
	for(var i = 0; i < alreadyScored.length; i++){
		if(isSubset(hand, alreadyScored[i].hand) && alreadyScored[i].reason == str){
			return false;
		}
	}
	return true;
}

//checks if one set of cards is the subset of another
var isSubset = function(h1, h2){
	if(h1 >= h2){
		return false;
	}
	for(var i = 0; i < h1.length; i++){
		var matched = false;
		for(var j = 0; j < h2.length; j++){
			if(checkSameCard(h1[i], h2[j])){
				matched = true;
			}
		}
		if(!matched){
			return false;
		}
	}
	return true;
}

//checks if two cards are the same number(ace,2,3,...,king)
var checkSameCard = function(c1, c2){
	if(c1.suit == c2.suit && c1.number == c2.number){
		return true;
	}else{
		return false;
	}
}

//checks if the set is a pair, 3-of-a-kind, or four-of-a-kind
var checkPair = function(c, pName){
	var s = 0;
	if(checkSameNumber(c)){
		if(c.length == 4){
			s = 12;
		}else if(c.length == 3){
			s = 6;
		}else if(c.length == 2){
			s = 2;
		}
		scored(c, s, "pair", pName)
	}
}

//check if a set of cards have the same number
var checkSameNumber = function(c){
	for(var i = 1; i < c.length; i++){
		if(c[0].number != c[i].number){
			return false;
		}
	}
	return true;
}

//checks if the player has a jack which is the same suit as the flip card then they get 2 points
var checkNobs = function(c, pName){
	for(var i = 0; i < c.length - 1; i++){
		if(c[i].number == "jack" && c[i].suit == c[c.length - 1].suit){
			scored(c, 1, "nobs", pName);
		}
	}
}

//check if the players hand is a flush
var checkFlush = function(c, pName){
	opponent = getOpponent();
	var s = 0;
	if(timesCounted == 2){
		if(checkSameSuit(c)){
			s = 5;
			scored(c, s, "flush", pName);
		}
	}else{
		var c2 = c;
		c2.pop();
		if(checkSameSuit(c2)){
			if(checkSameSuit(c)){
				s = 5;	
				scored(c, s, "flush", pName);
			}else{
				s = 4;
				scored(c, s, "flush", pName);
			}
		}
	}

}

//used by the proceeding function to see if eveyr card in the hand is the same suit
var checkSameSuit = function(c){
	for(var i = 1; i < c.length; i++){
		if(c[0].suit != c[i].suit){
			return false;
		}
	}
	return true;
}

//check if the given subset is a run or not
var checkRun = function(c, pName){
	var s = 0;
	var h = c[0].runVal;
	var i = c[1].runVal;
	var j = c[2].runVal;
	var str = getStringCombo(c);
	if(c.length > 3){
		var k = c[3].runVal;
		if(c.length > 4){
			var m = c[4].runVal;
		}
	}
	if(c.length == 5 && i != j && i != k && i != m && i != h && j != k && j != m && j != h && k != m && k != h && m != h && (Math.max(i,j,k,m,h) - Math.min(i,j,k,m,h) == 4)){
		s = 5;
		scored(c, s, "run", pName);
	}else if(c.length == 4 && i != j && i != k && i != h && j != k && j != h && k != h && (Math.max(i,j,k,h) - Math.min(i,j,k,h) == 3)){
		s = 4;
		scored(c, s, "run", pName);
	}else if(c.length == 3 && i != j && i != h && j != h && (Math.max(i,j,h) - Math.min(i,j,h) == 2)){
		s = 3;
		scored(c, s, "run", pName);
	}
	
}


//each time a  point is scored the players points increase, and the score and reason is logged
var scored = function(c, s, r, pName){
	opponent = getOpponent();
	alreadyScored.push({hand: c, reason: r, person: pName, points: s});
	if(pName == player1.name){
		player1.score += s;
	}else{
		opponent.score += s;
	}
}


//checks if any subset of cards is equal to 15
var checkFifteen = function(c, pName){
	var sum = 0;
	for(var i = 0; i < c.length; i++){
		sum += c[i].value;
	}
	if(sum == 15){
		var str = getStringCombo(c);
		if(pName == player1.name){
			scored(c, 2, "fifteen", pName)
		}else{
			scored(c, 2, "fifteen", pName)
		}
	}
};


//displays the scoring reasoning in the chat
var showPointsInChat = function(){
	if(alreadyScored.length != 0){
		chatTxt = [];
		pointName = alreadyScored[0].person;
		alreadyScored.sort(scoreSort);
		if(timesCounted != 3){
			newStr = pointName + "'s hand: \n";
		}else{
			newStr = pointName + "'s crib: \n";
		}
		chatTxt.push(newStr);
		var kind = "";
		for(var i = 0; i < alreadyScored.length; i++){
			if(alreadyScored[i].reason == "pair" && alreadyScored[i].hand.length == 4){
				kind = "a four-of-a-kind of " + alreadyScored[i].hand[0].number + "'s";
			}else if(alreadyScored[i].reason == "pair" && alreadyScored[i].hand.length == 3){
				kind = "a three-of-a-kind of " + alreadyScored[i].hand[0].number + "'s";
			}else if(alreadyScored[i].reason == "pair" && alreadyScored[i].hand.length == 2){
				kind = "a pair of " + alreadyScored[i].hand[0].number + "'s";
			}else if(alreadyScored[i].reason == "run"){
				kind = "a run" + getStringCombo(alreadyScored[i].hand);
			}else if(alreadyScored[i].reason == "fifteen"){
				kind = "a combo totaling fifteen" + getStringCombo(alreadyScored[i].hand);
			}else if(alreadyScored[i].reason == "flush"){
				kind = "a flush" + getStringCombo(alreadyScored[i].hand);
			}else if(alreadyScored[i].reason == "nobs"){
				kind = "his nobs";
			}
			var str = alreadyScored[i].points + " points for " + kind + ".";
			chatTxt.push(str);
		}
		chat = 3;
		Game.sendMessage();
		chat = 0;
		chatTxt = [];
	}
}