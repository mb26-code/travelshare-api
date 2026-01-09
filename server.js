const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TravelShare server app running locally on port ${PORT}.
  (http://localhost:${PORT}/)
  `);
});

