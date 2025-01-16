import { PointXY } from "./types";
import { decodePoints, encodePoints } from "./utilities";

const API_URL = "http://localhost:8000";

export const getPaint = async () => {
    const response = await fetch(`${API_URL}/canvas`);
    return decodePoints(await response.json());
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

export const postQueue = async (name: string) => {
    const response = await fetch(`${API_URL}/queue`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name }),
    });
    return response.json();
}