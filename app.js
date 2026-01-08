require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

//import routes
const authRoutes = require('./routes/auth.routes');
const mediaRoutes = require('./routes/media.routes');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");


const app = express();

//global middleware
app.use(cors()); //allow cross-origins requests (Android, ...)
app.use(express.json()); //parse JSON automatically

//documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//root/default route/endpoint
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'TravelShare API: Hello world!' });
});


//define routes
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);


//middleware to handle some errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

