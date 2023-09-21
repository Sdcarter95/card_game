"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextRound = exports.newGame = exports.Suit = void 0;
const server_1 = require("./server");
const server_2 = require("./server");
var Suit;
(function (Suit) {
    Suit["Hearts"] = "hearts";
    Suit["Diamonds"] = "diamonds";
    Suit["Clubs"] = "clubs";
    Suit["Spades"] = "spades";
})(Suit = exports.Suit || (exports.Suit = {}));
let roundGenerator;
function playWarRound(deckId) {
    return __asyncGenerator(this, arguments, function* playWarRound_1() {
        const player1 = { name: "Player 1", deck: [] };
        const player2 = { name: "Player 2", deck: [] };
        let round = 0;
        while (true) {
            round++;
            const card1 = yield __await((0, server_2.drawCard)(deckId));
            const card2 = yield __await((0, server_2.drawCard)(deckId));
            let roundResults = "";
            if (!card1 || !card2) {
                yield yield __await('Not enough cards in the deck to continue the game.');
                return yield __await(void 0);
            }
            roundResults += `Round ${round}:`;
            roundResults += `${player1.name}: ${card1.value} of ${card1.suit}`;
            roundResults += `${player2.name}: ${card2.value} of ${card2.suit}`;
            if (card1.value > card2.value) {
                roundResults += `${player1.name} wins the round!`;
                player1.deck.push(card1, card2);
            }
            else if (card2.value > card1.value) {
                roundResults += `${player2.name} wins the round!`;
                player2.deck.push(card1, card2);
            }
            else {
                roundResults += "It's a tie!";
            }
            if (round >= 100) {
                roundResults += "Game Over";
                if (player1.deck.length > player2.deck.length) {
                    roundResults += `${player1.name} wins the game!`;
                }
                else if (player2.deck.length > player1.deck.length) {
                    roundResults += `${player2.name} wins the game!`;
                }
                else {
                    roundResults += "It's a tie!";
                }
                yield yield __await(roundResults);
                return yield __await(void 0);
            }
            yield yield __await(roundResults);
        }
    });
}
async function newGame() {
    try {
        const deck = await (0, server_1.createDeck)();
        roundGenerator = playWarRound(deck);
        // Get the first message from the generator
        const firstMessage = await roundGenerator.next();
        return firstMessage.value;
    }
    catch (error) {
        throw new Error('Failed to start a new game.');
    }
}
exports.newGame = newGame;
async function nextRound() {
    const roundMessage = await roundGenerator.next();
    if (roundMessage.done) {
        return "This game is over";
    }
    else {
        return roundMessage.value;
    }
}
exports.nextRound = nextRound;
