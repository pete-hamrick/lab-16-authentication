const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
module.exports = class UserService {
  static async create({ email, password }) {
    //check if user exists
    const existingUser = await User.findByEmail(email);

    //add error for existing user if email exists already
    if (existingUser) {
      throw new Error('User already exists for the given email');
    }
    //hash password
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    //put user into the DB
    const user = await User.insert({
      email,
      passwordHash,
    });

    //return user
    return user;
  }
};
