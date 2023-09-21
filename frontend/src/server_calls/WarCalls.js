"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextRound = exports.newGame = void 0;
const backendURL = "http://localhost:3001";
function newGame() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${backendURL}/newGame`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.text();
            return data;
        }
        catch (error) {
            return String(error);
        }
    });
}
exports.newGame = newGame;
function nextRound() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${backendURL}/nextRound`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = yield response.text();
            return data;
        }
        catch (error) {
            return String(error);
        }
    });
}
exports.nextRound = nextRound;
