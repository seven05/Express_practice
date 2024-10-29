import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// JSON 파일 경로 설정
const userInfoPath = path.join(__dirname, '../config/userinfo.json');
// JSON 파일에서 db_password 가져오기
const userInfo = JSON.parse(fs.readFileSync(userInfoPath, 'utf-8'));
const db_password = userInfo.db_password;

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
