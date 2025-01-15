import { useEffect, useState } from 'react';
import { Point } from './types';
import { decodePoints } from './utilities';


const URL = "http://localhost:8000/events";

const useEventSource = () => {
    const [lastMessage, setLastMessage] = useState<Point[] | null>(null);
    // const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // useEffect(() => {
    //     if (error) {
    //         alert("An error occurred. Please refresh the page."); 
    //     }
    // }, [error])

    useEffect(() => {
        const eventSource = new EventSource(URL);

        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const points = decodePoints(message);
            setLastMessage(points);
        };

        eventSource.onopen = () => {
            setIsConnected(true);
        };

        eventSource.onerror = () => {
            // setError("Error with SSE connection");
            console.error("Error with SSE connection");
            eventSource.close();
        };

        return () => {
            eventSource.close(); // Clean up the connection on component unmount
        };
    }, []);

    return { lastMessage, isConnected };
};

export default useEventSource;