import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './models/user';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';

passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET || 'something_secret',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      if (!validator.isEmail(email)) {
        return done(null, false, {
          message: 'Email address provided is invalid',
        });
      }

      try {
        const authorization = req?.headers['x-user-id'];
        const checkUser = await User.findOne({ email: email });

        if (checkUser) {
          return done(null, false, { message: 'Email address already in use' });
        }

        const token = jwt.sign(
          { user: { email, password } },
          process.env.JWT_SECRET || 'something_secret',
          { expiresIn: Math.floor(Date.now() / 1000) + 60 * 60 * 24.5 }
        );
        // anonymous user can create short url without signup or login , but if they want to delete the url they have to signup or login
        if (authorization) {
          await User.updateOne(
            { _id: authorization },
            { $set: { email } }, // Update
            { $set: { password } } // Update
          );
          return done(null, true, { message: token });
        }

        const user = await User.create({
          email,
          password,
        });
        if (!user) {
          console.log('no user created');
        }

        return done(null, user, { message: token });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        const validate = user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' });
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
