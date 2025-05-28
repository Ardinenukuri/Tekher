import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: '1234',
    database: 'Users',
    entities: [User],
    synchronize: true,
    logging: true
})

export const InitializeDatabase = async ():Promise<void> => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
}