import { app } from '../app';
import request from 'supertest';
import { connect, Connection } from './db';
import { User } from '../models/user';

describe('Auth: Authentication', () => {
  let conn: Connection;

  beforeAll(async () => {
    conn = await connect();
  });

  afterEach(async () => {
    if (!conn) return;

    await conn.cleanup();
  });

  afterAll(async () => {
    if (!conn) return;

    await conn.disconnect();
  });

  it('should signup a user', async () => {
    const response = await request(app).post('/auth/signup').send({
      email: 'sope@gmail.com',
      password: 'hello101',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should login a user', async () => {
    // create user in our db
    const user = await User.create({
      email: 'sope@mail.com',
      password: 'hello101',
    });

    // login user
    const response = await request(app)
      .post('/auth/login')
      .set('content-type', 'application/json')
      .send({
        email: 'sope@mail.com',
        password: 'hello101',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');

  });
});
