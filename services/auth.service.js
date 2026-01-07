const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (email, password, name) => {
  const [existingUsers] = await db.query('SELECT id FROM user_ WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    throw { status: 409, message: 'Email already exists' };
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const [result] = await db.query(
    'INSERT INTO user_ (email, password_hash, name_) VALUES (?, ?, ?)',
    [email, passwordHash, name]
  );

  return { id: result.insertId, email, name };
};

const login = async (email, password) => {
  const [users] = await db.query('SELECT * FROM user_ WHERE email = ?', [email]);
  if (users.length === 0) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials' };
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name_,
      profilePicture: user.profile_picture
    }
  };
};

module.exports = {
  register,
  login
};

