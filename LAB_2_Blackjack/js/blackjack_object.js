// pcm 20172018a Blackjack class

//constant with the maximum number of points for blackJack
const MAX_POINTS = 21;


// BlackJack Class- constructor
class BlackJack {
    constructor() {
        // array with dealer cards
        this.dealer_cards = [];
        // array with player cards
        this.player_cards = [];
        // boolean variable that indicates the dealer's turn to play until the end
        this.dealerTurn = false;

        // object in literal form with game state
        this.state = {
            'gameEnded': false,
            'dealerWon': false
        };

        // methods used in the constructor (MUST BE IMPLEMENTED BY THE STUDENTS)
        this.new_deck = function () {
            let ordered_deck = [];
            for (let i = 52; i > 0; i--)
                ordered_deck.push(i % 13 + 1);
            console.log(ordered_deck);
            return ordered_deck;
        };

        this.shuffle = function (deck) {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
            return deck;
        };

        // card deck shuffled
        this.deck = this.shuffle(this.new_deck());
    }

    // methods
    // returns the dealer's cards in a new array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // returns the player's cards in a new array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Activates the boolean variable "dealerTurn"
    setDealerTurn (val) {
        this.dealerTurn = val;
    }

    //METHODS TO BE IMPLEMENTED BY STUDENTS (Explained in the lab work)
    get_cards_value(cards) {
        let total = 0;
        let ace = false;

        for (let i = 0; i < cards.length; i++) {
            let value;

            if (cards[i] >= 11) {
                value = 10; 
            } else if (cards[i] == 1) {
                value = 11;
                ace = true
            } else {
                value = cards[i];
            }

            total += value;
        }
        if (ace == true && total > 21) {
            total -= 10;
        }

        return total;
    }

    dealer_move() {
        let dealerCardsValue = this.get_cards_value(this.get_dealer_cards())
        let playerCardsValue = this.get_cards_value(this.get_player_cards())
        if ( 
            this.dealerTurn 
            && dealerCardsValue > playerCardsValue 
            && dealerCardsValue < MAX_POINTS
        ) {
            this.state.dealerWon = true;
            this.state.gameEnded = true;
            return false;
        } else { 
            this.dealer_cards.push(this.deck.pop());
            
            let total = this.get_game_state(this.get_dealer_cards());

            if (total[0] && total[1]) {
                this.state.dealerWon = true;
                this.state.gameEnded = true;
            } else if (total[0]) {
                this.state.gameEnded = true;
            } 
            return true;
        }
    }

    player_move() {
        this.player_cards.push(this.deck.pop());

        let total = this.get_game_state(this.get_player_cards());

        if (total[0] && total[1]) {
            this.state.gameEnded = true;
        } else if (total[0]) {
            this.state.dealerWon = true;
            this.state.gameEnded = true;
        } 
    }

    get_game_state(cards) {
        let result = this.get_cards_value(cards);

        if (result == MAX_POINTS) {
            return [true, true];
        }

        if (result > MAX_POINTS) {
            return [true, false];
        }

        return [false, false];
    }
}

