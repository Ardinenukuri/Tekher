import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modals/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_DATABASE || 'assignment2',
  synchronize: process.env.NODE_ENV !== 'production', // Auto-create database schema in development.  
  // logging: process.env.NODE_ENV !== 'production',
  entities: [User],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error during database initialization', error);
    throw error;
  }
};