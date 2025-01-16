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

export const postPaint = async (data: PointXY[]) => {
    const encodedData = encodePoints(data);
    const response = await fetch(`${API_URL}/paint`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(encodedData),
    });
    return response.json();
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