import express, { Request, Response } from 'express';
import { connect_db } from './schemas';
import routes from "./routes"
import cookieParser from 'cookie-parser';
const app = express();
const port = 3000;

connect_db();

app.use(express.json());
app.use(cookieParser());

app.use('/posts', routes.post);
app.use('/comments', routes.comments);
app.use('/users', routes.users);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, My Express server' );
});

app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
});
