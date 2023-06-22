"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const history_controller_1 = require("../controllers/history.controller");
const historyRouter = (0, express_1.Router)();
exports.historyRouter = historyRouter;
historyRouter.get('/', passport_1.default.authenticate('jwt', { session: false }), history_controller_1.getHistory);
historyRouter.get('/:shortUrl', passport_1.default.authenticate('jwt', { session: false }), history_controller_1.getHistoryById);
