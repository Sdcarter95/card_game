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
const WarCalls_1 = require("../server_calls/WarCalls");
function HomePage() {
    const [gameMessage, setGameMessage] = (0, react_1.useState)("Ready to play");
    (0, react_1.useEffect)(() => {
        startGame();
    }, []);
    const startGame = () => {
        (0, WarCalls_1.newGame)()
            .then((response) => {
            setGameMessage(response);
        })
            .catch((error) => {
            console.error("Error starting the game:", error);
            setGameMessage(error);
        });
    };
    const playRound = () => {
        (0, WarCalls_1.nextRound)().then((response) => {
            setGameMessage(response);
        })
            .catch((error) => {
            console.error("Error playing round:", error);
            setGameMessage(error);
        });
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, gameMessage),
            react_1.default.createElement("button", { onClick: playRound }, "Draw"))));
}
exports.default = HomePage;
