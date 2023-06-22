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
const mongoose_1 = require("mongoose");
const app_1 = require("../app");
const url_model_1 = require("../models/url.model");
const user_1 = require("../models/user");
const db_1 = require("./db");
const supertest_1 = __importDefault(require("supertest"));
const shortid_1 = __importDefault(require("shortid"));
const history_1 = require("../models/history");
describe('Home Route', () => {
    let conn;
    let token;
    const fullUrl = 'https://123moviestv.me/watch-tv/watch-modern-family-2009-39507.4858783';
    let short_url;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        conn = yield (0, db_1.connect)();
        const user = yield user_1.User.create({
            email: 'sope@gmail.com',
            password: 'hello101',
        });
        const loginResponse = yield (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({
            email: 'sope@gmail.com',
            password: 'hello101',
        });
        token = loginResponse.body.accessToken;
        const shortUrl = yield url_model_1.ShortUrl.create({
            shortUrl: shortid_1.default.generate(),
            fullUrl,
            userId: new mongoose_1.Types.ObjectId(user._id),
        });
        short_url = shortUrl.shortUrl;
        yield url_model_1.ShortUrl.create({
            shortUrl: shortid_1.default.generate(),
            fullUrl,
            userId: new mongoose_1.Types.ObjectId(user._id),
        });
        yield history_1.History.create({
            userId: new mongoose_1.Types.ObjectId(user._id),
            fullUrl,
            shortUrl: short_url,
            device: 'Mac',
            location: 'Lagos',
            os: 'Mac',
            browser: 'chrome',
            brand: 'Mac',
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!conn)
            return;
        yield conn.cleanup();
        yield conn.disconnect();
    }));
    it('should return a short url with authentication', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .get('/history')
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    }));
    it('should return a short url with authentication', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app)
            .get(`/history/:${short_url}`)
            .set('content-type', 'application/json')
            .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
    }));
});
