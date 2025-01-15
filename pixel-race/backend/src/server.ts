import cors from 'cors';
import express, { Request, Response } from 'express';
import endpoints from './endpoints/index.js';
const app = express();
const port = 8000;

// Enable CORS if needed
app.use(cors());
app.use(express.json());

app.get('/ok', (_req: Request, res: Response) => res.send('OK'));
app.get('/events', endpoints.get.events);
app.get('/canvas', endpoints.get.canvas); 
app.post('/paint', endpoints.post.paint);

// Start the server
app.listen(port, () => {
    console.log(`SSE server running at http://localhost:${port}`);
});

export { app };
