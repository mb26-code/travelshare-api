require('dotenv').config();

const express = require('express');

const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); //allow requests from Android devices
app.use(express.json()); //parse JSON bodies

//routes
app.use('/api/auth', authRoutes);

//server start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

