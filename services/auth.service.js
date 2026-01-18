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

  const [result] = await db.query(
    'INSERT INTO user_ (email, password_hash, name_, is_verified) VALUES (?, ?, ?, ?)',
    [email, passwordHash, name, false]
  );

  
  
  return { id: result.insertId, email, name };
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
  
  //security: do not reveal if an account linked to this e-mail exists or not to the client
  //return success regardless
  if (users.length === 0) return; 
  const user = users[0];

  //generate an alphanumeric confirmation code of length 8
  const code = crypto.randomBytes(4).toString('hex').toUpperCase();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); //15 minutes expiration delay

  //save confirmation code to DB (remove old codes for this user/type first)
  await db.query('DELETE FROM verification_code WHERE user_id = ? AND type = ?', [user.id, 'password_reset']);
  await db.query(
    'INSERT INTO verification_code (user_id, code, type, expires_at) VALUES (?, ?, ?, ?)',
    [user.id, code, 'password_reset', expiresAt]
  );

  //send e-mail
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

  //check that the confirmation code is the same as the one sent by the user
  const [codes] = await db.query(
    'SELECT * FROM verification_code WHERE user_id = ? AND code = ? AND type = ? AND expires_at > NOW()',
    [user.id, code, 'password_reset']
  );

  if (codes.length === 0) {
    throw { status: 400, message: 'Invalid or expired code.' };
  }

  //update password hash in the database
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(newPassword, saltRounds);
  
  await db.query('UPDATE user_ SET password_hash = ? WHERE id = ?', [passwordHash, user.id]);

  //get rid of used confirmation code
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
  login,
  requestPasswordReset,
  confirmPasswordReset,
  getMe
};

