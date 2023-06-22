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
exports.getHistoryById = exports.getHistory = void 0;
const history_1 = require("../models/history");
const user_1 = require("../models/user");
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const user = yield user_1.User.findOne({ email });
    if (!user) {
        return res.status(401).send('unauthorized');
    }
    const history = (yield history_1.History.find({})).reverse();
    return res.status(200).send(history);
});
exports.getHistory = getHistory;
const getHistoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortUrl } = req.params;
    const { email } = req.user;
    const verifyUser = yield user_1.User.findOne({ email });
    if (!verifyUser) {
        return res.status(401);
    }
    const history = yield history_1.History.find({ shortUrl });
    return res.status(200).send(history);
});
exports.getHistoryById = getHistoryById;
