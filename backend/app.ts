import express from 'express';
import { authRouter } from './routes/auth.route';
import './passport';
import { shortUrlRouter } from './routes/url.route';
import cors from 'cors';
import { historyRouter } from './routes/history.route';
import { createClient } from 'redis';
import { redirectUrl } from './controllers/url.controller';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { Request, Response } from 'express';

const app = express();

// app.use(express.static(path.join(__dirname, 'templates')));

// app.use(express.urlencoded({ extended: true }));
// app.set('views', path.join(__dirname, 'templates'))

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, './templates')));

//   app.get('/*', function (req: Request, res: Response) {
//     res.sendFile(path.join(__dirname, './templates', 'index.html'));
//   });
// }

 app.use(express.static(path.join(__dirname, './templates')));

 app.get('/dashboard', function (req: Request, res: Response) {
   res.sendFile(path.join(__dirname, './templates', 'index.html'));
 });
 app.get('/analytics', function (req: Request, res: Response) {
   res.sendFile(path.join(__dirname, './templates', 'index.html'));
 });
 app.get('/login', function (req: Request, res: Response) {
   res.sendFile(path.join(__dirname, './templates', 'index.html'));
 });
 app.get('/signup', function (req: Request, res: Response) {
   res.sendFile(path.join(__dirname, './templates', 'index.html'));
 });
 app.get('/', function (req: Request, res: Response) {
   res.sendFile(path.join(__dirname, './templates', 'index.html'));
 });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: '',
});

// app.use(limiter);

app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

// app.set('trust proxy', true);

// const client = createClient();
// client.on('error', (err) => console.log('Redis Client Error', err));

// (async () => {
//   await client.connect();
// })();

// app.get('/', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, 'templates', 'index.html'));
// });

app.use('/auth', authRouter);
app.use('/history', historyRouter);
app.use('/url', shortUrlRouter);
app.use('/:shortUrl', redirectUrl);

app.use(function (err: any, req: any, res: any, next: any) {
  res.status(err.status || 500);
  res.json({ error: err });
});

export { app };
