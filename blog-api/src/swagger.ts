import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'A comprehensive API for blogging platform with authentication, posts, and admin features',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
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
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'nukuri',
            },
            email: {
              type: 'string',
              example: 'nukuri@gmail.com',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            title: {
              type: 'string',
              example: 'the blog',
            },
            content: {
              type: 'string',
              example: 'the content of my first blog post...',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-05-01T12:00:00Z',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 100,
            },
            limit: {
              type: 'integer',
              example: 10,
            },
            offset: {
              type: 'integer',
              example: 0,
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        PostListResponse: {
          allOf: [
            { $ref: '#/components/schemas/PaginatedResponse' },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Post' },
                },
              },
            },
          ],
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Forbidden',
            },
            statusCode: {
              type: 'integer',
              example: 403,
            },
          },
        },
      },
      responses: {
        Error: {
          description: 'An error response',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Blog API',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/public/favicon.ico',
    explorer: true,
  }));
};
