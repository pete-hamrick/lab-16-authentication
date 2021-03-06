const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth.js');
const UserService = require('../services/UserService.js');

const ONE_DAY = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY,
      });

      res.send(user);
    } catch (error) {
      error.status = 400;
      next(error);
    }
  })
  .post('/login', async (req, res, next) => {
    try {
      const user = await UserService.authorize(req.body);

      res.cookie('session', user.authToken(), {
        httpOnly: true,
        maxAge: ONE_DAY,
      });

      res.send(user);
    } catch (error) {
      error.status = 401;
      next(error);
    }
  })
  .get('/me', ensureAuth, async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (error) {
      next(error);
    }
  })
  .put('/:id', ensureAuth, async (req, res, next) => {
    try {
      if (req.user.role !== 'ADMIN') {
        res.status(403).send({ status: 403, message: 'Unauthorized' });
      } else {
        res.send('Role Updated');
      }
    } catch (error) {
      next(error);
    }
  });
