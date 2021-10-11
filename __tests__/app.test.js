const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserService = require('../lib/services/UserService.js');

const standardUser = {
  email: 'me@you.com',
  password: 'usandthem',
  roleTitle: 'USER',
};

describe('authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user and returns that users id using POST /signup', async () => {
    const res = await request(app).post('/api/auth/signup').send(standardUser);
    expect(res.body).toEqual({ id: '1', email: 'me@you.com' });
  });

  it('returns 400 for trying to create new user where email already exists', async () => {
    await UserService.create(standardUser);

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'me@you.com', password: 'allaboutme' });

    expect(res.statusCode).toEqual(400);
  });

  it('logs a user in returning the user', async () => {
    await UserService.create(standardUser);

    const res = await request(app).post('/api/auth/login').send(standardUser);

    expect(res.body).toEqual({ id: '1', email: 'me@you.com' });
  });

  it('should return 401 if bad email or password provided', async () => {
    await UserService.create(standardUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'me@you.com', password: 'weandthem' });

    expect(res.statusCode).toEqual(401);
  });

  it('returns the currently logged in user on the GET /me route', async () => {
    await UserService.create(standardUser);

    const agent = request.agent(app);

    await agent.post('/api/auth/login').send(standardUser);

    const res = await agent.get('/api/auth/me');

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'me@you.com',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('will not allow USER roles to set their role to admin', async () => {
    await UserService.create(standardUser);

    const agent = request.agent(app);

    await agent.post('/api/auth/login').send(standardUser);

    const res = await agent.update('/api/user/1').send({
      id: expect.any(String),
      email: 'me@you.com',
      role: 'ADMIN',
    });

    expect(res.status).toEqual(403);
    expect(res.body).toEqual({
      status: 403,
      message: 'Unauthorized!',
    });
  });

  //TODO
  // // a route that doesn't require a JWT
  // // a route only accessible to signed in users
  // //  if the req has no valid JWT then 401
  // a route to set a users role thats only accessible to admin users
  //   if no valid JWT then 401
  //   if the user isn't an admin then 403

  // all users need a role
  // switch cookies to JWTs

  afterAll(() => {
    pool.end();
  });
});
