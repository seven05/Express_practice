import express, { Request, Response } from 'express';
import { connect_db } from './schemas';
import routes from "./routes"
const app = express();
const port = 3000;

connect_db();

app.use(express.json());

app.use('/posts', routes.post);
app.use('/comments', routes.comments);

app.get('/', (req: Request, res: Response) => {
  res.send('TypeScript, Node.js, Express, mongodb connect');
});

app.listen(port, () => {
  console.log(`${port} 포트로 서버가 열렸어요!`);
});
