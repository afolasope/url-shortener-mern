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
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
const db_1 = require("./db");
const user_1 = require("../models/user");
describe('Auth: Authentication', () => {
    let conn;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        conn = yield (0, db_1.connect)();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!conn)
            return;
        yield conn.cleanup();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!conn)
            return;
        yield conn.disconnect();
    }));
    it('should signup a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post('/auth/signup').send({
            email: 'sope@gmail.com',
            password: 'hello101',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
    }));
    it('should login a user', () => __awaiter(void 0, void 0, void 0, function* () {
        // create user in our db
        const user = yield user_1.User.create({
            email: 'sope@mail.com',
            password: 'hello101',
        });
        // login user
        const response = yield (0, supertest_1.default)(app_1.app)
            .post('/auth/login')
            .set('content-type', 'application/json')
            .send({
            email: 'sope@mail.com',
            password: 'hello101',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    }));
});
