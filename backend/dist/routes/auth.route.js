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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
exports.authRouter = authRouter;
authRouter.post('/signup', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return passport_1.default.authenticate('signup', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (user) {
            req.user = user;
            res.status(200).json(info);
        }
        return res.status(400).json(info);
    })(req, res, next);
}));
authRouter.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return passport_1.default.authenticate('login', (err, user, info) => {
        (0, auth_controller_1.login)(req, res, { err, user, info });
    })(req, res, next);
}));
