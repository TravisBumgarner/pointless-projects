import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

// Enable CORS if needed
app.use(cors());
app.use(express.json());

// Store connections to broadcast to (for simplicity, using an array)
let clients: { id: number; res: Response }[] = [];

// Function to send events to all connected clients
function sendToClients(message: any) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
}

app.get('/ok', (req: Request, res: Response) => {
    res.send('OK');
});

// Endpoint to handle SSE connections
app.get('/events', (req: Request, res: Response) => {
    // Set the headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Keep the connection open
    res.flushHeaders();
    
    // Add the client connection to the clients array
    clients.push({ id: Date.now(), res });

    // Handle disconnect
    req.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client.res !== res);  // Remove client on disconnect
    });

    console.log('Client connected');
    res.write('data: {"status": "connected"}\n\n'); // Send a connected message to the client
});

const canvasData: Record<string, string> = {};

app.get('/canvas', (req: Request, res: Response) => {
    res.json(canvasData);
}); 

app.post('/paint', (req: Request, res: Response) => {
    const encodedPoints = req.body as Record<string, string>;  // body is already the encoded points object
    Object.entries(encodedPoints).forEach(([index, color]) => {
        canvasData[index] = color;
    });

    sendToClients(encodedPoints);
    res.json({ success: true });
});

// Start the server
app.listen(port, () => {
    console.log(`SSE server running at http://localhost:${port}`);
});

export { app };
