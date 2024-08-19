import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Otp } from './entity/Otp.entity';
import { User } from './entity/User.entity';
import { Agent } from './entity';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: NODE_ENV === "dev" ? false : false,
    logging: NODE_ENV === "dev" ? false : false,
    entities: [Otp, User, Agent],
    migrations: [__dirname + "/migration/*.ts"],
    migrationsRun: false,
    subscribers: []
});
