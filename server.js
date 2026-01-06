const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TravelShare server app running on port ${PORT}.\n`);
});

