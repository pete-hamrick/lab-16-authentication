const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth.js');
const User = require('../models/User.js');
const UserService = require('../services/UserService.js');

const ONE_DAY = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/signup', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
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
      const userId = req.userId;
      const user = await User.get(userId);

      res.send(user);
    } catch (error) {
      next(error);
    }
  });
