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
require("./css/HomePage.css");
const socket = (0, socket_io_client_1.io)('http://localhost:3001', { transports: ['websocket', 'polling', 'flashsocket'] });
function HomePage() {
    const [gameMessage, setGameMessage] = (0, react_1.useState)('Ready to play');
    const [drawMessage, setDrawMessage] = (0, react_1.useState)('');
    const [opponentMessage, setOpponentMessage] = (0, react_1.useState)('');
    const [turnStatus, setTurnStatus] = (0, react_1.useState)('start');
    const [roundNumber, setRoundNumber] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        // Listen for "endGame" event from the server
        socket.on('endGame', (message) => {
            setGameMessage(message);
        });
        // Listen for "waitingForPlayers" event from the server
        socket.on('waitingForPlayers', (message) => {
            setGameMessage(message);
        });
        // Listen for "gameStart" events from the server
        socket.on('gameStart', (result) => {
            setGameMessage(result);
        });
        // Listen for "drawResult" events from the server
        socket.on('drawResult', (result) => {
            setDrawMessage(result);
            setTurnStatus('wait');
        });
        // Listen for "opponentResult" events from the server
        socket.on('opponentResult', (result) => {
            setOpponentMessage(result);
            setTurnStatus('Draw');
        });
        // Listen for "roundResult" events from the server
        socket.on('roundResult', (result) => {
            setGameMessage(result);
            setTurnStatus('Draw');
        });
        // Updates the round number
        socket.on('roundNumber', (result) => {
            setRoundNumber(result);
        });
    }, []);
    const playRound = () => {
        socket.emit('nextRound');
        setTurnStatus('wait');
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "container" },
            react_1.default.createElement("h1", { className: "round-number" }, roundNumber),
            react_1.default.createElement("div", { className: "opponent-message" }, opponentMessage),
            react_1.default.createElement("div", { className: "game-message" }, gameMessage),
            react_1.default.createElement("div", { className: "draw-message" }, drawMessage),
            turnStatus !== 'wait' ? (gameMessage !== 'Waiting for more players to join...' ? (react_1.default.createElement("button", { className: "draw-button", onClick: playRound }, turnStatus)) : null) : (react_1.default.createElement("p", { className: "waiting-text" }, "Waiting...")))));
}
exports.default = HomePage;
