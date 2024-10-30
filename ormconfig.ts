import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './.env') });

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // 개발 시에는 true로 하여 자동으로 DB 스키마를 업데이트 할 수 있음. 운영 시에는 false로 설정.
  logging: false,
  entities: [path.join(__dirname, 'entities', '*.ts')],
  migrations: [path.join(__dirname, 'migrations', '*.ts')],
  subscribers: [],
});
