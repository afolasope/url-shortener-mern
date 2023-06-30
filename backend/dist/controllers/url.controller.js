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
exports.redirectUrl = exports.deleteUrl = exports.getShortUrl = exports.createShortUrl = void 0;
const shortid_1 = __importDefault(require("shortid"));
const url_model_1 = require("../models/url.model");
const user_1 = require("../models/user");
const mongoose_1 = require("mongoose");
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const history_1 = require("../models/history");
const node_device_detector_1 = __importDefault(require("node-device-detector"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
const validator_1 = __importDefault(require("validator"));
const detector = new node_device_detector_1.default({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});
const createShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullUrl, customUrl } = req.body;
    const userId = req === null || req === void 0 ? void 0 : req.headers['x-user-id'];
    let userEmail;
    if (req.user) {
        let { email } = req === null || req === void 0 ? void 0 : req.user;
        userEmail = email;
    }
    const validFullUrl = validator_1.default.isURL(fullUrl);
    if (!validFullUrl) {
        return res.status(401).send({ message: 'Invalid link' });
    }
    const checkXUser = yield user_1.User.findOne({ _id: userId });
    const validUser = yield user_1.User.findOne({ email: userEmail });
    const checkCustomUrl = yield url_model_1.ShortUrl.findOne({ shortUrl: customUrl });
    if (checkCustomUrl) {
        return res.status(409).send({ message: 'This custom url already exists for another link' });
    }
    if (validUser) {
        const url = yield url_model_1.ShortUrl.create({
            shortUrl: customUrl ? customUrl : shortid_1.default.generate(),
            fullUrl,
            userId: validUser === null || validUser === void 0 ? void 0 : validUser._id,
        });
        return res.status(200).json(url);
    }
    if (checkXUser) {
        const url = yield url_model_1.ShortUrl.create({
            shortUrl: customUrl ? customUrl : shortid_1.default.generate(),
            fullUrl,
            userId: new mongoose_1.Types.ObjectId(userId),
        });
        return res.status(200).json(url);
    }
    if (!checkXUser && !validUser) {
        yield user_1.User.create({
            _id: new mongoose_1.Types.ObjectId(userId),
            email: 'anonymous@gmail.com',
            password: 'xoxoxo',
        });
        const url = yield url_model_1.ShortUrl.create({
            shortUrl: customUrl ? customUrl : shortid_1.default.generate(),
            fullUrl,
            userId: new mongoose_1.Types.ObjectId(userId),
        });
        return res.status(200).json(url);
    }
});
exports.createShortUrl = createShortUrl;
const getShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const XUserId = req === null || req === void 0 ? void 0 : req.headers['x-user-id'];
    let userEmail;
    if (req.user) {
        let { email } = req === null || req === void 0 ? void 0 : req.user;
        userEmail = email;
    }
    const validUser = yield user_1.User.findOne({ email: userEmail });
    const XUserUrls = yield url_model_1.ShortUrl.find({ userId: XUserId });
    const authUrls = yield url_model_1.ShortUrl.find({ userId: validUser === null || validUser === void 0 ? void 0 : validUser._id });
    if (XUserId) {
        return res.status(200).send(XUserUrls);
    }
    if (validUser) {
        return res.status(200).send(authUrls);
    }
    return res.status(200).send([]);
});
exports.getShortUrl = getShortUrl;
const deleteUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { shortUrl } = req.params;
    const { email } = req.user;
    yield ((_a = redis_config_1.default.redis) === null || _a === void 0 ? void 0 : _a.del('auth-urls'));
    const user = yield user_1.User.findOne({ email });
    if (!user) {
        return res.status(401).send({ message: 'User not authorized' });
    }
    const validOwner = yield url_model_1.ShortUrl.deleteOne({
        userId: new mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id),
        shortUrl: shortUrl,
    });
    yield history_1.History.deleteMany({ shortUrl });
    if (!validOwner) {
        return res.status(400).send({ message: 'No urls match the ID provided' });
    }
    yield ((_b = redis_config_1.default.redis) === null || _b === void 0 ? void 0 : _b.del(`cache-${shortUrl}`));
    return res.status(200).send({ message: 'deletion successful' });
});
exports.deleteUrl = deleteUrl;
const redirectUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shortUrl } = req.params;
    const url = yield url_model_1.ShortUrl.findOne({ shortUrl });
    // const cacheKey = `cache-${shortUrl}`;
    // Cache.redis?.get(cacheKey);
    if (!url) {
        return res.status(404);
    }
    var ip = '102.219.54.33';
    const geo = geoip_lite_1.default.lookup(ip);
    console.log('geo', geo);
    yield url_model_1.ShortUrl.updateOne({ shortUrl }, { $set: { clicks: +url.clicks + 1 } });
    const userAgent = req.headers['user-agent'];
    const { os, client, device } = detector.detect(userAgent);
    yield history_1.History.create({
        shortUrl: url.shortUrl,
        fullUrl: url.fullUrl,
        device: device.type,
        brand: device.brand,
        os: os.name,
        browser: client.name,
        location: `${geo === null || geo === void 0 ? void 0 : geo.city}, ${geo === null || geo === void 0 ? void 0 : geo.country}`,
        userId: new mongoose_1.Types.ObjectId(url === null || url === void 0 ? void 0 : url.userId),
    });
    // Cache.redis?.set(cacheKey, JSON.stringify(url));
    return res.status(301).redirect(url === null || url === void 0 ? void 0 : url.fullUrl);
});
exports.redirectUrl = redirectUrl;
