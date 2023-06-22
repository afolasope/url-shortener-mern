"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortUrlRouter = void 0;
const express_1 = require("express");
const url_controller_1 = require("../controllers/url.controller");
const passport_1 = __importDefault(require("passport"));
const checkUserId_1 = require("../middlewares/checkUserId");
const shortUrlRouter = (0, express_1.Router)();
exports.shortUrlRouter = shortUrlRouter;
shortUrlRouter.post('/', checkUserId_1.checkUserId, url_controller_1.createShortUrl);
shortUrlRouter.get('/', checkUserId_1.checkUserId, url_controller_1.getShortUrl);
shortUrlRouter.delete('/:shortUrl', passport_1.default.authenticate('jwt', { session: false }), url_controller_1.deleteUrl);
