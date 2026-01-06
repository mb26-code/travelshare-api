require('dotenv').config();
const express = require('express');
const cors = require('cors');

//import routes
//const authRoutes = require('./routes/auth.routes');
//const mediaRoutes = require('./routes/media.routes');


const app = express();

//global middleware
app.use(cors()); //allow cross-origins requests (Android, ...)
app.use(express.json()); //parse JSON automatically


//define routes
//app.use('/api/auth', authRoutes);
//app.use('/api/media', mediaRoutes);

//root/default route/endpoint
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'TravelShare API: Hello world!' });
});

//middleware to handle some errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

