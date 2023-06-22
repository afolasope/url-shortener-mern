"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const user_1 = require("./models/user");
const validator_1 = __importDefault(require("validator"));
const jwt = __importStar(require("jsonwebtoken"));
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.JWT_SECRET || 'something_secret',
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return done(null, token.user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use('signup', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (!validator_1.default.isEmail(email)) {
        return done(null, false, {
            message: 'Email address provided is invalid',
        });
    }
    try {
        const authorization = req === null || req === void 0 ? void 0 : req.headers['x-user-id'];
        const checkUser = yield user_1.User.findOne({ email: email });
        if (checkUser) {
            return done(null, false, { message: 'Email address already in use' });
        }
        const token = jwt.sign({ user: { email, password } }, process.env.JWT_SECRET || 'something_secret', { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24.5 });
        // anonymous user can create short url without signup or login , but if they want to delete the url they have to signup or login
        if (authorization) {
            yield user_1.User.updateOne({ _id: authorization }, { $set: { email } }, // Update
            { $set: { password } } // Update
            );
            return done(null, true, { message: token });
        }
        const user = yield user_1.User.create({
            email,
            password,
        });
        if (!user) {
            console.log('no user created');
        }
        return done(null, user, { message: token });
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.use('login', new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        const validate = user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        return done(null, user, { message: 'Logged in Successfully' });
    }
    catch (error) {
        return done(error);
    }
})));
