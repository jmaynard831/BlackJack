/**
 * add options to set the number of decks in play
 * display cards remaining in deck in a submenu
 * enable the odds calculator
 * What to do if the deck runs out of cards? 
 *      oh, i guess call it a draw and reset the deck.
 * add reset button to reset deck (not money)
 * game over when you run out of money? 
 * min bets? 
 * DONE- Make check nautrals work!!!
 * if player score goes over 21 auto start dealer turn
 * 
 * UI THINGS:
 * Make the player scores a bit better looking
 * Only display both scores if theres an ace in play
 * fix cards running over edge when you have 5+
 *      maybe leaf them over each other
 * make the bet button vanish when playing, and so on
 * 
 */

const suits = ["heart", "club","diamond","spade"];
const ranks = ["A","K","Q","J","2","3","4","5","6","7","8","9","10"];
let dealerHand = [], playerHand = [];
let dealerScore = [0,0], playerScore = [0,0];
let playerMoney = 0;
let playerBet = 0;



let deck = getDeck();
shuffleDeck(deck);
setMoney(500);
hideButtons(true);

function setMoney(money){
    playerMoney = money;
    document.getElementById("moneyDisplay").innerHTML = "Money: " + money;
    
}

function getDeck(){
    let deck = [];

    for(let x = 0; x< suits.length; x++){
        for(let y = 0; y<ranks.length; y++){
            let card = {rank: ranks[y], suit: suits[x]};
            deck.push(card);
        }
    }

    return deck;
}

function shuffleDeck(deck){
    let currentIndex = deck.length, randomIndex;
    //fisher-yates algorithm 
    while(currentIndex!=0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
    }

    return deck;
}

function drawFromDeck(hand, deck, numberOfCards){
    //Check number of cards remaining in deck lol.
    for(let x = 0; x<numberOfCards; x++){
        if(deck.length!=0){
        hand.push(deck.pop());
        }
    }
}

//debug function
function displayHandScoresOnScreen(){
    //if theyre the same we  we only show one score
    
    let DS = "";
    if(dealerScore[0]===dealerScore[1]){
         DS =  deriveSingleScore(dealerScore);
    }
    else{
        DS = dealerScore;
    }

    document.getElementById("dealerHandScore").innerHTML = "Dealer Score: " + DS;

    let PS = "";
    if(playerScore[0]===playerScore[1]){
         PS =  deriveSingleScore(playerScore);
    }
    else{
        PS = playerScore;
    }

    document.getElementById("playerHandScore").innerHTML = "Player Score: " + PS;

    
}

function scoreHand(hand){
    let score = 0; 
    let isAce = false;
    for(let x = 0; x< hand.length; x++){
        if(hand[x].rank==="A"){
            isAce = true;
        }
        score += scoreCard(hand[x]);
    }
    //if there's an ace drawn, add ten to ace score
    return isAce ? [score, score+10] : [score,score];
}

function scoreCard(card){
    switch(card.rank){
        case "A":
            return 1; break;
        case "K":
            return 10; break;
        case "Q":
            return 10; break;
        case "J":
            return 10; break;
        case "10":
            return 10; break;
        case "9":
            return 9; break;
        case "8":
            return 8; break;
        case "7":
            return 7; break;
        case "6":
            return 6; break;
        case "5":
            return 5; break;
        case "4":
            return 4; break;
        case "3":
            return 3; break;
        case "2":
            return 2; break; 
                       
    }
}

function hideButtons(toggle){
    if(toggle){
        document.getElementById("hitHold").style.visibility = "hidden";
    }
    else{
        document.getElementById("hitHold").style.visibility = "visible";
    }
}

function hideBetBar(toggle){
    if(toggle){
        document.getElementById("betForm").style.visibility = "hidden";
    }
    else{
        document.getElementById("betForm").style.visibility = "visible";
    }
}

function checkNaturals(handArray){
    //check the score of dealer hand
    let dealerScore = scoreHand(handArray[0]);

    let playerScore = scoreHand(handArray[1]);

    //check for blackjack in dealer hand
    let dealerBjWin = (dealerScore[0]===21 || dealerScore[1]===21) ? true : false; 

    //check for blackjack in player hand
    let playerBjWin = (playerScore[0]===21 || playerScore[1]===21) ? true : false; 

    if(dealerBjWin && playerBjWin){
        console.log("Both players win. No Payout.");
        //empty both hands

        updateBetOnScreen(0)
        playerBet = 0;
        //reset bet to 0 
        hideBetBar(false);
        hideButtons(true);
        
    }
    else if(dealerBjWin){
        console.log("Dealer wins the Natural. Player loses bet.");
        //empty both hands
        //subtract money from player
        //reset bet to 0
      
        //redraw screen
        playerMoney-=parseInt(playerBet);
        setMoney(playerMoney);
        updateBetOnScreen(0)
        playerBet = 0;
        hideBetBar(false);
        hideButtons(true);
    }
    else if(playerBjWin){
        console.log("Player wins the Natural. Player wins 1.5x bet.");
        //empty hands
        //add money to player
        //reset bet to 0 
       
        playerMoney+=parseInt(playerBet*1.5);
        setMoney(playerMoney);
        updateBetOnScreen(0)
        playerBet = 0;
        hideBetBar(false);
        hideButtons(true);
    }
    else{
        console.log("No one wins the Natural. Continue.");
    }

}

//debug function 
function revealHands(handArray){

    console.log("Dealer's Hand: \n[Hidden Card]");
    for(let x = 0; x<handArray[0].length; x++){
        console.log(printCard(handArray[0][x]));
    }

    console.log("Player's Hand: ");
    for(let x = 0; x<handArray[1].length; x++){
        console.log(printCard(handArray[1][x]));
    }
    
}

function printCard(card){
    switch(card.suit){
        case "heart":
            return card.rank+"♥";
            break;
        case "spade":
            return card.rank+"♠";
            break;
        case "diamond":
            return card.rank+"♦";
            break;
        case "club":
            return card.rank+"♣";
            break;
        default:
            return null;
    }
}


//Called at start of game after betting.
function dealStarterHands(){
    //empty both players hands 
    playerHand = [];
    dealerHand = [];

    // both players get two cards
    drawFromDeck(playerHand, deck, 2);
    drawFromDeck(dealerHand, deck, 2);
    //put both of them on the screen
    calculateScoreAndDisplay();
    //check for natural wins
    checkNaturals([dealerHand, playerHand]);
    //write function to do something if theres a win
}


//Draws cards from the player and dealer hands to the screen. 
function drawHandsToTable(handArray){
    //Clears the cards out of the player and dealer hands. 
    //Then draws a card for each element of the player and dealer hands
    document.getElementById("playerHand").innerHTML = '';

    for(let x = 0; x<handArray[0].length; x++){
        let card = "<div class='card'><p>"+printCard(handArray[0][x])+"</p></div>"
        document.getElementById("playerHand").insertAdjacentHTML('beforeend',card);
    }

    document.getElementById("dealerHand").innerHTML = '';
    for(let x = 0; x<handArray[1].length; x++){
        let card = "<div class='card'><p>"+printCard(handArray[1][x])+"</p></div>"
        document.getElementById("dealerHand").insertAdjacentHTML('beforeend',card);
    }


}


//Calls the draw cards function, then calculates and updates the hand score. 
function calculateScoreAndDisplay(){
    drawHandsToTable([playerHand, dealerHand]);
    playerScore = scoreHand(playerHand);
    dealerScore = scoreHand(dealerHand);
    displayHandScoresOnScreen();
}

//Button listener for Hitting the deck.
document.getElementById("hit").addEventListener("click", ()=>{
    drawFromDeck(playerHand, deck, 1);
    calculateScoreAndDisplay();
    //check if player busted
    if(checkPlayerBust()){
        console.log("Player Busted. Dealer's turn.");
        dealerTurn();
    }
})

function checkPlayerBust(){
    //take player score, find the lowest value, and see if thats over 21.
    if(playerScore[0]>21 && playerScore[1]>21){
        return true;
    }

    return false; 
}

document.getElementById("resetBTN").addEventListener("click", ()=>{
    deck = getDeck();
    shuffleDeck(deck);
})

//Stop the players turn and let the dealer do his thing.
document.getElementById("hold").addEventListener("click", ()=>{
    console.log("hold")
    //If we click hold, that means the dealer needs to play
    //they can either HOLD if score is 17-21
    //or they can hit
    dealerTurn();
})

function dealerTurn(){
    //loop, check if score is 16-21
    //if so, stop.
    //if score is lower, then hit

    let DS = deriveSingleScore(dealerScore);
    let PS = deriveSingleScore(playerScore);
    
    while(DS<17 || (DS<PS && PS<22)){
        drawFromDeck(dealerHand, deck, 1);
        calculateScoreAndDisplay();
        
        DS = deriveSingleScore(dealerScore);
        PS = deriveSingleScore(playerScore);
    }
    handleWin();
}

function deriveSingleScore(hand){
    //If both scores are over 21, return the smaller number
    //otherwise return the highest number 21 or less. 

    let first = hand[0];
    let second = hand[1];

    if(first>21 && second>21){
        //return the smaller value
        return first>second ? second : first;
    }

    if(first<=21 && second<=21){
        //return the larger value
        return first<second ? second : first;
    }

    return first<=21? first : second;


}

function handleWin(){

    /**
     * how does player win? 
     * if they have a higher score than the dealer and theyre <=21.
     * 
     */
    //take player score object, return the highest valid number as a single.
    let DS = deriveSingleScore(dealerScore);
    let PS = deriveSingleScore(playerScore);
    console.log("ds:", DS, " ps:",PS);

    if((PS<=21 && PS>DS) || (PS<=21 && DS>21)){
        console.log("Player wins!");
        playerMoney+=parseInt(playerBet);
        playerBet=0;
        setMoney(playerMoney);
        updateBetOnScreen(0);
        hideBetBar(false);
        hideButtons(true);
        return; 
    }
    //If player and dealer have same score, or if both bust, its a tie
    else if((DS===PS) || (PS>21 && DS>21)){
        console.log("Tie Game!")
        playerBet=0;
        updateBetOnScreen(0);
        hideBetBar(false);
        hideButtons(true);
        return;
    }
    //if player didnt win or player didnt tie, then dealer wins
    else{
        console.log("Dealer Wins!");
        playerMoney-=parseInt(playerBet);
        playerBet=0;
        setMoney(playerMoney);
        updateBetOnScreen(0);
        hideBetBar(false);
        hideButtons(true);
        return;
    }
    

}


function updateBetOnScreen(newBet){
    document.getElementById("betField").innerHTML = "Bet: "+ newBet;
}


//Betting requires putting a number down and setting the var. 
//Add check if bet is valid. 
document.getElementById("betForm").addEventListener("submit", (event)=>{
    event.preventDefault();

    hideBetBar(true);
    hideButtons(false);
    
    let bet = document.getElementById("betInput").value;
    playerBet = bet;

    document.getElementById("betField").innerHTML = "Bet: "+playerBet;
    document.getElementById("betInput").value = 0;

    dealStarterHands();
})