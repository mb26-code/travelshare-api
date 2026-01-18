const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing e-mail, password, and/or name field(s).' });
    }
    const result = await authService.register(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

//verify email with code
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Missing email or code.' });
    }
    const result = await authService.verifyEmail(email, code);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing e-mail or password.' });
    }
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//password reset request
const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'E-mail is required.' });

    await authService.requestPasswordReset(email);
    
    //always return 200 OK for security to prevent e-mail enumeration
    res.status(200).json({ message: 'If the e-mail exists, a code has been sent.' });
  } catch (error) {
    next(error);
  }
};

//confirm reset and set new password
const confirmPasswordReset = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'E-mail, code, and new password are required.' });
    }

    const result = await authService.confirmPasswordReset(email, code, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//logout
const logout = async (req, res) => {
  //since we use stateless JWTs, the server doesn't track active sessions
  //the client is responsible for deleting its token
  //this endpoint serves as a formal acknowledgment of that 
  //and it could be used later if the app evolves to track which users are logged-in or logged-out for tracking sessions or gathering statistics
  //and if I do this, those that data will be stored in the database, not on the server

  res.status(200).json({ message: 'Logged out successfully.' });
};

//get gurrent user info
//the client wants to know what identifies it in the app system/back-end
const getMe = async (req, res, next) => {
  try {
    //req.user is populated by the authenticateToken middleware
    const userId = req.user.id;
    const user = await authService.getMe(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  register,
  verifyEmail,
  login,
  requestPasswordReset,
  confirmPasswordReset,
  logout,
  getMe
};

