const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TravelShare API',
      version: '1.0.0',
      description: 'API de partage de frames/photos de voyage',
    },
    servers: [
      {
        url: 'https://api.travelshare.dev',
        description: 'Production',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT à utiliser dans Authorization: Bearer <token>',
            },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Frame: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            photos: {
              type: 'array',
              items: { type: 'string', format: 'uri' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            author: { $ref: '#/components/schemas/User' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
