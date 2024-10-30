import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const db_password = process.env.DB_PASSWORD;

const db_uri = `mongodb+srv://sparta:${db_password}@cluster0.esmjwdb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// MongoDB 연결 함수
const connect_db = (): void => {
	mongoose.connect(db_uri)
		.then(() => {
			console.log('MongoDB 연결 성공');
		})
		.catch((err: Error) => {
			console.log(err);
		});
};

export { connect_db };
