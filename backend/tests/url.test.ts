import { app } from '../app';
import request from 'supertest';
import { ShortUrl } from '../models/url.model';
import shortid from 'shortid';
import { Types } from 'mongoose';
import { connect, Connection } from './db';
import { User } from '../models/user';
import { History } from '../models/history';

describe('Home Route', () => {
  let conn: Connection;
  const userId = '123456789123';
  const fullUrl =
    'https://123moviestv.me/watch-tv/watch-modern-family-2009-39507.4858783';

  beforeAll(async () => {
    conn = await connect();
    await User.create({
      email: 'anonymous@gmail.comw',
      password: 'xoxoxo',
      userId,
    });

    await ShortUrl.create({
      shortUrl: shortid.generate(),
      fullUrl,
      userId: new Types.ObjectId(userId),
    });

    await ShortUrl.create({
      shortUrl: shortid.generate(),
      fullUrl,
      userId: new Types.ObjectId(userId),
    });
  });

  afterEach(async () => {
    if (!conn) return;

    await conn.cleanup();
  });

  afterAll(async () => {
    if (!conn) return;

    await conn.disconnect();
  });

  it('should return a short url without authentication', async () => {
    const response = await request(app)
      .post('/url')
      .send({ fullUrl })
      .set('content-type', 'application/json')
      .set('x-user-id', userId);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('shortUrl');
  }, 10000);

  it('should return all short url without authentication', async () => {
    const response = await request(app)
      .get('/url')
      .set('content-type', 'application/json')
      .set('x-user-id', userId);
    expect(response.status).toBe(200);
  });

  it('should return all short url without authentication', async () => {
    const response = await request(app)
      .get('/url')
      .set('content-type', 'application/json')
      .set('x-user-id', userId);
    expect(response.status).toBe(200);
  });
});

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
  });

  afterAll(async () => {
    if (!conn) return;

    await conn.disconnect();
  });

  it('should return a short url with authentication', async () => {
    const response = await request(app)
      .post('/url/auth')
      .send({ fullUrl })
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('shortUrl');
  }, 10000);

  it('should get all short url with authentication', async () => {
    const response = await request(app)
      .get('/url/auth')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('should delete a short url with authentication', async () => {
    const response = await request(app)
      .delete('/url/:shortUrl')
      .send({ shortUrl: short_url })
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }, 10000);
});
