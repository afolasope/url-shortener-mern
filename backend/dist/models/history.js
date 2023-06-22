"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = void 0;
const mongoose_1 = require("mongoose");
const historySchema = new mongoose_1.Schema({
    id: mongoose_1.Schema.Types.ObjectId,
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    fullUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    time: {
        type: mongoose_1.Schema.Types.Date,
        default: Date.now(),
        immutable: true,
    },
    device: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    os: {
        type: String,
        required: true,
    },
    browser: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
});
exports.History = (0, mongoose_1.model)('History', historySchema);
