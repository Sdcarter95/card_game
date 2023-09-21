"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCard = exports.createDeck = void 0;
const express_1 = __importDefault(require("express"));
const gameLogic_1 = require("./gameLogic");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http")); // Import the http module
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const server = http_1.default.createServer(app);
console.log(`Server is listening on port ${port}`);
const io = new socket_io_1.Server(server);
// Keep track of connected players
const connectedPlayers = new Set();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Handle WebSocket connections
io.on('connection', async (socket) => {
    if (!connectedPlayers.has(socket.id)) {
        console.log('User ' + socket.id + ' connected');
        connectedPlayers.add(socket.id); // Add the player's socket ID to the set of connected players
    }
    if (connectedPlayers.size == 2) {
        const newGameAlert = await (0, gameLogic_1.newGame)();
        io.emit('gameStart', newGameAlert);
    }
    else {
        socket.emit('waitingForPlayers', 'Waiting for more players to join...');
    }
    // Listen for "nextRound" event from clients
    socket.on('nextRound', async () => {
        if (connectedPlayers.size >= 2) {
            // Handle the logic for the next round and broadcast the result to all clients
            const roundResult = await (0, gameLogic_1.nextRound)();
            io.emit('roundResult', roundResult); // Broadcast the result to all clients
        }
        else {
            socket.emit('waitingForPlayers', 'Waiting for more players to join...');
        }
    });
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Remove the player's socket ID from the set of connected players
        connectedPlayers.delete(socket.id);
        // If a player disconnects and there are fewer than two players, end the game
        if (connectedPlayers.size < 2) {
            io.emit('endGame', 'Not enough players to continue the game.');
        }
    });
});
app.get('/newGame', async (req, res) => {
    try {
        const response = await (0, gameLogic_1.newGame)();
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create a new game.' });
    }
});
app.get('/nextRound', async (req, res) => {
    try {
        const response = await (0, gameLogic_1.nextRound)();
        res.json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to play next Rounds' });
    }
});
async function createDeck() {
    try {
        const response = await axios_1.default.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
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
        const response = await axios_1.default.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = response.data;
        const card = data.cards[0];
        return card ? { value: card.value, suit: card.suit } : null;
    }
    catch (error) {
        throw new Error('Failed to draw a card from the deck.');
    }
}
exports.drawCard = drawCard;
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
