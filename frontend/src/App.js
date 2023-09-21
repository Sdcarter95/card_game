"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
const react_1 = __importDefault(require("react"));
const HomePage_1 = __importDefault(require("./components/HomePage"));
const react_router_dom_1 = require("react-router-dom");
const react_router_dom_2 = require("react-router-dom");
function App() {
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement("header", { className: "App-header" },
            react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
                react_1.default.createElement(Logo, null),
                react_1.default.createElement(react_router_dom_1.Routes, null,
                    react_1.default.createElement(react_router_dom_1.Route, { path: "/", Component: HomePage_1.default }))))));
}
function Logo() {
    const location = (0, react_router_dom_2.useLocation)();
    return (react_1.default.createElement("div", null, location.pathname !== '/' && (react_1.default.createElement("a", { href: "/" },
        react_1.default.createElement("img", { src: "", alt: "Logo", className: "logo" })))));
}
exports.default = App;
