import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Enable CORS if needed
app.use(cors());

// Store connections to broadcast to (for simplicity, using an array)
let clients: { id: number; res: Response }[] = [];

// Function to send events to all connected clients
function sendToClients(message) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(message)}\n\n`));
}

function sendToClient(client: { id: number; res: Response }, message: string) {
    client.res.write(`data: ${JSON.stringify(message)}\n\n`);
}

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

    // Optionally, send periodic updates (e.g., broadcasting a time every 5 seconds)
    setInterval(() => {
        sendToClients({ message: 'This is a broadcast message', timestamp: new Date() });
    }, 5000);
});

// Start the server
app.listen(port, () => {
    console.log(`SSE server running at http://localhost:${port}`);
});

export { app };
