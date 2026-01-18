const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { sendEmail } = require('../utils/email.util');

const register = async (email, password, name) => {
  const [existingUsers] = await db.query('SELECT id FROM user_ WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    throw { status: 409, message: 'E-mail already exists.' };
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  //insert user with is_verified = false (0)
  const [result] = await db.query(
    'INSERT INTO user_ (email, password_hash, name_, is_verified) VALUES (?, ?, ?, ?)',
    [email, passwordHash, name, false]
  );
  
  const userId = result.insertId;

  //generate alphanumeric code (8 chars)
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); //24 hours expiration delay

  //save code to DB
  await db.query(
    'INSERT INTO verification_code (user_id, code, type, expires_at) VALUES (?, ?, ?, ?)',
    [userId, code, 'email_verification', expiresAt]
  );

  //send email
  await sendEmail(
    email, 
    'TravelShare - Verify your account', 
    `Welcome ${name}!\n\nPlease enter this code to verify your account: ${code}`
  );
  
  return { message: 'Verification code sent.', email };
};

const verifyEmail = async (email, code) => {
  const [users] = await db.query('SELECT id, is_verified FROM user_ WHERE email = ?', [email]);
  if (users.length === 0) throw { status: 404, message: 'User not found.' };
  const user = users[0];

  if (user.is_verified) {
    return { message: 'Account already verified.' };
  }

  //check code
  const [codes] = await db.query(
    'SELECT * FROM verification_code WHERE user_id = ? AND code = ? AND type = ? AND expires_at > NOW()',
    [user.id, code, 'email_verification']
  );

  if (codes.length === 0) {
    throw { status: 400, message: 'Invalid or expired code.' };
  }

  //mark user as verified
  await db.query('UPDATE user_ SET is_verified = 1 WHERE id = ?', [user.id]);

  //delete used code
  await db.query('DELETE FROM verification_code WHERE id = ?', [codes[0].id]);

  return { message: 'E-mail verified successfully. You can now login.' };
};

const login = async (email, password) => {
  const [users] = await db.query('SELECT * FROM user_ WHERE email = ?', [email]);
  if (users.length === 0) {
    throw { status: 401, message: 'Invalid credentials.' };
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw { status: 401, message: 'Invalid credentials.' };
  }

  //block login if not verified
  if (!user.is_verified) {
    throw { status: 403, message: 'Account not verified. Please verify your email.' };
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

const requestPasswordReset = async (email) => {
  const [users] = await db.query('SELECT id, name_ FROM user_ WHERE email = ?', [email]);
  
  if (users.length === 0) return; 
  const user = users[0];

  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); //15 minutes expiration delay

  await db.query('DELETE FROM verification_code WHERE user_id = ? AND type = ?', [user.id, 'password_reset']);
  await db.query(
    'INSERT INTO verification_code (user_id, code, type, expires_at) VALUES (?, ?, ?, ?)',
    [user.id, code, 'password_reset', expiresAt]
  );

  await sendEmail(
    email, 
    'TravelShare - Password Reset Code', 
    `Hello ${user.name_},\n\nYour password reset code is: ${code}\n\nIt expires in 15 minutes.`
  );
};

const confirmPasswordReset = async (email, code, newPassword) => {
  const [users] = await db.query('SELECT id FROM user_ WHERE email = ?', [email]);
  if (users.length === 0) throw { status: 404, message: 'User not found.' };
  const user = users[0];

  const [codes] = await db.query(
    'SELECT * FROM verification_code WHERE user_id = ? AND code = ? AND type = ? AND expires_at > NOW()',
    [user.id, code, 'password_reset']
  );

  if (codes.length === 0) {
    throw { status: 400, message: 'Invalid or expired code.' };
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  
  await db.query('UPDATE user_ SET password_hash = ? WHERE id = ?', [passwordHash, user.id]);
  await db.query('DELETE FROM verification_code WHERE id = ?', [codes[0].id]);

  return { message: 'Password updated successfully.' };
};

const getMe = async (userId) => {
  const [users] = await db.query('SELECT id, email, name_, profile_picture, created_at FROM user_ WHERE id = ?', [userId]);
  if (users.length === 0) throw { status: 404, message: 'User not found.' };
  
  const u = users[0];
  return {
    id: u.id,
    email: u.email,
    name: u.name_,
    profilePicture: u.profile_picture,
    createdAt: u.created_at
  };
};

module.exports = {
  register,
  verifyEmail,
  login,
  requestPasswordReset,
  confirmPasswordReset,
  getMe
};

