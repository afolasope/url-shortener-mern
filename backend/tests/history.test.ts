import { Types } from 'mongoose';
import { app } from '../app';
import { ShortUrl } from '../models/url.model';
import { User } from '../models/user';
import { Connection, connect } from './db';
import request from 'supertest';
import shortid from 'shortid';
import { History } from '../models/history';

describe('Home Route', () => {
  let conn: Connection;
  let token: string;
  const fullUrl =
    'https://123moviestv.me/watch-tv/watch-modern-family-2009-39507.4858783';
  let short_url: string;

  beforeAll(async () => {
    conn = await connect();

    const user = await User.create({
      email: 'sope@gmail.com',
      password: 'hello101',
    });

    const loginResponse = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'sope@gmail.com',
        password: 'hello101',
      });

    token = loginResponse.body.accessToken;

    const shortUrl = await ShortUrl.create({
      shortUrl: shortid.generate(),
      fullUrl,
      userId: new Types.ObjectId(user._id),
    });

    short_url = shortUrl.shortUrl as string;

    await ShortUrl.create({
      shortUrl: shortid.generate(),
      fullUrl,
      userId: new Types.ObjectId(user._id),
    });

    await History.create({
      userId: new Types.ObjectId(user._id),
      fullUrl,
      shortUrl: short_url,
      device: 'Mac',
      location: 'Lagos',
      os: 'Mac',
      browser: 'chrome',
      brand: 'Mac',
    });
  });

  afterAll(async () => {
    if (!conn) return;

    await conn.cleanup();
    await conn.disconnect();
  });

  it('should return a short url with authentication', async () => {
    const response = await request(app)
      .get('/history')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }, );

  it('should return a short url with authentication', async () => {
    const response = await request(app)
      .get(`/history/:${short_url}`)
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }, );
});
