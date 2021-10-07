const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

describe('authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user and returns that users id using POST /signup', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'me@you.com', password: 'usandthem' });
    expect(res.body).toEqual({ id: '1' });
  });

  it('returns 400 for trying to create new user where email already exists', async () => {
    await UserService.create({
      email: 'me@you.com',
      password: 'usandthem',
    });

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'me@you.com', password: 'allaboutme' });

    expect(res.statusCode).toEqual(400);
  });

  it('logs a user in returning the users id', async () => {
    await UserService.create({
      email: 'me@you.com',
      password: 'usandthem',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'me@you.com', password: 'usandthem' });

    expect(res.body).toEqual({ id: '1' });
  });

  it('should return 401 if bad email or password provided', async () => {
    await UserService.create({
      email: 'me@you.com',
      password: 'usandthem',
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'me@you.com', password: 'weandthem' });

    expect(res.statusCode).toEqual(401);
  });

  afterAll(() => {
    pool.end();
  });
});
