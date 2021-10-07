const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('authentication routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('signs up a user and returns that users id using POST /signup', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ email: 'me@you.com', password: 'usandthem' });
    expect(res.body).toEqual({ userId: '1' });
  });

  //create another test to try to signup an already existing user that 400s

  afterAll(() => {
    pool.end();
  });
});
