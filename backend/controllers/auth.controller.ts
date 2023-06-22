require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { IUser } from '../types';

const signup = async (req: any, res: any) => {
  // const { email } = req.user;
  // return res.status(201).json({
  //   user: {
  //     email,
  //   },
  // });
};

const login = (
  req: any,
  res: any,
  { err, user, info }: { err: any; user: IUser; info: any }
) => {
  if (!user) {
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }

  // req.login is provided by passport
  req.login(user, { session: false }, async (error: any) => {
    if (error) return res.status(400).json(error);

    const body = { _id: user.id, email: user.email };

    const token = jwt.sign(
      { user: body },
      process.env.JWT_SECRET || 'something_secret',
      { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 }
    );

    return res.status(200).json({ accessToken: token });
  });
};

export { signup, login };
