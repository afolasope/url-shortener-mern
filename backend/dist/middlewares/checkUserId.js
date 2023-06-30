"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserId = void 0;
const passport_1 = __importDefault(require("passport"));
const checkUserId = (req, res, next) => {
    const userId = req === null || req === void 0 ? void 0 : req.headers['x-user-id'];
    if (userId) {
        return next();
    }
    return passport_1.default.authenticate('jwt', { session: false })(req, res, next);
};
exports.checkUserId = checkUserId;
