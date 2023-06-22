"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortUrl = void 0;
const mongoose_1 = require("mongoose");
const urlSchema = new mongoose_1.Schema({
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
        required: false,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        default: Date.now(),
        immutable: true,
    },
    QRCode: {
        type: String,
    },
});
exports.ShortUrl = (0, mongoose_1.model)('Url', urlSchema);
