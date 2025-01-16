import { PointEncoded } from "../../shared";
import { PointXY } from "./types";
import { encodePoints } from "./utilities";

const API_URL = "http://localhost:8000";

export const init = async () => {
    const response = await fetch(`${API_URL}/init`);
    const data = await response.json();

    return {
        canvas: data.canvas as PointEncoded[],    
        queue: data.queue as number
    }
}

export const postPaint = async (data: PointXY[], clientId: string) => {
    const encodedData = encodePoints(data);

    const body = {
        points: encodedData,
        clientId: clientId
    }
    const response = await fetch(`${API_URL}/paint`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    });
    return response.status === 200;
}

export const postQueue = async (clientId: string) => {
    const response = await fetch(`${API_URL}/queue`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clientId }),
    });
    return response.status === 200;
}