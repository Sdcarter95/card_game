"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawCard = exports.createDeck = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const gameLogic_1 = require("./gameLogic");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const server = http_1.default.createServer(app);
console.log(`Server is listening on port ${port}`);
const io = new socket_io_1.Server(server);
const connectedPlayers = new Set();
let turnCounter = 0;
let roundResult = "";
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
io.on('connection', async (socket) => {
    if (!connectedPlayers.has(socket.id)) {
        console.log(`User ${socket.id} connected`);
        connectedPlayers.add(socket.id);
    }
    if (connectedPlayers.size === 2) {
        await (0, gameLogic_1.newGame)();
        io.emit('gameStart', 'Draw to begin');
    }
    else {
        socket.emit('waitingForPlayers', 'Waiting for more players to join...');
    }
    socket.on('nextRound', async () => {
        if (connectedPlayers.size >= 2) {
            if (turnCounter === 0) {
                roundResult = await (0, gameLogic_1.nextRound)();
            }
            const finalResult = roundResult.split('|r|')[1];
            const roundInfo = roundResult.split('|r|')[0];
            const roundNumber = roundInfo.split('|c|')[0];
            const player1Result = roundInfo.split('|c|')[1];
            const player2Result = roundInfo.split('|c|')[2];
            if (turnCounter === 0) {
                io.emit('roundResult', '');
                io.emit('opponentResult', '');
                io.emit('drawResult', '');
                io.emit('roundNumber', roundNumber);
            }
            if (turnCounter < 2) {
                turnCounter++;
                if ([...connectedPlayers][0] === socket.id) {
                    socket.emit('drawResult', player1Result);
                    io.to([...connectedPlayers][1]).emit('opponentResult', player1Result);
                }
                else {
                    socket.emit('drawResult', player2Result);
                    io.to([...connectedPlayers][0]).emit('opponentResult', player2Result);
                }
            }
            if (turnCounter >= 2) {
                turnCounter = 0;
                io.emit('roundResult', finalResult);
            }
        }
        else {
            socket.emit('waitingForPlayers', 'Waiting for more players to join...');
        }
    });
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        connectedPlayers.delete(socket.id);
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
        res.status(500).json({ error: 'Failed to play next rounds.' });
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
