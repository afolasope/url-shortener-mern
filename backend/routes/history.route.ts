import { Router } from 'express';
import passport from 'passport';

import { getHistory, getHistoryById } from '../controllers/history.controller';

const historyRouter = Router();
historyRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  getHistory
);

historyRouter.get(
  '/:shortUrl',
  passport.authenticate('jwt', { session: false }),
  getHistoryById
);
export { historyRouter };
