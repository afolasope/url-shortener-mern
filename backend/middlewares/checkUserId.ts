import { NextFunction } from 'express';
import passport from 'passport';

export const checkUserId = (req: any, res: any, next: NextFunction) => {
  console.log('second');
  const userId = req?.headers['x-user-id'];

  if (userId) {
    return next();
  }
  return passport.authenticate('jwt', { session: false })(req, res, next);
};
