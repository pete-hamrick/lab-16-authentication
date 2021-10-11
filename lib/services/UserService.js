const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
module.exports = class UserService {
  static async create({ email, password, roleTitle }) {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      throw new Error('User already exists for the given email');
    }
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      passwordHash,
      roleTitle,
    });

    return user;
  }

  static async authorize({ email, password }) {
    const existingUser = await User.findByEmail(email);

    if (!existingUser) {
      throw new Error('Invalid email or password');
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!passwordsMatch) {
      throw new Error('Invalid email or password');
    }

    return existingUser;
  }
};
