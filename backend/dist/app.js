"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("./routes/auth.route");
require("./passport");
const url_route_1 = require("./routes/url.route");
const cors_1 = __importDefault(require("cors"));
const history_route_1 = require("./routes/history.route");
const url_controller_1 = require("./controllers/url.controller");
const express_rate_limit_1 = require("express-rate-limit");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.app = app;
// app.use(express.static(path.join(__dirname, 'templates')));
// app.use(express.urlencoded({ extended: true }));
// app.set('views', path.join(__dirname, 'templates'))
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, './templates')));
//   app.get('/*', function (req: Request, res: Response) {
//     res.sendFile(path.join(__dirname, './templates', 'index.html'));
//   });
// }
app.use(express_1.default.static(path_1.default.join(__dirname, './templates')));
app.get('/dashboard', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, './templates', 'index.html'));
});
app.get('/analytics', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, './templates', 'index.html'));
});
app.get('/login', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, './templates', 'index.html'));
});
app.get('/signup', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, './templates', 'index.html'));
});
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, './templates', 'index.html'));
});
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: '',
});
// app.use(limiter);
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
}));
// app.set('trust proxy', true);
// const client = createClient();
// client.on('error', (err) => console.log('Redis Client Error', err));
// (async () => {
//   await client.connect();
// })();
// app.get('/', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, 'templates', 'index.html'));
// });
app.use('/auth', auth_route_1.authRouter);
app.use('/history', history_route_1.historyRouter);
app.use('/url', url_route_1.shortUrlRouter);
app.use('/:shortUrl', url_controller_1.redirectUrl);
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});
