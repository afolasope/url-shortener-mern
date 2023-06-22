import { Router } from 'express';
import {
  createShortUrl,
  deleteUrl,
  getShortUrl,
} from '../controllers/url.controller';
import passport from 'passport';
import { checkUserId } from '../middlewares/checkUserId';

const shortUrlRouter = Router();

shortUrlRouter.post('/', checkUserId, createShortUrl);

shortUrlRouter.get('/', checkUserId, getShortUrl);

shortUrlRouter.delete(
  '/:shortUrl',
  passport.authenticate('jwt', { session: false }),
  deleteUrl
);

export { shortUrlRouter };
