import { useEffect, useState } from 'react';

interface Message {
    [key: string]: unknown; // Define the structure of your message here
}

const URL = "http://localhost:8000/events";

const useEventSource = () => {
    const [lastMessage, setLastMessage] = useState<Message | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (error) {
            alert("An error occurred. Please refresh the page."); 
        }
    }, [error])

    useEffect(() => {
        const eventSource = new EventSource(URL);

        eventSource.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            setLastMessage(message);
        };

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onerror = () => {
            setError("Error with SSE connection");
            eventSource.close();
        };

        return () => {
            eventSource.close(); // Clean up the connection on component unmount
        };
    }, []);

    return { lastMessage, isConnected };
};

export default useEventSource;