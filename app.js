require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');


//import routes
const authRoutes = require('./routes/auth.routes');
const frameRoutes = require('./routes/frame.routes');
const photoRoutes = require('./routes/photo.routes');
const mediaRoutes = require('./routes/media.routes');
const { globalLimiter } = require('./middleware/rateLimiter');



const app = express();

app.set('trust proxy', 1);

//global middleware
app.use(cors()); //allow cross-origins requests (Android, ...)
app.use(express.json()); //parse JSON automatically
app.use(globalLimiter); //rate limiter

//documentation
//TO DO


//root/default route/endpoint
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'TravelShare API: Hello world!' });
});


//define routes
app.use('/auth', authRoutes);
app.use('/frames', frameRoutes);
app.use('/photos', photoRoutes);
app.use('/media', mediaRoutes);


//middleware to handle some errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

