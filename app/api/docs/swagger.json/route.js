import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartPersona Admin API',
      version: '1.0.0',
      description: 'REST API for the SmartPersona Resume Builder admin panel. Covers user management, resume management, dashboard statistics, and CSV exports.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Somchai Jaidee' },
            email: { type: 'string', format: 'email', example: 'somchai@example.com' },
            role: { type: 'string', enum: ['User', 'Admin'], example: 'User' },
            status: { type: 'string', enum: ['Active', 'Inactive', 'Suspended'], example: 'Active' },
            resumes: { type: 'integer', example: 3 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', example: 'Somchai Jaidee' },
            email: { type: 'string', format: 'email', example: 'somchai@example.com' },
            role: { type: 'string', enum: ['User', 'Admin'], default: 'User' },
            status: { type: 'string', enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
          },
        },
        Resume: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'RES-001' },
            title: { type: 'string', example: 'Software Engineer Resume' },
            template: { type: 'string', example: 'Modern UX' },
            status: { type: 'string', enum: ['Draft', 'Published', 'Archived'], example: 'Published' },
            views: { type: 'integer', example: 42 },
            downloads: { type: 'integer', example: 12 },
            user_name: { type: 'string', example: 'Somchai Jaidee' },
            user_email: { type: 'string', format: 'email', example: 'somchai@example.com' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            totalItems: { type: 'integer', example: 100 },
            totalPages: { type: 'integer', example: 10 },
          },
        },
      },
    },
  },
  // Scan ALL api route files for @swagger JSDoc comments
  apis: ['./app/api/admin/**/*.js'],
};

export async function GET() {
  const spec = swaggerJsdoc(options);
  return NextResponse.json(spec);
}
