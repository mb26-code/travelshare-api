const bcrypt = require('bcrypt');

const db = require('../config/db');

exports.signUp = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        //check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) return res.status(409).json({ error: 'Email already in use' });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //insert into DB
        const newUser = await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, hashedPassword]);

        //success
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};