"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCard = exports.createDeck = void 0;
// server/index.ts
const express_1 = __importDefault(require("express"));
const gameLogic_1 = require("./gameLogic");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
app.get('/newGame', async (req, res) => {
    try {
        const response = await (0, gameLogic_1.newGame)();
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create a new game.' }); //check this
    }
});
app.get('/nextRound', async (req, res) => {
    try {
        const response = await (0, gameLogic_1.nextRound)();
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to play next Rounds' }); //check this
    }
});
async function createDeck() {
    try {
        const response = await axios_1.default.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'); // Use axios.get
        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response.data;
        return data.deck_id;
    }
    catch (error) {
        throw new Error('Failed to create a new deck.');
    }
}
exports.createDeck = createDeck;
async function drawCard(deckId) {
    try {
        const response = await axios_1.default.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`); // Use axios.get
        if (response.status !== 200) { // Axios doesn't use ok property; check status
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response.data; // No need for an explicit type annotation
        const card = data.cards[0];
        return card ? { value: card.value, suit: card.suit } : null;
    }
    catch (error) {
        throw new Error('Failed to draw a card from the deck.');
    }
}
exports.drawCard = drawCard;
