import cors from 'cors';
import express, { Request, Response } from 'express';
import endpoints from './endpoints';
const app = express();
const port = 8000;



app.use(cors());
app.use(express.json());

app.get('/ok', (_req: Request, res: Response) => res.send('OK'));

app.get('/events', endpoints.get.events);
app.get('/init', endpoints.get.init);

app.post('/paint', endpoints.post.paint);
app.post('/queue', endpoints.post.queue);


app.listen(port, () => {
    console.log(`SSE server running at http://localhost:${port}`);
});

export { app };
