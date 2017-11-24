// pcm 20172018a Blackjack oop

let game = null;
let message = "";
let is_debug = false;

function debug(an_object) {
    document.getElementById("debug").innerHTML = JSON.stringify(an_object);
}

function buttons_initialization(){
    document.getElementById("card").disabled     = false;
    document.getElementById("stand").disabled    = false;
    document.getElementById("new_game").disabled = true;

    document.getElementById("status").innerHTML = null;
    document.getElementById("dealer").innerHTML = "";
    document.getElementById("player").innerHTML = "";

    if(!is_debug)
        document.getElementById("sec_debug").style.display="none";
}

function finalize_buttons(){
    document.getElementById("card").disabled     = true;
    document.getElementById("stand").disabled    = true;
    document.getElementById("new_game").disabled = false;
}


//FUNCTIONS TO BE IMPLEMENTED BY STUDENTS (Explained in the lab work)
function new_game(){
	buttons_initialization()
    game = new BlackJack();
    debug(game);
    dealer_new_card();
    player_new_card();
    dealer_new_card();
}

function update_dealer(state){
    putCardFace("dealer", state.get_dealer_cards());
}

function update_player(state){
    putCardFace("player", state.get_player_cards());
}

function dealer_new_card(){
	game.dealer_move();
    update_dealer(game);
    check_winner();
	debug(game);
}

function player_new_card(){
	game.player_move();
    update_player(game);
    check_winner();
	debug(game);
}

function dealer_finish(){
    game.setDealerTurn(true);
    while(!game.state.gameEnded) {
        r = game.dealer_move();
        if (r) update_dealer(game);
        check_winner();
        debug(game);
    }
}

function check_winner() {
    if (game.state.gameEnded) {
        if (game.state.dealerWon) {
            message = "Dealer won!"
        } else {
            message = "Player won!"
        }
        finalize_buttons()
        document.getElementById("status").innerHTML = message;
    }
}

function putCardFace(name, state) {
    let img = document.createElement("IMG");
    img.src = getCardFace(state[state.length-1]);
    document.getElementById(name).appendChild(img);
    let x = document.getElementById(name).lastElementChild;
    TweenMax.from(x, 1, { x: '+=1000', opacity:0, ease: Power4.easeOut });
}

function getCardFace(n) {
    let cards = new card_faces();
    return cards.faces[n - 1][Math.floor(Math.random() * 4)];
}




