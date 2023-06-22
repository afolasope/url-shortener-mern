import { Router } from 'express';
import passport, { use } from 'passport';
import { IUser } from '../types';

import { login, signup } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', async (req, res, next) =>
  passport.authenticate('signup', (err: any, user: IUser, info: any) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
      res.status(200).json(info);
    }
    return res.status(400).json(info);
  })(req, res, next)
);

authRouter.post('/login', async (req, res, next) =>
  passport.authenticate('login', (err: any, user: IUser, info: any) => {
    login(req, res, { err, user, info });
  })(req, res, next)
);

export { authRouter };
