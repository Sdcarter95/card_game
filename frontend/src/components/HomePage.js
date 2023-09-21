"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] }); // Connect to the WebSocket server
function HomePage() {
    const [gameMessage, setGameMessage] = (0, react_1.useState)("Ready to play");
    const [drawMessage, setDrawMessage] = (0, react_1.useState)("");
    const [opponentMessage, setOpponentMessage] = (0, react_1.useState)("");
    const [turnStatus, setTurnStatus] = (0, react_1.useState)("start");
    const [roundNumber, setRoundNumber] = (0, react_1.useState)("start");
    (0, react_1.useEffect)(() => {
        // Listen for "endGame" event from the server
        socket.on('endGame', (message) => {
            setGameMessage(message);
        });
        //startGame();
    }, []);
    const playRound = () => {
        socket.emit('nextRound');
        setTurnStatus("wait");
    };
    // Listen for "waitingForPlayers" event from the server
    socket.on('waitingForPlayers', (message) => {
        setGameMessage(message); // Display the waiting message
    });
    // Listen for "gameStart" events from the server
    socket.on('gameStart', (result) => {
        setGameMessage(result); // Update the game message with the result
    });
    // Listen for "drawResult" events from the server
    socket.on('drawResult', (result) => {
        setDrawMessage(result); // Update the game message with the result
        setTurnStatus("wait");
    });
    // Listen for "opponentResult" events from the server
    socket.on('opponentResult', (result) => {
        setOpponentMessage(result); // Update the game message with the result
        setTurnStatus("Draw");
    });
    // Listen for "roundResult" events from the server
    socket.on('roundResult', (result) => {
        setGameMessage(result); // Update the game message with the result
        setTurnStatus("Draw");
    });
    socket.on('roundNumber', (result) => {
        setRoundNumber(result);
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, roundNumber),
            react_1.default.createElement("p", null, opponentMessage),
            react_1.default.createElement("p", null, gameMessage),
            react_1.default.createElement("p", null, drawMessage),
            turnStatus !== "wait" ? (react_1.default.createElement("button", { onClick: playRound }, turnStatus)) : (react_1.default.createElement("p", null, "Waiting...")))));
}
exports.default = HomePage;
