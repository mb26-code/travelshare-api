const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TravelShare API",
      version: "1.0.0",
      description: "Documentation de l'API TravelShare",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local",
      },
    ],
  },
  apis: ["./routes/*.js"], // où tu documentes tes routes
};

module.exports = swaggerJsdoc(options);

